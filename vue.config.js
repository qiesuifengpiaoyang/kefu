module.exports = {
	productionSourceMap: false, //关闭source map
	lintOnSave: false,
	//减少打包编译的时间；
	// 避免在生产环境中用F12开发者工具在Sources中看到源码
	devServer: {
		proxy: {
			'/apis': {
				target: 'http://192.168.101.4/chat/public/index.php/index/index',
				// target: 'http://192.168.1.2/fiveInARows/public/index.php/index/index',
				changeOrigin: true,
				pathRewrite: {
					'^/apis': ''
				}
			},
		}
	}
};

// vue.config.js
// module.exports = {
//     // 选项...
//     // title:'同心台'
//     productionSourceMap:false,
//     devServer: {
//       proxy: {
//         '/api': {
//           target: 'http://test.tongxintailm.com',
//           changeOrigin: true
//         }
//       }
//       // proxy: 'http://test.tongxintailm.com/api/1/'
//     }
//   }
