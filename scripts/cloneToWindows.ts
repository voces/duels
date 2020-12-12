import * as fs from "fs-extra";

import { cloneToWindows, IProjectConfig, loadJsonFile, logger } from "./utils";

const config: IProjectConfig = loadJsonFile("config.json");

fs.readFile(`${config.outputFolder}/${config.mapFolder}`).then((f) => {
	cloneToWindows(f);

	logger.info("Finished!");
});
