import Component from "../../core/Componen.js";
class BootstrapInputText extends Component{
	constructor(){
		this.name = "BootstrapInputText";
		this.defaultConfig = {
			name:'', //名称
			id:'', //id
			placeholder:'',
			validators:[], //校验规则
		};
	}
	emitCode(){
		return 
		`
		 <input type="text" class="form-control" autocomplete="off" placeholder="${this.placeholder}">
		 </input>
		`;
	}
}