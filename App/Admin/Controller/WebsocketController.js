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
    // websocket列表
    var wsList = {};
    setInterval(function () {
        for(var id in wsList) {
            if(wsList.hasOwnProperty(id)) {
                wsList[id].send({
                    name: "机器人",
                    text: "每隔10秒我就发一条消息哦"
                });
            }
        }
    }, 10*1000);
    return {
        init: function (http) {
            this.super_("init", http);
            this.UserModel = D("Admin/User", {db_ext_config:{safe: 1}});
        },
        indexAction: function () {
            return this.display();
        },
        openAction: function () {
            var websocket = this.http.websocket;
            var id = websocket.id;
            for(var wid in wsList) {
                if(wsList.hasOwnProperty(wid)) {
                    wsList[wid].send({
                        name: "系统",
                        text: "id_" + id + " 进入了聊天室"
                    });
                }
            }
            wsList[id] = websocket;
            //this.http.on("websocket.close", function () {
            //    console.log("close");
            //    delete wsList[id];
            //    for(var wid in wsList) {
            //        if(wsList.hasOwnProperty(wid)) {
            //            wsList[wid].send({
            //                name: "id_" + id,
            //                text: "goodbye~~"
            //            });
            //        }
            //    }
            //});
        },
        messageAction: function () {
            var data = I("", this);
            data.name = "id_" + this.http.websocket.id;
            data.wslength = Object.keys(wsList).length;
            for(var id in wsList) {
                if(wsList.hasOwnProperty(id)) {
                    wsList[id].send(data);
                }
            }
        }
    }
});