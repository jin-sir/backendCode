const reocommondDao = require("../dao/RecommondDao");
const respUtil = require("../util/RespUtil");
const path = new Map();
const headers = {
    "content-type": "text/html; charset=utf-8",
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type, x-requested-with",
    "Access-Control-Allow-Credentials": true
};

// 推荐
function queryRecommond(request, response) {
    const { offset, limit } = request.query;
    if (!offset && !limit) {
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("error", "0", null));
        response.end();
        return;
    }
    console.log(offset, limit)
    reocommondDao.queryRandomUserByUser(parseInt(offset), parseInt(limit), function(result) {
        const temp = {
            result
        }
        response.writeHead(200, headers);
        response.write(respUtil.writeResult("success", "1", temp));
        response.end();
    });
}
path.set("/queryRecommond", queryRecommond);
path.set("/querysomeUser", queryRecommond);
module.exports.path = path;