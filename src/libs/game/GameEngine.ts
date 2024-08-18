import { GameObject } from "./GameObject";
import { Ticker } from "./Ticker";

export interface GameEngineConfig {
  canvas: HTMLCanvasElement;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  objects: GameObject[] = [];
  ticker: Ticker = new Ticker();

  constructor(config: GameEngineConfig) {
    this.canvas = config.canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas.width = 800;
    this.canvas.height = 600;
  }

  addChild(obj: GameObject) {
    this.objects.push(obj);

    // 게임 오브젝트가 생성될 때마다 ticker에 추가
    this.ticker.add((deltaTime: number) => obj.update(deltaTime));
  }

  removeChild(obj: GameObject) {
    const index = this.objects.indexOf(obj);
    if (index > -1) {
      this.objects[index].destory();
      this.objects.splice(index, 1);
    }
  }

  // 게임 루프
  run() {
    this.ticker.add(() => this.render());
    this.ticker.start();
  }

  // 화면 렌더링
  render() {
    // 캔버스 초기화 (배경을 검정색으로 채우기)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.objects.forEach((obj) => obj.draw(this.ctx));
  }

  // destroy
  destroy() {
    this.ticker.stop();

    this.objects.forEach((obj) => obj.destory());
    this.objects = [];
  }
}
