var hostFunction = require('../../utils/hostFunction.js');

Page({
  data: {
    text: "host"
  },
  scanQRcode: function() {
    hostFunction.scanQRcode()
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