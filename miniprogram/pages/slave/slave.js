var slaveFunctions = require("../../utils/slaveFunction.js")

Page({
  data: {
    text: "slave"
  },


  onListen: function () {
    console.log("listen button");
    slaveFunctions.listen();
  },

  onStartListen: function () {
    console.log("start listening button");
    slaveFunctions.startListening();
  },
})