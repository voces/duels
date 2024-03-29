declare const __async__require__: (luaPath: string) => Record<string, unknown>;

export const asyncRequire = <T>(luaPath: string): T =>
  setmetatable({}, {
    __index: (_: unknown, prop: string) => __async__require__(luaPath)[prop],
  }) as unknown as T;
