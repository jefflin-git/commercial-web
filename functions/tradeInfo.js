if (process.env.NODE_ENV !== 'produciton') {
  require('dotenv').config()
}

const { create_mpg_aes_encrypt, create_mpg_sha_encrypt } = require('./encryptDecrypt')

const URL = process.env.URL
const MerchantID = process.env.MERCHANT_ID
const PayGateWay = 'https://ccore.newebpay.com/MPG/mpg_gateway'
const ReturnURL = `${URL}/orders/spgateway/callback?from=ReturnURL`
const NotifyURL = `${URL}/orders/spgateway/callback?from=NotifyURL`
const ClientBackURL = `${URL}/orders`

// 產生要提供給藍新的資料
function getTradeInfo(Amt, Desc, email) {
  const data = {
    MerchantID, // 商店代號
    RespondType: 'JSON', // 回傳格式
    TimeStamp: Date.now(), // 時間戳記
    Version: 1.5, // 串接程式版本
    MerchantOrderNo: Date.now(), // 商店訂單編號
    LoginType: 0, // 智付通會員
    OrderComment: 'This is a test environment', // 商店備註
    Amt, // 訂單金額
    ItemDesc: Desc, // 產品名稱
    Email: email, // 付款人電子信箱
    ReturnURL, // 支付完成返回商店網址
    NotifyURL, // 支付通知網址/每期授權結果通知
    ClientBackURL, // 支付取消返回商店網址
  }

  // 加密 & 雜湊資料
  const mpg_aes_encrypt = create_mpg_aes_encrypt(data)
  const mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

  const tradeInfo = {
    MerchantID, // 商店代號
    TradeInfo: mpg_aes_encrypt, // 加密後參數
    TradeSha: mpg_sha_encrypt,
    Version: 1.5, // 串接程式版本
    PayGateWay,
    MerchantOrderNo: data.MerchantOrderNo,
  }

  return tradeInfo
}

module.exports = getTradeInfo