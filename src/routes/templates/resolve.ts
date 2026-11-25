/**
 * Turns a template's source into the file a reader can paste.
 *
 * The templates take their preview options as props, which is right for the
 * gallery and wrong for a copy: pasted as is, the file renders its defaults no
 * matter what was picked above the preview. This bakes the picked values in.
 * Markup that depends only on options is evaluated in place, so
 * `variant={pattern}` becomes `variant="lines"` and an `{#if}` on an option
 * keeps one branch. Whatever still reads an option after that, usually the
 * script, gets a plain `const` where the `$props()` line was.
 */

type Values = Record<string, unknown>;

const PROPS = /^[ \t]*let\s*\{([^}]*)\}\s*(?::\s*\{[^}]*\})?\s*=\s*\$props\(\);[ \t]*\n/m;
const LITERALS = new Set(['true', 'false', 'null', 'undefined']);

export function resolveSource(source: string, values: Values): string {
	const match = source.match(PROPS);
	if (!match) return source;

	const names = match[1]
		.split(',')
		.map((entry) => entry.split('=')[0].trim())
		.filter(Boolean);
	const known: Values = {};
	for (const name of names) if (name in values) known[name] = values[name];
	if (!Object.keys(known).length) return source;

	const before = source.slice(0, match.index);
	const after = source.slice(match.index! + match[0].length);

	// Only the markup is rewritten. The instance script ends before it.
	const scriptEnd = after.indexOf('</script>');
	const scriptRest = scriptEnd === -1 ? '' : after.slice(0, scriptEnd + '</script>'.length);
	let markup = scriptEnd === -1 ? after : after.slice(scriptEnd + '</script>'.length);
	markup = rewrite(markup, known);

	const code = stripStrings(scriptRest) + expressionsIn(markup).map(stripStrings).join('\n');
	const still = Object.keys(known).filter((name) =>
		new RegExp(`(?<![\\w$.])${name}(?![\\w$])`).test(code)
	);
	const indent = match[0].match(/^[ \t]*/)![0];
	const consts = still
		.map((name) => `${indent}const ${name} = ${literal(known[name])};\n`)
		.join('');

	let result = before + consts + scriptRest + markup;
	result = pruneImports(result);
	return result.replace(/\n{3,}/g, '\n\n').trim();
}

/* -- markup --------------------------------------------------------------- */

interface Tag {
	start: number;
	end: number;
	/** What sits between the braces. */
	body: string;
}

/** The `{...}` at `start`, braces inside strings and template literals skipped. */
function tagAt(text: string, start: number): Tag | null {
	let depth = 0;
	let quote: string | null = null;
	for (let i = start; i < text.length; i++) {
		const char = text[i];
		if (quote) {
			if (char === '\\') i++;
			else if (char === quote) quote = null;
			continue;
		}
		if (char === "'" || char === '"' || char === '`') quote = char;
		else if (char === '{') depth++;
		else if (char === '}' && --depth === 0) {
			return { start, end: i + 1, body: text.slice(start + 1, i) };
		}
	}
	return null;
}

/** Every `{...}` body in the markup, script and style included. */
function expressionsIn(markup: string): string[] {
	const found: string[] = [];
	for (let i = markup.indexOf('{'); i !== -1;) {
		const tag = tagAt(markup, i);
		if (!tag) break;
		found.push(tag.body);
		i = markup.indexOf('{', tag.end);
	}
	return found;
}

