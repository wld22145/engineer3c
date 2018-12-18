const db = wx.cloud.database({ env: "test-d49d77" });

function testInstruction() {
  insertInstruction("test instruction");
}

function photo() {
  insertInstruction("photo");
}


function insertInstruction(instruction) {
  return db.collection('instructions').add({
    data: {
      instruction: instruction,
      time: new Date(),
    }
  })
    .then(function (res) {
      console.log(res)
    })
}

module.exports = {
  testInstruction: testInstruction,
  photo:photo,

}