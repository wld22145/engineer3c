var app = getApp()

var UTIL = require('../../utils/util.js');

const appkey = require('../../config').appkey
const appsecret = require('../../config').appsecret

const mp3Recorder = wx.getRecorderManager()
const mp3RecoderOptions = {
  duration: 60000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 48000,
  format: 'mp3',
  //frameSize: 50
}

//弹幕定时器
var timer;

var pageSelf = undefined;

var doommList = [];
class Doomm {
  constructor() {
    this.top = Math.ceil(Math.random() * 40);
    this.time = Math.ceil(Math.random() * 8 + 6);
    this.color = getRandomColor();
    this.display = true;
    let that = this;
    setTimeout(function () {
      doommList.splice(doommList.indexOf(that), 1);
      doommList.push(new Doomm());

      pageSelf.setData({
        doommData: doommList
      })
    }, this.time * 1000)
  }
}
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  data: {
    j: 1,//帧动画初始图片 
    isSpeaking: false,//是否正在说话
    outputTxt : "", //输出识别结果

    doommData: []
  },

  initDoomm: function () {
    doommList.push(new Doomm());
    doommList.push(new Doomm());
    doommList.push(new Doomm());
    this.setData({
      doommData: doommList
    })
  },

  onLoad: function () {
    pageSelf = this;
    this.initDoomm();

    //onLoad中为录音接口注册两个回调函数，主要是onStop，拿到录音mp3文件的文件名（不用在意文件后辍是.dat还是.mp3，后辍不决定音频格式）
    mp3Recorder.onStart(() => {
      console.log('mp3Recorder.onStart()...')
    })
    mp3Recorder.onStop((res) => {
      console.log('mp3Recorder.onStop() ' + res)
      const { tempFilePath } = res
      var urls = "https://api.happycxz.com/wxapp/mp32asr";
      console.log('mp3Recorder.onStop() tempFilePath:' + tempFilePath)
      processFileUploadForAsr(urls, tempFilePath, this);
    })
  },

  /////////////////////////////////////////////////////////////// 以下是调用新接口实现的录音，录出来的是 mp3
  touchdown: function () {
  //touchdown_mp3: function () {
    console.log("mp3Recorder.start with" + mp3RecoderOptions)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    mp3Recorder.start(mp3RecoderOptions);
  },
  touchup: function () {
  //touchup_mp3: function () {
    console.log("mp3Recorder.stop")
    this.setData({
      isSpeaking: false,
    })
    mp3Recorder.stop();
  },
})

//上传录音文件到 api.happycxz.com 接口，处理语音识别和语义，结果输出到界面
function processFileUploadForAsr(urls, filePath, _this) {
  wx.uploadFile({
    url: urls,
    filePath: filePath,
    name: 'file',
    formData: { "appKey": appkey, "appSecret": appsecret, "userId": UTIL.getUserUnique() },
    header: { 'content-type': 'multipart/form-data' },
    success: function (res) {
      console.log('res1.data:' + res.data);
    
      var stt = getSttFromResult(res.data)
      console.log('stt:' + stt + typeof stt);

      var sentenceResult;
      try {        
        var length = "前".length
        var sentenceResult = stt.substring(0, length)
        console.log("tmp length" + length)
        console.log("tmp string" + sentenceResult)
        if (setenceResult != "前" && sentenceResult != "后" && sentenceResult != "左" && sentenceResult !="右")
          sentenceReuslt = "指令不正确！"
      } catch (e) {
        sentenceResult = "指令不正确！"
      }

      var lastOutput = "==>语音识别结果：\n" + stt + "\n\n==>发送指令：\n" + sentenceResult;
      _this.setData({
        outputTxt: lastOutput,
      });
      wx.hideToast();
    },

    fail: function (res) {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: "网络请求失败，请确保网络是否正常",
        showCancel: false,
        success: function (res) {
        }
      });
      wx.hideToast();
    }
  });
}

function getSttFromResult(res_data) {
  var res_data_json = JSON.parse(res_data);
  var res_data_result_json = JSON.parse(res_data_json.result);
  return res_data_result_json.asr.result;
}

//麦克风帧动画 
function speaking() {
  var _this = this;
  //话筒帧动画 
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}
