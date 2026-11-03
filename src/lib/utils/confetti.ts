export interface ConfettiOptions {
	/** Where the burst starts: an element's center, or a point in viewport pixels. */
	origin?: HTMLElement | { x: number; y: number };
	/** Number of pieces. */
	count?: number;
	/** Width of the cone, in degrees. */
	spread?: number;
	/** Middle of the cone, in degrees: -90 is straight up, 0 is to the right. */
	angle?: number;
	/** Launch speed; around 10 clears a button, 16 clears the screen. */
	velocity?: number;
	/** How hard the pieces fall. Below 1 they hang about, above 1 they drop. */
	gravity?: number;
	/** Size of the pieces, as a multiplier. */
	scale?: number;
	/** CSS colors. Defaults to the theme's accent and status colors. */
	colors?: string[];
	/** Milliseconds until every piece has faded. */
	duration?: number;
}

interface Piece {
	x: number;
	y: number;
	vx: number;
	vy: number;
	rotation: number;
	spin: number;
	width: number;
	height: number;
	color: string;
	round: boolean;
	wobble: number;
}

function themeColors(): string[] {
	const style = getComputedStyle(document.documentElement);
	return ['--ck-accent', '--ck-success', '--ck-warning', '--ck-info', '--ck-danger']
		.map((name) => style.getPropertyValue(name).trim())
		.filter(Boolean);
}

/**
 * Fire a burst of confetti from a point or an element. Resolves when the last
 * piece is gone. Does nothing for visitors who prefer reduced motion.
 */
export function confetti(options: ConfettiOptions = {}): Promise<void> {
	if (typeof window === 'undefined') return Promise.resolve();
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

	const {
		count = 120,
		spread = 70,
		angle = -90,
		velocity = 11,
		gravity = 1,
		scale = 1,
		duration = 2400,
		colors = themeColors()
	} = options;

	let x = window.innerWidth / 2;
	let y = window.innerHeight / 2;
	if (options.origin instanceof HTMLElement) {
		const box = options.origin.getBoundingClientRect();
		x = box.left + box.width / 2;
		y = box.top + box.height / 2;
	} else if (options.origin) {
		({ x, y } = options.origin);
	}

	const ratio = window.devicePixelRatio || 1;
	const canvas = document.createElement('canvas');
	canvas.width = window.innerWidth * ratio;
	canvas.height = window.innerHeight * ratio;
	canvas.style.cssText =
		'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:70';
	canvas.setAttribute('aria-hidden', 'true');
	document.body.appendChild(canvas);

	const context = canvas.getContext('2d')!;
	context.scale(ratio, ratio);

	const palette = colors.length ? colors : ['#7c4dff'];
	const pieces: Piece[] = Array.from({ length: count }, () => {
		const direction = (angle + (Math.random() - 0.5) * spread) * (Math.PI / 180);
		const speed = velocity * (0.55 + Math.random() * 0.75);
		return {
			x,
			y,
			vx: Math.cos(direction) * speed,
			vy: Math.sin(direction) * speed,
			rotation: Math.random() * Math.PI * 2,
			spin: (Math.random() - 0.5) * 0.35,
			width: (5 + Math.random() * 5) * scale,
			height: (7 + Math.random() * 7) * scale,
			color: palette[Math.floor(Math.random() * palette.length)],
			round: Math.random() < 0.3,
			wobble: Math.random() * Math.PI * 2
		};
	});

	return new Promise((resolve) => {
		const start = performance.now();
		let previous = start;

		const frame = (now: number) => {
			// Normalize to 60 fps so the physics feel the same on any refresh rate.
			const step = Math.min(3, (now - previous) / (1000 / 60));
			previous = now;
			const progress = (now - start) / duration;

			context.clearRect(0, 0, window.innerWidth, window.innerHeight);
			context.globalAlpha = progress > 0.7 ? Math.max(0, 1 - (progress - 0.7) / 0.3) : 1;

			for (const piece of pieces) {
				piece.vy += 0.32 * gravity * step;
				piece.vx *= 0.985 ** step;
				piece.vy *= 0.985 ** step;
				piece.wobble += 0.12 * step;
				piece.x += (piece.vx + Math.sin(piece.wobble) * 0.6) * step;
				piece.y += piece.vy * step;
				piece.rotation += piece.spin * step;

				context.save();
				context.translate(piece.x, piece.y);
				context.rotate(piece.rotation);
				// Squash on one axis to fake the piece turning in 3D.
				context.scale(1, Math.cos(piece.wobble));
				context.fillStyle = piece.color;
				if (piece.round) {
					context.beginPath();
					context.arc(0, 0, piece.width / 2, 0, Math.PI * 2);
					context.fill();
				} else {
					context.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
				}
				context.restore();
			}

			if (progress < 1) {
				requestAnimationFrame(frame);
			} else {
				canvas.remove();
				resolve();
			}
		};

		requestAnimationFrame(frame);
	});
}
