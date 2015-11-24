/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2014- <ric3000(at)163.com>
 * @license    MIT
 * @version    15/6/8
 */
module.exports = Model(function () {
    'use strict';
    return {
        //定义字段
        fields: {
            username: {
                type: 'string',
                unique: true,
                //required: true,
                index: true,
                size: 50
            },
            nickname: {
                type: "string",
                unique: true,
                index: true,
                size: 50
            },
            password: {
                type: 'string',
                required: true,
                index: true,
                size: 32
            },
            icon: {
                type: 'text'
            },
            last_login_time: {
                type: 'string',
                size: 20
            },
            last_login_ip:{
                type: 'string',
                defaultsTo: ''
            },
            email: {
                type: 'string',
                index: true,
                required: true,
                size: 50
            },
            gender: {
                type: 'integer'
            },
            website: {
                type: 'string',
                size: 100
            },
            description: {
                type: "string",
                size: "256"
            },
            company: {
                type: "string",
                size: 100
            },
            address: {
                type: "string",
                size: 100
            },
            phone: {
                type: 'string',
                size: 30
            },
            create_time: {
                type: 'string',
                size: 20
            },
            update_time: {
                type: 'string',
                size: 20
            }
        },

        //定义数据校验
        validations: {
            email: {
                valid: ['email'],
                msg: {
                    email: 'email格式不正确'
                }
            }
        },

        _beforeAdd: function (data) {
            this.validations = extend(this.validations,{
                password: {
                    valid: ['required', 'length'],
                    length_args: [6],
                    msg: {
                        required: '密码不能为空',
                        length: '密码长度至少6位'
                    }
                }
            });
            data.create_time = +new Date;
            data.update_time = +new Date;
            if(!isEmpty(data.password)){
                data.password = this.autoPassword(data);
            }
            return getPromise(data);
        },

        _beforeUpdate: function (data) {
            data.update_time = +new Date;
            if(!isEmpty(data.password)){
                data.password = this.autoPassword(data);
            }
            return getPromise(data);
        },

        autoPassword: function(data){
            if(!isEmpty(data.password)){
                return md5(data.password);
            }
        }

    }
});