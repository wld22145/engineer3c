
const app = getApp()

const util = require('../../utils/util.js')

const plugin = requirePlugin("WechatSI")
var bluetoothFunction = require('../../utils/bluetoothFunction.js');
//import { language } from '../../utils/conf.js'
let language = [
  {
    id: 0,
    lang_name: "中文",
    lang_content: "zh_CN",
    lang_to: ["en_US",],
    max_length: 300,
    source_language: "输入文字",
    target_language: "输出文字",
    hold_talk: "长按说话",
    keyboard_input: "键盘输入",
    type_here: "输入文字",
    bg_content: "请输入翻译内容",
    record_failed: "录制失败",
    recognize_nothing: "请说话",
    time_left: "录音输入倒数",
    text_left: "剩余文本长度",
    prompt_time: "提示秒数",
    upload_failed: "上传失败",
    translating: "翻译中",
    text_limit: "限制长度",
    input_tip: "请输入有效文字",
    request_failed: "请求失败",
    delete_tip: "删除该项",
    cancel: "取消",
    bubble_tip: "请输入文本",
    bg_bubble: "正在听你说话",
    copy_source_text: "复制原文",
    copy_target_text: "复制译文",
    delete_item: "删除",
    exceed_network: "网络请求失败",
    retry_network: "尝试重新连接",
    wait_last_record: "请等待翻译结束",
    access_auth: "请检查权限",
    access_network: "网络错误",
    login: "登录",
  },
  {
    id: 1,
    lang_name: "EN",
    lang_content: "en_US",
    lang_to: ["zh_CN",],
    max_length: 1800,
    source_language: "Source Language",
    target_language: "Target Language",
    hold_talk: "Hold To Talk",
    keyboard_input: "Keyboard",
    type_here: "Type here...",
    bg_content: "Please enter the content to be translated",
    record_failed: "Audio recording failed",
    recognize_nothing: "Nothing recognized",
    time_left: "Recording time left",
    text_left: "Inputing text left",
    prompt_time: "Prompt time",
    upload_failed: "Upload failed",
    translating: "Translating",
    text_limit: "Text length has reached the limit",
    input_tip: "Please enter valid text",
    request_failed: "Request failed",
    delete_tip: "Delete this item",
    cancel: "Cancel",
    bubble_tip: "Please input English content",
    bg_bubble: "Please speak English",
    copy_source_text: "Copy Source",
    copy_target_text: "Copy Target",
    delete_item: "Delete",
    exceed_network: "Network request failed",
    retry_network: "Retry connect",
    access_auth: "Please checkout authorization",
    access_network: "Network error",
    login: "Login",
  }
]

