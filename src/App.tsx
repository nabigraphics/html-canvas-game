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

    const speed = 5;
    let score = 0;
    let level = 1;
    let enemySpeed = 1;

    let player = new Player(100, 100, 50, 50, "#0f0");
    let enemies: Enemy[] = [];

    initEnemies();

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

    // 초기 메뉴 화면 표시
    startMenu();
    // 게임 루프 시작
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

    function startGameOver() {
      gameState = "gameOver";
      document.removeEventListener("keydown", handlePlayingKeys);
      document.removeEventListener("keyup", handlePlayingKeys);
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

    function menu() {
      ctx.fillStyle = "#fff";
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);
    }

    function playing() {
      // 적의 속도를 레벨에 따라 증가
      if (score % 500 === 0 && score > 0) {
        increaseDifficulty();
      }

      // 플레이어 업데이트 및 그리기
      player.update(keys, speed);
      player.draw(ctx);

      // 적 업데이트 및 그리기
      enemies.forEach((enemy) => {
        enemy.update();
        enemy.draw(ctx);

        if (player.isCollide(enemy)) {
          enemy.color = "#f00";
          startGameOver();
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
    }

    function increaseDifficulty() {
      level += 1;
      enemySpeed += 0.5;

      enemies.forEach((enemy) => {
        enemy.setSpeed(enemySpeed);
      });

      for (let i = 0; i < level; i++) {
        enemies.push(
          new Enemy(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            50,
            50,
            "#00f",
            enemySpeed,
            canvas
          )
        );
      }
    }

    function drawScore() {
      ctx.fillStyle = "#fff";
      ctx.font = "24px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score}`, 10, 30);
    }

    function resetGame() {
      score = 0;
      level = 1;
      enemySpeed = 1;

      player.x = 100;
      player.y = 100;

      enemies = [];
      initEnemies();

      startPlaying();
    }

    function initEnemies() {
      for (let i = 0; i < 5; i++) {
        enemies.push(
          new Enemy(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            50,
            50,
            "#00f",
            enemySpeed,
            canvas
          )
        );
      }
    }

    return () => {
      // cleanup
      abort.abort();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
