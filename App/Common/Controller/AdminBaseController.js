/**
 * 后台基类
 * @author     richen
 * @copyright  Copyright (c) 2014- <ric3000(at)163.com>
 * @license    MIT
 * @version    14-8-29
 */
module.exports = Controller('AppFrameController', function () {
    'use strict';
    return {
        //默认初始化方法
        init: function (http) {
            this.super_('init', http);
            this.assign('title', C('app_title'));
            this.assign('keywords', C('app_keywords'));
            this.assign('description', C('app_description'));
        },

        //控制器公共前置方法
        __before: function () {
            var self = this;
            //判断用户是否登录
            return this.session('userInfo').then(function (user) {
                if (isEmpty(user)) {
                    //ajax访问返回一个json的错误信息
                    if (self.isAjax()) {
                        return self.error('用户未登录，不能访问');
                    } else {
                        //跳转到登录页
                        return self.redirect('/Admin/Public/login');
                    }
                } else {
                    return authCheck(self.http.group, self.http.controller, self.http.action, user, 2, 'every').then(function (check) {
                        if (!check) {
                            //ajax访问返回一个json的错误信息
                            if (self.isAjax()) {
                                return self.error('没有权限');
                            } else {
                                //跳转到错误页
                                return self.redirect('/Admin/Public/error/errmsg/'+encodeURI('没有权限'));
                            }
                        }
                        //将用户信息赋值到模版变量里，供模版里使用
                        return self.assign('userInfo', user);
                    });
                }
            });
        },

        indexAction: function () {
            var self = this;
            this.Mo.page = I('page', this) || 1;
            this.Model = isEmpty(this.Model) ? M(this.http.controller) : this.Model;
            return D('Common')._list(this.Model, this.Map, this.Mo).then(function (data) {
                self.assign('data', data);
                self.assign('pagerData', data);
                return self.display();
            }).catch(function (e) {
                return self.error(e.toString());
            });
        },

        addAction: function () {
            var self = this;
            if (this.isPost()) {
                this.Model = isEmpty(this.Model) ? D(this.http.group + '/' + this.http.controller) : this.Model;
                //表单令牌验证
                var promise = getPromise();
                if (C('token_on')) {
                    promise = this.token(I(C('token_name'), this)).then(function (tk) {
                        if(tk){
                            return self.error('表单令牌失效');
                        }
                        return {};
                    });
                }
                return promise.then(function () {
                    return self.Model.add(I('', self, 'post'));
                }).then(function (data) {
                    return self.success('操作成功');
                }).catch(function (e) {
                    return self.error(e.toString());
                });

            } else {
                return this.display();
            }
        },

        editAction: function () {
            var self = this;
            var id = I('id', this);
            this.Model = isEmpty(this.Model) ? D(this.http.group + '/' + this.http.controller) : this.Model;
            if (this.isPost()) {
                //表单令牌验证
                var promise = getPromise();
                if (C('token_on')) {
                    promise = this.token(this.post(C('token_name'))).then(function (tk) {
                        if(tk){
                            return self.error('表单令牌失效');
                        }
                        return {};
                    });
                }
                return promise.then(function () {
                    return self.Model.update(I('', self, 'post'));
                }).then(function (data) {
                    return self.success('操作成功');
                }).catch(function (e) {
                    return self.error(e.toString());
                });
            } else {
                return getPromise(this.Model.getPk()).then(function (pk) {
                    return self.Model.where(getObject(pk, id)).find().then(function (data) {
                        self.assign('info', isArray(data) ? data[0] : data);
                        return self.display();
                    });
                });
            }
        },

        delAction: function () {
            var self = this;
            var ids = I('id', this);
            if (isEmpty(ids)) {
                ids = I('ids', this);
            }
            if (isEmpty(ids)) {
                return this.error('没有选择要操作的对象');
            }
            if (!isArray(ids)) {
                ids = ids.split(',');
            }
            //表单令牌验证
            var promise = getPromise();
            if (C('token_on')) {
                promise = this.token(I(C('token_name'), this)).then(function (tk) {
                    if(tk){
                        return self.error('表单令牌失效');
                    }
                    return {};
                });
            }
            this.Model = isEmpty(this.Model) ? D(this.http.group + '/' + this.http.controller) : this.Model;
            return promise.then(function () {
                var ps = ids.map(function (id) {
                    return getPromise(self.Model.getPk()).then(function (pk) {
                        var model = D(self.Model);
                        return model.where(getObject(pk, id)).delete();
                    });
                });
                return Promise.all(ps);
            }).then(function () {
                return self.success('操作成功');
            }).catch(function (e) {
                return self.error(e.toString());
            });
        },

        sortAction: function () {
            var self = this;
            var ids = I('ids', this, 'post');

            if (isEmpty(ids)) {
                return this.error('没有选择要操作的对象');
            }
            if (!isArray(ids)) {
                ids = ids.split(',');
            }

            //表单令牌验证
            var promise = getPromise();
            if (C('token_on')) {
                promise = this.token(this.post(C('token_name'))).then(function (tk) {
                    if(tk){
                        return self.error('表单令牌失效');
                    }
                    return {};
                });
            }
            this.Model = isEmpty(this.Model) ? D(this.http.group + '/' + this.http.controller) : this.Model;
            return promise.then(function () {
                var ps = ids.map(function (id) {
                    var sort = (function () {
                        return getPromise(self.Model.getPk()).then(function (pk) {
                            var listOrder = I('listorders-' + id, self, 'post');
                            var model = D(self.Model);
                            return model.where(getObject(pk, id)).update({listorders: listOrder});
                        });
                    }());

                    return sort;
                });
                return Promise.all(ps)
            }).then(function () {
                return self.success('操作成功');
            }).catch(function (e) {
                return self.error(e.toString());
            });
        },

        viewAction: function () {
            var self = this;
            var id = I('id', this);
            this.Model = isEmpty(this.Model) ? D(this.http.group + '/' + this.http.controller) : this.Model;
            return getPromise(this.Model.getPk()).then(function (pk) {
                return self.Model.where(getObject(pk, id)).find().then(function (data) {
                    self.assign('info', isArray(data) ? data[0] : data);
                    return self.display();
                });
            });
        },

        copyAction: function () {
            var self = this;
            var id = I('id', this);
            this.Model = isEmpty(this.Model) ? D(this.http.group + '/' + this.http.controller) : this.Model;
            if (this.isPost()) {
                //表单令牌验证
                var promise = getPromise();
                if (C('token_on')) {
                    promise = this.token(I(C('token_name'), this)).then(function (tk) {
                        if(tk){
                            return self.error('表单令牌失效');
                        }
                        return {};
                    });
                }
                return promise.then(function () {
                    return self.Model.add(I('', self, 'post'));
                }).then(function (data) {
                    return self.success('操作成功');
                }).catch(function (e) {
                    return self.error(e.toString());
                });
            } else {
                return getPromise(this.Model.getPk()).then(function (pk) {
                    return self.Model.where(getObject(pk, id)).find().then(function (data) {
                        self.assign('info', isArray(data) ? data[0] : data);
                        return self.display();
                    });
                });
            }
        }

    };
});