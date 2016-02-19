function drawChart(divid, symbol, duration, duration_text, bg) {
    var options = {
        chart: {
            renderTo: divid,
            backgroundColor: bg
        },
        title: {},
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: [{
            title: {
                text: null
            },
            labels: {
                align: 'left',
                x: 3,
                y: 16,
                formatter: function() {
                    return Highcharts.numberFormat(this.value, 0);
                }
            },
            showFirstLabel: false
        }, {
            linkedTo: 0,
            gridLineWidth: 0,
            opposite: true,
            title: {
                text: null
            },
            labels: {
                align: 'right',
                x: -3,
                y: 16,
                formatter: function() {
                    return Highcharts.numberFormat(this.value, 0);
                }
            },
            showFirstLabel: false
        }],
        tooltip: {
            shared: true,
            crosshairs: true
        },
        plotOptions: {
            series: {
                marker: {
                    lineWidth: 1
                }
            }
        },
        series: [{
            name: "Close price",
            lineWidth: 2,
            marker: {
                radius: 0
            }
        }]
    };

    $.ajax({
        beforeSend: function() {
            $("#" + divid).text("Loading chart...");
        },
        data: {
            parameters: JSON.stringify({
                Normalized: false,
                NumberOfDays: duration,
                DataPeriod: "Day",
                Elements: [{
                    Symbol: symbol,
                    Type: "price",
                    Params: ["c"]
                }]
            })
        },
        url: "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/jsonp",
        jsonp: "callback",
        dataType: "jsonp",
        context: this,
        success: function(json) {
            var dateDS = json.Dates,
                closeDS = json.Elements[0].DataSeries.close.values,
                closeDSLen = closeDS.length,
                irregularIntervalDS = [];
            for (var i = 0; i < closeDSLen; i++) {
                var dat = new Date(dateDS[i]);
                var dateIn = Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
                var val = closeDS[i];
                irregularIntervalDS.push([dateIn, val]);
            }
            options.series[0].data = irregularIntervalDS;
            options.title.text = json.Elements[0].Symbol + "<br>" + duration_text;
            new Highcharts.Chart(options);
        },
        error: function() {
            console.error("Couldn't generate chart.");
        }
    });
}