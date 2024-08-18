import { GameObject } from "./GameObject";

export class Enemy extends GameObject {
  private speed: number;
  private canvas: HTMLCanvasElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    speed: number,
    canvas: HTMLCanvasElement
  ) {
    super(x, y, width, height, color);

    this.speed = speed;
    this.canvas = canvas;
  }

  update() {
    this.x += Math.random() * this.speed - this.speed / 2;
    this.y += Math.random() * this.speed - this.speed / 2;

    // 화면 경계를 넘지 않도록 조정
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > this.canvas.width)
      this.x = this.canvas.width - this.width;
    if (this.y + this.height > this.canvas.height)
      this.y = this.canvas.height - this.height;
  }

  destroy() {}

  setSpeed(speed: number) {
    this.speed = speed;
  }
}
