export class InputManager {
  private keys: { [key: string]: boolean } = {};

  constructor() {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(event: KeyboardEvent) {
    this.keys[event.code] = true;
  }

  onKeyUp(event: KeyboardEvent) {
    this.keys[event.code] = false;
  }

  isKeyDown(key: string) {
    return this.keys[key] || false;
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
}
