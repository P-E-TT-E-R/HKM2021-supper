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

        //Makes sure that displayed items correspond to the right stage in the process
        if (info['stage'] == 1)
        {
            document.getElementById('list-users').parentNode.style.display = "flex";
            document.getElementById('list-restaurants').parentNode.style.display = "none";
            document.getElementById('list-menu').parentNode.style.display = "none";
            document.getElementById('ready-btn').style.display = "none";

            //Updates items in list
            updateUserlist();
        } else if (info['stage'] == 2) {
            document.getElementById('list-users').parentNode.style.display = "flex";
            document.getElementById('list-restaurants').parentNode.style.display = "none";
            document.getElementById('list-menu').parentNode.style.display = "none";
            document.getElementById('ready-btn').style.display = "none";
            document.getElementById('title').innerHTML = "Vote who orders today";

            //Updates items in list
            updateUserlist();

        } else if (info['stage'] == 3) {
            document.getElementById('list-users').parentNode.style.display = "none";
            document.getElementById('list-restaurants').parentNode.style.display = "flex";
            document.getElementById('list-menu').parentNode.style.display = "none";
            document.getElementById('title').innerHTML = "Vote for restaurant";
            document.getElementById('ready-btn').style.display = "none";

            //Updates items in listt
            updateRestaurants();

        } else if (info['stage'] == 4) {
            document.getElementById('list-users').parentNode.style.display = "none";
            document.getElementById('list-restaurants').parentNode.style.display = "none";
            document.getElementById('list-menu').parentNode.style.display = "flex";
            document.getElementById('title').innerHTML = "Choose what you want to order";
            document.getElementById('ready-btn').style.display = "block";

            //Updates items in listt
            updateFood();

        } else if (info['stage'] == 5) {
            //Redirects to results page if lobby finished
            window.location.replace("/result");
        }
    }
}