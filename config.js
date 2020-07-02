const fs = require("fs");
const globalConfig = {};
const conf = fs.readFileSync("./server.conf");
const configArr = conf.toString().split("\n");
// console.log(configArr)
for (const item of configArr) {
    globalConfig[item.split("=")[0].trim()] = item.split("=")[1].trim();
}
// console.log(globalConfig)
module.exports = globalConfig;