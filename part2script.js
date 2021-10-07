var user_added_data = [];let comments_data = [], news_data = [];
localStorage.getItem("user_added_data") ? user_added_data = $.parseJSON(localStorage.getItem("user_added_data")) : user_added_data = [];
localStorage.getItem("comments_data") ? comments_data = $.parseJSON(localStorage.getItem("comments_data")) : comments_data = [];
localStorage.getItem("news_data") ? news_data = $.parseJSON(localStorage.getItem("news_data")) : news_data = [];
$("#addform").submit(function (event) {
    formArray = $(this).serializeArray();
    user_added_data.push(addHawkerStall(formArray));
    localStorage.setItem("user_added_data", JSON.stringify(user_added_data));
    event.preventDefault();
});
function addHawkerStall(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    returnArray.stallNoInput = parseInt(returnArray.stallNoInput);
    returnArray.mapInput = returnArray.mapInput.split(",");
    returnArray.likes = 0;
    addToNews("Added: " + returnArray.stallNameInput);
    return returnArray;
}

function addToNews(text){
    current_datetime = new Date($.now());
    news_data.unshift({ text: text, timestamp: current_datetime });
    localStorage.setItem("news_data", JSON.stringify(news_data.slice(0,5)));
}

$.getJSON('data/data.json', function (data) {
    $.each(data.data, function (i, val) {
        console.log("check exist: ", comments_data[1])
        if (comments_data[val.no]) {
            comments = comments_data[val.no]
            console.log("no exist: ", val.no);
        } else {
            comments = val.comments;
        }
        $("ul#updatedefault").append('<li class="list-group-item">' +
            '<b>Stall No: ' + val.no + '</b>' +
            '<form class="updateform">' +
            '<div class="form-group">' +
            '<label for="updateCommentsInput">Comments</label>' +
            '<input type="text" class="form-control" id="updateCommentsInput" name="updateCommentsInput" value="' + comments + '">' +
            '<input type="hidden" name="stallNo" value="' + val.no + '" />' +
            '<input type="hidden" name="stallName" value="' + val.name + '" />' +
            '</div> <input class="updateButton" type="submit" value="Update" /></form>' +
            '</li>');
    });
    $('.updateform').on('submit', function (ev) {
        ev.preventDefault();
        var curObj = $(this), formArray = curObj.serializeArray();
        comments_data[formArray[1].value] = formArray[0].value;
        localStorage.setItem("comments_data", JSON.stringify(comments_data));
        addToNews("Updated: " + formArray[2].value);
    });
});