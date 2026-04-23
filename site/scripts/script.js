"use strict";

const DEFAULT_GAME_STATE = {
    /** 'home' | 'descending' | 'ascending' | 'results' */
    status: 'home',
    startTime: null,
    depth: 0,
    maxDepth: 0,
    lureX: 100,
    lureXglide: 110,
    fishes: [],
    nextSpawnTime: null,
    lastGame: null,
    resultsShown: false,
}

// Misc. options for debugging
const debugSetup = (gameState) => {
    console.log('[dbg] Debug setup is running');

    gameState.lastGame = {
        results: {
            fishTypeCounts: {
                "silver": 1, "orange": 2, "ghost": 2, "purple": 2,
            }
        }
    };
    gameState.status = 'results';
}

const runGame = () => {
    // Set up state
    const gameState = structuredClone(DEFAULT_GAME_STATE);
    const inputState = {
        keysDown: new Set(),
    };

    if (USE_DEBUG_SETUP) {
        debugSetup(gameState);
    }

    // Start helpers
    startInputListeners(inputState);
    setupImages();

    // Game loop
    const gameLoop = (delta) => {
        render(gameState);
        updateState(gameState, inputState, delta);
    }

    // Start rendering
    const renderState = {
        lastTime: null,
    };
    const handleNextFrame = (time) => {
        if (renderState.lastTime !== null) {
            const delta = time - renderState.lastTime;
            gameLoop(delta);
        }

        renderState.lastTime = time;
        window.requestAnimationFrame(handleNextFrame);
    }
    window.requestAnimationFrame(handleNextFrame);
}

runGame();
