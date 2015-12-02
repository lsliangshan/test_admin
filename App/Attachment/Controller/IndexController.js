/**
 * controller
 * @return
 */
module.exports = Controller("AdminBaseController", function () {
    "use strict";
    return {
        //init: function (http) {
        //    this.super_("init", http);
        //    //this.Model = D("Attachment");
        //},
        //上传文件
        doUploadAction: function (http) {
            var self = this;
            if (this.isPost()) {
                //表单令牌验证
                var promise = getPromise();
                if (C('token_on')) {
                    promise = this.token(I(C('token_name'), this)).then(function (tk) {
                        if (tk) {
                            return self.error('表单令牌失效');
                        }
                        return {};
                    });
                }
                return promise.then(function () {
                    //获取上传的图片文件
                    var vBImg = self.file('file_upload');
                    var local = self.get("local") || 0;
                    return X("Attachment/Attachment").upload(vBImg,local);
                }).then(function (data) {
                    return self.success("", data);
                }).catch(function (e) {
                    return self.error(e.toString());
                });
            } else {
                var type = this.get("type") || 1;
                var local = this.get("local") || '';
                var allowUploadType = C("post_file_allow_type");
                if (type === 1) {
                    allowUploadType = "jpg|jpeg|png|bmp|gif";
                }
                this.assign("type", type);
                this.assign("local", local);
                this.assign("allowUploadType", allowUploadType);
                return this.display();
            }
        },
        //上传前置检查
        publicCheckUploadAction: function () {
            var self = this;
            //后台上传检查交给rbac
            if (this.inAdmin) {
                self.json({"errno": 0, "errmsg": "", "data": {}});
            } else {
                //判断用户是否登录
                return this.session("userInfo").then(function (user) {
                    if (isEmpty(user)) {
                        return self.json({"errno": 500, "errmsg": "用户未登录,不能访问", "data": {}});
                    } else {
                        //检查用户权限
                        //...

                        return self.json({"errno": 0, "errmsg": "", "data": {}});
                    }
                });
            }
        },

        indexAction: function () {
            return this.deny(403);
        },

        addAction: function () {
            return this.deny(403);
        },

        editAction: function () {
            return this.deny(403);
        },

        delAction: function () {
            return this.deny(403);
        },

        sortAction: function () {
            return this.deny(403);
        },

        copyAction: function () {
            return this.deny(403);
        },

        viewAction: function () {
            return this.deny(403);
        }
    };
});