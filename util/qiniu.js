const fs = require('fs');
// 七牛云模块
const qiniu = require('qiniu');
const accessKey = 'TIkEMDzZhXZ8JcXtnfXRdIJ2SXmrECw7Q7vcLAmJ';
const secretKey = '7z2EnICcf8LXJSOsSOrKaxY-wn6L11jt7ufmxKHp';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const bucket = 'chatpath';
const options = {
    scope: bucket
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken=putPolicy.uploadToken(mac);

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

function qiniuUpload (file, success, err) {
    if (!file) {
        err();
        return;
    }
    if (file instanceof Array) {
        for (const [prop,index] of file) {
            upload(prop, success[index]);
        }
    } else {
        upload(file, success);
    }
}
function upload(file, success) {
    const type = file.originalname && file.originalname.split('.');
    // 构建图片名 这个主要是生成唯一图片名字利于存储 当然为了方便就写时间戳 实际开发可千万别 可能出现两人同一时间
    const fileName = Date.now() + '.' + type[type.length - 1];
    // 构建图片路径 需要在上一层目录下新建一个image
    const filePath = file.destination + fileName;
    fs.readFile(file.path, function(err, result) {
        fs.writeFile(filePath, result, function (err) {
            if (err) {
                // 写入失败
                res.end(JSON.stringify({status: '102', msg: '文件写入失败'}));
            } else {
                formUploader.putFile(uploadToken, fileName, filePath, putExtra, function (err, respBody, respInfo) {
                    if (err) {
                        err()
                    }
                    if (respInfo.statusCode == 200) {
                        success(respBody.key);
                    } else {
                        console.log(respInfo.statusCode);
                        console.log(respBody);
                    }


                    // 上传之后删除本地文件
                    fs.unlinkSync(file.path);
                    fs.unlinkSync(filePath);
                });
            }
        })
    })
}
module.exports.qiniuUpload = qiniuUpload;