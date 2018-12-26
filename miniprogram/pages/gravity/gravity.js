var bluetoothFunction = require('../../utils/bluetoothFunction.js');

const gapTime = 500;
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
      if(res.x<-0.5){
        console.log("go left")
        bluetoothFunction.goLeft()
      }else if(res.x>0.5){
        console.log("go right")
        bluetoothFunction.goRight()
      }else if(res.y<-0.5){
        console.log("go back")
        bluetoothFunction.goBack()
      }else if(res.y>0.5){
        console.log("go ahead")
        bluetoothFunction.goAhead()
      } else if (res.x > -0.5 && res.x < 0.5 && res.y > -0.5 && res.y < 0.5) {
        console.log("stop")
        bluetoothFunction.stop()
      }
      // console.log(res.x,res.y,res.z)
    })
  },

  AcceleratorPause: function () {
    console.log("Accelerator pause");
    wx.stopAccelerometer();
  },
})
