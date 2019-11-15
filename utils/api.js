import request from "../service/network.js";

// 获取导航栏和歌单
const getBanners = function() {
  return request({
    url: "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",
    data: {
      g_tk: 5381,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp',
      platform: 'h5',
      uin: 0,
      needNewCode: 1,
      jsonpCallback: 'callback'
    }
  });
}


const getHotList = function() {
  return request({
    url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=jp1'
  })
}
// 获取热门搜索
const getHotSearch = function() {
  return request({
    url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
    data: {
      g_tk: 5381,
      jsonpCallback: 'hotSearchKeysmod_top_search',
      loginUin: 0,
      hostUin: 0,
      format: 'jsonp',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  });
}

// 获取搜索结果
const search = (key) => {
  return request({
    url: `https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg`,
    data: {
      is_xml: 0,
      format: 'jsonp',
      key: key,
      g_tk: 5381,
      jsonpCallback: 'SmartboxKeysCallbackmod_top_search3847',
      loginUin: 0,
      hostUin: 0,
      format: 'jsonp',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  })

}
const getRecommendList = function() {
  return request({
    url: "https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",
    data: {
      g_tk: 5381,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp',
      platform: 'h5',
      uin: 0,
      needNewCode: 1,
      jsonpCallback: 'callback'
    }
  })
}
const getSongDetails = function(mid) {
  return request({
    url: `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg`,
    data: {
      songmid: mid,
      tpl: 'yqq_song_detail',
      format: 'jsonp',
      callback: 'getOneSongInfoCallback',
      g_tk: 5381,
      jsonpCallback: 'getOneSongInfoCallback',
      loginUin: 0,
      hostUin: 0,
      format: 'jsonp',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      needNewCode: 0
    }
  })
}
/**
 * 获取榜单歌曲列表
 */
const getTopMusicList = function(topid) {
  return request({
    url: `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${topid}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp1`
  });
}

/**
 * 获取播放地址
 */
const getPlayUrl = function(mid) {
  return request({
    url: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
    data: {
      g_tk: 5381,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp',
      hostUin: 0,
      loginUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      cid: 205361747,
      uin: 0,
      filename: `C400${mid}.m4a`,
      guid: 3913883408,
      songmid: mid,
      callback: 'callback',
    }
  })
}

// 获取歌手列表
const getSingerList = function() {
  return request({
    url: "https://c.y.qq.com/v8/fcg-bin/v8.fcg",
    data: {
      g_tk: 5381,
      inCharset: "utf-8",
      outCharset: "utf-8",
      notice: 0,
      format: "jsonp",
      channel: "singer",
      page: "list",
      key: "all_all_all",
      pagesize: 100,
      pagenum: 1,
      hostUin: 0,
      needNewCode: 0,
      platform: "yqq",
      jsonpCallback: "callback"
    }
  })
}

/**
 * 获取当前歌手的歌曲
 * @parms singermid 当前歌手id
 * @parms startIndex 歌曲从该索引开始
 */
const getSingerSongs = function(singermid, startIndex) {
  return request({
    url: "https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",
    data: {
      g_tk: 5381,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      format: 'jsonp',
      hostUin: 0,
      needNewCode: 0,
      platform: 'yqq',
      order: 'listen',
      begin: startIndex,
      num: 40,
      songstatus: 1,
      singermid: singermid,
      jsonpCallback: 'callback'
    }
  })
}

export default {
  search,
  getRecommendList,
  getSongDetails,
  getHotList,
  getHotSearch,
  getTopMusicList,
  getPlayUrl,
  getSingerList,
  getSingerSongs
}