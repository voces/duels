declare interface Console {
  // @ts-ignore
  log: (...args: any[]) => void;
  // @ts-ignore
  error: (...args: any[]) => void;
}
declare var console: Console;
