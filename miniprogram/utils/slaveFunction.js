const db = wx.cloud.database({ env: "test-d49d77" });
var app = getApp()

// get earliest instruction
function getInstruction() {
  return new Promise(function (resolve, reject) {
    db.collection("instructions").orderBy('time', 'desc').limit(1).get().then(res => {
      resolve(res.data)
    })
  })
}

// remove it from database
// function removeInstruction(input) {
//   return new Promise(function (resolve, reject) {
//     console.log(input)
//     const targetId = input[0]["_id"]
//     db.collection('instructions').doc(targetId).remove()
//     resolve(input[0])
//   })
// }

function confirmInstruction(instruction){
  //console.log("confirm")

  return new Promise(function (resolve, reject) {
    if (!(instruction[0].time > app.globalData.lastInstruction.time)
    && !(instruction[0].time < app.globalData.lastInstruction.time)
    &&(instruction[0].instruction == app.globalData.lastInstruction.instruction)) {
      
      //console.log("old instruction")
      
      }
    else{
      console.log("new instruction")
      app.globalData.lastInstruction.time = instruction[0].time
      app.globalData.lastInstruction.instruction = instruction[0].instruction
      resolve(instruction[0])
    }
  })
}

// listen once
function listen() {
  getInstruction().then(confirmInstruction).then(function (result) {
    return new Promise(result);
  }).catch(e => { console.error(e) });
}

//keep listening
function startListening() {
  var op = listen()
  if (op) return op;
  setTimeout(startListening, 500)
}

module.exports = {
  getInstruction: getInstruction,
  confirmInstruction:confirmInstruction,
  listen: listen
}