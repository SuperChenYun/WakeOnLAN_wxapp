//index.js
//获取应用实例
const app = getApp()

Page({
  
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mac: '04 D4 C4 4B 41 91',
    ip_address: '192.168.2.3',
    port: '9'
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  strDivision(str,grap){
    let arr = [];
    let count =0;
    for(let i=0,len=str.length/grap;i<len;i++) {
        let str1 = str.substr(0,grap);
        str = str.replace(str1,'');
        arr.push(str1)
    }
    return arr.join(' ')
  },
  buildMagicPack: function(mac, password = '00 00 00 00 00 00') {
      mac = mac.trim();

      //格式化mac地址
      mac = mac.replace(/[^0-9a-zA-Z]+/ig,"")

      if (mac.length != 12) {
        // 格式不正确
        return false;
      }

      mac = this.strDivision(mac, 2)
      
      let magicPack = 'FF FF FF FF FF FF'

      for(var i = 0 ;i < 16 ;i++) {
        magicPack += (' ' + mac)
      }

      magicPack += (' ' +password)

      return magicPack.toUpperCase()
  },
  _utf2buffer: function(utfstr)
  {
      utfstr = utfstr.split(new RegExp(" ", "gm")) // 格式化成数组
      var buf = new ArrayBuffer(utfstr.length); // 构造指定长度的ArrayBuffer
      var bufView = new Uint8Array(buf);// 构造指定长度的Uint8Array
      // 换算16进制的数据为 Unicode 编码
      for (var i = 0, f= ''; i < utfstr.length; i++) {
          f = parseInt('0x'+utfstr[i])
          bufView[i] = f;
          // bufView[i] = f.toString().charCodeAt();
      }
      return buf;
  },
  wakeOnLAN: function(e) {
    if (!this.data.mac || !this.data.ip_address || !this.data.port) {
      return false;
    }
    let udp = wx.createUDPSocket()
    udp.bind()
    udp.send({
      address:this.data.ip_address,
      port: this.data.port,
      message: this._utf2buffer(this.buildMagicPack(this.data.mac))
    })
    setTimeout(function() {
      udp.close()
    }, 2000)
  },
  inputMac: function(event) {
    this.setData({
      mac: event.detail.value
    })
  },
  inputIpAddress: function(event) {
    this.setData({
      ip_address: event.detail.value
    })
  },
  inputPort: function(event) {
    this.setData({
      port: event.detail.value
    })
  },
})
