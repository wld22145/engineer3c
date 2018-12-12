//index.js

var bluetoothFunction = require('../../utils/bluetoothFunction.js');

Page({
  ahead: function () {
    console.log("go ahead")
    bluetoothFunction.goAhead()
  },
  left: function () {
    console.log("go left")
    bluetoothFunction.goLeft()
  },
  right: function () {
    console.log("go right")
    bluetoothFunction.goRight()
  },
  back: function () {
    console.log("go back")
    bluetoothFunction.goBack()
  },
  stop: function() {
    console.log("stop")
    bluetoothFunction.stop()
  }
  
})