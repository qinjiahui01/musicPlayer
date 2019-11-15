// components/music-list/music-list.js
const app = getApp().globalData
import util from  "../../utils/util.js";

Component({
  properties: {
    title: {
      type: String,
      value: 'Chicken Music',
      observer: function(newVal) {
        this.setTitle(newVal)
      }
    },
    image: {
      type: String,
      value: '',
      observer: function(newVal) {
        this.setData({
          album: newVal
        })
      }
    },
    songlist: {
      type: Array,
      value: []
    },
    total:{
      type:Number,
      value:0
    }
  },
  ready: function() {
    // this.setSonglistTop()
    this.setTitle(this.properties.title)
    // 动态设置歌手头像背景图
    this.setData({
      album: this.properties.image
    })
  },
  methods: {
    /*针对不同手机设置songlist的top值*/
    setSonglistTop: function() {
      wx.createSelectorQuery().in(this).select('#bgImage').boundingClientRect((rect) => {
        rect.height
      }).exec((res) => {
        this.setData({
          top: res[0].height,
          oldTop: res[0].height //记录原始的top值
        })
      })
    },
    setTitle: function(title) {
      wx.setNavigationBarTitle({
        title: title
      })
    },
    randomPlayAll: function() {
      var index = util.randomNum(0, this.data.songlist.length);
      this.setPlayInfo(index);
    },
    /*向父组件推送滚动到底部的事件*/
    getMoreSongs: function() {
      if (this.properties.total < this.properties.songlist.length){
        return;
      }
      this.triggerEvent('myevent', this.properties.songlist.length)
    },
    selectItem(e) {
      var index = e.currentTarget.dataset.index;
      this.setPlayInfo(index);
    },
    // 相关设置
    setPlayInfo(index) {
      // 保存播放歌曲索引到本地;
      wx.setStorageSync("currentIndex", index);
      //  保存播放列表到本地
      wx.setStorageSync('songlist', this.data.songlist);
      // 跳转页面
      wx.switchTab({
        url: '/pages/player/player'
      })
    }
  }
})