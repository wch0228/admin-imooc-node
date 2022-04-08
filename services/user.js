// 封装一个login查询方法
const { querySql, queryOne } = require('../db');

function login(username, password) {
    const sql = `select * from admin_user where username='${username}' and password='${password}'`;
    return querySql(sql)
}
function findUser(username) {
    return queryOne(`select id,username,role,nickname,avatar from admin_user where username = '${username}'`);
}
module.exports = {
    login,
    findUser
}