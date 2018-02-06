# grunt-cli

## 功能
* sprite图的生成
* js／css hash md5 处理(js/html/css合体了，牵一发而动全身，感觉不怎么好，速度稍慢)
* 压缩打包(压缩图片不咋地)
* 服务器构建
* babel(添加了一个polyfill.min.js文件)

## 目录介绍
* ...
* serve/ 服务器脚本文件(简陋的)
* src/ 开发目录
	* css/ 样式目录
		* index.less(主要样式的入口)
		* sprite/ sprite图生成的less
	* js/ 脚本目录
		* mian.js(路口文件)
		* modules/模块js文件
		* tools/辅助工具文件
	* resource/ 资源目录
		* audio/ 音频资源
		* video/ 视频资源
		* img/ 图片资源
			* sprite/ sprite图源文件
			* ..
	* index.html html文件
* test/ 自动生成的 测试代码
* app/ 自动生成 正式代码
* .eslintrc.json 真是个大家伙，这种检测真好玩0.0
* .eslintignore 排除检测的目录(代码检测需要安装相应编辑器的插件)
* Gruntfile.js grunt的运行代码
* sprite-config/ 移动端rem sprite图的配置
* ...

## 运行
* 本地服务器 `npm start`
* 测试环境运行 `grunt`(全局安装了grunt，test目录下)
* 生产上线 `grunt build` (app目录)
* 压缩图片 `grunt buildImg`(还是很差的0.0)[安利一个压缩网站](https://tinypng.com)

### sprite图的附加说明
* 原图放在`src/resource/img/sprite`里面，生成的sprite图和样式文件都根据所创建的文件夹名称来的 栗子 原图路径 `src/resource/img/sprite/[spriteName]` 生成的sprite图路径`test/resource/img/sprite/[spriteName].png` 样式文件路径 `src/resource/css/sprite/[spriteName].less` 初次`index.less`里面手动引入即可，后续改变图片就自动改变了
* 本来是打算直接换成less，但测试发现如果`index.less`里面引入多个`[spriteName].less`生成的css里面就会出现重复的class名，于是就由 `sprite=>styl=>less`这样的做法0.0
* 所有的sprite图适合.png格式

### sprite-config文件说明
* `spritesheet-templates` rem的转换配置文件，具体1rem值根据设计来，截图可知修改的位置。替换位置`/node_modules/spritesheet-templates/lib` 默认64px
* `stylus.template.handlebars` 添加rem的class名称，生成的文件样式例如 .yeluochen .xx{}这样的，截图可以修改class。替换位置`node_modules/spritesheet-templates/lib/templates`，默认'.yeluochen'

### 附加说明
* windows C盘可能出现权限问题(无法删除文件夹)，就别放C盘啦0.0
