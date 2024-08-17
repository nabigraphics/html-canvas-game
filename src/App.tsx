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

    const keys = {
      left: false,
      right: false,
      up: false,
      down: false,
    };

    let gameState = "menu";

    let isEventListnerAdded = false;

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
      }

      function menu() {
        ctx.fillStyle = "#fff";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          "Press Enter to Start",
          canvas.width / 2,
          canvas.height / 2
        );

        if (!isEventListnerAdded) {
          document.addEventListener("keydown", handleEnterKey, {
            signal: abort.signal,
          });
          isEventListnerAdded = true;
        }
      }

      function playing() {
        player.update(keys, speed);
        player.draw(ctx);

        enemies.forEach((enemy) => {
          if (player.isCollide(enemy)) {
            enemy.color = "#f00";
          } else {
            enemy.color = "#00f";
          }

          enemy.update();
          enemy.draw(ctx);
        });
      }
    }

    // RUN
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

    startMenu();

    return () => {
      // cleanup
      abort.abort();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
