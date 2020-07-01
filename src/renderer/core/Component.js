class Component{
	constructor(){
		this.x = 0;
		this.y = 0;
		this.w = 0;
		this.h = 0;
		this.visible = false;
		this.parent = null;
		this.children = [];//子节点
		this.siblings = [];//兄弟节点
		this.name = '';
		this.dependency = null;
		this.useNpm = ''; //是否采用npm 模块化管理
		this.version ='';
		this.refcount = 0;
		this.is_dirty = false;
		this.framework = ''; //所属第三方框架
		this.isModuleDev = true; //是否模块化编程
		this.css = ""; //自定义CSS样式
		this.js = "";
		this.hasGlobalJs = "";
		this.globalJs = ""; //全局配置，减少代码量
		this.html = "";
		this.hilight_code = {css:'',js:'',html:''}; //高亮后的代码块
		this.import_code = ""; //es6 import语句
		this.config = {}; //右侧配置面板参数
		this.defaultConfig = {}; //默认配置参数
		this.save_dir = ''; //保持文件夹路径
		this.saveFileName = ""; //保持文件名
		this._ = {}; //合并过的配置
	}
	emit(){
		this.prevEmitCode();
		this.emitCode();
		this.postEmitCode();
	}
	emitCode(){ //生成代码

	}
	prevEmitCode(){ //生成代码前的钩子

	}
	postEmitCode(){ //生成代码后的钩子

	}
	previewCode(){ //预览代码片段

	}
	loadUserConfig(){
		this._ = Object.assign({},this.config,this.defaultConfig);
	}
	flush(){ //刷新数据到代码文件

	}
}

export default Component;