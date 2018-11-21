var slaveFunction = require("../../utils/slaveFunction.js")

Page({
  data: {
    text: "slave"
  },


  onListen: function () {
    console.log("listen button");
    slaveFunction.listen();
  },

  onStartListen: function () {
    console.log("start listening button");
    slaveFunction.startListening();
  },
})