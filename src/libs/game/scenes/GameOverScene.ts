import { GameEngine } from "../GameEngine";
import { InputManager } from "../InputManager";
import { Scene } from "../Scene";

import { PlayingScene } from "./PlayingScene";

export class GameOverScene extends Scene {
  private inputManager: InputManager = new InputManager();
  private finalScore: number;
  private canvas: HTMLCanvasElement;

  constructor(engine: GameEngine, finalScore: number) {
    super(engine);

    this.canvas = this.engine.getCanvas();
    this.finalScore = finalScore;
  }

  exit() {
    this.inputManager.destroy();
  }

  update(deltaTime: number) {
    if (this.inputManager.isKeyDown("Enter")) {
      this.engine.changeScene(new PlayingScene(this.engine));
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // 캔버스 초기화 (배경을 검정색으로 채우기)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "#fff";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Game Over",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );
    ctx.font = "16px sans-serif";
    ctx.fillText(
      `Score: ${this.finalScore}`,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    ctx.font = "24px sans-serif";
    ctx.fillText(
      "Press Enter to Restart",
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }
}
