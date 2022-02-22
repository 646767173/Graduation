Component({
	properties:{
		title:{
			type:String,
			value:'提示'
		},
		content:{
			type:String,
			value:'请输入提示框内容'
		}
	},
	methods:{
		close(){
			this.triggerEvent('close');
		}
	}
})
