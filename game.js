class Game {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');

		this.colorArray = ["pink", "blue", "black", "red", "gray", "yellow"];
		this.nameColorArray = ["Розовый", "Синий", "Черный", "Красный", "Серый", "Желтый"];

		this.drewShapeArray = []; 

		this.width = 600; 
		this.height = 500;
		this.n = 3;

		this.indexSelectedShape = 0;

		this.timerId = null;

		this.scoreStart = 0;
		this.scoreLife = 3;

		this.taskField = null;
		this.scoresField = null;
		this.livesField = null;
		
		this.onGameOver = null;
	}

	start() {
		this.clearCanvas(this.context);
		this.n = 3;
		if (this.timerId != null) {
			clearInterval(this.timerId);
		}

		this.drawFrame();
		this.timerId = setInterval(() => {this.drawFrame()}, 3000);
		this.scoreStart = 0;
		this.scoreLife = 3;
		this.scoresField.innerHTML = " Ваши баллы : " + this.scoreStart;
		this.livesField.innerHTML = "Количество жизней : " + this.scoreLife;
		this.clickShape();
	}

	pause() {
		this.clearCanvas(this.context);
		clearInterval(this.timerId);
	}

	continue() {
		if (this.timerId != null) {
			clearInterval(this.timerId);
		}
		this.checkScores(this.scoreStart);
	}

	setScoreField(field) {
		this.scoresField = field
	}

	setLifeField(field) {
		this.livesField = field
	}

	setTaskField(field) {
		this.taskField = field
	}

	clearCanvas() {
		this.context.fillStyle = "green";
		this.context.fillRect(0, 0, 600, 500);
	}

	drawFrame() {
		this.clearCanvas(this.context);
		this.drewShapeArray = [];
		
		for(var x = (this.width/this.n)/2; x < this.width; x = x + this.width/this.n) {
			this.shape = this.generateRandomShape(x, this.height/2);

			for (let i = 0; i < this.drewShapeArray.length; i++) {
				if (this.drewShapeArray[i].name == this.shape.name && this.drewShapeArray[i].color == this.shape.color) {
					this.shape = this.generateRandomShape(x, this.height/2);
					this.shape = this.checkUniqueAndGenerateShapeIfNeed(this.drewShapeArray, this.shape, x, this.height/2);
				}	
			}

			this.shape.draw(this.context);
			this.drewShapeArray.push(this.shape);
		}

		let randomDrewRightShape = this.getRandomInt(0, this.drewShapeArray.length);
		let rightShape = this.drewShapeArray[randomDrewRightShape];
		this.indexSelectedShape = randomDrewRightShape;

		let randomDrewOtherShape = this.getRandomInt(0, this.drewShapeArray.length);
		let otherShape = this.drewShapeArray[randomDrewOtherShape];

		var colorIndex = null;
		for (var i = 0; i < this.colorArray.length; i++) {
			if (otherShape.color == this.colorArray[i]) {
				colorIndex = i;
				break;
			}
		}

		this.showText(this.nameColorArray[colorIndex] + " " + rightShape.name, rightShape.color);
	}

	clickShape() {
		let game = this;

		this.canvas.onclick = function(event) {
			for (var i = 0; i < game.drewShapeArray.length; i++) {
				let shape = game.drewShapeArray[i];

				let rect = canvas.getBoundingClientRect()

				let x = event.x - rect.left;
				let y = event.y - rect.top;

				if (shape.isPressed(x, y) == true) {
					if (game.indexSelectedShape == i) {
						game.scoreStart += 1;
					} else {
						if (game.scoreStart > 0) {
							game.scoreStart -= 1;
						}
						game.scoreLife -= 1;
					}
					game.clearCanvas(game.context);
					game.drawFrame();
					game.checkScores(game.scoreStart);
				}
			}

			game.scoresField.innerHTML = "Ваши баллы : " + game.scoreStart;
			game.livesField.innerHTML = "Количество жизней : " + game.scoreLife;

			if (game.scoreLife == 0) {
				if (game.onGameOver != null) {
					game.onGameOver();
				}
			}
		}
	}
	
	checkScores(scoreStart) {
		if (this.scoreStart >= 20) {
			this.n = 5;
			clearInterval(this.timerId);
			this.timerId = setInterval(() => {this.drawFrame()}, 1000);
		} else if (this.scoreStart >= 10) {
			this.n = 4;
			clearInterval(this.timerId);
			this.timerId = setInterval(() => {this.drawFrame()}, 2000);
		} else {
			clearInterval(this.timerId);
			this.n = 3;
			this.timerId = setInterval(() => {this.drawFrame()}, 3000);
		}
	}

	createRandomShape(randomNum) {
		let shape = null;

		switch (randomNum) {
			case 0: 
				shape = new Circle("Круг", 50);
			break;
			case 1:
				shape = new Rectangle("Прямоугольник", 100, 50);
			break;
			case 2:
				shape = new Rectangle("Квадрат", 100, 100);
			break;
		}

		return shape;
	}

	generateRandomShape(x, y) {
		let randomNumColor = this.getRandomInt(0, colorArray.length);
		let randomNumShape = this.getRandomInt(0, 3);
		let color = this.colorArray[randomNumColor];

		let shape = this.createRandomShape(randomNumShape);

		shape.x = x;
		shape.y = y;
		shape.color = color;

		return shape;
	}

	checkUniqueAndGenerateShapeIfNeed(drewShapeArray, shape, x, y) {
		for (var i = 0; i < this.drewShapeArray.length; i++) {
			if (this.drewShapeArray[i].name == this.shape.name && this.drewShapeArray[i].color == this.shape.color) {
				this.shape = this.generateRandomShape(this.x, this.y);
				return this.checkUniqueAndGenerateShapeIfNeed(this.drewShapeArray, this.shape, this.x, this.y);
			}	
		}	
		return this.shape;
	}


	showText(text, textColour) {
		this.taskField.innerHTML = text;
		this.taskField.style.color = textColour;
	}

	getRandomInt(min, max) {
		this.min = Math.ceil(min);
		this.max = Math.floor(max);
		return Math.floor(Math.random() * (this.max - this.min)) + this.min;
	}
}