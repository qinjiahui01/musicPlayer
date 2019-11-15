// pages/search/search.js
import api from "../../utils/api.js";
import Song from "../../utils/song.js";

let timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotSearch: [],
    result: false,
    singers: [],
    songs: [],
    histroyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHotSearch();
    // 页面加载时，获取历史搜索记录
    this.setData({
      histroyList: this.getHistroySearch()
    })
  },
  // 获得热门搜索
  getHotSearch() {
    api.getHotSearch().then(res => {
      let res1 = res.data.replace('hotSearchKeysmod_top_search(', '')
      let res2 = JSON.parse(res1.substring(0, res1.length - 1))
      if (res2.code === 0) {
        let hotArr = res2.data.hotkey
        this.setData({
          hotSearch: hotArr.length > 10 ? hotArr.slice(0, 10) : hotArr
        })
      }
    })
  },
  
  searchAction(event) {
    // 获取搜索的内容
    const value = event.detail.value ||event.currentTarget.dataset.txt || "";
    clearTimeout(timer);
    const that = this;
    // 函数防抖，防止事件触发过于频繁，造成性能过低
    timer = setTimeout(function() {
      // 获取数据
      api.search(value).then(res => {
        const res1 = res.data.replace('SmartboxKeysCallbackmod_top_search3847(', '')
        const data = JSON.parse(res1.substring(0, res1.length - 1)).data;
        // 返回数据不为空时，将搜索结果保存
        if (data) {
          that.setData({
            singers: data.singer.itemlist,
            songs: data.song.itemlist,
            result: true
          })
        }
        // 当返回结果为空时，将返回结果列表隐藏
        else {
          that.setData({
            result: false
          })
        }
      })
    }, 100)
  },
  // 添加历史搜索
  addHistroySearch(keyWord) {
    // 判断是否有内容
    if (!keyWord) {
      return;
    }
    // 获取原有历史搜索
    const histroyList = this.getHistroySearch() || [];
    // 判断搜索内容之前是否存在
    if (histroyList.indexOf(keyWord) >= 0) {
      return;
    }
    // 添加搜索内容
    histroyList.push(keyWord);
    wx.setStorageSync("histroyList", histroyList);
  },
  // 获取历史搜索
  getHistroySearch() {
    return wx.getStorageSync("histroyList");
  },
  goSinger: function(event) {
    const detail = event.currentTarget.dataset
    this.addHistroySearch(detail.key); 

    const singer = event.currentTarget.dataset.singer;
    const app = getApp();
    app.globalData.singer = {
      id: detail.id,
      name: detail.name
    };
    app.globalData.singer.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${app.globalData.singer.id}.jpg?max_age=2592000`;
    console.log(app.globalData.singer);
    wx.navigateTo({
      url: '/pages/singer-detail/singer-detail'
    })
  },
  selectSong: function(event) {
    const detail = event.currentTarget.dataset
    const mid = event.currentTarget.dataset.mid;
    this.addHistroySearch(detail.key); 
    api.getSongDetails(mid).then((res) => {
      var res1 = res.data.replace('getOneSongInfoCallback(', '')
      var res2 = JSON.parse(res1.substring(0, res1.length - 1)).data[0]

      // 创建歌曲实例
      let song = Song.createSong({
        songid: res2.id,
        songmid: mid,
        singer: res2.singer,
        songname: res2.name,
        albumname: res2.album.name,
        interval: res2.interval,
        albummid: res2.album.mid,
        songid: res2.id
      })
      // 获取本地歌曲列表
      let songlist = wx.getStorageSync("songlist") || [];
      if(song){
        // 将歌曲实例添加到歌曲列表
        songlist.unshift(song);
        wx.setStorageSync("songlist", songlist);

        // 更改播放歌曲索引
        wx.setStorageSync("currentIndex", 0);
      }
      // 跳转至播放界面
      wx.switchTab({
        url: '/pages/player/player'
      })
    }).catch(() => {})
  }
})