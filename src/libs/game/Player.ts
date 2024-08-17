import { GameObject } from "./GameObject";

export class Player extends GameObject {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    super(x, y, width, height, color);
  }

  update(
    keys: { left: boolean; right: boolean; up: boolean; down: boolean },
    speed: number
  ) {
    if (keys.left) {
      this.x -= speed;
    }
    if (keys.right) {
      this.x += speed;
    }
    if (keys.up) {
      this.y -= speed;
    }
    if (keys.down) {
      this.y += speed;
    }
  }
}
