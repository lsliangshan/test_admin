/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2014- <ric3000(at)163.com>
 * @license    MIT
 * @version    14-10-21
 */
var fs = require("fs");

module.exports = Service(function(){
    "use strict";
    return {

        getFilePath: function(){
            var self = this;
            var path = new Date().Format('YYYY/MM/DD') + "/";
            return getPromise(path);
        },

        upload: function(file,local){
            var self = this;
            if(!isEmpty(file.originalFilename) && !isEmpty(file.path) && !isEmpty(file.size)){
                //检查文件类型
                var mime = require('mime');
                var mimetype = mime.extension(mime.lookup(file.path));
                var allowUploadType = C("post_file_allow_type");
                if(allowUploadType.split("|").indexOf(mimetype) <0 ){
                    return E("上传的文件类型非法");
                }
                //检查文件大小
                var allowUploadSize = C("post_max_file_size");
                if(file.size > allowUploadSize){
                    return E("上传的文件大小超限");
                }
                //var ext = file.originalFilename.split(".");
                var newFileName = md5(file.originalFilename + file.size) + "." + mimetype;
                var uploadType = C("post_file_upload_type");
                //强制上传到本地(适用于特殊场景,比如xls文件解析)
                if(!isEmpty(local) && local > 0){
                    uploadType = "local";
                }

                return self.getFilePath().then(function (path) {
                    if(uploadType === 'ftp'){
                        return self.doUploadFtp(file.path,path,newFileName);
                    }else if(uploadType === 'aliyun'){
                        return self.doUploadAliyun(file.path,path,newFileName);
                    }else if(uploadType === 'aws'){
                        return self.doUploadAws(file.path,path,newFileName);
                    }else{
                        return self.doUploadLocal(file.path,path,newFileName);
                    }
                }).then(function (data) {
                    return getPromise({filename:newFileName,fileurl:data,filesize:file.size});
                });
            }else{
                return E("获取文件错误");
            }
        },
        //本地上传
        doUploadLocal: function (srcfile, filepath, filename) {
            //读取文件
            //var filePath = '',fileUrl='';
            //return Promise.all([self.getFilePath(),mReadFile(file.path)]).then(function (data) {
            //    filePath = C("post_file_save_path") + data[0] + newFileName;
            //    fileUrl = C('post_file_save_url') + data[0] + newFileName;
            //    return mWriteFile(filePath,data[1]);
            //}).then(function () {
            //    return getPromise({"status":true,"info":fileUrl});
            //}).catch(function (e) {
            //    return getPromise({"status":false,"info":e});
            //});
            var localSavePath = C("post_file_save_path") + filepath;
            var promise = getPromise();
            if(!isDir(localSavePath)){
                promise = promise.then(function () {
                    return mkdir(localSavePath);
                });
            }
            return promise.then(function () {
                return mReName(srcfile,localSavePath + filename).then(function () {
                    return C('post_file_save_url') + filepath + filename;
                });
            });

        },
        //FTP上传
        doUploadFtp: function (srcfile, filepath, filename) {
            var ftp = require("ftp");
            var config = {
                host:C("ftp_server"),
                port:C("ftp_port"),
                user:C("ftp_user"),
                password:C("ftp_pwd")
            };

            return new Promise(function (fulfill, reject){
                var client = new ftp();
                var fileUrl = C("ftp_url") + filepath + filename;
                client.on('ready', function () {
                    client.mkdir(filepath,true, function (err) {
                        if (err) {
                            reject(err);
                        }else {
                            client.put (srcfile, filepath + filename,function (err, res){
                                if (err) {
                                    reject(err);
                                }else {
                                    //删除临时文件
                                    var fn = function(){};
                                    try{
                                        fs.unlink(srcfile, fn);
                                        fulfill(fileUrl);
                                    }catch (e){}
                                }
                            });
                        }
                    });
                });
                client.connect(config);
            });

        },
        //阿里云上传
        doUploadAliyun: function (srcfile, filepath, filename) {
            var aliyun = require("oss-easy");
            var ossOptions = {
                accessKeyId : C("ali_access_key_id"),
                accessKeySecret : C("ali_access_key_secret")
            };

            return new Promise(function (fulfill, reject){
                var store = new aliyun(ossOptions, C("ali_bucket"));
                var fileUrl = C("ali_url") + filepath + filename;
                store.uploadFile(srcfile, C('ali_path') + filepath + filename, function(err) {
                    if (err) {
                        reject(err);
                    }else {
                        //删除临时文件
                        var fn = function(){};
                        try{
                            fs.unlink(srcfile, fn);
                            fulfill(fileUrl);
                        }catch (e){}
                    }
                });
            });
        },
        //亚马逊AWS上传
        doUploadAws: function(srcfile, filepath, filename){

        }

    };
});