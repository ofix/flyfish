import Component from "../../core/Componen.js";

class BootstrapLabel extends Component{
	construct(){
		this.defaultConfig = {
			fontSize:12,
			fontFamily:'inherit', //继承浏览器的属性
			text:"",//文字内容
			textAlign:'left', //左对齐
			padding:0, //是否有额外内边距
			needValidator:false,//是否需要校验
		}
	}
	emitCode(){
		return 
		`
		<label class="form-label">${this.text}</label>
		`;
	}
}