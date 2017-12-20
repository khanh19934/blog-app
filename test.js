const bcrypt = require('bcryptjs');

async function test(code){
	const checkPass = await bcrypt.compare(code, '$2a$10$6yEKKibwUFn4.BRE1TcAQ.ilxT8GSRqndpagtyE/YzhZ/5zZppzfa');
	if(checkPass){
		console.log("ok");
	}else{
		console.log('err');
	}
	
}
test("admin");