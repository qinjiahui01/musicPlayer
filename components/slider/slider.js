// components/slider/slider.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    slider:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    circular: true,
    indicatorActiveColor: 'rgba(255,255,255,0.8)',
    indicatorColor: 'rgba(255,255,255,0.5)',
    duration: 500
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
