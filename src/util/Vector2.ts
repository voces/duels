interface Vector2 {
	x: number;
	y: number;
}

export class Vector2Ex {
	static angleBetweenVectors(start: Vector2, end: Vector2): number {
		return Math.atan2(end.y - start.y, end.x - start.x);
	}

	static distanceBetweenVectors(a: Vector2, b: Vector2): number {
		return ((a.x - b.x) ** 2 + (a.y - b.y) ** 2) ** 0.5;
	}
}
