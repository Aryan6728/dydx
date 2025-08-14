
export enum GameState {
  Ready,
  Playing,
  GameOver,
}

export interface Position {
  x: number;
  y: number;
}

export interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}
