/**
 * 项目基类
 * @author     Richen
 * @copyright  Copyright (c) 2014- <ric3000(at)163.com>
 * @license    MIT
 * @version    14-8-28
 */
module.exports = Controller(function(){
    "use strict";

    return {
        //默认初始化方法(仅适合做非中断型同步逻辑,中断目前无法正确返回)
        init: function (http) {
            this.super_('init',http);
            // 页面公共过滤条件
            this.Map = {};
            // 定义数据对象
            this.Model = '';
            // index列表分页查询SQL数组参数
            this.Mo = {sortby: '',field: [],ispage: true,pagesize: 20};
        },

        //_empty: function(){
        //    this.redirect("/");
        //},

    };
});