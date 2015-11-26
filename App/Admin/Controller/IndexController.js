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
var nodemailer = require("nodemailer");
module.exports = Controller(function () {
    "use strict";
    return {
        init: function (http) {
            this.super_("init", http);
            this.UserModel = D("Admin/User", {db_ext_config:{safe: 1}});
        },
        indexAction: function () {
            var self = this;
            //this.assign("testData", "这是测试数据");
            //return this.display(THINK.ROOT_PATH + "/www/index.html");
            this.assign("username", "zhangsan");
            this.assign("appName", "Admin");
            return self.session("userInfo").then(function (data) {
                if(isEmpty(data)) {
                    return self.redirect("/Public/signin");
                } else {
                    self.assign("sessionInfo", data);
                    if(data.hasOwnProperty("lockme") && data.lockme == 1) {
                        return self.redirect("/Public/lockme");
                    } else {
                        return self.display();
                    }
                }
            });
        },
        hackFlushSessionAction: function () {
            return this.session();
        },
        autoMailAction: function () {
            var self = this;
            var _to = I("email", this);
            var user = "61826293@qq.com",
                pass = "liangshan001";
            var smtpTransport = nodemailer.createTransport("SMTP", {
                service: "QQ",
                auth: {
                    user: user,
                    pass: pass
                }
            });

            var _data = {
                timestamp: +new Date,
                email: _to
            };
            var _encodedData = new Buffer(JSON.stringify(_data)).toString("base64");
            var _url = "http://127.0.0.1:3000/Public/repassword/p/" + _encodedData;

            var mailOptions = {
                from: 'Keith<' + user + '>',
                to: _to,
                subject: 'Enlink-mob Admin密码修改',
                text: "Hello World",
                html: "点击下面的链接来修改链接 <br/><a href='" + _url + "'>" + _url + "</a><br/>这是由Enlink Admin后台系统自动发送的邮件<br/>请不要直接回复"
            };

            return smtpTransport.sendMail(mailOptions, function (err, res) {
            });
        },
        uploadAction: function () {
            return this.echo("ssssss");
        },
        testGetDropdownHtmlAction: function () {
            this.assign("data", [{"text": "选项1"}, {"text": "选项2"}, {"text": "选项3"}, {"text": "选项4"}, {"text": "选项5"}])
            return this.display();
        },
        testGetAsideHtmlAction: function () {
            var _type = I("type", this);
            this.assign("type", _type);
            return this.display();
        }
    }
});