import { useEffect, useRef, useState } from "react";

import styles from "./App.module.css";
import { GameEngine } from "./libs/game/GameEngine";
import { MenuScene } from "./libs/game/scenes/MenuScene";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameEngine | null>(null);
  const [toggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle((prev) => {
      if (!gameRef.current) {
        return prev;
      }

      if (prev) {
        gameRef.current.resume();
      } else {
        gameRef.current.pause();
      }

      return !prev;
    });
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const game = new GameEngine({ canvas });
    const menuScene = new MenuScene(game);

    gameRef.current = game;
    game.changeScene(menuScene);

    // 게임 루프 시작
    game.run();

    return () => {
      // cleanup
      game.destroy();
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <button onClick={handleToggle}>
        게임 {toggle ? "재개" : "일시정지"}
      </button>
    </>
  );
};
