const express = require('express');
//创建express应用
const app = express();
const router = require('./router');
const fs = require('fs');
const https = require('https');
// body-parser是非常常用的一个express中间件，作用是对post请求的请求体进行解析
// 调试解析中间件
const bodyParser = require('body-parser');
//解决跨域中间件
const cors = require('cors');
// 读取证书
const privateKey = fs.readFileSync('./https/7258671_www.epubbook.site.key', 'utf8');
const certificate = fs.readFileSync('./https/7258671_www.epubbook.site.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
//启用证书
const httpsServer = https.createServer(credentials, app);
const SSLPORT = 18082;

//中间件是一个回调函数，需要在响应结束前被调用，在请求之前调用（get、post）
//中间件一定需要调用next,否则无法向下执行
// const myLogger = function (req, res, next) {
//     console.log('myLogger');
//     next();
// }
// //使用中间件
// app.use(myLogger);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);

//监听 / 根路径的get请求
// app.get('/', function (req, res) {
//     // res.send('hellow node');
//     throw new Error('something has error...');
// })
//浏览器地址栏只能捕获get请求
// app.get('/user', function (req, res) {
//     res.send('user!');
// })

//异常处理 通过自定义异常处理中间件处理请求中产生的异常,放在请求之后（get、post）
//4个参数一个不能少，否则会视为普通的中间件 异常处理中间件需要在请求之后引用项目框架搭建
// const errorHandler = function (err, req, res, next) {
//     // console.log('errorHandler');
//     res.status(404).json({
//         error: -1,
//         msg: err.toString()
//     })
// }
// app.use(errorHandler);


//使express监听5000端口号发起的HTTP请求
const server = app.listen('5000', function () {
    const { address, port } = server.address()
    console.log('HTTP服务启动成功: http://', address, port)
})
// 监听18082发起的HTTPS请求
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT)
})



