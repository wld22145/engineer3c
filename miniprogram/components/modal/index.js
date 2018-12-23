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

const tips_language = language[0]

let modalItems = [
    {
      type: 'copySource',
      text: tips_language.copy_source_text
    },
    {
      type: 'delete',
      text: tips_language.delete_item
    },
    {
      type: 'copyTarget',
      text: tips_language.copy_target_text
    },
]

Component({
  properties: {

    item: {
      type: Object,
      value: {},
    },

    modalShow: {
      type: Boolean,
      value: true,
    },

    index: {
      type: Number,
    },

  },

  data: {
    // tips_language: language[0], // 目前只有中文

    modalItems: modalItems,
  },

  ready: function () {
  },

  methods: {


    deleteBubbleModal: function() {
      this.triggerEvent('modaldelete', {
        item: this.data.item,
        index: this.data.index,
      },{ bubbles: true, composed: true })
      this.leaveBubbleModal()
    },

    /**
     * 点击
     */
    itemTap: function(e) {
      let itemType = e.currentTarget.dataset.type

      let item = this.data.item

      switch(itemType) {
        case 'copySource':
          this.setClip(item.text)

          break;
        case 'copyTarget':
          this.setClip(item.translateText)

          break
        case 'delete':
          this.deleteBubbleModal()

          break
        default:
          break
      }
    },

    /**
     * 复制到剪贴板
     *
     * @param      {string}  text    需要复制到剪贴板的文字
     */
    setClip: function(text) {

      wx.setClipboardData({
        data: text,
        success:  (res) => {
          this.leaveBubbleModal()
          wx.showToast({
            title: "已复制到剪切板",
            icon: "success",
            duration: 1000,
            success: function (res) {
              console.log("show succ");
            },
            fail: function (res) {
              console.log(res);
            }
          });
        }
      })
    },

    leaveBubbleModal: function() {
      this.triggerEvent('modalleave', {
        modalShow: this.data.modalShow
      })
    },

  }
});