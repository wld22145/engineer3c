/*
Tencent is pleased to support the open source community by making Face-2-Face Translator available.

Copyright (C) 2018 THL A29 Limited, a Tencent company. All rights reserved.

Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://opensource.org/licenses/MIT

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

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

Component({

  properties: {
    /*
    item 格式
    {
      create: '04/27 15:37',
      text: '一二三四五',
      translateText: '12345',
      voicePath: '',
      translateVoicePath: '',
      id: 0,
    },*/
    item: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal){

        // 翻译完成后，文字有改变触发重新翻译
        if(this.data.recordStatus == 2 && oldVal.text && oldVal.text != '' && newVal.text != oldVal.text) {
          this.triggerEvent('translate', {
            item: this.data.item,
            index: this.data.index,
          })
        }

        // 翻译内容改变触发播放
        if(newVal.autoPlay && newVal.translateVoicePath != oldVal.translateVoicePath){
          this.autoPlayTranslateVoice()
        } else if(newVal.translateVoicePath == "") {
          this.playAnimationEnd()
        }

      }
    },
    editShow: {
      type: Boolean,
      value: false,
    },
    index: {
      type: Number,
    },

    currentTranslateVoice: {
      type: String,
      observer: function(newVal, oldVal){
        if(newVal != '' && newVal != this.data.item.translateVoicePath) {
          this.playAnimationEnd()
        }
      },
    },

    recordStatus: {
      type: Number,
      value: 2, // 0：正在识别，1：正在翻译，2：翻译完成
    },
  },

  data: {

    tips_language: language[0], // 目前只有中文

    modalShow: false, // 展示悬浮框

    playType: 'wait', // 语音播放状态


    waiting_animation: {},
    waiting_animation_1: {},

    edit_icon_path: '../../image/edit.png'


  },

  ready: function () {
    if(this.data.item.autoPlay) {
      this.autoPlayTranslateVoice()
    }

  },

  // 组件生命周期函数，在组件实例被从页面节点树移除时执行
  detached: function() {
    // console.log("detach")

  },

  methods: {

    /**
     * 显示悬浮框
     */
    showModal: function() {
      this.setData({modalShow: true})
    },

    /**
     * 离开悬浮框
     */
    modalLeave: function() {
      this.setData({modalShow: false})
    },


    /**
     * 点击播放图标
     */
    playTranslateVoice: function() {

      let nowTime = parseInt(+ new Date() / 1000)
      let voiceExpiredTime = this.data.item.translateVoiceExpiredTime || 0

      if(this.data.playType == 'playing') {
        wx.stopBackgroundAudio()
        this.playAnimationEnd()
      } else if(nowTime < voiceExpiredTime) {
        this.autoPlayTranslateVoice()
      } else {
        this.setData({
          playType: 'loading',
        })
        this.triggerEvent('expired', {
          item: this.data.item,
          index: this.data.index,
        })
      }


    },

    /**
     * 播放背景音乐
     */
    autoPlayTranslateVoice: function (path,index) {
      let play_path = this.data.item.translateVoicePath

      if(!play_path) {
        console.warn("no translate voice path")
        return
      }


      wx.onBackgroundAudioStop(res => {
        console.log("play voice end",res)
        this.playAnimationEnd()
      })

      this.playAnimationStart()

      wx.playBackgroundAudio({
        dataUrl: play_path,
        title: '',
        success: (res) => {
          this.playAnimationStart()
        },
        fail: (res) => {
            // fail
            console.log("failed played", play_path);
            this.playAnimationEnd()
        },
        complete: function (res) {
            console.log("complete played");
        }
      })
    },

    /**
     * 开始播放
     */
    playAnimationStart: function() {
      this.setData({
        playType: 'playing',
      })

    },

    /**
     * 结束播放
     */
    playAnimationEnd: function() {
        this.setData({
          playType: 'wait',
        })
    },

  }
});