var hostFunction = require('../../utils/hostFunction.js');
const db = wx.cloud.database({ env: "test-d49d77" });
var app = getApp()
var qrCodeFlag = true
var fileIdFlag = true
var videoFlag = true
var stop = false

Page({
  data: {
    text: "host"
  },

  scanQRcode: function() {
    hostFunction.scanQRcode()
    qrCodeFlag = true
    wx.showLoading({
      title: 'getting QRcode',
    })
    keepListenQRcode()
  },

  takePhoto: function () {
    hostFunction.takePhoto()
    fileIdFlag = true
    wx.showLoading({
      title: 'getting photo',
    })
    keepListenFileId()
  },

  startRecord: function () {
    hostFunction.startRecord()
    timing30s()
  },

  stopRecord: function () {
    stopTiming30s()
    hostFunction.stopRecord()
    videoFlag = true
    keepListenVideoId()
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
    qrCodeFlag = false
    wx.hideLoading()
    wx.showModal({
      title: 'QRcode result',
      content: result.result,
      showCancel: false,
      confirmText: 'confirm',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  }).catch(e => { console.error(e) });
}

function keepListenQRcode() {
  listenQRcode()
  console.log('listen')
  if (qrCodeFlag) setTimeout(keepListenQRcode, 1000)
}



function getFileId() {
  return new Promise(function (resolve, reject) {
    db.collection("fileID").orderBy('time', 'desc').limit(1).get().then(res => {
      resolve(res.data)
    })
  })
}

function confirmFileId(res) {
  return new Promise(function (resolve, reject) {
    if (!(res[0].time > app.globalData.lastFileID.time)
      && !(res[0].time < app.globalData.lastFileID.time)
      && (res[0].fileID == app.globalData.lastFileID.fileID)) {
      // old QRcode
    }
    else {
      console.log("new fileID")
      app.globalData.lastFileID.time = res[0].time
      app.globalData.lastFileID.fileID = res[0].fileID
      resolve(res[0])
    }
  })
}

function listenFileId() {
  getFileId().then(confirmFileId).then(function (result) {
    fileIdFlag = false
    wx.hideLoading()
    wx.showModal({
      title: 'show photo',
      content: result.fileID,
      cancelText: 'cancel',
      confirmText: 'confirm',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // show photo
          wx.previewImage({
            urls: [result.fileID]
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }

      }
    })
  }).catch(e => { console.error(e) });
}

function keepListenFileId() {
  listenFileId()
  console.log('listen fileID')
  if (fileIdFlag) setTimeout(keepListenFileId, 1000)
}



function getVideoId() {
  return new Promise(function (resolve, reject) {
    db.collection("videoID").orderBy('time', 'desc').limit(1).get().then(res => {
      resolve(res.data)
    })
  })
}

function confirmVideoId(res) {
  return new Promise(function (resolve, reject) {
    if (!(res[0].time > app.globalData.lastVideoID.time)
      && !(res[0].time < app.globalData.lastVideoID.time)
      && (res[0].videoID == app.globalData.lastVideoID.videoID)) {
      // old QRcode
    }
    else {
      console.log("new fileID")
      app.globalData.lastVideoID.time = res[0].time
      app.globalData.lastVideoID.videoID = res[0].videoID
      resolve(res[0])
    }
  })
}

function listenVideoId() {
  getVideoId().then(confirmVideoId).then(function (result) {
    videoFlag = false
    wx.hideLoading()
    wx.showModal({
      title: 'save video',
      content: result.videoID,
      cancelText: 'cancel',
      confirmText: 'confirm',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: 'saving video',
          })
          // save video
          wx.cloud.downloadFile({
            fileID: result.videoID,
            success: re => {
              // get temp file path
              console.log(re.tempFilePath)
              wx.saveVideoToPhotosAlbum({
                filePath: re.tempFilePath,
                success(r) {
                  console.log(r.errMsg)
                  wx.hideLoading()
                  wx.showToast({
                    title: 'save success',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail(f) {
                  wx.hideLoading()
                  wx.showModal({
                    title: 'save fail',
                    content: f.errMsg,
                    showCancel: false,
                    confirmText: 'confirm',
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      }
                    }
                  })
                }
              })
            },
            fail: err => {
              wx.showModal({
                title: 'download fail',
                content: err.errMsg,
                showCancel: false,
                confirmText: 'confirm',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }).catch(e => { console.error(e) });
}

function keepListenVideoId() {
  listenVideoId()
  console.log('listen videoID')
  if (videoFlag) setTimeout(keepListenVideoId, 1000)
}


function timing30s() {
  stop = false
  t = 0;
  wx.showLoading({
    title: t + 's',
  })

  timer = setInterval(function () {
    t = t + 1
    //wx.hideLoading()
    wx.showLoading({
      title: t + 's',
    })

    if (t == 30) {
      wx.hideLoading()
      clearInterval(timer)
      videoFlag = true
      wx.showLoading({
        title: 'video uploading',
      })
      keepListenVideoId()
    }
    else if (stop) {
      wx.hideLoading()
      wx.showLoading({
        title: 'video uploading',
      })
      clearInterval(timer)
    }
  }, 1000);
}

function stopTiming30s() {
  stop = true
}
