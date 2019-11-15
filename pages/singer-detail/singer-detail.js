// pages/singer-detail/singer-detail.js
import song from "../../utils/song.js";
import api from "../../utils/api.js";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: "",
    songlist: [],
    title: "",
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const title = app.globalData.singer.name,
      image = app.globalData.singer.avatar;
    console.log(app.globalData)
    console.log(image);
    this.setData({
      title,
      image
    })
    this.getSingerDetail(app.globalData.singer.id)

  },
  getSingerDetail: function(singermid, startIndex = 0) {
    wx.showLoading({
      title: '正在加载中'
    })
    api.getSingerSongs(singermid, startIndex).then((res) => {
      const res1 = res.data.replace("callback(", "");
      const res2 = JSON.parse(res1.substring(0, res1.length - 1)).data;

      let ret = this.normallizeSongs(res2.list)
      let nowData = this.data.songlist;
      nowData.length > 0 ? nowData = nowData.concat(ret) : nowData = ret
      this.setData({
        songlist: nowData,
        total: res2.total
      })
      wx.hideLoading();
    })
  },
  normallizeSongs: function(list) {
    let ret = []
    list.forEach((item) => {
      let {
        musicData
      } = item
      if (musicData.songid && musicData.albummid) {
        ret.push(song.createSong(musicData))
      }
    })
    return ret
  },
  /*上拉加载更多歌曲*/
  childEvent: function(e) {
    this.getSingerDetail(app.globalData.singer.id, e.detail)
  }
})