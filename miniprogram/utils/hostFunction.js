const db = wx.cloud.database({ env: "test-d49d77" });

function scanQRcode() {
  insertInstruction("scanQRcode");
}

function takePhoto() {
  insertInstruction("takePhoto");
}

function startRecord() {
  insertInstruction("startRecord");
}

function stopRecord() {
  insertInstruction("stopRecord");
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
  scanQRcode: scanQRcode,
  takePhoto: takePhoto,
  startRecord: startRecord,
  stopRecord: stopRecord
}