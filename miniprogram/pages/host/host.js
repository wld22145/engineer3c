var hostFunction = require('../../utils/hostFunction.js');
const db = wx.cloud.database({ env: "test-d49d77" });
var app = getApp()

Page({
  data: {
    text: "host"
  },
  scanQRcode: function() {
    hostFunction.scanQRcode()
    keepListenQRcode()
  },
  takePhoto: function () {
    hostFunction.takePhoto()
  },
  startRecord: function () {
    hostFunction.startRecord()
  },
  stopRecord: function () {
    hostFunction.stopRecord()
  }
})

function getQRcode() {
  return new Promise(function (resolve, reject) {
    db.collection("QRcode").orderBy('time', 'desc').limit(1).get().then(res => {
      resolve(res.data)
    })
  })
}

function confirmQRcode(res) {
  return new Promise(function (resolve, reject) {
    if (!(res[0].time > app.globalData.lastQRcode.time)
      && !(res[0].time < app.globalData.lastQRcode.time)
      && (res[0].result == app.globalData.lastQRcode.result)) {
        // old QRcode
    }
    else {
      console.log("new QRcode")
      app.globalData.lastQRcode.time = res[0].time
      app.globalData.lastQRcode.result = res[0].result
      resolve(res[0])
    }
  })
}

function listenQRcode(){
  getQRcode().then(confirmQRcode).then(function (result) {
    wx.showModal({
      title: 'QRcode result',
      content: result.result,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
    return true
  }).catch(e => { console.error(e) });
}

function keepListenQRcode() {
  var result = listenQRcode()
  if (!result) setTimeout(keepListenQRcode, 2000)
}