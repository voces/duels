import { readFile, writeFile } from "fs/promises";

const getMapLua = () =>
  readFile(
    "/mnt/c/Users/verit/Documents/Warcraft III/Maps/duels.w3m/war3map.lua",
    "utf-8",
  )
    .then((file) =>
      file.split(
        "--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]",
      )[0]
    );

const getTsLua = () =>
  readFile("./temp/out.lua", "utf-8").then((f) =>
    f.replace(/__async__require__/g, "require")
  );

(async () => {
  const [mapLua, tsLua] = await Promise.all([
    getMapLua(),
    getTsLua(),
  ]);

  await writeFile(
    "/mnt/c/Users/verit/Documents/Warcraft III/Maps/duels.w3m/war3map.lua",
    mapLua + tsLua,
  );
})();
