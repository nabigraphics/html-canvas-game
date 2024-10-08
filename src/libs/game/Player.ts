import { GameObject } from "./GameObject";
import { InputManager } from "./InputManager";

export class Player extends GameObject {
  // TODO: 생성자에서 InputManager를 주입 받을지 고민
  private inputManager: InputManager = new InputManager();
  private speed: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    speed: number
  ) {
    super(x, y, width, height, color);

    this.speed = speed;
  }

  update(deltaTime: number) {
    if (this.inputManager.isKeyDown("ArrowLeft")) {
      this.x -= this.speed;
    }
    if (this.inputManager.isKeyDown("ArrowRight")) {
      this.x += this.speed;
    }
    if (this.inputManager.isKeyDown("ArrowUp")) {
      this.y -= this.speed;
    }
    if (this.inputManager.isKeyDown("ArrowDown")) {
      this.y += this.speed;
    }
  }

  destroy() {
    this.inputManager.destroy();
  }
}
