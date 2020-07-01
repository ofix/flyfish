import Component from "../../core/Component.js";
class BootstrapTextarea extends Component{
	constructor(){
		this.name="BootstrapTextarea";
		this.defaultConfig={
			charLimit:0; //是否有字符限制
			id:"",
			placeholder:"",
			name:"",
			fontSize:12
		}
	}
	emitCode(){
		loadUserConfig();
		return 
		`
		<textarea class="form-control" id="${this._.id}" placeholder="${this._.placeholder}" name="${this._.name}"></textarea>
		`
	}
	emitCss(){ //生成CSS代码
		return 
		`

		`;
	}
}