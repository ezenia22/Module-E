let pinArray = [[400, 280], [450, 600],[700, 400]]; 

$.each(pinArray, function (i, val) {
    pos_pair = val;
    console.log(pos_pair);
    document.getElementById("pins").innerHTML += 
    '<img src="https://cdn.iconscout.com/icon/free/png-256/bootstrap-2038880-1720093.png" width="30" height="30"' +
    'style="bottom: '+pos_pair[0]+'px;left: '+pos_pair[1]+'px;position: absolute;" />';
});

var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});