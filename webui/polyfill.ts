import * as w3api from "w3api";

import "w3api/dist/lua/polyfill";

w3api.ui.setAdapter({
  urlRewriter: (url) =>
    url
      ? url.endsWith(".blp") || url.endsWith(".dds")
        ? `url(https://dds-to-png.deno.dev?path=https://www.hiveworkshop.com/casc-contents?path=${url})`
        : `url(${url}.png)`
      : url,
});

w3api.initUI();

Object.assign(globalThis, w3api.api, {
  setmetatable: () =>
    new Proxy({}, {
      get: () => {
        throw new Error("asyncRequire does not work in the browser");
      },
    }),
  CreateTimerDialog: () => w3api.getHandle(),
  AddWeatherEffect: () => {},
  BlzSendSyncData: () => false,
  TimerDialogSetTitle: () => {},
  TimerDialogDisplay: () => {},
  DestroyTimerDialog: () => {},
  TriggerRegisterPlayerEvent: () => {},
  BlzTriggerRegisterPlayerSyncEvent: () => {},
  UnitAddType: () => {},
  BlzGetAbilityIcon: () => "",
  GetUnitName: (unit: unit) => `<unit:${(unit as any).handleId}>`,
});

w3api.getGame().localPlayerId = 0;

console.log(w3api.ui.getGlobalScale());

export const tick = () => {
  w3api.getGame().tick();
};

export { w3api };
