// pages/top-list.js
import api from "../../utils/api.js";
import song from "../../utils/song.js";
import util from "../../utils/util.js";

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    album: "",
    title:"",
    songlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中，请稍后...'
    })
    this.getMusicList(options.topId);
  },
  getMusicList(topId) {
    api.getTopMusicList(topId).then(res => {
      const res1 = res.data.replace("jp1(", "");
      const data = JSON.parse(res1.substring(0, res1.length - 1));
      this.setData({
        songlist: this.normalizeSongs(data.songlist),
        album: data.topinfo.pic_album,
        title:data.topinfo.ListName
      })
      setTimeout(wx.hideLoading, 200);
    });

  },
  normalizeSongs(list) {
    let ret = [];
    list.forEach(item => {
      const musicData = item.data;
      if (musicData.songid && musicData.albummid) {
        ret.push(song.createSong(musicData));
      }
    })
    return ret;
  }
})