// 获取**全局唯一**的语音识别管理器**recordRecoManager**
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    dialogList: [
      // {
      //   // 当前语音输入内容
      //   create: '04/27 15:37',
      //   lfrom: 'zh_CN',
      //   lto: 'en_US',
      //   text: '这是测试这是测试这是测试这是测试',
      //   translateText: 'this is test.this is test.this is test.this is test.',
      //   voicePath: '',
      //   translateVoicePath: '',
      //   autoPlay: false, // 自动播放背景音乐
      //   id: 0,
      // },
    ],
    scroll_top: 10000, // 竖向滚动条位置

    bottomButtonDisabled: false, // 底部按钮disabled

    tips_language: language[0], // 目前只有中文

    initTranslate: {
      // 为空时的卡片内容
      create: '04/27 15:37',
      text: '等待说话',
    },

    currentTranslate: {
      // 当前语音输入内容
      create: '04/27 15:37',
      text: '等待说话',
    },
    recording: false,  // 正在录音
    recordStatus: 0,   // 状态： 0 - 录音中 1- 翻译中 2 - 翻译完成/二次翻译

    toView: 'fake',  // 滚动位置
    lastId: -1,    // dialogList 最后一个item的 id
    currentTranslateVoice: '', // 当前播放语音路径

  },


  /**
   * 按住按钮开始语音识别
   */
  streamRecord: function (e) {
    // console.log("streamrecord" ,e)
    let detail = e.detail || {}
    let buttonItem = detail.buttonItem || {}
    manager.start({
      lang: buttonItem.lang,
    })

    this.setData({
      recordStatus: 0,
      recording: true,
      currentTranslate: {
        // 当前语音输入内容
        create: util.recordTime(new Date()),
        text: '正在聆听中',
        lfrom: buttonItem.lang,
        lto: buttonItem.lto,
      },
    })
    this.scrollToNew();

  },


  /**
   * 松开按钮结束语音识别
   */
  streamRecordEnd: function (e) {

    // console.log("streamRecordEnd" ,e)
    let detail = e.detail || {}  // 自定义组件触发事件时提供的detail对象
    let buttonItem = detail.buttonItem || {}

    // 防止重复触发stop函数
    if (!this.data.recording || this.data.recordStatus != 0) {
      console.warn("has finished!")
      return
    }

    manager.stop()

    this.setData({
      bottomButtonDisabled: true,
    })
  },


  /**
   * 翻译
   */
  translateText: function (item, index) {
    let lfrom = item.lfrom || 'zh_CN'
    let lto = item.lto || 'en_US'

    plugin.translate({
      lfrom: lfrom,
      lto: lto,
      content: item.text,
      tts: true,
      success: (resTrans) => {

        let passRetcode = [
          0, // 翻译合成成功
          -10006, // 翻译成功，合成失败
          -10007, // 翻译成功，传入了不支持的语音合成语言
          -10008, // 翻译成功，语音合成达到频率限制
        ]

        if (passRetcode.indexOf(resTrans.retcode) >= 0) {
          let tmpDialogList = this.data.dialogList.slice(0)

          if (!isNaN(index)) {

            let tmpTranslate = Object.assign({}, item, {
              autoPlay: true, // 自动播放背景音乐
              translateText: resTrans.result,
              translateVoicePath: resTrans.filename || "",
              translateVoiceExpiredTime: resTrans.expired_time || 0
            })

            tmpDialogList[index] = tmpTranslate


            this.setData({
              dialogList: tmpDialogList,
              bottomButtonDisabled: false,
              recording: false,
            })

            this.scrollToNew();

          } else {
            console.error("index error", resTrans, item)
          }
        } else {
          console.warn("翻译失败", resTrans, item)
        }

      },
      fail: function (resTrans) {
        console.error("调用失败", resTrans, item)
        this.setData({
          bottomButtonDisabled: false,
          recording: false,
        })
      },
      complete: resTrans => {
        this.setData({
          recordStatus: 1,
        })
        wx.hideLoading()
      }
    })

  },


  /**
   * 修改文本信息之后触发翻译操作
   */
  translateTextAction: function (e) {
    // console.log("translateTextAction" ,e)
    let detail = e.detail  // 自定义组件触发事件时提供的detail对象
    let item = detail.item
    let index = detail.index

    this.translateText(item, index)



  },

  /**
   * 语音文件过期，重新合成语音文件
   */
  expiredAction: function (e) {
    let detail = e.detail || {}  // 自定义组件触发事件时提供的detail对象
    let item = detail.item || {}
    let index = detail.index

    if (isNaN(index) || index < 0) {
      return
    }

    let lto = item.lto || 'en_US'

    plugin.textToSpeech({
      lang: lto,
      content: item.translateText,
      success: resTrans => {
        if (resTrans.retcode == 0) {
          let tmpDialogList = this.data.dialogList.slice(0)

          let tmpTranslate = Object.assign({}, item, {
            autoPlay: true, // 自动播放背景音乐
            translateVoicePath: resTrans.filename,
            translateVoiceExpiredTime: resTrans.expired_time || 0
          })

          tmpDialogList[index] = tmpTranslate


          this.setData({
            dialogList: tmpDialogList,
          })

        } else {
          console.warn("语音合成失败", resTrans, item)
        }
      },
      fail: function (resTrans) {
        console.warn("语音合成失败", resTrans, item)
      }
    })
  },

  /**
   * 初始化为空时的卡片
   */
  initCard: function () {
    let initTranslateNew = Object.assign({}, this.data.initTranslate, {
      create: util.recordTime(new Date()),
    })
    this.setData({
      initTranslate: initTranslateNew
    })
  },


  /**
   * 删除卡片
   */
  deleteItem: function (e) {
    // console.log("deleteItem" ,e)
    let detail = e.detail
    let item = detail.item

    let tmpDialogList = this.data.dialogList.slice(0)
    let arrIndex = detail.index
    tmpDialogList.splice(arrIndex, 1)

    // 不使用setTImeout可能会触发 Error: Expect END descriptor with depth 0 but get another
    setTimeout(() => {
      this.setData({
        dialogList: tmpDialogList
      })
      if (tmpDialogList.length == 0) {
        this.initCard()
      }
    }, 0)

  },


  /**
   * 识别内容为空时的反馈
   */
  showRecordEmptyTip: function () {
    this.setData({
      recording: false,
      bottomButtonDisabled: false,
    })
    wx.showToast({
      title: this.data.tips_language.recognize_nothing,
      icon: 'success',
      image: '/image/no_voice.png',
      duration: 1000,
      success: function (res) {

      },
      fail: function (res) {
        console.log(res);
      }
    });
  },


  /**
   * 初始化语音识别回调
   * 绑定语音播放开始事件
   */
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let currentData = Object.assign({}, this.data.currentTranslate, {
        text: res.result,
      })
      this.setData({
        currentTranslate: currentData,
      })
      this.scrollToNew();
    }

    // 识别结束事件
    manager.onStop = (res) => {

      let text = res.result

      if (text == '') {
        this.showRecordEmptyTip()
        return
      }

      let lastId = this.data.lastId + 1
      if (res.result === '向左转。' || res.result === '想做爱') {
        console.log('go left')
        // bluetoothFunction.goLeft()
      }
      else if (res.result === '前进。'|| res.result === '亲亲。' ) {
        console.log('go ahead')
        // bluetoothFunction.goAhead()
      }
      else if (res.result === '后退。') {
        console.log('go backward')
        // bluetoothFunction.goBack()
      }
      else if (res.result === '向右转。') {
        console.log('go right')
        // bluetoothFunction.goRight()
      }
      else if (res.result === '停。') {
        console.log('stop')
        // bluetoothFunction.stop()
      }
      let currentData = Object.assign({}, this.data.currentTranslate, {
        text: res.result,
        translateText: '正在翻译中',
        id: lastId,
        voicePath: res.tempFilePath
      })

      this.setData({
        currentTranslate: currentData,
        recordStatus: 1,
        lastId: lastId,
      })
      
      this.scrollToNew();

      this.translateText(currentData, this.data.dialogList.length)
    }

    // 识别错误事件
    manager.onError = (res) => {

      this.setData({
        recording: false,
        bottomButtonDisabled: false,
      })

    }

    // 语音播放开始事件
    wx.onBackgroundAudioPlay(res => {

      const backgroundAudioManager = wx.getBackgroundAudioManager()
      let src = backgroundAudioManager.src

      this.setData({
        currentTranslateVoice: src
      })

    })
  },

  /**
   * 设置语音识别历史记录
   */
  setHistory: function () {
    try {
      let dialogList = this.data.dialogList
      dialogList.forEach(item => {
        item.autoPlay = false
      })
      wx.setStorageSync('history', dialogList)

    } catch (e) {

      console.error("setStorageSync setHistory failed")
    }
  },

  /**
   * 得到历史记录
   */
  getHistory: function () {
    try {
      let history = wx.getStorageSync('history')
      if (history) {
        let len = history.length;
        let lastId = this.data.lastId
        if (len > 0) {
          lastId = history[len - 1].id || -1;
        }
        this.setData({
          dialogList: history,
          toView: this.data.toView,
          lastId: lastId,
        })
      }

    } catch (e) {
      // Do something when catch error
      this.setData({
        dialogList: []
      })
    }
  },

  /**
   * 重新滚动到底部
   */
  scrollToNew: function () {
    this.setData({
      toView: this.data.toView
    })
  },

  onShow: function () {
    this.scrollToNew();

    this.initCard()

    if (this.data.recordStatus == 2) {
      wx.showLoading({
        // title: '',
        mask: true,
      })
    }

  },

  onLoad: function () {
    this.getHistory()
    this.initRecord()


    this.setData({ toView: this.data.toView })


    app.getRecordAuth()
  },

  onHide: function () {
    this.setHistory()
  },
})