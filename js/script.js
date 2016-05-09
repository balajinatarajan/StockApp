var total = [];
			
invoke();

setInterval( function(){
	invoke();
	amt = 0;
	for(var c=0; c < total.length; c++) {
		amt = amt + total[c].amt;
	}
	$('#total').html('$' + (Math.round(amt * 100) /100 ));
}, 60000);

function invoke() {
	$('#index').html('');
	$.ajax({
			url:"/stockapp/data/shares.json",
			dataType: "json",
			success: function( response1 ) {
				total = response1;
			for(var i=0; i < response1.length; i++) {
				(function(x, y){
					$.ajax({
	  					url:"http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=" + x.index,
	    				jsonp: "callback",
	    				dataType: "jsonp",
	    				success: function( response2 ) {
	        				$('#index').append('<div class="col col-md-6"><div class="panel panel-default"><div class="panel-heading">' + response2.Symbol + '</div><div class="price">$' + response2.LastPrice + '</div>x ' + x.shares + ' = ' + (Math.round((x.shares * response2.LastPrice) * 100) /100 ) + '<div id="' + response2.Symbol + '_chart"></div></div></div>');
	        				total[y].amt = (x.shares * response2.LastPrice);
                            
                            drawChart(response2.Symbol + '_chart', response2.Symbol, 30, '(30 days)', '#000000');
	    				}
					});
				})(response1[i], i);
			}
		},
		error: function( jqXHR, textStatus ) {
			alert( "Request failed: " + textStatus );
		}
	});
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90
setInterval(drawClock, 1000);

function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2*Math.PI);
  ctx.fillStyle = '#000000';
  ctx.fill();
  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(0.5, 'white');
  grad.addColorStop(1, '#fff');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 0;
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = radius*0.25 + "px arial";
  ctx.textBaseline="middle";
  ctx.textAlign="center";
  for(num = 1; num < 13; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius*0.75);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius*0.75);
    ctx.rotate(-ang);
  }
}

function drawTime(ctx, radius){
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour=hour%12;
    hour=(hour*Math.PI/6)+
    (minute*Math.PI/(6*60))+
    (second*Math.PI/(360*60));
    drawHand(ctx, hour, radius*0.5, radius*0.04);
    //minute
    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
    drawHand(ctx, minute, radius*0.8, radius*0.04);
    // second
    second=(second*Math.PI/30);
    drawHand(ctx, second, radius*0.9, radius*0.02);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}