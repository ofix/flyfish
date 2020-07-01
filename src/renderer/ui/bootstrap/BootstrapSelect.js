import Component from "../../core/Component.js";
class BootstrapSelect extends Component{
	constructor(){
		this.name = 'BootstrapSelect';
		this.defaultConfig ={
			isAjax:false, //数据是否来自服务端
			ajaxUrl:'', //ajax请求获取option数据
			options:[], //选项, for example 1,管理员,2,员工
		}
	}
	emitCode(){
		this.loadUserConfig();
		return 
		`
		<select class="form-control">${this.emitSelectOptions()}</select>
		`
	}
	emitSelectOptions(){
		let strOptions = '';
		for(let i=0; i<this.options.length; i++){
			strOptions += `<option value="${this.options['value']}">${this.options['name']}</option>`;
		}
		return strOptions;
	}
	emitAjaxCode(){
		let parts = this.ajaxUrl.spit(',');
		return 
		`
		$.post()
		`;
	}
}