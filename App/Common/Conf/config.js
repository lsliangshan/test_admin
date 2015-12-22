/**
 * config
 */
module.exports = {
    /**App属性**/
    app_version: '1.0',
    app_version_code: '1',
    app_title: 'thinknode',
    app_keywords: 'thinknode',
    app_description: 'thinknode,node.js mvc framework',
    app_port: 3000,
    app_group_list: ['Admin'], //分组列表
    default_group: 'Admin',//默认分组


    url_resource_reg: /^(Static\/|favicon\.ico|robot\.txt)/, //判断是否是静态资源的正则

    post_file_allow_type: 'jpg|jpeg|png|bmp|gif|xls|xlsx|zip|rar|ipa|apk',//允许上传的文件类型

};