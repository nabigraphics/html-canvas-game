import { useEffect, useRef } from "react";

import styles from "./App.module.css";
import { Player } from "./libs/game/Player";
import { Enemy } from "./libs/game/Enemy";

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

    let player = new Player(100, 100, 50, 50, "#0f0");

    let enemies: Enemy[] = [];

    for (let i = 0; i < 10; i++) {
      enemies.push(
        new Enemy(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          50,
          50,
          "#00f"
        )
      );
    }

    const speed = 5;
    let score = 0;

    const keys = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    let gameState: "menu" | "playing" | "gameOver" = "menu";

    const abort = new AbortController();

    function loop() {
      requestAnimationFrame(loop);

      // 캔버스 초기화 (배경을 검정색으로 채우기)
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === "menu") {
        menu();
      } else if (gameState === "playing") {
        playing();
      } else if (gameState === "gameOver") {
        gameOver();
      }
    }

    // RUN
    startMenu();
    loop();

    function handleEnterKey(e: KeyboardEvent) {
      if (e.key === "Enter") {
        startPlaying();
      }
    }

    function handlePlayingKeys(e: KeyboardEvent) {
      if (e.type === "keydown") {
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
      } else if (e.type === "keyup") {
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
      }
    }

    function startMenu() {
      gameState = "menu";
      document.addEventListener("keydown", handleEnterKey, {
        signal: abort.signal,
      });
    }

    function startPlaying() {
      gameState = "playing";
      document.removeEventListener("keydown", handleEnterKey);
      document.addEventListener("keydown", handlePlayingKeys, {
        signal: abort.signal,
      });
      document.addEventListener("keyup", handlePlayingKeys, {
        signal: abort.signal,
      });
    }

    function menu() {
      ctx.fillStyle = "#fff";
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);
    }

    function playing() {
      // 플레이어 업데이트 및 그리기
      player.update(keys, speed);
      player.draw(ctx);

      // 적 업데이트 및 그리기
      enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw(ctx);

        if (player.isCollide(enemy)) {
          enemy.color = "#f00";
          gameState = "gameOver";
        }
      });

      // 점수 그리기
      drawScore();

      score += 1;
    }

    function gameOver() {
      ctx.fillStyle = "#fff";
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
      ctx.font = "24px sans-serif";
      ctx.fillText(
        "Press Enter to Restart",
        canvas.width / 2,
        canvas.height / 2 + 50
      );

      document.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter") {
            resetGame();
          }
        },
        {
          signal: abort.signal,
          once: true,
        }
      );
    }

    function drawScore() {
      ctx.fillStyle = "#fff";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function resetGame() {
      score = 0;
      player.x = 100;
      player.y = 100;

      enemies.forEach((enemy) => {
        enemy.x = Math.random() * canvas.width;
        enemy.y = Math.random() * canvas.height;
        enemy.color = "#00f";
      });

      startPlaying();
    }

    return () => {
      // cleanup
      abort.abort();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
