import { Scene } from "./Scene";
import { Ticker } from "./Ticker";

export interface GameEngineConfig {
  canvas: HTMLCanvasElement;
  defaultScene?: Scene;
}

export type GameEngineCurrentState = "running" | "paused" | "stopped";

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ticker: Ticker = new Ticker();
  private currentScene: Scene | null;
  private currentState: GameEngineCurrentState = "stopped";

  constructor(config: GameEngineConfig) {
    this.canvas = config.canvas;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.canvas.width = 800;
    this.canvas.height = 600;

    this.currentScene = config.defaultScene ?? null;

    if (this.currentScene) {
      this.currentScene.enter();
    }
  }

  // 게임 루프
  run() {
    if (this.currentState === "running" || this.currentState === "paused") {
      return;
    }

    this.currentState = "running";
    this.ticker.add((deltaTime: number) => this.update(deltaTime));
    this.ticker.add(() => this.render());
    this.ticker.start();
  }

  // 일시정지
  pause() {
    if (this.currentState !== "running") {
      return;
    }
    this.currentState = "paused";
    this.ticker.stop();
  }

  // 재개
  resume() {
    if (this.currentState !== "paused") {
      return;
    }
    this.currentState = "running";
    this.ticker.start();
  }

  stop() {
    if (this.currentState === "stopped") {
      return;
    }
    this.currentState = "stopped";
    this.ticker.stop();
    if (this.currentScene) {
      this.currentScene.exit();
    }
  }

  private update(deltaTime: number) {
    if (this.currentState === "running" && this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  // 화면 렌더링
  private render() {
    if (this.currentState === "running" && this.currentScene) {
      this.currentScene.render(this.ctx);
    }
  }

  // destroy
  destroy() {
    this.stop();
    this.currentScene = null;
  }

  changeScene(scene: Scene) {
    if (this.currentScene) {
      this.currentScene.exit();
    }

    this.currentScene = scene;
    this.currentScene.enter();
  }

  getCanvas() {
    return this.canvas;
  }
}
