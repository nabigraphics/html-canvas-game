import { useEffect, useRef } from "react";

import styles from "./App.module.css";
import { GameEngine } from "./libs/game/GameEngine";
import { MenuScene } from "./libs/game/scenes/MenuScene";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const game = new GameEngine({ canvas });
    const menuScene = new MenuScene(game);

    game.changeScene(menuScene);

    // 게임 루프 시작
    game.run();

    return () => {
      // cleanup
      game.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};
