/*
  Ticker deltaTime 참고자료: https://blog.naver.com/oh-mms/222126025440
*/

export class Ticker {
  private listeners: Array<(deltaTime: number) => void> = [];
  private lastTime: number = 0;
  private isRunning: boolean = false;

  add(listner: (deltaTime: number) => void) {
    this.listeners.push(listner);
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    const tick = (currentTime: number) => {
      if (!this.isRunning) return;
      const deltaTime = (currentTime - this.lastTime) / 1000; // 초 단위로 변환

      this.lastTime = currentTime;
      this.listeners.forEach((listener) => listener(deltaTime));

      requestAnimationFrame(tick);
    };

    tick(this.lastTime);
  }

  stop() {
    this.isRunning = false;
  }
}
