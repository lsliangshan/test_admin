/**
 *                        _ooOoo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       O\  =  /O
 *                    ____/`---'\____
 *                  .'  \\|     |//  `.
 *                 /  \\|||  :  |||//  \
 *                /  _||||| -:- |||||-  \
 *                |   | \\\  -  /// |   |
 *                | \_|  ''\---/''  |   |
 *                \  .-\__  `-`  ___/-. /
 *              ___`. .'  /--.--\  `. . __
 *           ."" '<  `.___\_<|>_/___.'  >'"".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `-.   \_ __\ /__ _/   .-` /  /
 *     ======`-.____`-.___\_____/___.-`____.-'======
 *                        `=---='
 *
 *     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                 佛祖保佑       永不死机
 *                 心外无法       法外无心
 *
 * Created by liangshan on 15/11/18.
 */
module.exports = Controller("AppFrameController", function () {
    "use strict";
    return {
        init: function (http) {
            this.super_("init", http);
            //this.UserModel = D("Admin/User", {db_ext_config:{safe: 1}});
            this.UserModel = D("Admin/User");
        },
        indexAction: function () {
            return this.deny(403);
        },
        signinAction: function () {
            var self = this;
            if(this.isPost()) {
                var signinInfo = I("", this);
                return self.UserModel.where({email: signinInfo.email, password: md5(signinInfo.password)}).find().then(function (user) {
                    if(isEmpty(user)) {
                        return self.error("用户名或密码有误");
                    } else {
                        user = isArray(user) ? user[0] : user;
                        if(user.hasOwnProperty("password")) {
                            delete user.password;
                        }

                        // 更新last_login_time
                        self.UserModel.where({email: user.email}).update({"last_login_time": +new Date});

                        // 默认登录时不锁定账号
                        user.lockme = 0;
                        user.last_login_time = +new Date;

                        return self.session("userInfo", user).then(function () {
                            return self.session("userInfo").then(function (data) {
                                return self.redirect("/Index/index");
                            });
                        });
                    }
                })
                    .catch(function (e) {
                        return self.error(e.toString().replace('Error:',''));
                    });
            } else {
                this.assign("username", "liangshanfasfdasdfasdfsafdsadfsd");
                //this.assign("url", THINK.APP_PATH + "/Admin/View/default/index_signin.html");
                this.assign("hash", "signin");
                this.assign("appName", "Admin");
                //return this.display(THINK.APP_PATH + "/Admin/View/default/index_signin.html");
                return this.display();
            }
        },
        signupAction: function () {
            var self = this;
            if(this.isPost()) {
                var signupInfo = I("", this);
                return self.UserModel.add({username: signupInfo.username, password: signupInfo.password, email: signupInfo.email}).then(function (id) {
                    if(id) {
                        return self.success("注册成功", {referer: "/Public/signin"});
                        //return self.redirect("/Public/signin");
                    } else {
                        return self.error("注册失败");
                    }
                })
            } else {
                this.assign("username", "yanglin");
                //this.assign("url", THINK.APP_PATH + "/Admin/View/default/index_signup.html");
                this.assign("hash", "signup");
                this.assign("appName", "Admin");
                //return this.display(THINK.APP_PATH + "/Admin/View/default/index_signup.html");
                return this.display();
            }
        },
        loginoutAction: function () {
            var self = this;
            return self.session().then(function () {
                return self.redirect("/Index/index");
            });
        },
        forgotPasswordAction: function () {
            var self = this;
            if(this.isPost()) {

            } else {
                this.assign("appName", "Admin");
                return this.display();
            }
        },
        repasswordAction: function () {
            var self = this;
            var _args = I("", this);
            var _newpassword = _args.password;
            if(self.isPost()) {
                // 更新密码
                return self.UserModel.where({"email": _args.email}).update({"password": _newpassword}).then(function (user) {
                    if(!isEmpty(user)) {
                        return self.json("更新成功");
                    } else {
                        return self.redirect("/Public/error/errmsg/" + (new Buffer("用户查找失败").toString("base64")));
                    }
                })
            } else {
                var _data = JSON.parse(new Buffer(_args.p, "base64").toString("utf8")),
                    _email = _data.email,
                    _timestamp = _data.timestamp,
                    _now = +new Date;
                if(_now - _timestamp > 30*60*1000) {
                    // 链接已经失效
                    return self.redirect("/Public/error/errmsg/" + (new Buffer("链接已经失效").toString("base64")));
                } else {
                    self.assign("email", _email);
                    self.assign("appName", "Admin");
                    return self.display();
                }
            }
        },
        modifyPasswordAction: function () {
            var self = this;
            if(self.isPost()) {
                var formData = I("", this),
                    _oldPassword = formData.old_password,
                    _newPassword = formData.new_password;
                // 修改密码
                return self.session("userInfo").then(function (suser) {
                    if(!isEmpty(suser)) {
                        return self.UserModel.where({"email":suser.email, "id": suser.id, "password": md5(_oldPassword)}).find().then(function (data) {
                            if(isEmpty(data)) {
                                return self.error("密码错误");
                            } else {
                                return self.UserModel.where({"email": suser.email, "id": suser.id}).update({"password": _newPassword}).then(function (id) {
                                    if(!isEmpty(id)) {
                                        // 密码修改成功后,需要重新登录
                                        self.session();
                                        return self.success("密码修改成功", {referer: "/Index/index"});
                                    } else {
                                        return self.error("密码修改失败");
                                    }
                                });
                            }
                        });
                    } else {
                        return self.error("请重新登录", {referer: "/Index/index"});
                    }
                });
            }
        },
        modifyProfileAction: function () {
            var self = this;
            if(self.isPost()) {
                var formData = I("", this);
                return self.session("userInfo").then(function (suser) {
                    if(!isEmpty(suser)) {
                        if(formData.hasOwnProperty("__token__")) {
                            delete formData["__token__"];
                        }
                        return self.UserModel.where({"email": suser.email, "id": suser.id}).update(formData).then(function (id) {
                            if(!isEmpty(id)) {
                                return self.UserModel.where({"id": id}).find().then(function (user) {
                                    if(!isEmpty(user)) {
                                        self.session("userInfo", user);
                                    }
                                    return self.success("更新成功");
                                });
                            } else {
                                return self.error("更新失败");
                            }
                        });
                    } else {
                        return self.error("请重新登录", {referer: "/Index/index"});
                    }
                });
            }
        },
        lockmeAction: function () {
            var self = this;
            return self.session("userInfo").then(function (user) {
                if(self.isPost()) {
                    // 解锁
                    var _password = I("password", self);
                    user = isArray(user) ? user[0] : user;
                    return self.UserModel.where({email: user.email, password: md5(_password)}).find().then(function (user) {
                        if(isEmpty(user)) {
                            return self.error("密码有误");
                        } else {
                            if(user.hasOwnProperty("password")) {
                                delete user.password;
                            }

                            // 更新last_login_time
                            self.UserModel.where({email: user.email}).update({"last_login_time": +new Date});

                            // 默认登录时不锁定账号
                            user.lockme = 0;
                            user.last_login_time = +new Date;

                            return self.session("userInfo", user).then(function () {
                                //return self.session("userInfo").then(function (data) {
                                //    return self.redirect("/Index/index");
                                //});
                                self.assign("sessionInfo", user);
                                return self.success("解锁成功", {referer: "/Index/index"});
                            });
                        }
                    })
                } else {
                    self.assign("appName", "Admin");
                    if(!isEmpty(user)) {
                        user.lockme = 1;
                        return self.session("userInfo", user).then(function () {
                            var _lockedTime = (+new Date - user.last_login_time) / 1000;
                            var _day = 0,
                                _hour = 0,
                                _minute = 0,
                                _second = 0;

                            if(_lockedTime / (60 * 60 * 24) >= 1) {
                                _day = parseInt(_lockedTime / (60 * 60 * 24));
                                _lockedTime = parseInt(_lockedTime % (60 * 60 * 24));
                            }
                            if(_lockedTime / (60 * 60) >= 1) {
                                _hour = parseInt(_lockedTime / (60 * 60));
                                _lockedTime = parseInt(_lockedTime % (60 * 60));
                            }
                            if(_lockedTime / 60 >= 1) {
                                _minute = parseInt(_lockedTime / 60);
                                _lockedTime = parseInt(_lockedTime % 60);
                            }
                            _second = parseInt(_lockedTime);

                            var _out = (_day > 0 ? (_day + "天") : "") + (_hour > 0 ? (_hour + "时") : "") + (_minute > 0 ? (_minute + "分") : "") + (_second > 0 ? (_second + "秒") : "");

                            self.assign("lockedTime", _out);
                            self.assign("sessionInfo", user);
                            return self.display();
                        });
                    } else {
                        return self.display();
                    }
                }
            });
        },
        profileAction: function () {
            var self = this;
            return self.session("userInfo").then(function (user) {
                self.assign("appName", "Admin");
                if(!isEmpty(user)) {
                    if(user.hasOwnProperty("password")) {
                        delete user.password;
                    }
                    self.assign("sessionInfo", user);
                } else {
                    self.assign("sessionInfo", {});
                }
                return self.display();
            });
        },
        settingsAction: function () {
            var self = this;
            return self.session("userInfo").then(function (user) {
                self.assign("appName", "Admin");
                if(!isEmpty(user)) {
                    if(user.hasOwnProperty("password")) {
                        delete user.password;
                    }
                    self.assign("sessionInfo", user);
                } else {
                    self.assign("sessionInfo", {});
                }
                return self.display();
            });
        },
        updateHeadIconAction: function () {
            var self = this;
            if(self.isPost()) {
                return self.session("userInfo").then(function (user) {
                    if(!isEmpty(user)) {
                        if(user.hasOwnProperty("password")) {
                            delete user.password;
                        }
                        var _headicon = I("headicon", self);
                        return self.UserModel.where({username: user.username, email: user.email}).update({"icon": _headicon}).then(function (id) {
                            user.icon = _headicon;
                            return self.session("userInfo", user).then(function () {
                                self.assign("sessionInfo", user);
                                return self.success("更新成功");
                            });
                        });
                    }
                });
            }
        },
        homeAction: function () {
            return this.display();
        },
        componentAction: function () {
            return this.display();
        },
        errorAction: function () {
            var errmsg = new Buffer(I('errmsg', this), "base64").toString("utf8");
            this.assign("appName", "Admin");
            if (this.isAjax()) {
                return this.error(errmsg);
            } else {
                this.assign("errmsg", errmsg);
                return this.display();
            }
        }
    }
});