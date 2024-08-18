import { Scene } from "./Scene";
import { Ticker } from "./Ticker";

export interface GameEngineConfig {
  canvas: HTMLCanvasElement;
  defaultScene?: Scene;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ticker: Ticker = new Ticker();
  private currentScene?: Scene;

  constructor(config: GameEngineConfig) {
    this.canvas = config.canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.currentScene = config.defaultScene;

    if (this.currentScene) {
      this.currentScene.enter();
    }
  }

  changeScene(scene: Scene) {
    if (this.currentScene) {
      this.currentScene.exit();
    }

    this.currentScene = scene;
    this.currentScene.enter();
  }

  // 게임 루프
  run() {
    this.ticker.add((deltaTime: number) => this.update(deltaTime));
    this.ticker.add(() => this.render());
    this.ticker.start();
  }

  update(deltaTime: number) {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  // 화면 렌더링
  render() {
    if (this.currentScene) {
      this.currentScene.render(this.ctx);
    }
  }

  // destroy
  destroy() {
    this.ticker.stop();

    if (this.currentScene) {
      this.currentScene.exit();
    }
  }

  getCanvas() {
    return this.canvas;
  }

  getCurrentScene() {
    return this.currentScene;
  }
}
