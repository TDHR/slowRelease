const rpcMethod = require('../../rpc/index');
const p = require('../../config/db');
const addressMessage = require('../../config/message.json');

exports.index = async (ctx)=> {
    let params = ctx.request.body;
    // console.log(params);
    let address = params.address;
    let productAddress = params.productAddress;
    let reward = await queryProductMessage(productAddress);//查询此地址应当打多少个币
    // let assetId = addressMessage[productAddress].assetID;
    let assetId = reward.result;
    if(!assetId || productAddress === '16nTo9eyf3gGSVTbyobYkaWBZzGEKpa3XU'){
        assetId = "100001:1"
    }
    // console.log(address);
    // let priAddress = await rpcMethod.getAddr();
    // console.log('address:'+priAddress)
    // let txID = await rpcMethod.sendToAddress(address);
    // console.log('toAddress' + address);
    let myAddress = await rpcMethod.getAddr();//获取项目地址
    //还应该再去验证传过来的产品地址是否属于当前项目地址，测试阶段省去这一步
    let txData = await rpcMethod.sendToAddress(address,assetId);
    // console.log(txID)
    ctx.body = {
        success:true,
        txData:txData,
        toAddress:address,
        fromAddress:myAddress
    }
};
//通过地址查询应当打多少个币出去
const queryProductMessage = function (productAddress) {
    return new Promise((resolve,reject) => {
        let queryProductMessageSql = `SELECT assetId,reward FROM  code_product  WHERE proAddress='${productAddress}'`;
        p.query(queryProductMessageSql,function (error, result, fields) {
            if(error){
                let queryMessage = {
                    status:false,
                    message:'查询失败'
                }
                reject(queryMessage);
            }else {
                let queryMessage = {
                    status:true,
                    message:'查询成功',
                    result:`${result[0].assetId}:${result[0].reward}`
                }
                resolve(queryMessage)
            }

        })
    });

};