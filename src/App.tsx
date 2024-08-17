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

    function loop() {
      requestAnimationFrame(loop);

      // 캔버스 초기화 (배경을 검정색으로 채우기)
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 사각형 그리기
      ctx.fillStyle = "#f00";
      ctx.fillRect(x, 100, 50, 50);

      x += 2;

      if (x > canvas.width) {
        x = 0;
      }
    }

    loop();
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
