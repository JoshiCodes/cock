/**
 * Reads the exported types out of the sources, the way props.server.ts reads
 * props: a second, hand-written copy would be wrong within a release.
 *
 * The list is taken from `src/lib/index.ts`, so a type that is exported shows up
 * here whether or not anybody remembered to document it.
 */
const sources = import.meta.glob(['/src/lib/**/*.ts', '/src/lib/**/*.svelte'], {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export interface TypeDoc {
	name: string;
	/** Where it is declared, relative to `src/lib`. */
	module: string;
	group: string;
	description?: string;
	code: string;
}

/** `./utils/anchor.js` as it is written in index.ts → the file on disk. */
function resolve(specifier: string): string | undefined {
	const path = `/src/lib/${specifier.replace(/^\.\//, '').replace(/\.js$/, '.ts')}`;
	return path in sources ? path : undefined;
}

/** Every `type` name re-exported from index.ts, with the file it came from. */
function exported(): { name: string; path: string }[] {
	const found: { name: string; path: string }[] = [];

	for (const [, kind, names, specifier] of sources['/src/lib/index.ts'].matchAll(
		/export\s+(type\s+)?\{([^}]*)\}\s+from\s+'([^']+)'/g
	)) {
		const path = resolve(specifier);
		if (!path) continue;

		for (const token of names.split(',')) {
			const name = token.trim().replace(/^type\s+/, '');
			// In `export { cn, type ClassValue }` only the prefixed ones are types.
			if (!name || (!kind && !/^type\s/.test(token.trim()))) continue;
			found.push({ name, path });
		}
	}
	return found;
}

/** Index just past the character that closes the block opened at `open`. */
function closing(text: string, open: number, pair: [string, string]): number {
	let depth = 0;
	for (let i = open; i < text.length; i++) {
		if (text[i] === pair[0]) depth++;
		else if (text[i] === pair[1] && --depth === 0) return i + 1;
	}
	return text.length;
}

/**
 * The `;` that ends a type alias. A union can run over several lines and carry
 * `=>`, `{}` and `[]` along the way, so only a semicolon outside all of those
 * counts.
 */
function endOfAlias(text: string, equals: number): number {
	let depth = 0;
	for (let i = equals; i < text.length; i++) {
		if ('{[('.includes(text[i])) depth++;
		else if (')]}'.includes(text[i])) depth--;
		else if (text[i] === ';' && depth === 0) return i + 1;
	}
	return text.length;
}

/** Strip the indentation a declaration inherits from a `<script module>` block. */
function dedent(block: string): string {
	const lines = block.split('\n');
	const indents = lines.filter((line) => line.trim()).map((line) => /^\t*/.exec(line)![0].length);
	const shortest = Math.min(...indents);
	return lines.map((line) => line.slice(shortest)).join('\n');
}

/** The declaration of `name`, plus the doc comment sitting on top of it. */
function declaration(source: string, name: string): { code: string; description?: string } | null {
	const start = new RegExp(`^[\\t ]*export (type|interface|const) ${name}\\b`, 'm').exec(source);
	if (!start) return null;

	const from = start.index;
	const end =
		start[1] === 'interface'
			? closing(source, source.indexOf('{', from), ['{', '}'])
			: endOfAlias(source, source.indexOf('=', from));

	const code = dedent(source.slice(from, end).trimEnd());

	// A doc comment, if the lines directly above are one.
	const before = source.slice(0, from).trimEnd();
	let description: string | undefined;
	if (before.endsWith('*/')) {
		const comment = before.slice(before.lastIndexOf('/**'));
		description = comment
			.replace(/^\/\*\*|\*\/$/g, '')
			.split('\n')
			.map((line) => line.replace(/^[\t ]*\*? ?/, '').trim())
			.join(' ')
			.replace(/\s+/g, ' ')
			.trim();
	}

	return { code, description: description || undefined };
}

const groups: Record<string, string> = {
	components: 'Component types',
	state: 'Theme and toasts',
	actions: 'Actions',
	utils: 'Helpers'
};

/**
 * A type is no use if half of it is a name declared somewhere the reader cannot
 * see. Anything the declaration leans on — a local helper type, or the array
 * behind a `typeof x[number]` — is printed underneath it.
 */
function supporting(source: string, code: string, name: string): string[] {
	const referenced = new Set<string>();
	for (const [, word] of code.matchAll(/\b([A-Z]\w+)\b/g)) referenced.add(word);
	for (const [, word] of code.matchAll(/typeof\s+(\w+)/g)) referenced.add(word);
	referenced.delete(name);

	return [...referenced]
		.map((word) => declaration(source, word)?.code ?? localDeclaration(source, word))
		.filter((found): found is string => found !== undefined);
}

/** The same, for a type that is declared but not exported from its module. */
function localDeclaration(source: string, name: string): string | undefined {
	const start = new RegExp(`^(type|interface) ${name}\\b`, 'm').exec(source);
	if (!start) return undefined;

	const end =
		start[1] === 'interface'
			? closing(source, source.indexOf('{', start.index), ['{', '}'])
			: endOfAlias(source, source.indexOf('=', start.index));
	return dedent(source.slice(start.index, end).trimEnd());
}

/** Where a type the kit only passes through actually comes from. */
function passedThrough(source: string, name: string): { code: string; description: string } | null {
	const from = new RegExp(`import[^;]*\\b${name}\\b[^;]*from '([^']+)'`).exec(source);
	if (!from) return null;

	return {
		code: `export type { ${name} } from '${from[1]}';`,
		description: `Re-exported unchanged from ${from[1]}.`
	};
}

export const types: TypeDoc[] = exported()
	.map(({ name, path }) => {
		const source = sources[path];
		const found = declaration(source, name) ?? passedThrough(source, name);
		const module = path.replace('/src/lib/', '');
		const folder = module.split('/')[0];
		const extras = found ? supporting(source, found.code, name) : [];

		return {
			name,
			module,
			group: groups[folder] ?? 'Helpers',
			description: found?.description,
			code: [found?.code ?? `type ${name} = unknown;`, ...extras].join('\n\n')
		};
	})
	.sort((a, b) => a.name.localeCompare(b.name));

/** Names the prop tables can link to. */
export const typeNames = types.map((entry) => entry.name);
