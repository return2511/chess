;
void

function() {

	var winners = [];
	for (var i = 0; i < 15; i++) {
		winners[i] = [];
		for (var j = 0; j < 15; j++) {
			winners[i][j] = [];
		}
	}

	var count = 0;
	var myWin = [];
	var computerWin = [];
	var over = false;

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				winners[i][j + k][count] = true;
			}
			count++;
		}
	}

	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				winners[j + k][i][count] = true;
			}
			count++;
		}
	}

	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			for (var k = 0; k < 5; k++) {
				winners[i + k][j + k][count] = true;
			}
			count++;
		}
	}
	console.log(count);

	for (var i = 0; i < 11; i++) {
		for (var j = 14; j > 3; j--) {
			for (var k = 0; k < 5; k++) {
				winners[i + k][j - k][count] = true;
			}
			count++;
		}
	}

	console.log(count);
	for (var i = 0; i < count; i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}



	var chessBox = [];
	for (var i = 0; i < 15; i++) {
		chessBox[i] = [];
		for (var j = 0; j < 15; j++) {
			chessBox[i][j] = 0;
		}
	}
	var me = true;
	var chess = document.getElementById('J_chess');
	var ctx = chess.getContext("2d");
	ctx.strokeStyle = "#BFBFBF";
	for (var i = 0; i < 15; i++) {
		var x = 15 + 30 * i;
		ctx.moveTo(x, 15);
		ctx.lineTo(x, 435);
		ctx.stroke();
		ctx.moveTo(15, x);
		ctx.lineTo(435, x);
		ctx.stroke();
	}
	var oneStep = function(i, j, me) {
		ctx.beginPath();
		ctx.arc(15 + 30 * i, 15 + 30 * j, 13, 0, 2 * Math.PI, false);
		ctx.closePath();
		var grd = ctx.createRadialGradient(15 + 30 * i + 2, 15 + 30 * j - 2, 13, 15 + 30 * i + 2, 15 + 30 * j - 2, 0);
		if (me) {
			grd.addColorStop(0, "#0A0A0A");
			grd.addColorStop(1, "#636766");
		} else {
			grd.addColorStop(0, "#D1D1D1");
			grd.addColorStop(1, "#F9F9F9");
		}
		ctx.fillStyle = grd;
		ctx.fill();
	}



	chess.onclick = function(e) {
		if (over) {
			window.alert("游戏已经结束！");
			window.location.reload();
			return;
		}
		if (!me) {
			return;
		}
		var x = e.offsetX;
		var y = e.offsetY;
		var i = parseInt(x / 30);
		var j = parseInt(y / 30);
		if (chessBox[i][j] == 0) {
			oneStep(i, j, me);
			chessBox[i][j] = me ? 1 : 2;
			for (var k = 0; k < count; k++) {
				if (winners[i][j][k]) {
					myWin[k]++;
					computerWin[k] = -1;
				}
				if (myWin[k] == 5) {
					over = true;
					setTimeout("window.alert('you win!!')", 250);
				}
			}
			if (!over) {
				me = !me;
				compuerAi(me);
			}
		}
	}
	var compuerAi = function() {
		var myScore = [];
		var computerScore = [];
		var max = 0,
			u = 0,
			v = 0;
		for (var i = 0; i < 15; i++) {
			myScore[i] = [];
			computerScore[i] = [];
			for (var j = 0; j < 15; j++) {
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if (chessBox[i][j] == 0) {
					for (var k= 0; k < count; k++) {
						if (winners[i][j][k]) {
							if (myWin[k] == 1) {
								myScore[i][j] += 200;
							} else if (myWin[k] == 2) {
								myScore[i][j] += 400;
							} else if (myWin[k] == 3) {
								myScore[i][j] += 2000;
							} else if (myWin[k] == 4) {
								myScore[i][j] += 10000;
							}
							if (computerWin[k] == 1) {
								myScore[i][j] += 220;
							} else if (computerWin[k] == 2) {
								myScore[i][j] += 420;
							} else if (computerWin[k] == 3) {
								myScore[i][j] += 2100;
							} else if (computerWin[k] == 4) {
								myScore[i][j] += 20000;
							}
						}
					}
					if (myScore[i][j] > max) {
						max = myScore[i][j];
						u = i;
						v = j;
					} else if (myScore[i][j] == max) {
						if (computerScore[i][j] > computerScore[u][v]) {
							u = i;
							v = j;
						}
					}
					if (computerScore[i][j] > max) {
						max = computerScore[i][j];
						u = i;
						v = j;
					} else if (computerScore[i][j] == max) {
						if (myScore[i][j] > myScore[u][v]) {
							u = i;
							v = j;
						}
					}
				}
			}
		}
		oneStep(u, v, false);
		chessBox[u][v] = 2;
		for (var k = 0; k < count; k++) {
			if (winners[u][v][k]) {
				computerWin[k]++;
				myWin[k] = -1;
			}
			if (computerWin[k] == 5) {
				over = true;
				setTimeout("window.alert('computer win!!')", 250);
			}
		}
		if (!over) {
			me = !me;
		}
	}
}.call(this);