const fs = require("fs");
const globalConfig = require("./config");
const controllerSet = [];
const pathMap = new Map();
const files = fs.readdirSync(globalConfig["web_path"]);

for (const i of files) {
    const temp = require(`./${globalConfig["web_path"]}/${i}`);
    if (temp.path) {
        for (const [key, value] of temp.path) {
            if (pathMap.get(key) == null) {
                pathMap.set(key, value);
            } else {
                throw new Error("url path异常，url:" + key);
            }
        }
        controllerSet.push(temp);
    }
}

module.exports = pathMap;