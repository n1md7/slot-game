let Slot = function(canvas){

	let reels = [
			new Reel(canvas, conf.reel.xOffsets[0]),
			new Reel(canvas, conf.reel.xOffsets[1]),
			new Reel(canvas, conf.reel.xOffsets[2])
		];

	let lastTime = [0, 0, 0];
	let time = 0;
	let initDone = Array(3).fill(!!0);
	let spin = Array(3).fill(!!0);
	let checkDone = !0;
	let reelsStates = [0,0,0];
	let winPoints = 0;

	let check = function(){
		if(!checkDone ){
			checkDone = !checkDone;
			let dataMap = reels.map(reel=>{
				return reel.reelRowMap
						.sort(function(next, current){
							if(next.offsetY>current.offsetY) return  1;
							if(next.offsetY<current.offsetY) return -1; 
								return 0;
					}).slice(2);
			});
			winData = [];
			dataMap[0].forEach(function(cell, i){
				let barWin = false;
				//aligned cells
				if(cell.offsetY === dataMap[1][i].offsetY && dataMap[1][i].offsetY === dataMap[2][i].offsetY){
					//cherry
					if(cell.key === conf.$imgMap[4] && 
						dataMap[1][i].key === dataMap[2][i].key &&
						dataMap[1][i].key === conf.$imgMap[4]){
							winPoints += 1000;
							if(i === 0) winPoints *= 2;
							if(i === 2) winPoints *= 4;
							winData.push({i:i,o:cell.offsetY});
					}
					//seven
					if(cell.key === conf.$imgMap[3] && 
						dataMap[1][i].key === dataMap[2][i].key &&
						dataMap[1][i].key === conf.$imgMap[3]){
							winPoints += 150;
							winData.push({i:i,o:cell.offsetY});
					}
					//bar3
					if(cell.key === conf.$imgMap[2] && 
						dataMap[1][i].key === dataMap[2][i].key &&
						dataMap[1][i].key === conf.$imgMap[2]){
							winPoints += 50;
							barWin = true;
							winData.push({i:i,o:cell.offsetY});
					}
					//bar2
					if(cell.key === conf.$imgMap[1] && 
						dataMap[1][i].key === dataMap[2][i].key &&
						dataMap[1][i].key === conf.$imgMap[1]){
							winPoints += 20;
							barWin = true;
							winData.push({i:i,o:cell.offsetY});
					}
					//bar1
					if(cell.key === conf.$imgMap[0] && 
						dataMap[1][i].key === dataMap[2][i].key &&
						dataMap[1][i].key === conf.$imgMap[0]){
							winPoints += 10;
							barWin = true;
							winData.push({i:i,o:cell.offsetY});
					}
					//any bar combination
					let bars = Array(3).fill(1).map((x,i)=>x=conf.$imgMap[i]);
					if(!barWin && bars.includes(cell.key) && 
						bars.includes(dataMap[1][i].key) &&
						bars.includes(dataMap[2][i].key)){
							winPoints += 5;
							winData.push({i:i,o:cell.offsetY});
					}
				}
			});

			//heightlight winner row
			let margin = 10;
			winData.forEach(i => {
				canvas.beginPath();
				canvas.moveTo(margin, i.o-2+conf.reel.height/2);
				canvas.lineTo(conf.width - margin, i.o-2+conf.reel.height/2);
				canvas.strokeStyle = "#FF0000";
				canvas.stroke();
			});
			conf.player.money += winPoints;
			conf.balance.value = conf.player.money;
			if(winPoints!==0){
				conf.balance.classList.add('blink');
				console.log('winPoint', winPoints);
			}
			winPoints = 0;
		}
	}

	this.spin = function(){
		conf.player.money = conf.balance.value || 10;
		if(conf.player.money <= 0){
			alert('You are out of money! Get it and come back later!');

			return;
		}
		conf.player.money -= 1;
		conf.balance.value = conf.player.money; 
		lastTime = Array(3).fill(time);
		spin = Array(3).fill(!0);

		conf.balance.classList.remove('blink');
		conf.spinBtn.setAttribute('disabled', '');

		return this;
	};
	this.update = function(now){
		[0,1,2].forEach(function(reel){
			let delta = now - lastTime[reel];
			//to draw init boxes
			if(!initDone[reel]){
				initDone[reel] = !initDone[reel];
				reels[reel].resume().animate(0).stop();
			}
			//spin it again
			if(spin[reel]){
				reels[reel].resume();
				spin[reel] = !spin[reel];
				checkDone = false;
			}
			//stop reels according their animTime
			if(delta >= conf.reel.animation[reel] && !reels[reel].$stop){
				lastTime[reel] = now;
				reels[reel].stop();
			}
			reelsStates[reel] = reels[reel].$stop;
			reels[reel].animate();
		});
		
		if(reelsStates.filter(x=>x===true).length===3){
			check.call(this);
			conf.spinBtn.removeAttribute('disabled');
		}

		time = now;

		return this;
	};

};