export const repeat = <T>(count: number, fn: (index: number) => T) => {
  const arr: T[] = [];
  for (let i = 0; i < count; i++) arr.push(fn(i));
  return arr;
};
