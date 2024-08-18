import { GameEngine } from "../GameEngine";
import { InputManager } from "../InputManager";
import { Scene } from "../Scene";
import { clearCanvas } from "../utils/clearCanvas";

import { PlayingScene } from "./PlayingScene";

export class MenuScene extends Scene {
  private inputManager: InputManager = new InputManager();
  private canvas: HTMLCanvasElement;

  constructor(engine: GameEngine) {
    super(engine);
    this.canvas = this.engine.getCanvas();
  }

  enter() {}

  exit() {
    this.inputManager.destroy();
  }

  update(deltaTime: number) {
    if (this.inputManager.isKeyDown("Enter")) {
      this.engine.changeScene(new PlayingScene(this.engine));
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    clearCanvas(ctx, this.canvas);

    ctx.fillStyle = "#fff";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "Press Enter to Start",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }
}
