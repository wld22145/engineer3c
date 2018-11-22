const gapTime = 500;
var timer;

Page({
  data: {
    text: "test"
  },
  onStartCheck: function () {
    console.log("start button");
    Countdown();
  },
  onPauseCheck: function () {
    console.log("pause button");
    clearTimeout(timer);
  },
  AcceleratorCheck: function () {
    console.log("Accelerator start");
    wx.startAccelerometer({
      interval: gapTime
    })
    wx.onAccelerometerChange(function (res) {
      console.log(res.x)
      console.log(res.y)
      console.log(res.z)
    })
  },
  AcceleratorPause: function () {
    console.log("Accelerator pause");
    wx.stopAccelerometer();
  },
})

function Countdown() {
  timer = setTimeout(function () {
    console.log("----count down----");
    Countdown();
  }, gapTime);
};