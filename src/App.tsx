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
      color: string;
      frame: number;
    };

    let player: Entity = {
      x: 100,
      y: 100,
      width: 50,
      height: 50,
      color: "#f00",
      frame: 0,
    };
    let enemies: Entity[] = [];

    for (let i = 0; i < 10; i++) {
      enemies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50,
        color: "#00f",
        frame: 0,
      });
    }

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

      enemies.forEach((enemy) => {
        if (checkCollision(player, enemy)) {
          enemy.color = "#f00";
        } else {
          enemy.color = "#00f";
        }

        // 적 그리기
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      // 애니메이션 프레임 업데이트
      player.frame += 1;
      if (player.frame % 20 < 10) {
        player.color = "#f00";
      } else {
        player.color = "#ff0";
      }

      // 플레이어 그리기
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
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
