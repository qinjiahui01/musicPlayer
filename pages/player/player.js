// pages/player/player.js
import api from "../../utils/api.js";
import util from "../../utils/util.js"

const SEQUENCE_MODE = 1
const RANDOM_MOD = 2
const SINGLE_CYCLE_MOD = 3

const app = getApp();
const audioManager = wx.getBackgroundAudioManager();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playMod: SEQUENCE_MODE, // 播放模式
    playIcon: "icon-play", //播放按钮样式
    dotsArray: new Array(2),
    currentDot: 0,
    currentSong: null,
    songlist: [],
    currentTime: "0:00",
    percent: "",
    cdCls: "icon-pause",
    duration: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 渲染完成
   */
  onShow: function() {
    this.init();
  },
  // 初始化
  init() {
    const songlist = wx.getStorageSync("songlist");
    const currentIndex = wx.getStorageSync("currentIndex");
    const currentSong = songlist[currentIndex];
    const duration = this.formatTime(currentSong.duration);
    this.setData({
      currentSong,
      songlist,
      currentIndex,
      duration
    })
    this.getPlayUrl(currentSong.mid);
  },
  // 获得播放地址
  getPlayUrl(mid) {
    api.getPlayUrl(mid).then(res => {
      const res1 = res.data.replace("callback(", "");
      const res2 = JSON.parse(res1.substring(0, res1.length - 1));
      const playUrl = `http://dl.stream.qqmusic.qq.com/${res2.data.items[0].filename}?vkey=${res2.data.items[0].vkey}&guid=3913883408&uin=0&fromtag=66`;
      this.getBackPlayfileName().then((nowPlay) => {
        // 判断当前播放地址是否相同，相同则不作任何操作 
        // 不相同则进行播放
        if (!(res2.data.items[0].filename === nowPlay)) {
          this.createAudio(playUrl)
        }
      }).catch((err) => {
        this.createAudio(playUrl)
      })
    })
  },

  // 创建播放器
  createAudio(playUrl) {
    audioManager.src = playUrl;
    audioManager.title = this.data.currentSong.name;

    // 监听音乐播放。
    audioManager.onPlay(() => {
      this.setData({
        playIcon: 'icon-pause',
        cdCls: 'play'
      })
    })
    // 监听音乐暂停。
    audioManager.onPause(() => {
      this.setData({
        playIcon: 'icon-play',
        cdCls: 'pause'
      })
    })

    // 监听音乐停止。
    audioManager.onEnded(() => {
      if (this.data.playMod === SINGLE_CYCLE_MOD) {
        this.init();
        return
      }
      this.next();
    })
    // 监听播放设置进度条
    audioManager.onTimeUpdate(() => {
      const currentTime = audioManager.currentTime;
      this.setData({
        currentTime: this.formatTime(currentTime),
        percent: currentTime / this.data.currentSong.duration
      })
    })
  },
  // 获取当前背景音乐id
  getBackPlayfileName: function() {
    return new Promise((resolve, reject) => {
      wx.getBackgroundAudioPlayerState({
        success: function(res) {
          var dataUrl = res.dataUrl
          let ret = dataUrl && dataUrl.split('?')[0].split('/')[3]
          resolve(ret);
        },
        fail: function(e) {
          let ret = false
          reject(ret);
        }
      })
    })
  },
  // 上一首
  prev: function() {
    wx.setStorageSync("currentIndex", this.getNextIndex(false));
    this.init()
  },
  // 下一首
  next: function() {
    wx.setStorageSync("currentIndex", this.getNextIndex(true));
    this.init()
  },
  /**
   * 获取不同播放模式下的下一曲索引
   * @param nextFlag: next or prev
   * @returns currentIndex
   */
  getNextIndex: function(nextFlag) {
    let ret,
      currentIndex = wx.getStorageSync("currentIndex"),
      mod = this.data.playMod,
      len = this.data.songlist.length
    if (mod === RANDOM_MOD) {
      ret = util.randomNum(0, len);
    } else {
      if (nextFlag) {
        ret = currentIndex + 1 == len ? 0 : currentIndex + 1
      } else {
        ret = currentIndex - 1 < 0 ? len - 1 : currentIndex - 1
      }
    }
    return ret
  },
  // 时间格式化
  formatTime(interval) {
    interval = interval | 0
    const minute = interval / 60 | 0
    const second = this.pad(interval % 60)
    return `${minute}:${second}`
  },
  /*秒前边加0*/
  pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  },
  // 改变播放模式
  changeMod() {
    let playMod = this.data.playMod + 1;
    if (playMod > SINGLE_CYCLE_MOD) {
      playMod = SEQUENCE_MODE;
    }
    this.setData({
      playMod
    })
  },
  // 改变播放状态
  togglePlaying() {
    if (audioManager.paused) {
      app.globalData.isPlay = true;
      audioManager.play();
    } else {

      audioManager.pause();
    }
  },
  changeDot: function(e) {
    this.setData({
      currentDot: e.detail.current
    })
  },
  openList: function() {
    if (!this.data.songlist.length) {
      return
    }
    this.setData({
      translateCls: 'uptranslate'
    })
  },
  close: function() {
    this.setData({
      translateCls: 'downtranslate'
    })
  },
  playthis: function(e) {
    const index = e.currentTarget.dataset.index
    
    wx.setStorageSync("currentIndex", index);
    this.init()
    this.close()
  }
})