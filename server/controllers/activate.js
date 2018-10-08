const rpcMethod = require('../../rpc/index');
const addressMessage = require('../../config/message.json');

exports.index = async (ctx)=> {
    let params = ctx.request.body;
    // console.log(params);
    let address = params.address;
    let productAddress = params.productAddress;
    let assetId = addressMessage[productAddress].assetID;
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
}