// 对生成的jwt进行认证
const jwt = require('express-jwt');
const { PRIVATE_KEY } = require('../utils/constant');

const jwtAuth = jwt({
    secret: PRIVATE_KEY,  //jwt秘钥
    algorithms: ['HS256'], //jwt算法
    credentialsRequired: true  // 设置为false就不进行校验了，游客也可以访问
}).unless({  // 设置 jwt 认证白名单
    path: [
        '/',
        '/user/login'
    ]
});
module.exports = jwtAuth;