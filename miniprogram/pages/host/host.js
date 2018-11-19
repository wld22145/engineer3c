var hostFunction = require('../../utils/hostFunction.js');

Page({
  data: {
    text: "host"
  },
  onGoLeft: function () {
    console.log("left button");
    hostFunction.goLeft();
  },
})