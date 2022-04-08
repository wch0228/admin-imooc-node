const express = require('express')
const boom = require('boom')
const userRouter = require('./user')
const bookRouter = require('./book')
const jwtAuth = require('./jwt')
const Result = require('../models/Result')

// 注册路由
const router = express.Router()
// 使用express-jwt中间件，对所有路由进行 jwt 认证
router.use(jwtAuth)
router.get('/', function (req, res) {
    res.send('欢迎学习小慕读书管理后台');
});
// 通过 userRouter 来处理 /user 路由，对路由处理进行解耦（/book同理）
router.use('/user', userRouter);
router.use('/book', bookRouter);
/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 *  next(boom.notFound('接口不存在'));
 * 把notFound信息传递给异常处理中间件
 */
router.use((req, res, next) => {
    next(boom.notFound('接口不存在'));
})

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
    console.log(err);
    if (err.name === 'UnauthorizedError') {
        const { status = 401, message } = err;
        new Result(null, 'token失效', {
            error: status,
            errorMsg: message
        }).jwtError(res.status(err.status))
    } else {
        const msg = (err && err.message) || '系统错误'
        const statusCode = (err.output && err.output.statusCode) || 500;
        const erroMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
        new Result(null, msg, {
            error: statusCode, erroMsg
        }).fail(res.status(statusCode));
    }
})

module.exports = router;
