let player;
let bullets = [];
let enemies = [];
let score = 0;
let gameTimer = 60; // 游戲時間，單位為秒

function setup() {
  createCanvas(400, 400);
  player = new Player();
  
  // 創建敵人
  for (let i = 0; i < 30; i++) {
    enemies.push(new Enemy());
  }
  
  // 設置倒計時
  setInterval(countdown, 1000);
}

function draw() {
  background(220);
  
  player.update();
  player.display();
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();
    
    // 檢查子彈是否擊中敵人
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(enemies[j])) {
        score += 10; // 擊中敵人得分
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        break;
      }
    }
    if (gameTimer <= 0 && enemies.length > 0) {
      gameOver(); // 游戏时间结束
    } else if (enemies.length === 0) {
      gameWin(); // 获得胜利
    }
  
    // 檢查子彈是否超出屏幕
    if (bullets[i] && bullets[i].offscreen()) {
      bullets.splice(i, 1);
    }
  }
  
  // 更新並顯示敵人
  for (let enemy of enemies) {
    enemy.update();
    enemy.display();
    
    // 檢查敵人是否碰到玩家
    if (enemy.hits(player)) {
      gameOver(); // 游戲結束
    }
  }
  
  // 顯示得分和剩餘時間
  fill(0);
  textSize(20);
  text("Score: " + score, 10, 30);
  let remainingTime = gameTimer - Math.floor(frameCount / 60);
  text("Time: " + remainingTime, width - 100, 30);
  
  // 檢查游戲時間是否到達
  if (remainingTime <= 0) {
    gameOver(); // 游戲結束
  }
  function gameWin() {
    fill(0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("You Win!", width / 2, height / 2);
    noLoop();
  }
  // 控制玩家移動
  if (keyIsDown(LEFT_ARROW)) {
    player.move(-1, 0);
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.move(1, 0);
  } else if (keyIsDown(UP_ARROW)) {
    player.move(0, -1);
  } else if (keyIsDown(DOWN_ARROW)) {
    player.move(0, 1);
  }
}

function keyPressed() {
  if (keyCode === 32) { // 空格鍵射擊子彈
    bullets.push(new Bullet(player.x, player.y));
  }
}

function countdown() {
  gameTimer--;
}

function gameOver() {
  noLoop(); // 停止游戲循環
  fill(255, 0, 0);
  textSize(30);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2);
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.speed = 5;
    this.size = 20;
  }
  
  update() {
    // 添加額外的更新邏輯
  }
  
  display() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  move(x, y) {
    let newX = this.x + x * this.speed;
    let newY = this.y + y * this.speed;
    
    // 限制玩家移動範圍在屏幕內
    if (newX >= 0 && newX <= width) {
      this.x = newX;
    }
    if (newY >= 0 && newY <= height) {
      this.y = newY;
    }
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 8;
    this.size = 10;
  }
  
  update() {
    this.y -= this.speed;
  }
  
  display() {
    fill(0, 0, 255);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  offscreen() {
    return this.y < 0;
  }
  
  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < this.size / 2 + enemy.size / 2;
  }
}

class Enemy {
  constructor() {
    this.x = random(width);
    this.y = random(height / 2);
    this.speed = random(1, 3);
    this.size = random(20, 40);
  }
  
  update() {
    this.y += this.speed;
    
    // 敵人超出屏幕底部時重新生成
    if (this.y > height) {
      this.x = random(width);
      this.y = random(-200, -100);
      this.speed = random(1, 3);
      this.size = random(20, 40);
    }
  }
  
  display() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }
  
  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < this.size / 2 + player.size / 2;
  }
}