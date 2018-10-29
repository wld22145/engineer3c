const db = wx.cloud.database({ env:"test-d49d77"});


function goLeft(){
  insertInstruction("left");
}

function insertInstruction(instruction) {
  return db.collection('instructions').add({
    data: {
      instruction: instruction,
      time: new Date(),
    }})
    .then(function(res){
      console.log(res)
    })
}

module.exports.goLeft = goLeft;