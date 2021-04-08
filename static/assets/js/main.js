var info;

setInterval(getInfo, 1500);

function join() {
    console.log("Joining");
	var nick = document.getElementById("username").value;
	console.log(httpRequest('api/action/'+key+'?type=join&name='+nick));
	window.location.replace("order");
}
function begin() {
    console.log("Beginning");
    console.log(httpRequest('api/action/'+key+'?type=join&name=Host'));
	console.log(httpRequest('api/action/'+key+'?type=start'));
	window.location.replace("order");
}
function updateUserlist() {
    var html = ""
    info['users'].forEach(function(user) {
        html += `<h3><i class="bi bi-person-circle"></i>${user}</h3>`
    })
    getElementById('list-users').innerHTML = ''
    getElementById('list-users').innerHTML = html
}
async function getInfo () {
    info = await httpRequest('api/info/'+key);
}
async function httpRequest(loc) {
    url = 'http://' + window.location.host + '/' + loc;
    console.log("HTTP Request > "+url);
    let response = await fetch(url);

    return await response.json();
}