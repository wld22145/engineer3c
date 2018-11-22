const db = wx.cloud.database({ env: "test-d49d77" });

function goLeft() {
  insertInstruction("left");
}

function goRight() {
  insertInstruction("right");
}

function goForward() {
  insertInstruction("forward");
}

function goBackward() {
  insertInstruction("backward");
}

function halt() {
  insertInstruction("halt");
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
  goLeft: goLeft,
  goRight:goRight,
  goForward: goForward,
  goBackward: goBackward
}