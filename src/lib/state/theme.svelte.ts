export type ThemeMode = 'light' | 'dark' | 'system';

const MODE_KEY = 'ck-theme';
const ACCENT_KEY = 'ck-accent';
const TOKEN_KEY = 'ck-tokens';

/** Built-in accent presets. Any other string works if you define it yourself. */
export const accents = ['plum', 'cobalt', 'pine', 'ember', 'gold', 'ink'] as const;
export type Accent = (typeof accents)[number] | (string & {});

type TokenMap = Record<string, string>;
type TokenStore = { light: TokenMap; dark: TokenMap };

function readTokens(): TokenStore {
	const empty: TokenStore = { light: {}, dark: {} };
	if (typeof window === 'undefined') return empty;
	try {
		const raw = localStorage.getItem(TOKEN_KEY);
		if (!raw) return empty;
		const parsed = JSON.parse(raw);
		return { light: parsed.light ?? {}, dark: parsed.dark ?? {} };
	} catch {
		return empty;
	}
}

class ThemeState {
	#mode = $state<ThemeMode>('system');
	#system = $state<'light' | 'dark'>('light');
	#accent = $state<Accent>('plum');
	#tokens = $state<TokenStore>({ light: {}, dark: {} });
	#revision = $state(0);

	#applied: string[] = [];
	#timer: ReturnType<typeof setTimeout> | undefined;

	constructor() {
		if (typeof window === 'undefined') return;

		const mode = localStorage.getItem(MODE_KEY);
		if (mode === 'light' || mode === 'dark' || mode === 'system') this.#mode = mode;

		const accent = localStorage.getItem(ACCENT_KEY);
		if (accent) this.#accent = accent;

		this.#tokens = readTokens();

		const query = window.matchMedia('(prefers-color-scheme: dark)');
		this.#system = query.matches ? 'dark' : 'light';
		query.addEventListener('change', (event) => {
			this.#system = event.matches ? 'dark' : 'light';
			this.#apply();
		});

		this.#apply(false);
	}

	/** What the user picked — may be `system`. */
	get mode(): ThemeMode {
		return this.#mode;
	}

	set mode(value: ThemeMode) {
		this.#mode = value;
		this.#store(MODE_KEY, value);
		this.#apply();
	}

	/** What is actually on screen — always `light` or `dark`. */
	get resolved(): 'light' | 'dark' {
		return this.#mode === 'system' ? this.#system : this.#mode;
	}

	get accent(): Accent {
		return this.#accent;
	}

	set accent(value: Accent) {
		this.#accent = value;
		this.#store(ACCENT_KEY, value);
		this.#apply();
	}

	toggle() {
		this.mode = this.resolved === 'dark' ? 'light' : 'dark';
	}

	/**
	 * Bumped every time the theme is applied. Read it to re-run work that
	 * measures the DOM — reading `tokens` alone will not see a changed value.
	 */
	get revision(): number {
		return this.#revision;
	}

	/** Token overrides for the scheme currently on screen. */
	get tokens(): TokenMap {
		return this.#tokens[this.resolved];
	}

	/** Token overrides for a given scheme. */
	tokensFor(scheme: 'light' | 'dark'): TokenMap {
		return this.#tokens[scheme];
	}

	/**
	 * `theme.setToken('--ck-bg', '#f6f5f2')`. Applies to the scheme on screen
	 * unless one is given.
	 */
	setToken(name: string, value: string, scheme: 'light' | 'dark' = this.resolved) {
		this.#tokens[scheme][name] = value;
		this.#persistTokens();
		this.#apply();
	}

	/** Replace all overrides at once — e.g. to load a generated theme. */
	setTokens(tokens: { light?: TokenMap; dark?: TokenMap }) {
		this.#tokens = { light: { ...tokens.light }, dark: { ...tokens.dark } };
		this.#persistTokens();
		this.#apply();
	}

	/** Set a token for both schemes — for things like radius that are not a colour. */
	setSharedToken(name: string, value: string) {
		this.#tokens.light[name] = value;
		this.#tokens.dark[name] = value;
		this.#persistTokens();
		this.#apply();
	}

	clearToken(name: string) {
		delete this.#tokens.light[name];
		delete this.#tokens.dark[name];
		this.#persistTokens();
		this.#apply();
	}

	/** Drop every override, in both schemes. */
	clearTokens() {
		this.#tokens = { light: {}, dark: {} };
		this.#persistTokens();
		this.#apply();
	}

	#store(key: string, value: string) {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(key, value);
		} catch {
			// Private mode, quota, blocked storage — the theme still applies for this page.
		}
	}

	#persistTokens() {
		this.#store(TOKEN_KEY, JSON.stringify($state.snapshot(this.#tokens)));
	}

	#apply(animate = true) {
		if (typeof document === 'undefined') return;
		const root = document.documentElement;

		root.classList.toggle('dark', this.resolved === 'dark');
		root.dataset.accent = this.#accent;

		for (const name of this.#applied) root.style.removeProperty(name);
		const overrides = this.#tokens[this.resolved];
		this.#applied = Object.keys(overrides);
		for (const [name, value] of Object.entries(overrides)) {
			root.style.setProperty(name, value);
		}

		this.#revision += 1;

		if (animate) this.#crossfade(root);
	}

	/** Let the page ease into the new colours instead of snapping to them. */
	#crossfade(root: HTMLElement) {
		root.classList.add('ck-theming');
		clearTimeout(this.#timer);
		this.#timer = setTimeout(() => root.classList.remove('ck-theming'), 340);
	}
}

export const theme = new ThemeState();

/**
 * Inline this in `app.html` before the body renders so the stored theme is in
 * place on first paint.
 */
export const themeScript = `(()=>{try{var d=document.documentElement,m=localStorage.getItem('${MODE_KEY}')||'system',k=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);d.classList.toggle('dark',k);var a=localStorage.getItem('${ACCENT_KEY}');if(a)d.dataset.accent=a;var t=JSON.parse(localStorage.getItem('${TOKEN_KEY}')||'{}')[k?'dark':'light']||{};for(var n in t)d.style.setProperty(n,t[n]);}catch(e){}})()`;
