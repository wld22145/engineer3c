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
      if(res.x<-0.5)
        console.log("go left")
      if(res.x>0.5)
        console.log("go right")
      if(res.y<-0.5)
        console.log("go back")
      if(res.y>0.5)
        console.log("go ahead")

      // console.log(res.x,res.y,res.z)
    })
  },

  AcceleratorPause: function () {
    console.log("Accelerator pause");
    wx.stopAccelerometer();
  },
})
