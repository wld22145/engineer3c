// pages/rocker/rocker.js
var bluetoothFunction = require('../../utils/bluetoothFunction.js');

Page({
  data: {
    StartX: '120',
    StartY: '200',
    leftLooks: '',
    topLooks: '',
    //半径
    radius: '60',
  },

  //拖动摇杆移动
  ImageTouchMove: function (e) {
    var self = this;
    var touchX = e.touches[0].clientX - 40;
    var touchY = e.touches[0].clientY - 40;
    var movePos = self.GetPosition(touchX, touchY);
    self.setData({
      leftLooks: movePos.posX,
      topLooks: movePos.posY
    })
    console.log(movePos.posX);
    console.log(movePos.posY);
    var slope = (movePos.posY - 200) / (movePos.posX - 120 + 0.001);
    if ((slope > 0.25 && movePos.posY < 200) || (slope < -0.25 && movePos.posY < 200)){
      console.log("go ahead")
      // bluetoothFunction.goAhead()
    }
    else if ((slope > 0.25 && movePos.posY > 200) || (slope < -0.25 && movePos.posY > 200)) {
      console.log("go back")
      // bluetoothFunction.goBack()
    }

    if (slope < 2 && slope > -2 && movePos.posX > 120){
      console.log("go right")
      // bluetoothFunction.goRight()
    }
    else if(slope < 2 && slope > -2 && movePos.posX < 120){
      console.log("go left")
      // bluetoothFunction.goLeft()
    }
  },
  //获得触碰位置并且进行数据处理获得触碰位置与拖动范围的交点位置
  GetPosition: function (touchX, touchY) {
    var self = this;
    var DValue_X;
    var Dvalue_Y;
    var Dvalue_Z;
    var imageX;
    var imageY;
    var ratio;
    DValue_X = touchX - self.data.StartX;
    Dvalue_Y = touchY - self.data.StartY;
    Dvalue_Z = Math.sqrt(DValue_X * DValue_X + Dvalue_Y * Dvalue_Y);
    //触碰点在范围内
    if (Dvalue_Z <= self.data.radius) {
      imageX = touchX;
      imageY = touchY;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };
    }

    //触碰点在范围外
    else {
      ratio = self.data.radius / Dvalue_Z;
      imageX = DValue_X * ratio + 120;
      imageY = Dvalue_Y * ratio + 200;
      imageX = Math.round(imageX);
      imageY = Math.round(imageY);
      return { posX: imageX, posY: imageY };
    }
  },

  ImageReturn: function (e) {
    var self = this;
    self.setData({
      leftLooks: self.data.StartX,
      topLooks: self.data.StartY,
    })
  }

})
