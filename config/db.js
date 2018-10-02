const mysql = require('mysql');
const wrapper = require('co-mysql');
// var dbConfig = {
//     host:'59.110.171.208',
//     user:'root',
//     password:'nrc1qaz@WSX',
//     database:'reits_data',
//     port:3306,
//     useConnectionPooling: true,
//     charset:'utf8mb4'
// };
const pool = mysql.createPool({
    host:'59.110.171.208',
    user:'root',
    password:'nrc1qaz@WSX',
    database:'reits_data',
    port:3306,
    useConnectionPooling: true,
    charset:'utf8mb4'
})
const SqlP = wrapper(pool);

module.exports = SqlP;