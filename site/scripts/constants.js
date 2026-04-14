"use strict";

const GAME_WIDTH = 330;
const GAME_HEIGHT = 540;
/** Maps keys to the game action identifiers that they trigger */
const KEYS = {
    'a': 'left',
    'd': 'right',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    ' ': 'start',
};

const FISHES = {
    'silver': {
        speed: 0.2,
        width: 32,
        height: 32,
        spawnDepthMin: 0,
        spawnDepthMax: 4000,
    },
    'orange': {
        speed: 0.1,
        width: 64,
        height: 32,
        spawnDepthMin: 0,
        spawnDepthMax: 1000,
    },
    'ghost': {
        speed: 0.3,
        width: 40,
        height: 32,
        spawnDepthMin: 800,
        spawnDepthMax: 1800,
    },
    'purple': {
        speed: 0.2,
        width: 32,
        height: 32,
        spawnDepthMin: 600,
        spawnDepthMax: 2000,
    },
    'longfish': {
        speed: 0.2,
        width: 80,
        height: 18,
        spawnDepthMin: 1800,
        spawnDepthMax: undefined,
    },
    'rock': {
        speed: 0.03,
        width: 32,
        height: 32,
        spawnDepthMin: 2000,
        spawnDepthMax: undefined,
    },
    'gold': {
        speed: 0.3,
        width: 32,
        height: 32,
        spawnDepthMin: 1400,
        spawnDepthMax: undefined,
    },
    'green': {
        speed: 0.7,
        width: 48,
        height: 40,
        spawnDepthMin: 2000,
        spawnDepthMax: 2600,
    },
};

const LURE_Y_OFFSET = 130;

const USE_DEBUG_SETUP = false;
