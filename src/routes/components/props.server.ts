/**
 * Reads the prop documentation straight out of the components.
 *
 * Every component declares a `Props` type and destructures it with defaults, so
 * the table on a component page is the component's real signature rather than a
 * second copy that drifts. Server-only: it needs the sources, which are not
 * shipped to the browser.
 */

export type PropKind = 'prop' | 'snippet' | 'event';

export interface PropDoc {
	name: string;
	type: string;
	default?: string;
	description?: string;
	/** Declared with `$bindable()`, so `bind:` works on it. */
	bindable?: boolean;
	required: boolean;
	kind: PropKind;
}

export interface ComponentDoc {
	name: string;
	category: string;
	/** Native attributes the component spreads onto its element, if any. */
	forwards?: string;
	props: PropDoc[];
}

const sources = import.meta.glob('/src/lib/components/**/*.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

/** Index just past the `}` that closes the block opened at `open`. */
function closingBrace(text: string, open: number): number {
	let depth = 0;
	for (let i = open; i < text.length; i++) {
		if (text[i] === '{') depth++;
		else if (text[i] === '}' && --depth === 0) return i;
	}
	return text.length;
}

/** The `Props` body, plus whatever native attribute type it builds on. */
function propsBlock(source: string): { body: string; forwards?: string } | null {
	const declaration = /(?:interface\s+Props\b|type\s+Props\s*=)([\s\S]*?)\{/.exec(source);
	if (!declaration) {
		// A couple of small components type their props inline.
		const inline = /\}:\s*\{([^}]*)\}\s*=\s*\$props\(\)/.exec(source);
		return inline ? { body: inline[1] } : null;
	}

	const open = declaration.index + declaration[0].length - 1;
	const body = source.slice(open + 1, closingBrace(source, open));
	const native = /HTML\w*Attributes/.exec(declaration[1]);
	return { body, forwards: native?.[0] };
}

/**
 * Split a type body into members. Braces, parens, strings and comments are all
 * skipped over, so a comma inside a doc comment does not start a new member.
 */
function members(body: string): string[] {
	const out: string[] = [];
	let depth = 0;
	let current = '';

	for (let i = 0; i < body.length; i++) {
		const char = body[i];
		const pair = body.slice(i, i + 2);

		if (pair === '/*') {
			const end = body.indexOf('*/', i + 2);
			const stop = end === -1 ? body.length : end + 2;
			current += body.slice(i, stop);
			i = stop - 1;
			continue;
		}
		if (pair === '//') {
			const end = body.indexOf('\n', i);
			const stop = end === -1 ? body.length : end;
			current += body.slice(i, stop);
			i = stop - 1;
			continue;
		}
		if (char === '"' || char === "'" || char === '`') {
			let j = i + 1;
			while (j < body.length && (body[j] !== char || body[j - 1] === '\\')) j++;
			current += body.slice(i, j + 1);
			i = j;
			continue;
		}

		if ('{(['.includes(char)) depth++;
		else if ('})]'.includes(char)) depth--;

		if ((char === ';' || char === ',') && depth === 0) {
			out.push(current);
			current = '';
			continue;
		}
		current += char;
	}

	if (current.trim()) out.push(current);
	return out;
}

/** `/** … *\/` above a member, flattened to one line. */
function comment(raw: string): string | undefined {
	const match = /\/\*\*([\s\S]*?)\*\//.exec(raw);
	if (!match) return undefined;
	return match[1]
		.split('\n')
		.map((line) => line.replace(/^\s*\*?\s?/, '').trim())
		.join(' ')
		.trim();
}

/**
 * Defaults as written in the destructuring, e.g. `size = 'md'` or
 * `value = $bindable('')`.
 */
function defaults(source: string): Map<string, { value?: string; bindable: boolean }> {
	const found = new Map<string, { value?: string; bindable: boolean }>();
	const start = source.search(/let\s*\{/);
	if (start === -1) return found;

	const open = source.indexOf('{', start);
	const body = source.slice(open + 1, closingBrace(source, open));

	for (const entry of members(body)) {
		const text = entry.trim();
		if (!text || text.startsWith('...')) continue;

		const [rawName, ...rest] = text.split('=');
		const name = rawName.replace(/:.*$/, '').replace(/['"]/g, '').trim();
		if (!name) continue;

		// No `=` at all means the prop is passed through without a default.
		const value = rest.length ? rest.join('=').trim() : undefined;
		const bindable = value?.startsWith('$bindable') ?? false;
		found.set(name, {
			bindable,
			value: bindable ? (/\$bindable\(([\s\S]*)\)/.exec(value!)?.[1].trim() ?? '') : value
		});
	}
	return found;
}

function classify(name: string, type: string): PropKind {
	if (/\bSnippet\b/.test(type)) return 'snippet';
	if (/^on[a-z]/.test(name) && type.includes('=>')) return 'event';
	return 'prop';
}

function parse(path: string, source: string): ComponentDoc | null {
	const name = path.split('/').pop()!.replace('.svelte', '');
	const category = path.split('/').at(-2)!;
	const block = propsBlock(source);
	if (!block) return null;

	const written = defaults(source);
	const props: PropDoc[] = [];

	for (const member of members(block.body)) {
		const text = member.replace(/\/\*\*[\s\S]*?\*\//, '').trim();
		const match = /^(\[?['"]?[\w-]+['"]?\]?)(\?)?\s*:\s*([\s\S]+)$/.exec(text);
		if (!match) continue;

		const propName = match[1].replace(/^\[?['"]?|['"]?\]?$/g, '');
		const type = match[3].replace(/\s+/g, ' ').trim();
		const written_ = written.get(propName);
		const fallback = written_?.value;

		props.push({
			name: propName,
			type,
			default: fallback && fallback !== '' ? fallback : undefined,
			description: comment(member),
			bindable: written_?.bindable || undefined,
			required: !match[2] && fallback === undefined,
			kind: classify(propName, type)
		});
	}

	// `class` is on every component and documented once, in the guide.
	return { name, category, forwards: block.forwards, props };
}

export const componentDocs: Record<string, ComponentDoc> = Object.fromEntries(
	Object.entries(sources)
		.map(([path, source]) => parse(path, source))
		.filter((doc): doc is ComponentDoc => doc !== null)
		.map((doc) => [doc.name, doc])
);
