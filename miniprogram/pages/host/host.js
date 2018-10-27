var functions = require('functions.js')

Page({
  data: {
    text: "host"
  },
  onGoLeft: function () {
    console.log("left button");
    functions.goLeft();
  },
})