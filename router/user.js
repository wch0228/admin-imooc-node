const express = require('express');
const Result = require('../models/Result');
const { login, findUser } = require('../services/user');
const { md5, decoded } = require('../utils');
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant');
const { body, validationResult } = require('express-validator');
const boom = require('boom');
const jwt = require('jsonwebtoken');

const router = express.Router()

router.post('/login',
    //1. 调用express-validator中间件的body方法判断是否为string，不是显示withMessage提示
    //使用body判断参数类型
    [
        body('username').isString().withMessage('用户名不正确'),
        body('password').isString().withMessage('密码不正确')
    ],
    function (req, res, next) {
        // 2.使用validationResult，传入req
        const err = validationResult(req);
        //判断变量为空的方法isEmpty
        if (!err.isEmpty()) {
            // 数组解构，拿到errors数组里的msg
            const [{ msg }] = err.errors;
            //next抛出异常给自定义异常处理中间件
            next(boom.badRequest(msg));
        } else {
            // 拿到req.body里面的username，password
            // const username = req.body.username;
            // const password = req.body.password;

            // let定义变量在赋值，通常const定义变量
            let { username, password } = req.body;
            password = md5(`${password}${PWD_SALT}`);
            login(username, password).then(user => {
                if (!user || user.length === 0) {
                    new Result('登录失败').fail(res);
                } else {
                    const token = jwt.sign(
                        { username },
                        PRIVATE_KEY,
                        { expiresIn: JWT_EXPIRED }
                    )
                    new Result({ token }, '登录成功').success(res);
                }
            })
            console.log('/user/login', req.body);
        }

    })

router.get('/info', function (req, res) {
    const decode = decoded(req);
    if (decode && decode.username) {
        findUser(decode.username).then(user => {
            if (user) {
                user.roles = [user.roles];
                new Result(user, '用户信息查询成功').success(res);
            } else {
                new Result('用户信息查询失败').fail(res);
            }
        })
    } else {
        new Result('用户信息查询失败').fail(res);
    }

})

module.exports = router;