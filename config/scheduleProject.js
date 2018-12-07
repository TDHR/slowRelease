// 定时任务，每15s生成一个二维码，并保存到数据库中
const p = require('./db');
const rpcMethod = require('../rpc/index');
let  schedule = require('node-schedule');
const request = require('superagent');
let addressList = ['1MDfA3XBZM5SMsuyyR23ZmGBQk9HCGmwV4','185Q5poNDgNzQkz3wzcRaSoNerf7naKBzY','1CUKmu8xg5AYetwLWvebkA1sQVoymfTZw7'];
// let addressList = ['187Xpykh4XDqUPBsoiafqpABfV8Fhct51Y'];

let rule = new schedule.RecurrenceRule();
exports.createCode =async function() {

    // var date = new Date(2018, 10, 1, 17, 45, 0);
    rule.second = [0,15,30,45];
    // rule.second = [0,5,10,15,20,25,30,35,40,45,50,55];

    let j = schedule.scheduleJob(rule,function () {
        initData();
    });

};
//整理数据
async function initData() {
    let index = Math.floor((Math.random()*addressList.length));
    let address = addressList[index];
    let now =parseInt(new Date().getTime());
    console.log(address);
    let originMessage = `id:${now}`;
    let singMessage  =await getSignMessage(address,originMessage);//获取签名信息；
    // console .log(singMessage)
    let  data = {address:address,originMessage:originMessage,signMessage:singMessage};
    // if(address === '187Xpykh4XDqUPBsoiafqpABfV8Fhct51Y') {
    //     insertCodeTmp(data)
    // }else {
        insertCode(data)
    // }


}
//将生成的二维码数据中插入数据库中
async function insertCode(data) {
    //s=HweOKK2CcM1vCDtAm6/Mg5hN2YzX+F1zCh3XnBein57xfoiF7UemhSlnzzWDr9w/pBaHrZBo1XzPS05NV/PJ948=&o=id:18419&id=18419&a=1BtvWKc9bdReVcP74WngsmuRiJrkjUiBNc

    return new Promise((resolve,reject) => {
        let sql = `insert into code_message (address,originMessage,signMessage) values('${data.address}','${data.originMessage}','${data.signMessage}')`;
        p.query(sql,function (error,results,fields) {
            if(error) {
                console.log(JSON.stringify(error))
                reject(error);
            }
            else {
                console.log('插入成功');
                resolve({
                    message:'插入成功'
                })
            }
        })
    })
}
//获取签名信息
async function getSignMessage(address,originMessage) {

    let signMessage = await rpcMethod.signmessage(address,originMessage);
    // console.log(signMessage)
    return signMessage;
}

//将生成的二维码数据中插入数据库中
async function insertCodeTmp(data) {
    //s=HweOKK2CcM1vCDtAm6/Mg5hN2YzX+F1zCh3XnBein57xfoiF7UemhSlnzzWDr9w/pBaHrZBo1XzPS05NV/PJ948=&o=id:18419&id=18419&a=1BtvWKc9bdReVcP74WngsmuRiJrkjUiBNc

    return new Promise((resolve,reject) => {
        let sql = `insert into code_tmp (address,originMessage,signMessage,codeId) values('${data.address}','${data.originMessage}','${data.signMessage}',${data.codeId})`;
        p.query(sql,function (error,results,fields) {
            if(error) reject(error);
            else {
                console.log('插入成功');
                resolve({
                    message:'插入成功'
                })
            }
        })
    })
}

//====================INU活动每天释放一定比例的INU==========
exports.releaseToken = async function () {
       // var date = new Date(2018, 10, 1, 17, 45, 0);
    rule.hour = [16];
    // rule.second = [0,5,10,15,20,25,30,35,40,45,50,55];
    rule.minute = [44];
    rule.second = [0];
    let j = schedule.scheduleJob(rule,function () {
        console.log('开始任务');
        queryFunc();
    });
};
const queryFunc = async function () {
    let userMessage = await queryInuActivityUser();
    await sendMessage(userMessage.result);
    // return userMessage;
}
//查询已经参与活动的用户
const queryInuActivityUser = async function () {
    return new  Promise ((resolve,reject) => {
        let querySql = `SELECT openid,nickname,total,shareNumber FROM (
SELECT tmp.user AS USER,shareNumber,total FROM  (
SELECT USER,SUM(token_number) AS shareNumber FROM codetx WHERE productAddress = '1FKi8SiEWY8TRsChyS9jzGMGbSZoaVB1S3' AND LENGTH(singleProductID)>5 GROUP BY USER) tmp 
LEFT JOIN (
SELECT SUM(token_number) total  ,USER FROM codetx WHERE productAddress='1FKi8SiEWY8TRsChyS9jzGMGbSZoaVB1S3' AND singleProductID=7) msg 
ON tmp.user=msg.user ) ms LEFT JOIN wechat_user wu ON ms.user=wu.openid WHERE ms.total<30000 OR ms.total IS NULL`;
        p.query(querySql,function (error, result) {
            if(error){
                reject ({
                    status:false,
                    message:JSON.stringify(error)
                })
            }else {
                resolve({
                    status:true,
                    result:result
                })
            }
        })
    })

};
//将查询出来的用户信息发送到主程序中开始打币
const sendMessage = async function (message) {
    let url = "https://www.reitschain.com/releaseInu";
    console.log(JSON.stringify(message));
  request
      .post(url)
      .set("Accept","application/json")
      .set('Content-Type','application/json')
      .send({
          data:message
      })
      .end(function (err, result) {
          if(err){
              console.log(JSON.stringify(err));
              console.error('任务失败');
          }else {
              console.log('任务成功');
          }
      })
};

exports. sendMessageTest = async function (message) {
    let url = "http://47.75.125.111:8080/code_test_manager/api/transfer";
    console.log(JSON.stringify(message));
    request
        .post(url)
        .set("Accept","application/json")
        .set('Content-Type','application/json')
        .query({
            address:'1HgCrBrmqapweFNmoxDChSb3YdXyMC6cee',
            productAddress:'1FKi8SiEWY8TRsChyS9jzGMGbSZoaVB1S3',
            amount:1
        })
        .end(function (err, result) {
            if(err){
                console.log(JSON.stringify(err));
                // console.error('任务失败');
            }else {
                console.log(JSON.stringify(result))
                // console.log('任务成功');
            }
        })
};