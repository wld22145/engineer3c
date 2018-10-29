const db = wx.cloud.database({ env: "test-d49d77" });
var latestInstruction;
var latestIndex = 0;
var latestTime;
var instruction;

// get earliest instruction
function getInstruction(){
  return new Promise(function (resolve,reject) {
    db.collection("instructions").orderBy('time','asc').limit(1).get().then(res => {
      resolve(res.data)
    })
  })
}

// remove it from database
function removeInstruction(input){
  return new Promise(function(resolve,reject){
    console.log(input)
    const targetId = input[0]["_id"]
    db.collection('instructions').doc(targetId).remove()
    resolve(input[0])
  })
}

// operate the instruction
// remain fulfilling
function operateInstruction(instruction){
  console.log(instruction)
  
}

// listen once 
function listen () {
  getInstruction().then(removeInstruction).then(function (result){
    operateInstruction(result);
  }).catch(e=>{console.error(e)});
}

//keep listening
function startListening(){
  listen()
  setTimeout(startListening,500)
}


module.exports.listen = listen;
module.exports.startListening = startListening;