$.getJSON('data/data.json', function (data) {
    let likes_data = [], xArray = [], yArray = [], zArray = [];
    let news_data = [], comments_data = [];

    localStorage.getItem("comments_data") ? comments_data = $.parseJSON(localStorage.getItem("comments_data")) : comments_data = [];
    localStorage.getItem("news_data") ? news_data = $.parseJSON(localStorage.getItem("news_data")) : news_data = [];
    
    $('ul#news').empty();
    $.each(news_data, function (index, value) {
        $("ul#news").append('<li class="list-group-item">' + value.text + '<br/><small>' + value.timestamp + '</small></li>');
    });
    
    $.each(data.data, function (i, val) {
        if (comments_data[val.no]) {
            comments = comments_data[val.no];
            pin = "red";
        }else{
            comments = val.comments;
            pin = "blue";
        }
        document.getElementById("pins").innerHTML +=
            "<img src='images/" + pin +"_pin.png' class='pin' id='pin_" + val.no + "' style='bottom: " + val.map[0] + "px; left: " + val.map[1] + "px' width='24'/>" +
            "<div class='popup' id='popup_" + val.no + "' style='transform: translate(" + val.map[1] + "px, -" + val.map[0] + "px'>" +
            "<p>Stall No: " + val.no + "</p>" +
            "<p id='name_" + val.no + "'>Stall Name: " + val.name + "</p>" +
            "<p><img class='img-thumbnail' src='" + val.thumbnail + "' style='width: 200px'/></p>" +
            "<p>Address: " + val.address + "</p>" +
            "<p>How to order: " + val.order + "</p>" +
            "<p>Food Category: " + val.category + "</p>" +
            "<p>Likes: <span id='likes_" + val.no + "'>" + val.likes + "</span>&nbsp;&nbsp;&nbsp;<button value='" + val.likes + "' type='button' id='likebtn_" + val.no + "' class='btn btn-xs btn-primary'>Like" +
            "</button></p>" +
            "<p>Comments: " + comments + "</p>" +
            "</div>";

        likes_data.push([val.no, val.likes, val.name])
    });
    var user_added_data = $.parseJSON(localStorage.getItem("user_added_data"));
    $.each(user_added_data, function (i, val) {
        document.getElementById("pins").innerHTML +=
            "<img src='images/purple_pin.png' class='pin' id='pin_" + val.stallNoInput + "' style='bottom: " + val.mapInput[0] + "px; left: " + val.mapInput[1] + "px' width='24'/>" +
            "<div class='popup' id='popup_" + val.stallNoInput + "' style='display:none; transform: translate(" + val.mapInput[1] + "px, -" + val.mapInput[0] + "px'>" +
            "<p>Stall No: " + val.stallNoInput + "</p>" +
            "<p id='name_" + val.stallNoInput + "'>Stall Name: " + val.stallNameInput + "</p>" +
            "<p><img class='img-thumbnail' src='images/" + val.imageInput + "' style='width: 200px'/></p>" +
            "<p>Address: " + val.addressInput + "</p>" +
            "<p>How to order: " + val.orderInput + "</p>" +
            "<p>Food Category: " + val.categorySelect + "</p>" +
            "<p>Likes: <span id='likes_" + val.stallNoInput + "'>" + val.likes + "</span>&nbsp;&nbsp;&nbsp;<button value='" + val.likes + "' type='button' id='userlikebtn_" + val.stallNoInput + "' class='btn btn-xs btn-primary'>Like" +
            "</button></p>" +
            "<p>Comments: " + val.commentsInput + "</p>" +
            "</div>";

        likes_data.push([val.stallNoInput, val.likes, val.stallNameInput])

    });

    likes_data.sort(function (first, second) {
        return second[1] - first[1];
    });

    $.each(likes_data, function (index, value) {
        xArray.push(value[0]);
        yArray.push(value[1]);
        zArray.push(value[2]);
    });

    $('.pin').click(function () {
        num = this.id.split("_")[1];
        $('#popup_' + num).toggle();
    });
    $('.btn').click(function () {
        var [btn, num] = this.id.split("_");
        var likes = this.value;

        function isMatch(like_data) {
            return like_data === parseInt(num);
        }

        like_index = xArray.findIndex(isMatch);

        if (yArray[like_index] === parseInt(likes)) {
            yArray[like_index] += 1;
            $('#likes_' + num).text(yArray[like_index]);
            if (btn === "likebtn") {
                $('#pin_' + num).prop('src',
                    'images/red_pin.png');
            }
            current_datetime = new Date($.now());
            news_data.unshift({ text: 'User "Liked" ' + zArray[like_index], timestamp: current_datetime });
            localStorage.setItem("news_data", JSON.stringify(news_data.slice(0,5)));

        } else {
            yArray[like_index] = parseInt(likes);
            $('#likes_' + num).text(yArray[like_index]);
            $('#pin_' + num).prop('src',
                'images/blue_pin.png');
        }
        myChart.data.datasets[0].data = yArray;
        myChart.update();

        $('ul#news').empty();
        $.each(news_data, function (index, value) {
            $("ul#news").append('<li class="list-group-item">' + value.text + '<br/><small>' + Date(value.timestamp) + '</small></li>');
        });
    });
    var ctx = document.getElementById('myChart');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xArray.slice(0, 10),
            datasets: [{
                label: '# of Likes',
                data: yArray.slice(0, 10),
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function (tooltipItem, data) {

                            return "Name: " + zArray[tooltipItem[0].dataIndex];
                        }
                    }
                }
            }
        }
    });

});