
// Game Dimensions
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

// Sprite Physics
export const SPRITE_WIDTH = 40;
export const SPRITE_HEIGHT = 40;
export const GRAVITY = 0.5;
export const JUMP_STRENGTH = -8;
export const INITIAL_SPRITE_Y = GAME_HEIGHT / 2 - SPRITE_HEIGHT / 2;
export const INITIAL_SPRITE_X = GAME_WIDTH / 4;


// Pipe Settings
export const PIPE_WIDTH = 60;
export const PIPE_GAP = 500;
export const PIPE_SPEED = -3;
export const PIPE_SPAWN_INTERVAL = 200; // in pixels, distance between pipes
export const PIPE_TOP_HEIGHT = GAME_HEIGHT; // Visual height, not calculation height
export const PIPE_BOTTOM_HEIGHT = GAME_HEIGHT; // Visual height, not calculation height
