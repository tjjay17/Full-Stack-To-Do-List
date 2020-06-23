exports.date = dateToday;

function dateToday(){
    var date = new Date();
    var options = {weekday:'long', month:'long', day:'numeric', year:'numeric'};
    today = date.toLocaleDateString('en-US',options);

    return today;
}
