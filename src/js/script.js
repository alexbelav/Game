'use strict';

window.addEventListener('load', () =>{


    const ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
    const stringName='RANGER_SCORE';

    //Variables
    let screenScroll = 0;
    let lastTime = 0;
    let lastKey = 0;
    let gameOver = false;
    let keyCodes = {
        right: {
            press: 0,
        },
        left: {
            press: 0,
        },
        jump: {
            press: 0,
        },
        touchUp :{
            swipe: 0
        }, 
        touchDown: {
            swipe: 0
        },
        touchLeft: {
            swipe: 0
        }, 
        touchRight: {
            swipe: 0
        }
    };

    //canvas
    const canvas = document.getElementById('screen');
    const context = canvas.getContext('2d');
    const CANVAS_WIDTH = canvas.width = 1500;
    const CANVAS_HEIGHT = canvas.height = 1000;

    //Полномасшатбный режим
    const fullscreenBtn = document.getElementById('fullscreen');
    fullscreenBtn.addEventListener('click', fullScreenWindow);
    
    
    //audio 
    const coinTouchSrcAudio = '/src/audio/coin.mp3';
    const damageEnemySrcAudio = '/src/audio/damage.mp3';
    const finalSrcAudio = '/src/audio/final.mp3';
    const dieSrcAudio = '/src/audio/die.mp3';
    const jumpSrcAudio = '/src/audio/jump.mp3';
    const brickSrcAudio = '/src/audio/brick.mp3';
    const levelSrcAudio = '/src/audio/background.mp3';

    const audioFinal = new Audio(finalSrcAudio);
    audioFinal.volume = 0.8
    audioFinal.loop = false;
    audioFinal.autoplay = false;
    
    const audioCoin = new Audio(coinTouchSrcAudio);
    audioCoin.volume = 0.2;
    
    const audioDamage = new Audio(damageEnemySrcAudio);
    audioDamage.volume = 0.2;
    
    const audioJump = new Audio(jumpSrcAudio);
    audioJump.volume = 0.07;
    
    const audioBrick = new Audio(brickSrcAudio);
    audioBrick.volume = 0.05;
    
    const audioDie = new Audio(dieSrcAudio);
    audioDie.volume = 0.5;
    
    const auidoLevel = new Audio(levelSrcAudio);
    auidoLevel.volume = 0.05;
    auidoLevel.loop = true;
    auidoLevel.autoplay = true;

    function fullScreenWindow() {
        if (!document.fullscreenElement) {
            canvas.requestFullscreen().catch(err => {
                alert(`Error, cant its:' ${err}`)
            });
        }  else {
            document.exitFullscreen();
            canvas.height = innerHeight;
            canvas.width = innerWidth;
        }
    };
    function statusGame(context) {
        if (gameOver === true) {
            context.textAlign = 'center';
            context.fillStyle = 'black';
            context.fillText(`GAME OVER, try again! press enter or swipe up`, CANVAS_WIDTH/2, 250);
        }
    }
    function scrollEffects() {
        //Паралакс эффект
        if (keyCodes.right.press && player.posX < player.maxRight) {
            player.velocityX = player.speed;
        } else if ((keyCodes.left.press && player.posX > player.maxLeft) || 
        keyCodes.left.press && screenScroll === 0 && player.posX > 0) {
            player.velocityX = -player.speed;
        } else {
            player.velocityX = 0;
            if (keyCodes.right.press) {
                screenScroll += player.speed;
                platforms.forEach((platform) => {
                    platform.velocityX = -player.speed;
                });
    
                backgroundObjects.forEach((objectBackground) => {
                    objectBackground.velocityX = -objectBackground.speed;
                });
    
                bg.velocityX = -bg.speed;
    
                spiders.forEach(spider => {
                    spider.posX -= player.speed;
                });
    
                birds.forEach(bird => {
                    bird.posX -= bird.speed;
                });
    
                destructions.forEach(destruction => {
                    destruction.posX -= player.speed
                });
    
                coins.forEach(coin => {
                    coin.posX -= player.speed;
                });
                
            } else if (keyCodes.left.press && screenScroll > 0) {
                screenScroll -= player.speed;
    
                platforms.forEach((platform) => {
                    platform.velocityX = player.speed;
                });
    
                backgroundObjects.forEach((objectBackground) => {
                    objectBackground.velocityX = objectBackground.speed;
                });
    
                bg.posX += bg.speed;
    
                spiders.forEach(spider => {
                    spider.posX += player.speed;
                });
    
                birds.forEach(bird => {
                    bird.posX += bird.speed;
                });
    
                destructions.forEach(destruction => {
                    destruction += player.speed
                });
    
                coins.forEach(coin => {
                    coin.posX += player.speed;
                });
            } 
        };
    }
    function detected() {
        if (screenScroll === 12000) {
            console.log('win');
            audioFinal.play();
        }
    }
    function createImage(url) {
        const image = new Image();
        image.src = url;
        return image;
    };
    function inputPlayer() {
            //Упралвение игроком
            if (keyCodes.right.press === 1 && lastKey === 'right' && player.sprite !== player.sprites.run.right) {
                player.sprite = player.sprites.run.right;
            } else if (keyCodes.right.press === 0 && (lastKey === 'up' || lastKey === 'right') && player.sprite !== player.sprites.stay.right && player.sprite === player.sprites.run.right) {
                player.sprite = player.sprites.stay.right;
            } if (keyCodes.jump.press === 1 && (lastKey === 'up' || lastKey === 'right') && player.sprite !== player.sprites.jump.right && (player.sprite === player.sprites.run.right || player.sprite === player.sprites.stay.right)) {
                player.sprite = player.sprites.jump.right;
            } else if (keyCodes.jump.press === 0 && lastKey === 'up' && player.sprite === player.sprites.jump.right) {
                player.sprite = player.sprites.run.right;
            }
    
            if (keyCodes.left.press === 1 && lastKey === 'left' && player.sprite !== player.sprites.run.left) {
                player.sprite = player.sprites.run.left
            } else if (keyCodes.left.press === 0 && (lastKey === 'up' || lastKey === 'left') && player.sprite !== player.sprites.stay.left && player.sprite === player.sprites.run.left) {
                player.sprite = player.sprites.stay.left
            } if (keyCodes.jump.press === 1 &&  (lastKey === 'up' || lastKey === 'left') && player.sprite !== player.sprites.jump.left && (player.sprite === player.sprites.run.left || player.sprite === player.sprites.stay.left)) {
                player.sprite = player.sprites.jump.left
            } else if (keyCodes.jump.press === 0 && lastKey === 'up' && player.sprite === player.sprites.jump.left) {
                player.sprite = player.sprites.run.left
            }
            
    };
    function collisionTop(objA, objB) {
        return (objA.posY + objA.height <= objB.posY && objA.posY + 
            objA.height + objA.velocityY >= objB.posY && objA.posX +
            objA.width >= objB.posX && objA.posX <= objB.posX + objB.width) 
    };
    function collisionTopCircle(objA, objB) {
        return (objA.posY + objA.radius <= objB.posY && objA.posY + 
            objA.radius + objA.velocityY >= objB.posY && objA.posX +
            objA.radius >= objB.posX && objA.posX <= objB.posX + objB.width) 
    };
    function collisionBottom(objA, objB) {
        return (objA.posY <= objB.posY + objB.height && 
            objA.posY - objA.velocityY >= objB.posY + objB.height &&
            objA.posX + objA.width >= objB.posX && objA.posX <= objB.posX + objB.width)
    };
    function collisionSide(objA, objB) {
        return (objA.posX + objA.width + objA.velocityX + objB.velocityX >= objB.posX && 
            objA.posX + objA.velocityX <= objB.posX + objB.width && objA.posY <= objB.posY + objB.height &&
            objA.posY + objA.height >= objB.posY)
    };
    function collisionCoins(objA, objB) {
        return (objA.posX + objA.width >= objB.posX && objA.posX <= objB.posX + objB.width &&
            objA.posY + objA.height >= objB.posY && objA.posY <= objB.posY + objB.height) 
            
    };
    function vibrate(val){
        if("vibrate" in navigator)  return navigator.vibrate(val);
        if("oVibrate" in navigator)  return navigator.oVibrate(val);
        if("mozVibrate" in navigator)  return navigator.mozVibrate(val);
        if("webkitVibrate" in navigator)  return navigator.webkitVibrate(val);
        document.getElementById('error').innerHTML = "Ваш браузер не поддерживает vibration Api .. попробуйте открыть пример в мобильном fixefox, там все точно работает";
    };
    function restartGame() {
        bg.restart();
        player.restart();
        player.score = 0;
        player.bonus = 0;
        gameOver = false;
        auidoLevel.play();
        animateGame(0);
    };
    
    // Навигация 
    class Keycodes {
        constructor() {
            this.touchY = '';
            this.touchX = '';
            this.touchTreschold = 50;
            window.addEventListener('keydown', e => {
                e.preventDefault()
                if (e.keyCode === 68) {
                    keyCodes.right.press = 1;
                    lastKey = 'right';
                } if (e.keyCode === 65) {
                    keyCodes.left.press = 1;
                    lastKey = 'left'
                } if (e.keyCode === 87) {
                    keyCodes.jump.press = 1;
                    lastKey = 'up';
                    if (!gameOver) audioJump.play();
                } if (e.keyCode === 13 && gameOver === true) {
                    restartGame();
                }
            });
            window.addEventListener('keyup', e => {
                e.preventDefault()
                if (e.keyCode === 68) {
                    keyCodes.right.press = 0;
                } if (e.keyCode === 65) {
                    keyCodes.left.press = 0;    
                } if (e.keyCode === 87) {
                    keyCodes.jump.press = 0;
                } 
            });
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY
                this.touchX = e.changedTouches[0].pageX
            });
            window.addEventListener('touchmove', e => {
                const touchSwiperY = e.changedTouches[0].pageY - this.touchX;
                const touchSwiperX = e.changedTouches[0].pageX - this.touchX;
                if (touchSwiperY < -this.touchTreschold) {
                    keyCodes.touchUp.swipe = 1
                    player.velocityY = -20;
                }
                if (touchSwiperX  < -this.touchTreschold) {
                    keyCodes.touchLeft.swipe = 1
                    player.velocityX = -5;
                }
                 if (touchSwiperY > this.touchTreschold) {
                    keyCodes.touchUp.swipe = 1;
                    player.velocityY = -20;
                }
                if (touchSwiperX > this.touchTreschold) {
                    keyCodes.touchRight.swipe = 1;
                    player.velocityX = +5;
                }
                    if (gameOver) restartGame();
                }
            );
            window.addEventListener('touchend', e => {
                console.log(keycode)
            });
        };
    }; 

    //Персонаж
    class Player {
        constructor() {
            this.width = 120;
            this.height = 183
            this.canvasHeight = CANVAS_HEIGHT;
            this.platformHeight = 200;
            this.posX = 150;
            this.posY = this.canvasHeight - this.height - this.platformHeight;
            this.gravity = 2;
            this.velocityX = 0;
            this.velocityY = 0;
            this.speed = 5;
            this.image = createImage('/src/img/stay_right.png');
            this.maxFrames = 8;
            this.frame = 0;
            this.fps = 20;
            this.timer = 0;
            this.maxLeft = 150;
            this.maxRight = 300;
            this.weight = 1;
            this.interval = 1000/this.fps;
            this.score = 0;
            this.topScore = 0;
            this.bonus = 0;
            this.sprites = {
                stay: {
                    right: createImage('/src/img/stay_right.png'),
                    left: createImage('/src/img/stay_left.png'),
                },
                run: {
                    right: createImage('/src/img/run_right.png'),
                    left: createImage('/src/img/run-left.png'),
                },
                jump: {
                    right: createImage('/src/img/jump_right.png'),
                    left: createImage('/src/img/jump_left.png'),
                },
                die: {
                    dead: createImage('/src/img/die.png')
                }
            }
    
            this.sprite = this.sprites.stay.right;
        };

        restart() {
            this.posX = 150;
            this.posY = this.canvasHeight - this.height - this.platformHeight;
        }
    
        draw(context) {
            context.drawImage(this.sprite, this.width * this.frame, 0, this.width, this.height, 
                this.posX, this.posY, this.width, this.height);
        };

        drawScore(context) {
            context.fillStyle = 'white';
            context.textAlign = 'center';
            context.fillText('Score: ' + this.score, CANVAS_WIDTH/8, 75);
            context.fillText('Coins: ' + this.bonus, CANVAS_WIDTH/8, 150);
            context.font = ('bold 48px sans-serif');
        };
    
        update(deltaTime) {
            //Плавная анимация игрока
            if(this.timer > this.interval) {
                if (this.frame >= this.maxFrames) this.frame = 0;
                else this.frame++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
    
           //Не даем провалиться ниже холста
            this.posY += this.velocityY;
            this.posX += this.velocityX;
            if (this.posY + this.height + this.velocityY <= this.canvasHeight) {
                this.velocityY += this.gravity;
            } 
    
            //Рисуем игрока
            this.draw(context);
            this.drawScore(context);
        };
    };
    
    //Платформы
    class Platform {
        constructor(posX, posY, image, block) {
            this.posX = posX;
            this.posY = posY;
            this.velocityX = 0;
            this.velocityY = 0
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.block = block;
        };

        restart() {
            this.posX = posX;
            this.posY = posY;
        }
    
        draw(context) {
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        };
    
        update() {
            this.draw(context);
            this.posX += this.velocityX;
        }
    };
    
    //Главный фон
    class BackgroundScreen {
        constructor(image, speed, width, height) {
            this.image = image;
            this.width = width;
            this.height = height;
            this.velocityX = 0;
            this.velocityY = 0
            this.posX = 0;
            this.posY = 0;
            this.speed = speed;
            this.backgroundX = 150;
        };
    
        draw(context) {
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
            context.drawImage(this.image, this.posX + this.width - this.speed, this.posY, this.width, this.height);
        };
        restart() {
            this.posX = 0;
            this.posY = 0;
        };

        update() {
            this.draw(context);
            this.posX += this.velocityX;
            if (player.posX < this.backgroundX) {
                this.posX = 0;
            }
        };
    };
    
    //Объекты фоновые
    class BackgroundItems {
        constructor(image, posX, posY) {
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.velocityX = 0;
            this.velocityY = 0
            this.posX = posX;
            this.posY = posY;
            this.speed = 2;
        }

        restart() {
            this.posX = posX;
            this.posY = posY;
        }

        draw(context) {
            context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
        };


    
        update() {
            this.draw(context);
            this.posX += this.velocityX;
        }
    };
    
    //Птица
    class EnemyBird {
        constructor(posX, posY, image) {
            this.posX = posX;
            this.posY = posY;
            this.width = 100;
            this.height = 100;
            this.spriteWidth = 90;
            this.spriteHeight = 89;
            this.image = image;
            this.speed = 5;
            this.minSpeed = 3;
            this.frame = 0;
            this.angel = 0;
            this.frames = 9;
            this.angelSpeed = Math.random() * 0.1;
        };
    
        draw() {
            context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, 
            this.spriteHeight, this.posX, this.posY, this.width, this.height);
        };
    
        update() {
            this.draw();
            this.posX -= this.minSpeed;
            this.posY += this.minSpeed * Math.sin(this.angel);
            this.angel += this.angelSpeed;
    
            if (this.frame > this.frames) {
                this.frame = 0;
            } else {
                this.frame++;
            }
        };
    };
    
    //Паук
    class EnemySpider {
        constructor(posX, posY, image) {
            this.posX = posX;
            this.posY = posY;
            this.velocityX = -1;
            this.velocityY = 0;
            this.image = image;
            this.width = 90;
            this.height = 78;
            this.gravity = 2;
            this.speed = 3;
            this.canvasHeight = CANVAS_HEIGHT;
            this.frame = 0;
            this.frames = 11;
            this.fps = 20;
            this.timer = 0;
            this.interval = 1000/this.fps;
        };
    
        draw(context) {
            context.drawImage(this.image, this.width * this.frame, 0, this.width, this.height, 
                this.posX, this.posY, this.width, this.height);
        }
    
        update(deltaTime) {
            this.draw(context);
    
            this.posX += this.velocityX
            this.posY += this.velocityY
    
            if (this.posY + this.height + this.velocityY <= this.canvasHeight) {
                this.velocityY += this.gravity;
            }
    
            if(this.timer > this.interval) {
                if (this.frame >= this.frames) this.frame = 0;
                else this.frame++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
        };
    };
    
    //Уничтожение врагов
    class Destruction {
        constructor(posX, posY, velocityX, velocityY, radius, color) {
            this.posX = posX;
            this.posY = posY;
            this.velocityX = velocityX;
            this.velocityY = velocityY;
            this.radius = radius;
            this.speed = 3;
            this.canvasHeight = CANVAS_HEIGHT;
            this.gravity = 2;
            this.color = color;
        }
    
        draw() {
            context.beginPath();
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    
        update() {
            this.draw();
            this.posX += this.velocityX;
            this.posY += this.velocityY;
    
            if (this.posY + this.radius + this.velocityY <= this.canvasHeight) {
                this.velocityY += this.gravity * 0.5;
            } 
        }
    };
    
    //Монеты
    class Coins {
        constructor(posX, posY) {
            this.posX = posX;
            this.posY = posY;
            this.velocityX = 0;
            this.velocityY = 0;
            this.width = 40;
            this.height = 36;
            this.image = createImage('/src/img/coins.png');
            this.frame = 0;
            this.frames = 5;
            this.fps = 9;
            this.timer = 0;
            this.interval = 1000/this.fps;
        };
    
        draw(context) {
            context.drawImage(this.image, this.width * this.frame, 0, this.width, this.height, 
                this.posX, this.posY, this.width, this.height);
        };

        restart() {
            this.posX = 0;
            this.posY = 0;
        }
    
        update(deltaTime) {
            this.draw(context);
            this.posX += this.velocityX
            this.posY += this.velocityY
    
            if (this.posY + this.height + this.velocityY <= this.canvasHeight) {
                this.velocityY += this.gravity;
            }
    
            if(this.timer > this.interval) {
                if (this.frame >= this.frames) this.frame = 0;
                else this.frame++;
                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
        }
    };
    let keycode = new Keycodes();
    let spiders = [];
    let player = new Player();
    let bg;
    let platforms = [];
    let backgroundObjects = [];
    let birds = [];
    let destructions = [];
    let coins = [];
    const bPlatform = createImage('/src/img/ggg.png');
    const mPlatform = createImage('/src/img/platform-1.png');
    const sPlatform = createImage('/src/img/platform-2.png');
    
    const backgroundTree =  createImage('/src/img/wd.png');
    const backgroundBush = createImage('/src/img/grass.png');
    
    const enemyBird = createImage('/src/img/crazy_bird.png');
    const enemySpider = createImage('/src/img/hairy_enemy.png');
    
    const screenBackground = createImage('/src/img/background.png');
    
    function init() {
        let screenScroll = 0;
        let score = 0;
        let kills = 0;
        let elemGap = 0;
        let elemFooter = 915;
        keycode = new Keycodes();
        player = new Player();
        bg = new BackgroundScreen(screenBackground, 1, 2048, 1024);
    
        platforms = [
            new Platform(400, 500, mPlatform, false),new Platform(1200, 400, mPlatform, false),
            new Platform(2300, 500, mPlatform, false),new Platform(3100, 400, mPlatform, false),
            new Platform(5000, 400, mPlatform, false),new Platform(6000, 300, mPlatform, false),
            new Platform(7900, 400, mPlatform, false),new Platform(9200, 300, mPlatform, false),
            new Platform(11000, 500, mPlatform, false),
    
            new Platform(900, 200, sPlatform, true),new Platform(1900, 200, sPlatform, true),
            new Platform(2100, 600, sPlatform, true),new Platform(2000, 400, sPlatform, true),
            new Platform(3800, 400, sPlatform, true),new Platform(4000, 500, sPlatform, true),
            new Platform(4200, 600, sPlatform, true),new Platform(6800, 500, sPlatform, true),
            new Platform(7000, 400, sPlatform, true),new Platform(7200, 300, sPlatform, true),
            new Platform(7400, 200, sPlatform, true),new Platform(7600, 300, sPlatform, true),
            new Platform(8600, 300, sPlatform, true),new Platform(8800, 400, sPlatform, true),
            new Platform(9000, 200, sPlatform, true),new Platform(10000, 600, sPlatform, true),
            new Platform(10200, 500, sPlatform, true),new Platform(10400, 400, sPlatform, true),
            new Platform(10600, 300, sPlatform, true),new Platform(10800, 200, sPlatform, true), 
        ];
        const platformsMap = [
            'b', 'e', 'b', 'b', 'e', 'b', 'e', 'b', 'e', 'b'
        ];
    
        platformsMap.forEach(elem => {
            if(elem = 'b') {
                platforms.push(new Platform(elemGap, elemFooter, bPlatform, true))
                elemGap += bPlatform.width;
            } if (elem === 'e') {
                elemGap += 200;
            }
        });
        backgroundObjects = [
            new BackgroundItems(backgroundTree, 300, 700),
            new BackgroundItems(backgroundTree, 900, 500),
            new BackgroundItems(backgroundTree, 0, 500),
            new BackgroundItems(backgroundTree, 300, 500),
            new BackgroundItems(backgroundTree, 1200, 500),
            new BackgroundItems(backgroundTree, 1500, 700),
            new BackgroundItems(backgroundBush, 2000, 800),
            new BackgroundItems(backgroundBush, 2100, 800),
            new BackgroundItems(backgroundBush, 2200, 800),
            new BackgroundItems(backgroundBush, 2300, 800),
            new BackgroundItems(backgroundBush, 2400, 800),
            new BackgroundItems(backgroundBush, 2500, 800),
            new BackgroundItems(backgroundBush, 2600, 800),
            new BackgroundItems(backgroundBush, 2700, 800),
            new BackgroundItems(backgroundBush, 2800, 800),
            new BackgroundItems(backgroundBush, 2900, 800),
            new BackgroundItems(backgroundTree, 3000, 500),
            new BackgroundItems(backgroundTree, 3200, 500),
            new BackgroundItems(backgroundTree, 3500, 500),
            new BackgroundItems(backgroundTree, 3600, 500),
            new BackgroundItems(backgroundBush, 3800, 800),
            new BackgroundItems(backgroundBush, 2900, 800),
            new BackgroundItems(backgroundBush, 4000, 800),
            new BackgroundItems(backgroundBush, 4100, 800),
            new BackgroundItems(backgroundBush, 4200, 800),
            new BackgroundItems(backgroundBush, 4300, 800),
            new BackgroundItems(backgroundBush, 4400, 800),
        ];
        birds = [
            new EnemyBird(600, 150, enemyBird),
            new EnemyBird(2000, 200, enemyBird),
            new EnemyBird(2250, 250, enemyBird),
            new EnemyBird(2500, 200, enemyBird),
            new EnemyBird(3000, 200, enemyBird),
            new EnemyBird(3300, 250, enemyBird),
            new EnemyBird(3500, 300, enemyBird),
            new EnemyBird(4400, 350, enemyBird),
            new EnemyBird(4900, 350, enemyBird),
            new EnemyBird(5500, 250, enemyBird),
            new EnemyBird(6000, 250, enemyBird),
            new EnemyBird(6500, 100, enemyBird),
            new EnemyBird(6500, 300, enemyBird),
            new EnemyBird(7000, 100, enemyBird),
            new EnemyBird(7500, 100, enemyBird),
            new EnemyBird(8000, 200, enemyBird),
            new EnemyBird(8500, 200, enemyBird),
            new EnemyBird(9000, 100, enemyBird),
            new EnemyBird(9500, 150, enemyBird),
            new EnemyBird(10000, 150, enemyBird),
            new EnemyBird(11000, 300, enemyBird),
            new EnemyBird(11500, 300, enemyBird),
            new EnemyBird(12000, 150, enemyBird),
            new EnemyBird(12500, 250, enemyBird),
            new EnemyBird(13500, 150, enemyBird),
            new EnemyBird(13500, 300, enemyBird),
            new EnemyBird(14000, 100, enemyBird),
            new EnemyBird(15000, 200, enemyBird),
            new EnemyBird(15500, 200, enemyBird),
            new EnemyBird(16000, 100, enemyBird),
            new EnemyBird(16500, 100, enemyBird),
            new EnemyBird(17000, 100, enemyBird),
            new EnemyBird(17200, 300, enemyBird),
            new EnemyBird(17500, 200, enemyBird),
        ];
        coins = [
            new Coins(200, 500),new Coins(250, 400),new Coins(300, 300),new Coins(350, 400),
            new Coins(400, 400),new Coins(450, 400),new Coins(500, 400),new Coins(550, 400),
            new Coins(800, 300),new Coins(850, 150),new Coins(925, 100),new Coins(1100, 400),
            new Coins(1200, 500),new Coins(1500, 300),new Coins(1550, 300),new Coins(1600, 250),
            new Coins(1650, 250),new Coins(1935, 150),new Coins(2035, 350),new Coins(2135, 550),
            new Coins(2500, 850),new Coins(2550, 850),new Coins(2600, 850),new Coins(2650, 850),
            new Coins(2700, 850),new Coins(2750, 850),new Coins(3300, 100),new Coins(3350, 100),
            new Coins(3400, 100),new Coins(3450, 100),new Coins(3500, 100),new Coins(3550, 100),
            new Coins(3835, 500),new Coins(4035, 600),new Coins(4235, 700),new Coins(4600, 100),
            new Coins(4600, 150),new Coins(4600, 200),new Coins(4600, 250),new Coins(4600, 300),
            new Coins(4600, 350),new Coins(4600, 400),new Coins(5000, 500),new Coins(5050, 500),
            new Coins(5100, 500),new Coins(5150, 500),new Coins(5200, 500),new Coins(5250, 500),
            new Coins(5000, 300),new Coins(5050, 300),new Coins(5100, 300),new Coins(5150, 300),
            new Coins(5200, 500),new Coins(6200, 200),new Coins(6250, 200),new Coins(6300, 200),
            new Coins(6350, 200),new Coins(6400, 200),new Coins(6450, 200),new Coins(6850, 300),
            new Coins(7050, 350),new Coins(7250, 400),new Coins(7450, 450),new Coins(7650, 400),
            new Coins(7850, 500),new Coins(7450, 50),new Coins(7450, 100),new Coins(7450, 150),
            new Coins(8000, 300),new Coins(8050, 300),new Coins(8100, 300),new Coins(8150, 300),
            new Coins(8900, 850),new Coins(8950, 850),new Coins(9000, 850),new Coins(9050, 850),
            new Coins(9100, 850),new Coins(9150, 800),new Coins(9200, 750),new Coins(9250, 700),
            new Coins(9500, 200),new Coins(9550, 200),new Coins(9600, 200),new Coins(9650, 200),
            new Coins(9700, 200),new Coins(9750, 200),new Coins(9800, 200),new Coins(9200, 100),
            new Coins(9250, 100),new Coins(9350, 100),new Coins(9400, 100),new Coins(9450, 100),
            new Coins(10040, 500),new Coins(10240, 400),new Coins(10440, 300),new Coins(10640, 200),
            new Coins(10840, 100),new Coins(11000, 400),new Coins(11100, 400),new Coins(11500, 400),
            new Coins(11200, 400),new Coins(11300, 400),new Coins(11400, 400),new Coins(11600, 400),
        ];
        spiders = [
            new EnemySpider(800, 100, enemySpider),new EnemySpider(1100, 100, enemySpider),new EnemySpider(1300, 100, enemySpider),
            new EnemySpider(3100, 100, enemySpider),new EnemySpider(3890, 100, enemySpider),new EnemySpider(4100, 100, enemySpider),
            new EnemySpider(4200, 100, enemySpider),new EnemySpider(4300, 100, enemySpider),new EnemySpider(4400, 100, enemySpider),
            new EnemySpider(4900, 100, enemySpider),new EnemySpider(5200, 100, enemySpider),new EnemySpider(6000, 100, enemySpider),
            new EnemySpider(6500, 100, enemySpider),new EnemySpider(7000, 100, enemySpider),new EnemySpider(7500, 100, enemySpider),
            new EnemySpider(7900, 100, enemySpider),new EnemySpider(8000, 100, enemySpider),new EnemySpider(11000, 100, enemySpider),
            new EnemySpider(8500, 100, enemySpider),new EnemySpider(8700, 100, enemySpider),new EnemySpider(11500, 100, enemySpider),
            new EnemySpider(9700, 100, enemySpider),new EnemySpider(9000, 100, enemySpider),new EnemySpider(12900, 100, enemySpider),
            new EnemySpider(9800, 100, enemySpider),new EnemySpider(10000, 100, enemySpider),new EnemySpider(10500, 100, enemySpider),
            new EnemySpider(12900, 100, enemySpider),new EnemySpider(11800, 100, enemySpider),new EnemySpider(12500, 100, enemySpider),
            new EnemySpider(13000, 100, enemySpider),new EnemySpider(13500, 100, enemySpider),new EnemySpider(13900, 100, enemySpider),
            new EnemySpider(14500, 100, enemySpider),new EnemySpider(15500, 100, enemySpider),
        ];
    };
    function animateGame(newTime) {
        
        const deltaTime = newTime - lastTime;
        lastTime = newTime;
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
        bg.update();
        bg.velocityX = 0;
        backgroundObjects.forEach((objectBackground) => {
            objectBackground.update();
            objectBackground.velocityX = 0;
        });
        platforms.forEach((platform) => {
            platform.update();
            platform.velocityX = 0;
        });
        spiders.forEach((spider, spiderIndex) => {
            spider.update(deltaTime);
            if (collisionTop(player, spider)) {
                for (let i = 0; i < 50; i++) {
                    destructions.push(new Destruction(spider.posX + spider.width/2,
                    spider.posY + spider.height/2, 
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    Math.random() * 3, '#808000'))
                }
                audioDamage.play();
                player.score += 250;
                player.velocityY -= 70;
                setTimeout(() => {
                    spiders.splice(spiderIndex, 1)
                }, 0) 
            } else if (player.posX + player.width >= spider.posX &&
                player.posY + player.height >= spider.posY &&
                player.posX <= spider.posX + spider.width &&
                player.posY <= spider.posY + spider.height) {
                    audioDie.play();
                    auidoLevel.pause();
                    audioJump.pause();
                    gameOver = true;
                    vibrate(1000);
                    init();
            } 
        });
        birds.forEach((bird, birdIndex) => {
            bird.update(deltaTime);
            if (collisionBottom(player, bird)) {
                for (let i = 0; i < 50; i++) {
                    destructions.push(new Destruction(bird.posX + bird.width/2,
                    bird.posY + bird.height/2, 
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    Math.random() * 3, '#4682B4'))
                }
                audioDamage.play();
                player.score += 250;
                player.velocityY += 20;
                setTimeout(() => {
                    birds.splice(birdIndex, 1)
                }, 0) 
            } else if (player.posX + player.width >= bird.posX &&
                player.posY + player.height >= bird.posY &&
                player.posX <= bird.posX + bird.width &&
                player.posY <= bird.posY + bird.height) {
                    audioDie.play();
                    audioJump.pause();
                    auidoLevel.pause();
                    gameOver = true;
                    vibrate(1000);
                    init();
            } 
        });
    
        platforms.forEach((platform) => {
            if (keyCodes.jump.press && player.velocityY === 0) {
                player.velocityY = -37;
            } 
            if (collisionTop(player, platform)) {
                player.velocityY = 0;
            }
            
            if (platform.block && collisionBottom(player, platform)) {
                audioBrick.play();
                player.velocityY = -5;
            }
    
            if (platform.block && collisionSide(player, platform)) {
                player.velocityX = 0;
            }
    
            destructions.forEach((destruction, dIndex) => {
                if(collisionTopCircle(destruction, platform)) {
                    destruction.velocityY = -destruction.velocityY * 0.7;
                    if(destruction.radius - 0.4 < 0) {
                        destructions.splice(dIndex, 1);  
                    } else {
                        destruction.radius -= 0.4;
                    }
                }
                if(destruction.ttl < 0) {
                    destructions.splice(dIndex, 1)
                }
            });
             
            spiders.forEach(spider => {
                if(collisionTop(spider, platform)) {
                    spider.velocityY = 0;
                }
            });
        });

        coins.forEach((coin, i) => {
            if (collisionCoins(player, coin)) {
                audioCoin.play();
                player.bonus++;
                player.score += 50;
                setTimeout(() => {
                    coins.splice(i, 1);
                }, 0)
            } else {
                coin.update(deltaTime); 
            }
        });
    
        destructions.forEach((destruction, dIndex) => {
            destruction.update();
            if (destruction.posX - destruction.radius >= CANVAS_WIDTH ||
                destruction.posX + destruction.radius <= 0) {
                setTimeout(() => {
                    destructions.splice(dIndex, 1)
                }, 0)
            }
        })
        player.update(deltaTime);
        
        detected();
        scrollEffects();
        inputPlayer();
        statusGame(context);
        if (gameOver === false) {
            requestAnimationFrame(animateGame);
        } 
    };
    init();
    animateGame(0);
})

   
    
    
    





