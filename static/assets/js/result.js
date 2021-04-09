var info;
//Updates lobby everything once in a while
if (typeof key !== 'undefined') {
    setTimeout(updateAll,200);
}

//Updates everything if something changed
async function updateAll() {
    //Gets new lobby data
    var info = await httpRequest('api/info/'+key);

    var html_users = `<h3 class="frosted"><i class="bi bi-person-circle"></i>${info['results']['stage2']}</h3>`;
    var html_restaurants = `<h3 class="frosted"><i class="bi bi-geo-alt"></i>${info['results']['stage3']}</h3>`;
    var html_menu = "";

    for (let [food, count] of Object.entries(info['results']['stage4'])) {
        html_menu += `<h3 class="frosted"><i class="bi bi-caret-right-fill"></i> ${food} <i class="bi bi-arrow-right-short"></i> ${count}x</h3>`
    };



    document.getElementById('list-users').innerHTML = html_users;
    document.getElementById('list-restaurants').innerHTML = html_restaurants;
    document.getElementById('list-menu').innerHTML = html_menu;
    
}