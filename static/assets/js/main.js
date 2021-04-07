function join(key) {
    console.log("Joining");
	var nick = document.getElementById("username").value;
	console.log(httpRequest('api/action/'+key+'?type=join&name='+nick));
	window.location.replace("order");
}
function begin(key) {
    console.log("Beginning");
    console.log(httpRequest('api/action/'+key+'?type=join&name=Host'));
	console.log(httpRequest('api/action/'+key+'?type=start'));
	window.location.replace("order");
}
function updateUserlist(key) {
    getElementById
}
function getInfo (key) {
    return JSON.parse(httpRequest('api/info/'+key));
}
async function httpRequest(loc) {
    console.log("HTTP Request > http://"+window.location.host + '/' + loc);
    url = 'http://' + window.location.host + '/' + loc
	let request = fetch(url)
    let response = request.text
    return response
}