var info;

//Updates lobby everything once in a while
if (typeof key !== 'undefined') {
    updateAll();
    setInterval(updateAll, 1000);
}

//Updates everything if something changed
async function updateAll() {
    //Gets new lobby data
    var newinfo = await httpRequest('api/info/'+key);

    //If lobby data changed proceeds to update everything
    if (newinfo != info) {
        //Updates global data variable
        info = newinfo

        //Updates items in lists
        updateUserlist();
        updateRestaurants();
        updateFood();

        //Makes sure that displayed items correspond to the right stage in the process
        if (info['stage'] == 2) {
            document.getElementById('list-users').parentNode.style.display = "flex";
            document.getElementById('list-restaurants').parentNode.style.display = "none";
            document.getElementById('list-menu').parentNode.style.display = "none";
            document.getElementById('title').innerHTML = "Vote who orders today";

        } else if (info['stage'] == 3) {
            document.getElementById('list-users').parentNode.style.display = "none";
            document.getElementById('list-restaurants').parentNode.style.display = "flex";
            document.getElementById('list-menu').parentNode.style.display = "none";
            document.getElementById('title').innerHTML = "Vote for restaurant";

        } else if (info['stage'] == 4) {
            document.getElementById('list-users').parentNode.style.display = "none";
            document.getElementById('list-restaurants').parentNode.style.display = "none";
            document.getElementById('list-menu').parentNode.style.display = "flex";
            document.getElementById('title').innerHTML = "Choose what you want to order";
        }
    }
}

//Updates user list
function updateUserlist() {
    var html = "";

    //Creates html list of all connected users 
    info['users'].forEach(function(user) {
        html += `<h3 class="frosted" onclick="pickedUser('${user}');"><i class="bi bi-person-circle"></i>${user}</h3>`
    });

    //Wipes contents of the list
    document.getElementById('list-users').innerHTML = '';

    //Adds new html to the list
    document.getElementById('list-users').innerHTML = html;
}

//Updates list of restaurants
function updateRestaurants() {
    var html = "";
    var stars = "";
    var badges = "";

    //Creates html list of all restaurants
    for (let [key, value] of Object.entries(info['restaurants'])) {
        stars = "";
        badges = "";

        //Creates html of stars  
        for (let i = 0; i < 5; i++) {
            if (i <= value['stars']) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }

        //Checks if the restaurant is vegan, if so adds vegan badge
        if (value['vegan_options'] === true) {
            badges += '<em class="badge bdg-green"><i class="bi bi-flower1"></i>Vegan </em><br>';
        }

        //Assembles final html
        html += `
        <div class="frosted" onclick="pickedRestaurant('${key}');">
		<img src="${value['thumbnail_url']}">
		<div class="restaurants-info">
			<h3>${key}</h3>
			<p>
				<em class="badge bdg-blue">${value['food_origin']}</em><br>
				<em class="badge bdg-orange">${stars}</em><br>
				${badges}<br>
                <i class="bi bi-hourglass-split"></i>${value['delivery_time']}min<br>
				${value['details_html']}
			</p>
		</div>
	</div>
	`;
    }

    //Wipes contents of the list
    document.getElementById('list-restaurants').innerHTML = '';

    //Adds new html to the list
    document.getElementById('list-restaurants').innerHTML = html;
}

//Updates menu
function updateFood() {
    var html = "";
    var stars = "";
    var menu = info['restaurants']["Pod Dubom"]['menu'];

    //Creates html list of all restaurants
    for (let [key, value] of Object.entries(menu)) {
        stars = "";

        //Creates html of stars  
        for (let i = 0; i < 5; i++) {
            if (i < value['stars']) {
                stars += '<i class="bi bi-star-fill"></i>';
            } else {
                stars += '<i class="bi bi-star"></i>';
            }
        }

        //Assembles final html
        html += `<div class="frosted" onclick="pickedFood('${key}');">
                    <img src="${value['thumbnail_url']}">
                    <div class="menu-info">
                        <h3>${key}</h3>
                        <p>
                            <em class="badge bdg-orange">${stars}</em>
                            ${value['details_html']}
                        </p>
                    </div>
                </div>   
    `;
    }

    //Wipes contents of the list
    document.getElementById('list-menu').innerHTML = '';

    //Adds new html to the list
    document.getElementById('list-menu').innerHTML = html;
}

//Stars lobby
async function begin() {
    console.log("Beginning");

    //Joins host to the lobby and starts it
    console.log(await httpRequest('api/action/'+key+'?type=join&name=Host'));
    console.log(await httpRequest('api/action/'+key+'?type=start'));

    //Redirects to new page
    window.location.replace("/order");
}

//Joins user to lobby
async function join() {
    console.log("Joining");

    //Retrieves users username
    var nick = document.getElementById("username").value;

    //Joins user to lobby
    console.log(await httpRequest('api/action/'+key+'?type=join&name='+nick));

    //Redirects to new page
    window.location.replace("/order");
}

//Votes for user
async function pickedUser(user) {
    //Votes for user if stage is right
    if (info['stage'] == 2) {
        console.log("Voted for "+user);

        //Votes for user
        console.log(await httpRequest('api/action/'+key+'?type=vote&stage=2&value='+user));
    }
}

//Votes for restaurant
async function pickedRestaurant(restaurant) {
    //Votes for restaurant if stage is right
    if (info['stage'] == 3) {
        console.log("Voted for "+restaurant);

        //Votes for restaurant
        console.log(await httpRequest('api/action/'+key+'?type=vote&stage=3&value='+restaurant));
    }
}

//Votes for food in menu
async function pickedFood(food) {
    //Votes for food in menu if stage is right
    if (info['stage'] == 4) {
        console.log("Voted for "+food);

        //Votes for food in menu
        console.log(await httpRequest('api/action/'+key+'?type=vote&stage=4&value='+food));
    }
}

//Sends HTTP GET request and retrieves the data
async function httpRequest(loc) {
    //Constructs URL
    url = 'http://' + window.location.host + '/' + loc;

    console.log("HTTP Request > "+url);

    //Sends HTTP GET request and retrieves the data
    let response = await fetch(url);
    text = await response.text();

    //Parses data and returns it if it's in the form of JSON or just returns it in plain text 
    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}