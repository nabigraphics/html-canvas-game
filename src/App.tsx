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

    type Entity = {
      x: number;
      y: number;
      width: number;
      height: number;
    };

    let player: Entity = { x: 100, y: 100, width: 50, height: 50 };
    let enemy: Entity = { x: 300, y: 300, width: 50, height: 50 };
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

      // 플레이어 이동
      if (keys.left) player.x -= speed;
      if (keys.right) player.x += speed;
      if (keys.up) player.y -= speed;
      if (keys.down) player.y += speed;

      if (checkCollision(player, enemy)) {
        ctx.fillStyle = "#0f0";
      } else {
        ctx.fillStyle = "#f00";
      }

      // 플레이어 그리기
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // 적 그리기
      ctx.fillStyle = "#00f";
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    loop();

    function checkCollision(a: Entity, b: Entity) {
      // AABB 충돌 검사
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    }

    return () => {
      // cleanup
      abort.abort();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
