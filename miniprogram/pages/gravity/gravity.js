var bluetoothFunction = require('../../utils/bluetoothFunction.js');

const gapTime = 1000;
var timer;

Page({
  data: {
    text: "test"
  },

  AcceleratorCheck: function () {
    console.log("Accelerator start");
    wx.startAccelerometer({
      interval: gapTime
    })
    wx.onAccelerometerChange(function (res) {
      if (res.x > -0.5 && res.x < 0.5 && res.y > -0.5 && res.y < 0.5)
        console.log("stop")
        bluetoothFunction.stop()
      if(res.x<-0.5)
        console.log("go left")
        bluetoothFunction.goLeft()
      if(res.x>0.5)
        console.log("go right")
        bluetoothFunction.goRight()
      if(res.y<-0.5)
        console.log("go back")
        bluetoothFunction.goBack()
      if(res.y>0.5)
        console.log("go ahead")
        bluetoothFunction.goAhead()

      // console.log(res.x,res.y,res.z)
    })
  },

  AcceleratorPause: function () {
    console.log("Accelerator pause");
    wx.stopAccelerometer();
  },
})
