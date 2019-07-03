var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = true;//是否在绘制中
var arrx = [10,60,110];//动作横坐标
var arry = [10,10,10];//动作纵坐标
var disx = 0;
var disy = 0;
var imagepath = '';
var imagewidth = 0;
var imageheight = 0;
var tmp = 0;
var canvasw = 0;//画布宽度
var canvash = 0;//画布高度
Page({
  /**
 * 页面的初始数据
 */
  data: {
    //canvas宽高
    canvasw: 0,
    canvash: 0,
    //设置图片路径
    images: ''
  },

  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        _this.setData({
          images: res.tempFilePaths
        });
        imagepath=res.tempFilePaths[0];
        _this.drawCan();
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(imgres) {
            imagewidth = imgres.width;
            imageheight=imgres.height;
            tmp = canvasw * imageheight / imagewidth;
            context.drawImage(res.tempFilePaths[0], 0, 0, canvasw, tmp);
            context.draw();
          }
        })
      }
    })
  },


  startCanvas: function () {
    //console.log("done");
    var that = this;
    //创建canvas
    this.initCanvas();
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        //console.log("finish");
        //设置canvas宽度和长度
        canvasw = res.windowWidth - 0;//设备宽度
        canvash = canvasw*2;
        that.setData({ 'canvasw': canvasw*0.8 });
        that.setData({ 'canvash': canvash });
      }
    });

  },

  //初始化函数
  initCanvas: function () {
    //console.log("done");
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
  },


  //事件监听
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  canvasStart: function (event) {
    isButtonDown = true;
  },

  canvasMove: function (event) {
    if (isButtonDown) {
      var x = event.changedTouches[0].x;
      var y = event.changedTouches[0].y;
      disx = Math.abs(x-arrx[0]);
      disy = Math.abs(y-arry[0]);
      if (disx<40 && disy<40){
        arrx[0]=x;
        arry[0]=y;
      } else {
        disx = Math.abs(x - arrx[1]);
        disy = Math.abs(y - arry[1]);
        if (disx < 40 && disy < 40) {
          arrx[1] = x;
          arry[1] = y;
        }else{
          disx = Math.abs(x - arrx[2]);
          disy = Math.abs(y - arry[2]);
          if (disx < 40 && disy < 40) {
            arrx[2] = x;
            arry[2] = y;
          }
        }
      }
      this.drawCan();
    };

    
    //context.clearRect(0, 0, canvasw, canvash);

    context.setStrokeStyle('#000000');
    context.setLineWidth(2);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.draw(true);
  },

  drawCan:function(){
    context.setStrokeStyle('#000000');
    context.setLineWidth(2);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.drawImage(imagepath, 0, 0, canvasw, tmp);
    context.draw(true);
    for (var i = 0; i < 3; i++) {
      context.arc(arrx[i], arry[i], 2, 0, 2 * Math.PI);
      context.lineTo(arrx[i], arry[i]);
    };
  },
  canvasEnd: function (event) {
    isButtonDown = false;
  },
  // //清除画布
  // cleardraw: function () {
  //   //清除画布
  //   arrx = [];
  //   arry = [];
  //   context.clearRect(0, 0, canvasw, canvash);
  //   context.draw(true);
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //画布初始化执行
    this.startCanvas();
  }
})
