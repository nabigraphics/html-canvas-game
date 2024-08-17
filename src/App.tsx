import { useEffect, useRef } from "react";

import styles from "./App.module.css";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = 800;
    canvas.height = 600;

    let x = 0;
    let y = 0;
    const speed = 5;

    const keys = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    const abort = new AbortController();

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "ArrowLeft") {
          keys.left = true;
        }
        if (e.key === "ArrowRight") {
          keys.right = true;
        }
        if (e.key === "ArrowUp") {
          keys.up = true;
        }
        if (e.key === "ArrowDown") {
          keys.down = true;
        }
      },
      { signal: abort.signal }
    );

    document.addEventListener(
      "keyup",
      (e) => {
        if (e.key === "ArrowLeft") {
          keys.left = false;
        }
        if (e.key === "ArrowRight") {
          keys.right = false;
        }
        if (e.key === "ArrowUp") {
          keys.up = false;
        }
        if (e.key === "ArrowDown") {
          keys.down = false;
        }
      },
      {
        signal: abort.signal,
      }
    );

    function loop() {
      requestAnimationFrame(loop);

      // 캔버스 초기화 (배경을 검정색으로 채우기)
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 키보드 입력에 따라 x, y 좌표 변경
      if (keys.left) x -= speed;
      if (keys.right) x += speed;
      if (keys.up) y -= speed;
      if (keys.down) y += speed;

      // 사각형 그리기
      ctx.fillStyle = "#f00";
      ctx.fillRect(x, y, 50, 50);
    }

    loop();

    return () => {
      // cleanup
      abort.abort();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
