function send(instruction) {
  var app = getApp()
  if (app.globalData.connected) {
    var buffer = new ArrayBuffer(instruction.length)
    var dataView = new Uint8Array(buffer)
    for (var i = 0; i < instruction.length; i++) {
      dataView[i] = instruction.charCodeAt(i)
    }
    wx.writeBLECharacteristicValue({
      deviceId: app.globalData.connectedDeviceId,
      serviceId: app.globalData.services[2].uuid,
      characteristicId: app.globalData.characteristics[0].uuid,
      value: buffer,
      success: function (res) {
        console.log('发送成功')
      }
    })
  }
  else {
    wx.showModal({
      title: '提示',
      content: '蓝牙已断开',
      showCancel: false,
    })
  }
}

function goAhead(){
  send("ONA")
}

function goBack(){
  send("ONB")
}

function goLeft(){
  send("ONC")
}

function goRight(){
  send("OND")
}

function stop(){
  send("ONF")
}



module.exports = {
  send: send,
  goAhead: goAhead,
  goBack: goBack,
  goLeft: goLeft,
  goRight: goRight,
  stop: stop
  
}