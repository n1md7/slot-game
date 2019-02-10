let Reel = function(canvas, offsetX = 0, offsetY = 0){
	this.canvas = canvas;
	this.reelRowMap = [];
	
	this.$stop = true;

	//init start positions
	conf.imgMap.shuffle()
		.forEach((key, i) => this.reelRowMap.push({
			offsetY: conf.reel.height * conf.rowMap[i],
			key: key
	}));

	this.stop = function(){
		this.$stop = true;

		return this;
	};

	this.resume = function(){
		this.$stop = false;

		return this;
	};

	this.clear = function(){
		this.canvas.clearRect(offsetX, conf.height, conf.reel.width, conf.height);

		return this;
	};

	this.draw = function(key = 'bar1', offsetY = 0){
		if(conf.img.hasOwnProperty(key)){
			this.clear();
			this.canvas.strokeStyle = '#000';
			this.canvas.lineWidth = 4;         
			this.canvas.fillRect(offsetX, offsetY, conf.reel.width, conf.reel.height);
			this.canvas.strokeRect(offsetX, offsetY, conf.reel.width, conf.reel.height);
			this.canvas.drawImage(conf.img[key], offsetX, offsetY);
		}

		return this;
	};

	this.animate = function(i = 1){
		if(this.$stop) return;

		for(let j = 0; j < this.reelRowMap.length; j ++){
			let $reel = this.reelRowMap[j];

			$reel.offsetY += i * conf.pSkip;

			//reset post and jump very top
			if($reel.offsetY >= conf.height){
				$reel.offsetY = conf.reel.height * -2;
			}

			this.draw($reel.key, $reel.offsetY);
		}
		
		return this;
	};

};
