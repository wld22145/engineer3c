var functions = require("functions.js")

Page({
  data: {
    text: "slave"
  },


  onListen: function () {
    console.log("listen button");
    functions.listen();
  },

  onStartListen: function () {
    console.log("start listening button");
    functions.startListening();
  },
})