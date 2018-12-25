const db = wx.cloud.database({ env: "test-d49d77" });
var app = getApp()
var that
var cntVideo
var cntPhoto

Page({
  data: {
    text: "slave",
  },

  onLoad() {
    this.ctx = wx.createCameraContext()
    that = this
    cntVideo = 0
    cntPhoto = 0
  },

  onListen: function () {
    console.log("listen button");
    listen();
  },

  onStartListen: function () {
    console.log("start listening button");
    startListening();
  }
})

// get earliest instruction
function getInstruction() {
  return new Promise(function (resolve, reject) {
    db.collection("instructions").orderBy('time', 'desc').limit(1).get().then(res => {
      resolve(res.data)
    })
  })
}

// remove it from database
// function removeInstruction(input) {
//   return new Promise(function (resolve, reject) {
//     console.log(input)
//     const targetId = input[0]["_id"]
//     db.collection('instructions').doc(targetId).remove()
//     resolve(input[0])
//   })
// }

function confirmInstruction(instruction) {
  //console.log("confirm")

  return new Promise(function (resolve, reject) {
    if (!(instruction[0].time > app.globalData.lastInstruction.time)
      && !(instruction[0].time < app.globalData.lastInstruction.time)
      && (instruction[0].instruction == app.globalData.lastInstruction.instruction)) {

      //console.log("old instruction")

    }
    else {
      console.log("new instruction")
      app.globalData.lastInstruction.time = instruction[0].time
      app.globalData.lastInstruction.instruction = instruction[0].instruction
      resolve(instruction[0])
    }
  })
}

// listen once
function listen() {
  getInstruction().then(confirmInstruction).then(function (result) {
    operateInstruction(result);
  }).catch(e => { console.error(e) });
}

//keep listening
function startListening() {
  listen()
  setTimeout(startListening, 500)
}

// operate the instruction
// remain fulfilling
function operateInstruction(instruction) {
  console.log("operate")
  console.log(instruction)

  switch (instruction.instruction) {
    case "scanQRcode":
      scanQRcode()
      break
    case "startRecord":
      startRecording()
      break
    case "stopRecord":
      stopRecording()
      break
    case "takePhoto":
      takePhoto()
      break
    default:
      console.log("default")
  }
}

// scanQRcode
function scanQRcode() {
  console.log("scanQRcode")
  wx.scanCode({
    success: (res) => {
      console.log("scanResult")
      console.log(res.result)
      insertQRcode(res.result)
    },
    fail: (res) => {
      console.log(res)
    }
  })
}

// start video recording
function startRecording() {
  console.log("startRecording")
  that.ctx.startRecord({
    success: (res) => {
      console.log('startRecord success')
      wx.showLoading({
        title: 'recording',
      })
    }
  })
}

// stop video recording
function stopRecording() {
  console.log("stopRecording")
  that.ctx.stopRecord({
    success: (res) => {
      wx.hideLoading()
      console.log(res.tempVideoPath)
      that.setData({
        src: res.tempThumbPath,
        videoSrc: res.tempVideoPath
      })

      console.log("upload video")
      wx.showLoading({
        title: 'uploading video',
      })
      wx.cloud.uploadFile({
        cloudPath: 'videoFile/'+cntVideo+'.mp4',
        filePath: res.tempVideoPath,
        success: function (re) {
          //insert video id
          insertVideoId(re.fileID)

          wx.hideLoading()
          cntVideo = cntVideo + 1;
          wx.showToast({
            title: 'upload success',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (re) {
          wx.hideLoading()
          console.error
          wx.showModal({
            title: 'upload fail',
            content: re.errMsg,
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
    fail:(res)=>{
      console.error
    }
  })
}

// take photo
function takePhoto() {
  console.log("takePhoto")
  wx.showLoading({
    title: 'uploading photo',
  })
  //let that = this
  //let ctx = wx.createCameraContext()
  that.ctx.takePhoto({
    quality: 'high',
    success: (res) => {
      console.log(res.tempImagePath)
      that.setData({
        src: res.tempImagePath
      })

      console.log("upload photo")
      wx.cloud.uploadFile({
        cloudPath: 'imgFile/' + cntPhoto + '.jpg',
        filePath: res.tempImagePath,
        success: function (res) {
          //insert file id
          insertFileId(res.fileID)

          wx.hideLoading()
          cntPhoto = cntPhoto + 1;
          wx.showToast({
            title: 'upload success',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (res) {
          wx.hideLoading()
          console.error
          wx.showModal({
            title: 'upload fail',
            content: res.errMsg,
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
    fail: (res) => {
      console.error
    }
  })
}

function insertQRcode(result) {
  return db.collection('QRcode').add({
    data: {
      result: result,
      time: new Date(),
    }
  })
    .then(function (res) {
      console.log(res)
    })
}

function insertFileId(result) {
  return db.collection('fileID').add({
    data: {
      fileID: result,
      time: new Date(),
    }
  })
    .then(function (res) {
      console.log(res)
    })
}

function insertVideoId(result) {
  return db.collection('videoID').add({
    data: {
      videoID: result,
      time: new Date(),
    }
  })
    .then(function (res) {
      console.log(res)
    })
}
