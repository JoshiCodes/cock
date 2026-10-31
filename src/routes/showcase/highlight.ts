/**
 * Small syntax highlighter for the snippets on this page. It knows just enough
 * Svelte and JavaScript to colour markup; it is not a general purpose lexer.
 */

const TOKEN = new RegExp(
	[
		/(&lt;!--[\s\S]*?--&gt;|(?<![:\w])\/\/[^\n]*|\/\*[\s\S]*?\*\/)/.source, // comments
		/('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`)/.source, // strings
		/(&lt;\/?)([A-Za-z][\w.-]*)/.source, // opening bracket + element name
		/(\/?&gt;)/.source, // closing bracket
		/(\{[#:/@][a-z]+|\}|\{)/.source, // svelte blocks and braces
		/(\b(?:import|export|from|const|let|function|return|await|async|new|if|else|snippet)\b)/.source,
		/([A-Za-z][\w:-]*)(?==)/.source, // attribute names
		/(--[\w-]+)(?=\s*:)/.source, // CSS custom properties
		/((?:^|(?<=\n))[:.][\w-]+)(?=\s*\{)/.source, // CSS selectors like :root or .dark
		/([=|])/.source // operators
	].join('|'),
	'g'
);

const classes = [
	'tok-comment',
	'tok-string',
	'tok-punct', // <  or  </
	'tok-tag', // element name
	'tok-punct', // >  or  />
	'tok-block',
	'tok-keyword',
	'tok-attr',
	'tok-attr', // custom property
	'tok-tag', // selector
	'tok-punct'
];

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(code: string): string {
	return escapeHtml(code).replace(TOKEN, (match, ...groups) => {
		let out = '';
		let matched = false;

		for (let i = 0; i < classes.length; i++) {
			const group = groups[i];
			if (group === undefined) continue;
			matched = true;
			out += `<span class="${classes[i]}">${group}</span>`;
		}

		return matched ? out : match;
	});
}
