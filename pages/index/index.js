// pages/index/index.js
import api from "../../utils/api.js";

//获取APP实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider: [],
    songList: [],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据正在加载中...'
    })
    this.getRecommendList();
    this.getHotList();
  },

  getRecommendList() {
    api.getRecommendList().then(res => {
      const {
        slider,
        songList
      } = JSON.parse(res.data.replace("callback(", "").replace(")", "")).data;
      this.setData({
        slider,
        songList
      })
    });
  },
  getHotList(){
    api.getHotList().then(res=>{
      const res1 = res.data.replace("jp1(", "");
      const topList = JSON.parse(res1.substring(0,res1.length-1)).data.topList;
      this.setData({
        topList
      })
      setTimeout(wx.hideLoading,500);
    })
  },
  handleClick(event){
    wx.navigateTo({
      url: `/pages/top-list/top-list?topId=${event.currentTarget.dataset.topid}`
    })
  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  }
})