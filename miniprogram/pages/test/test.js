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
})

function Countdown() {
  timer = setTimeout(function () {
    console.log("----count down----");
    Countdown();
  }, gapTime);
};