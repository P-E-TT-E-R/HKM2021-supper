var info;

//Updates lobby everything once in a while
if (typeof key !== 'undefined') {
    updateAll();
    setInterval(updateAll, 1000);
}

//Updates everything if something changed
async function updateAll() {
    //Gets new lobby data
    info = await httpRequest('api/info/'+key);

    //Updates items in list
    updateUserlist();
    
}