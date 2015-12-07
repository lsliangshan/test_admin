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
    /**数据库配置**/
    db_type: 'mysql', // 数据库类型
    db_host: '127.0.0.1', // 服务器地址
    db_port: '3306', // 端口
    db_name: 'test', // 数据库名
    db_user: 'root', // 用户名
    db_pwd: 'root', // 密码
    db_prefix: '', // 数据库表前缀

    url_resource_reg: /^(Static\/|favicon\.ico|robot\.txt)/, //判断是否是静态资源的正则

    post_file_allow_type: 'jpg|jpeg|png|bmp|gif|xls|xlsx|zip|rar|ipa|apk',//允许上传的文件类型

    post_max_file_size: 300 * 1024 * 1024, //上传文件大小限制，默认300M
    post_file_upload_type:'aliyun',//上传文件方式: local,ftp,aliyun,aws

    /**Aliyun config**/
    ali_access_key_id: 'gBvfSrZjoFhRCs08',
    ali_access_key_secret: 'b6VEEubulOXPbRUj2L2J9IGb88UYds',
    ali_bucket: 'cnautoshows',
    ali_region: 'oss-cn-hangzhou',
    ali_path: '',
    ali_url: 'http://img.cnautoshows.com/',
};