function rewrite(markup: string, values: Values): string {
	let out = '';
	let i = 0;
	let inTag = false;
	let attrQuote: string | null = null;

	while (i < markup.length) {
		const char = markup[i];

		if (char === '<' && !inTag && /[A-Za-z]/.test(markup[i + 1] ?? '')) {
			// Script and style bodies are left alone.
			const name = markup.slice(i + 1).match(/^[\w.-]+/)![0];
			if (name === 'script' || name === 'style') {
				const close = markup.indexOf(`</${name}>`, i);
				const end = close === -1 ? markup.length : close + name.length + 3;
				out += markup.slice(i, end);
				i = end;
				continue;
			}
			inTag = true;
		} else if (inTag && attrQuote === null && char === '>') {
			inTag = false;
		} else if (inTag && (char === '"' || char === "'")) {
			attrQuote = attrQuote === char ? null : (attrQuote ?? char);
		}

		if (char !== '{') {
			out += char;
			i++;
			continue;
		}

		const tag = tagAt(markup, i);
		if (!tag) {
			out += markup.slice(i);
			break;
		}

		const body = tag.body.trim();

		if (!inTag && (body.startsWith('#if ') || body.startsWith('#key '))) {
			const block = resolveBlock(markup, tag, values);
			if (block) {
				// Line-level: drop the indentation already written for the opener.
				const lineStart = out.lastIndexOf('\n') + 1;
				const lead = out.slice(lineStart);
				const whole = /^[ \t]*$/.test(lead);
				if (whole) out = out.slice(0, lineStart);
				const kept = rewrite(block.content, values);
				out += whole ? kept : kept.trim();
				i = block.end;
				if (whole && kept === '' && markup[i] === '\n') i++;
				continue;
			}
		}

		if (body[0] !== '#' && body[0] !== ':' && body[0] !== '/' && body[0] !== '@') {
			const spread = body.startsWith('...');
			if (!spread && pure(body, values)) {
				const value = evaluate(body, values);
				const attr = inTag && attrQuote === null ? out.match(/([\w:-]+)=$/) : null;

				if (attr) {
					// `name={expr}`
					const head = out.slice(0, out.length - attr[0].length);
					if (
						value === undefined ||
						value === null ||
						value === false ||
						(value === '' && attr[1] === 'class')
					) {
						out = head.replace(/\s+$/, '');
					} else if (value === true) {
						out = head + attr[1];
					} else if (typeof value === 'string') {
						out = head + `${attr[1]}="${value.replace(/"/g, '&quot;')}"`;
					} else {
						out = head + `${attr[1]}={${literal(value)}}`;
					}
				} else if (inTag && attrQuote === null) {
					// Shorthand `{name}` on an element.
					if (value === true) {
						out += body;
					} else if (value !== undefined && value !== null && value !== false) {
						out += typeof value === 'string' ? `${body}="${value}"` : `${body}={${literal(value)}}`;
					} else {
						out = out.replace(/\s+$/, '');
					}
				} else {
					// Text, or interpolation inside a quoted attribute.
					const text =
						value === undefined || value === null || value === false ? '' : String(value);
					out += inTag ? text : escapeText(text);
				}
				i = tag.end;
				continue;
			}
		}

		out += markup.slice(tag.start, tag.end);
		i = tag.end;
	}

	// Interpolations that came out empty leave doubled or trailing spaces in classes.
	return out.replace(/(class="[^"]*")/g, (attr) =>
		attr.replace(/ {2,}/g, ' ').replace(/" /, '"').replace(/ "$/, '"')
	);
}

/** An `{#if}` chain or `{#key}` whose conditions all depend on options only. */
function resolveBlock(
	markup: string,
	opener: Tag,
	values: Values
): { content: string; end: number } | null {
	const opening = opener.body.trim();
	const kind = opening.startsWith('#if ') ? 'if' : 'key';
	const first = opening.slice(kind.length + 2).trim();
	if (!pure(first, values)) return null;

	// Walk to the matching close, noting branch separators at this depth.
	const branches: { condition: string | null; from: number; to: number }[] = [];
	let condition: string | null = first;
	let from = opener.end;
	let depth = 0;
	let i = opener.end;

	while (i < markup.length) {
		const next = markup.indexOf('{', i);
		if (next === -1) return null;
		const tag = tagAt(markup, next);
		if (!tag) return null;
		const body = tag.body.trim();

		if (body.startsWith('#')) depth++;
		else if (body.startsWith('/')) {
			if (depth === 0) {
				branches.push({ condition, from, to: tag.start });
				return pick(markup, branches, tag.end, values, kind);
			}
			depth--;
		} else if (depth === 0 && kind === 'if' && body.startsWith(':else')) {
			branches.push({ condition, from, to: tag.start });
			const rest = body.slice(':else'.length).trim();
			if (rest.startsWith('if ')) {
				condition = rest.slice(3).trim();
				if (!pure(condition, values)) return null;
			} else condition = null;
			from = tag.end;
		}
		i = tag.end;
	}
	return null;
}

function pick(
	markup: string,
	branches: { condition: string | null; from: number; to: number }[],
	end: number,
	values: Values,
	kind: 'if' | 'key'
): { content: string; end: number } {
	const chosen =
		kind === 'key'
			? branches[0]
			: branches.find((branch) => branch.condition === null || evaluate(branch.condition, values));

	let tail = end;
	// Take the line break after the closing tag with the block.
	if (markup[tail] === '\n') tail++;
	if (!chosen) return { content: '', end: tail };

	return { content: dedent(markup.slice(chosen.from, chosen.to)), end: tail };
}

function dedent(content: string): string {
	const body = content.replace(/^[ \t]*\n/, '').replace(/\n[ \t]*$/, '\n');
	if (!body.includes('\n')) return body.trim();
	return body
		.split('\n')
		.map((line) => line.replace(/^\t/, ''))
		.join('\n');
}

/* -- expressions ---------------------------------------------------------- */

function stripStrings(code: string): string {
	return code.replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, "''");
}

/** True when the expression reads nothing but options and literals. */
function pure(expression: string, values: Values): boolean {
	const identifiers = stripStrings(expression).match(/(?<![\w$.])[A-Za-z_$][\w$]*/g) ?? [];
	return (
		identifiers.length > 0 &&
		identifiers.some((name) => name in values) &&
		identifiers.every((name) => name in values || LITERALS.has(name))
	);
}

function evaluate(expression: string, values: Values): unknown {
	const names = Object.keys(values);
	try {
		return new Function(...names, `return (${expression});`)(...names.map((name) => values[name]));
	} catch {
		return undefined;
	}
}

function literal(value: unknown): string {
	if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
	if (Array.isArray(value)) return `[${value.map(literal).join(', ')}]`;
	if (value && typeof value === 'object') {
		const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item)}`);
		return `{ ${entries.join(', ')} }`;
	}
	return String(value);
}

function escapeText(text: string): string {
	return text.replace(/[{}<]/g, (char) => `{'${char}'}`);
}

/* -- imports -------------------------------------------------------------- */

/** Drops names from the kit import that the resolved file no longer uses. */
function pruneImports(source: string): string {
	return source.replace(
		/^([ \t]*)import\s*\{([^}]*)\}\s*from\s*'@joshicodes\/cock';/m,
		(statement, indent: string, list: string) => {
			const rest = source.replace(statement, '');
			const kept = list
				.split(',')
				.map((name) => name.trim())
				.filter((name) => name && new RegExp(`\\b${name.replace(/^type\s+/, '')}\\b`).test(rest));
			if (!kept.length) return '';
			const line = `${indent}import { ${kept.join(', ')} } from '@joshicodes/cock';`;
			if (line.replace(/\t/g, '    ').length <= 100) return line;
			return `${indent}import {\n${kept.map((name) => `${indent}\t${name}`).join(',\n')}\n${indent}} from '@joshicodes/cock';`;
		}
	);
}
