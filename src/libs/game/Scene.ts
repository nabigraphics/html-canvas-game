import { GameEngine } from "./GameEngine";

export class Scene {
  engine: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  enter() {}

  exit() {}

  update(deltaTime: number) {}

  render(ctx: CanvasRenderingContext2D) {}
}
