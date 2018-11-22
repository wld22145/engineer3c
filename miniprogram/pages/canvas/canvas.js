Page({
  data: {
    startPoint: [0,0]
  },
  mytouchstart: function(e){
    this.setData({startPoint: [e.touches[0].pageX, e.touches[0].pageY]})
    console.log(e.touches[0].pageX)
    console.log(e.touches[0].pageY)
    var context = wx.createContext()
    function ball(x, y) {
      context.beginPath(0)
      context.arc(x, y+100, 50, 0, Math.PI * 2)
      context.setFillStyle('red')
      context.setStrokeStyle('rgba(1,1,1,0)')
      context.fill()
      context.stroke()
    
     ball(e.touches[0].pageX, e.touches[0].pageY)
      wx.drawCanvas({
        canvasId: 'canvas',
        actions: context.getActions()
      })
    }
    
  }

})
