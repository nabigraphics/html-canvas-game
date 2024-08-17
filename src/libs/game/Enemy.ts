import { GameObject } from "./GameObject";

export class Enemy extends GameObject {
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    super(x, y, width, height, color);
  }

  update() {}
}
