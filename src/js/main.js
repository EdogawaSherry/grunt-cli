// const demo = require('./modules/demo');
require("babel-polyfill");

async function roleWay() {
	const data = await new Promise((resolve) => {
			// console.log(452453);
			$.ajax({
				type: "POST",
				url: ipUrl + "/Award/Index/Vote/role",
				data: "",
				success: function(data) {
					let str = "";
					str += data.data.map((item) => {
						return `
							<div class="role-select-bg" data-info='${JSON.stringify(item)}'>
								<h2>${item.role}</h2>
							</div>
						`
					}).join("")
					$("#J-role-select").html(str)
				}
			})
	})

}
