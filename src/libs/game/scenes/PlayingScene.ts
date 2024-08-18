import { Enemy } from "../Enemy";
import { GameEngine } from "../GameEngine";
import { Player } from "../Player";
import { Scene } from "../Scene";
import { clearCanvas } from "../utils/clearCanvas";

import { GameOverScene } from "./GameOverScene";

export class PlayingScene extends Scene {
  private canvas: HTMLCanvasElement;

  player: Player = new Player(100, 100, 50, 50, "#0f0", 5);
  enemies: Enemy[] = [];

  score: number = 0;
  level: number = 1;
  enemySpeed: number = 1;

  constructor(engine: GameEngine) {
    super(engine);
    this.canvas = this.engine.getCanvas();
  }

  enter() {
    this.initEnemies();
  }

  exit() {
    this.player.destroy();
    this.enemies.forEach((enemy) => {
      enemy.destroy();
    });
  }

  update(deltaTime: number) {
    // 적의 속도를 레벨에 따라 증가
    if (this.score % 500 === 0 && this.score > 0) {
      this.increaseDifficulty();
    }

    this.player.update(deltaTime);
    this.enemies.forEach((enemy) => {
      enemy.update();

      if (this.player.isCollide(enemy)) {
        // gameover
        this.engine.changeScene(new GameOverScene(this.engine, this.score));
      }
    });

    this.score += 1;
  }

  render(ctx: CanvasRenderingContext2D) {
    clearCanvas(ctx, this.canvas);

    this.player.render(ctx);
    this.enemies.forEach((enemy) => {
      enemy.render(ctx);
    });

    this.drawScore(ctx);
  }

  initEnemies() {
    if (this.enemies.length > 0) {
      this.enemies.forEach((enemy) => {
        enemy.destroy();
      });
    }

    this.enemies = [];

    for (let i = 0; i < 5; i++) {
      const enemy = new Enemy(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        50,
        50,
        "#f00",
        1,
        this.canvas
      );
      this.enemies.push(enemy);
    }
  }

  increaseDifficulty() {
    this.level += 1;
    this.enemySpeed += 0.5;

    this.enemies.forEach((enemy) => {
      enemy.setSpeed(this.enemySpeed);
    });

    for (let i = 0; i < this.level; i++) {
      this.enemies.push(
        new Enemy(
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height,
          50,
          50,
          "#f00",
          this.enemySpeed,
          this.canvas
        )
      );
    }
  }

  drawScore(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#fff";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${this.score}`, 10, 30);
  }
}
