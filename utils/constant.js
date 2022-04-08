const { env } = require('./env')
const UPLOAD_PATH = env === 'dev' ? 'E:/Nginx/nginx-1.17.10/upload/admin-upload-ebook' : //本地电子书上传路径
    '/root/upload/admin-upload/ebook';  //服务器电子书上传路径

// 老式电子书在/book/res/img
const OLD_UPLOAD_URL = env === 'dev' ? 'https://epubbook.site/book/res/img' : 'https://www.epubbook.site/book/res/img'

// 判断文件下载路径是否为本地环境或线上环境
const UPLOAD_URL = env === 'dev' ? 'https://epubbook.site/admin-upload-ebook' : 'https://www.epubbook.site/admin-upload-ebook'

module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    debug: true,
    PWD_SALT: 'admin_imooc_node', // 密码采用MD5+SALT加密，需要与密码对等(类似JWT秘钥)
    PRIVATE_KEY: 'admin_imooc_node_test_youbaobao_xyz', //jwt秘钥
    JWT_EXPIRED: 60 * 60, //token失效时间
    UPLOAD_PATH,
    OLD_UPLOAD_URL,
    UPLOAD_URL,
    MINE_TYPE_EPUB: 'application/epub+zip'
}  