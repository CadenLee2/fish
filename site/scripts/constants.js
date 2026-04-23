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
        price: 4,
    },
    'orange': {
        speed: 0.1,
        width: 64,
        height: 32,
        spawnDepthMin: 0,
        spawnDepthMax: 1000,
        price: 6,
    },
    'ghost': {
        speed: 0.3,
        width: 40,
        height: 32,
        spawnDepthMin: 800,
        spawnDepthMax: 1800,
        price: 2,
    },
    'purple': {
        speed: 0.2,
        width: 32,
        height: 32,
        spawnDepthMin: 600,
        spawnDepthMax: 2000,
        price: 9,
    },
    'longfish': {
        speed: 0.2,
        width: 80,
        height: 18,
        spawnDepthMin: 1800,
        spawnDepthMax: undefined,
        price: 10,
    },
    'rock': {
        speed: 0.03,
        width: 32,
        height: 32,
        spawnDepthMin: 2000,
        spawnDepthMax: undefined,
        price: 12,
    },
    'gold': {
        speed: 0.3,
        width: 32,
        height: 32,
        spawnDepthMin: 1400,
        spawnDepthMax: undefined,
        price: 8,
    },
    'green': {
        speed: 0.7,
        width: 48,
        height: 40,
        spawnDepthMin: 2000,
        spawnDepthMax: 2600,
        price: 15,
    },
};

const LURE_Y_OFFSET = 130;

const USE_DEBUG_SETUP = false;
