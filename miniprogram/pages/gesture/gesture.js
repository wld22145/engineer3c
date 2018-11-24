Page({
  data: {
    startPoint: [0,0],
    endPoint: [0,0]
  },
  start: function (e) {
    this.setData({ startPoint: [e.touches[0].x, e.touches[0].y] })
  },
  move: function (e) {
    this.setData({ endPoint: [e.touches[0].y, e.touches[0].y] })
  },
  end: function(){
    // console.log("startPoint:", this.data.startPoint[0], this.data.startPoint[1])
    // console.log("endPoint:", this.data.endPoint[0], this.data.endPoint[1])
    if (this.data.endPoint[0] == 0 && this.data.endPoint[1] == 1)
      return 0;
    
    if (this.data.startPoint[1] > this.data.endPoint[1] && this.data.startPoint[1] - this.data.endPoint[1] > Math.abs(this.data.startPoint[0] - this.data.endPoint[0]))
    {
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.setFontSize(50)
      ctx.fillText('前进', 100, 150)
      ctx.draw()
      console.log("go ahead")
    }
    if (this.data.startPoint[1] < this.data.endPoint[1] && this.data.endPoint[1] - this.data.startPoint[1] > Math.abs(this.data.startPoint[0] - this.data.endPoint[0]))
    {
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.setFontSize(50)
      ctx.fillText('后退', 100, 150)
      ctx.draw()
      console.log("go back")
    }
    if (this.data.startPoint[0] > this.data.endPoint[0] && this.data.startPoint[0] - this.data.endPoint[0] > Math.abs(this.data.startPoint[1] - this.data.endPoint[1]))
    {
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.setFontSize(50)
      ctx.fillText('左转', 100, 150)
      ctx.draw()
      console.log("go left")
    }
    if (this.data.startPoint[0] < this.data.endPoint[0] && this.data.endPoint[0] - this.data.startPoint[0] > Math.abs(this.data.startPoint[1] - this.data.endPoint[1]))
    {
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.setFontSize(50)
      ctx.fillText('右转', 100, 150)
      ctx.draw()
      console.log("go right")
    }
      

    this.setData({ startPoint: [0, 0] })
    this.setData({ endPoint: [0, 0] })
  }
})

