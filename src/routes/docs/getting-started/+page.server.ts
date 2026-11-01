import { createHash } from 'node:crypto';
import raw from '../../../../package.json?raw';
import { themeScript } from '../../../lib/state/theme-script.js';

const pkg = JSON.parse(raw) as {
	peerDependencies: Record<string, string>;
	engines: Record<string, string>;
};

/**
 * The version ranges and the CSP hash both come from the package itself, so the
 * page cannot promise something the published `package.json` does not.
 */
export function load() {
	return {
		requires: [
			{ label: 'Svelte', range: pkg.peerDependencies.svelte },
			{ label: 'Tailwind CSS', range: pkg.peerDependencies.tailwindcss },
			{ label: 'Node', range: pkg.engines.node }
		],
		// The digest of the inline theme script, for a script-src allow-list.
		scriptHash: `sha256-${createHash('sha256').update(themeScript).digest('base64')}`
	};
}
