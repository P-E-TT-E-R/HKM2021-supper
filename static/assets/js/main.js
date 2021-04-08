var info;

if (typeof key !== 'undefined') {
    getInfo;
    updateUserlist;

    setInterval(getInfo, 1500);
    setInterval(updateUserlist, 1500);
    setTimeout(getRestaurants, 3000);
}

async function join() {
    console.log("Joining");
	var nick = document.getElementById("username").value;
	console.log(await httpRequest('api/action/'+key+'?type=join&name='+nick));
	window.location.replace("/order");
}
async function begin() {
    console.log("Beginning");
    console.log(await httpRequest('api/action/'+key+'?type=join&name=Host'));
	console.log(await httpRequest('api/action/'+key+'?type=start'));
	window.location.replace("/order");
}
function updateUserlist() {
    var html = ""
    info['users'].forEach(function(user) {
        html += `<h3><i class="bi bi-person-circle"></i>${user}</h3>`
    })
    document.getElementById('list-users').innerHTML = ''
    document.getElementById('list-users').innerHTML = html
}
function getRestaurants() {
    var html = ""
    var details = ""
    for (let [key, value] of Object.entries(info['restaurants'])) {
        html += `<a href="#">
		<img src="${value['thumbnail_url']}">
		<div class="restaurants-info">
			<h3>${key}</h3>
			<p>
				<em class="badge bdg-blue">${value['food_origin']}</em><br>
				<em class="badge bdg-orange"><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i></em><br>
				<em class="badge bdg-green"><i class="bi bi-flower1"></i>Vegan </em><br>
				<i class="bi bi-chevron-double-down"></i>Low Cal.<br>
				<i class="bi bi-cup-straw"></i>Drinks<br>
				<i class="bi bi-hourglass-split"></i>50min
			</p>
		</div>
	</a>
	`
    }
    document.getElementById('list-restaurants').innerHTML = ''
    document.getElementById('list-restaurants').innerHTML = html
}
async function getInfo () {
    info = await httpRequest('api/info/'+key);
}
async function httpRequest(loc) {
    url = 'http://' + window.location.host + '/' + loc;
    console.log("HTTP Request > "+url);
    let response = await fetch(url);
    text = await response.text();
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}