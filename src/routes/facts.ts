/**
 * Every number the site states about the kit, derived rather than typed in.
 *
 * `bundle.json` is written by scripts/measure-bundle.ts, which `bun run build`
 * runs against the packaged `dist` before building the site. The counts come
 * from the catalog, the same list that feeds the sitemap and llms.txt, and the
 * version from package.json.
 */
import measured from './bundle.json';
import pkg from '../../package.json';
import { componentCount, components } from './components/catalog.js';

export const bundle = measured;

export const version = pkg.version;

const baseline = bundle.rows[0].gzip;
const everything = bundle.rows[bundle.rows.length - 1].gzip;

export const stats = {
	components: componentCount,
	/** One page per catalog entry; parts share their component's page. */
	pages: components.length,
	runtimeDependencies: Object.keys(pkg.dependencies).length,
	/** Beyond the shared baseline, averaged over every component. */
	perComponentGzipKb: Number(((everything - baseline) / componentCount).toFixed(2))
};
