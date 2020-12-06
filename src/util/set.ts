export const setSubtract = <T>(minuend: T[], subtrahend: T[]): T[] => {
	for (const value of subtrahend) {
		const index = minuend.indexOf(value);
		if (index >= 0) minuend.splice(index, 1);
	}
	return minuend;
};
