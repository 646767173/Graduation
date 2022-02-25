export const getTimeNow = () => {
	let dateTime;
	let year = new Date().getFullYear();
	let mouth = new Date().getMonth()+1;
	let date = new Date().getDate();
	let hour = new Date().getHours();
	let min = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes() ;
	let second = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
	dateTime = `${year}-${mouth}-${date} ${hour}:${min}:${second}`;
	return dateTime;
}