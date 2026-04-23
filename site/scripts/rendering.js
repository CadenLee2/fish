"use strict";

// Page data
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.font = "18px Datatype";

const COLORS = {
    sky: "#85b4e2",
    water: "#4065bd",
    deepSea: "#0a0b23",
    red: "red",
    line: "#c5d1db",
};

const IMAGE_FILENAMES = {
    clouds: 'clouds.png',
    land: 'land.png',
    fisherUnreleased1: 'fisher_unreleased1.png',
    fisherUnreleased2: 'fisher_unreleased2.png',
    fisher: 'fisher.png',
    waves: 'waves.png',
    waves2: 'waves2.png',
    hook: 'hook.png',
    seabg: 'seabg.png',
};

const SKY_HEIGHT = 180;

const imageCache = {};

const setupImages = () => {
    for (const fishName of Object.keys(FISHES)) {
        const fishId = `fish_${fishName}`;
        IMAGE_FILENAMES[fishId] = `${fishId}.png`;
        IMAGE_FILENAMES[`${fishId}_right`] = `${fishId}_right.png`;
    }

    for (const [key, filename] of Object.entries(IMAGE_FILENAMES)) {
        const image = document.createElement('img');
        image.src = `assets/textures/${filename}`;
        imageCache[key] = image;
    }
}

const drawImageAt = (ctx, image, x, y, w, h) => {
    ctx.drawImage(image, Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
}

const drawPixelArtAt = (ctx, image, x, y) => {
    ctx.drawImage(image, Math.floor(x), Math.floor(y), Math.ceil(image.width * 2), Math.ceil(image.height * 2));
}

const getAscendingOffset = (state) => {
    if (state.status !== 'ascending') {
        return 0;
    }
    const fromTop = Math.min(Math.max(0, state.depth), 200);
    const fromBottomRaw = 0.5 * (state.maxDepth - state.depth);
    const fromBottomRawUnit = Math.max(0, Math.min(1, fromBottomRaw / 200));
    const fromBottomSmoothed = Math.sin(Math.PI * (fromBottomRawUnit - 0.5)) / 2 + 0.5;
    const fromBottom = fromBottomSmoothed * 200;
    return Math.min(fromTop, fromBottom);
}

const renderBg = (state, ctx) => {
    ctx.fillStyle = COLORS.deepSea;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const atSurface = state.status === 'home' || state.status === 'results';
    const ascendingOffset = getAscendingOffset(state);

    // Sea (always)
    const seaScrollHeight = -1 * (state.depth - ascendingOffset) % GAME_HEIGHT;
    const seaOffset = atSurface ? -1 * (Date.now() % 2000) / 1000 : 0;
    ctx.globalAlpha = Math.min(1, Math.max(0, 1 - (state.depth - 800) / 5000));
    ctx.fillStyle = COLORS.water;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    drawPixelArtAt(ctx, imageCache.seabg, 0, seaScrollHeight + seaOffset);
    drawPixelArtAt(ctx, imageCache.seabg, 0, seaScrollHeight + seaOffset + GAME_HEIGHT);
    ctx.globalAlpha = 1;

    const homeVisible = state.depth < SKY_HEIGHT + imageCache.land.height * 2;
    if (homeVisible) {
        const waterLine = SKY_HEIGHT - state.depth + ascendingOffset;
        ctx.fillStyle = COLORS.sky;
        ctx.fillRect(0, 0, GAME_WIDTH, Math.floor(waterLine));
        // Clouds
        const cloudAnimPercent = (Date.now() % 60000) / 60000;
        const cloudY = -1 * state.depth + ascendingOffset;
        drawPixelArtAt(ctx, imageCache.clouds, cloudAnimPercent * GAME_WIDTH, cloudY);
        drawPixelArtAt(ctx, imageCache.clouds, cloudAnimPercent * GAME_WIDTH - GAME_WIDTH, cloudY);
        const waveAnimPercent = (Date.now() % 120000) / 120000;
        const waveAnimFrame = (Date.now() % 2500) < 1250;
        const waveImage = waveAnimFrame ? imageCache.waves : imageCache.waves2;
        drawPixelArtAt(ctx, waveImage, waveAnimPercent * GAME_WIDTH, waterLine - 6);
        drawPixelArtAt(ctx, waveImage, waveAnimPercent * GAME_WIDTH - GAME_WIDTH, waterLine - 6);
        // Land
        drawPixelArtAt(ctx, imageCache.land, 0, waterLine - 52);
        // Fisher
        if (atSurface) {
            const fisherAnimFrame = (Date.now() % 1000) < 500;
            const fisherImage = fisherAnimFrame ? imageCache.fisherUnreleased1 : imageCache.fisherUnreleased2;
            drawPixelArtAt(ctx, fisherImage, 84, waterLine - 138);
        } else {
            drawPixelArtAt(ctx, imageCache.fisher, 84, waterLine - 138);
            ctx.strokeStyle = COLORS.line;
            ctx.beginPath();
            ctx.moveTo(114, waterLine - 124);
            ctx.lineTo(state.lureXglide, waterLine);
            ctx.stroke();
        }
    }
}

const renderLure = (state, ctx) => {
    const ascendingOffset = getAscendingOffset(state);
    const waterLine = SKY_HEIGHT - state.depth + ascendingOffset;
    const stringTop = Math.max(waterLine, 0);
    const lureY = Math.max(waterLine, LURE_Y_OFFSET + ascendingOffset);
    ctx.strokeStyle = COLORS.line;
    ctx.beginPath();
    ctx.moveTo(state.lureXglide, stringTop);
    ctx.lineTo(state.lureX, lureY);
    ctx.stroke();
    drawPixelArtAt(ctx, imageCache.hook, state.lureX - 18, lureY);
}

const renderFish = (state, ctx) => {
    const ascendingOffset = getAscendingOffset(state);
    const lureYOffset = LURE_Y_OFFSET + ascendingOffset;
    state.fishes.forEach((fish) => {
        const visible = fish.taken || fish.depth > state.depth - lureYOffset && fish.depth < state.depth + GAME_HEIGHT - ascendingOffset;
        if (!visible) return;

        if (fish.taken) {
            const imageId = `fish_${fish.type}`;
            const renderX = state.lureX + FISHES[fish.type].height / 2 - 8;
            const renderY = lureYOffset + 12;
            ctx.save();
            ctx.translate(renderX, renderY);
            ctx.rotate((80 + Math.random() * 20) * Math.PI / 180);
            drawPixelArtAt(ctx, imageCache[imageId], 0, 0);
            ctx.restore();
        } else {
            const facingRight = fish.direction > 0;
            const imageId = `fish_${fish.type}${facingRight ? '_right' : ''}`;
            const renderX = fish.x - FISHES[fish.type].width / 2;
            const renderY = fish.depth - state.depth + lureYOffset - FISHES[fish.type].height / 2;
            drawPixelArtAt(ctx, imageCache[imageId], renderX, renderY);
        }

    });
}

// UI definitions
const uiDepth = document.getElementById('depth');
const uiHint = document.getElementById('hint');
const uiResults = document.getElementById('results');
const uiFishlist = document.getElementById('fishlist');
const uiShare = document.getElementById('share');

const sumFishResults = (fishTypeCounts) => {
    const totalFishPrice = Object.entries(fishTypeCounts).reduce((prev, [type, count]) => prev + FISHES[type].price * count, 0);
    const totalFishCount = Object.values(fishTypeCounts).reduce((prev, count) => prev + count, 0);
    return { totalFishPrice, totalFishCount };
}

const renderUIFishlist = (state) => {
    const fishTypeCounts = state.lastGame.results.fishTypeCounts;
    // TODO: memoize this so it only happens once (update in state)
    while (uiFishlist.firstChild) {
        uiFishlist.removeChild(uiFishlist.lastChild);
    }
    const { totalFishPrice, totalFishCount } = sumFishResults(fishTypeCounts);
    Object.entries(fishTypeCounts).forEach(([type, count]) => {
        const fishCell = document.createElement('div');
        fishCell.className = 'fishcell';
        const fishImg = document.createElement('img');
        fishImg.src = `assets/textures/fish_${type}.png`;
        fishCell.appendChild(fishImg);
        const fishDescr = document.createElement('span');
        fishDescr.innerText = `x${count} = $${FISHES[type].price * count}`;
        fishCell.appendChild(fishDescr);
        uiFishlist.appendChild(fishCell);
    });
    const totalCell = document.createElement('div');
    totalCell.className = 'fishcell';
    totalCell.innerText = `Total: ${totalFishCount} fish, $${totalFishPrice}`
    uiFishlist.appendChild(totalCell)
}

const generateShareOnclick = (state) => {
    const fishTypeCounts = state.lastGame.results.fishTypeCounts;
    const { totalFishPrice, totalFishCount } = sumFishResults(fishTypeCounts);

    const generateFishRow = (type, count) => {
        return `🐟 ${type} x${count} = $${FISHES[type].price * count}\n`;
    }

    return () => {
        const toShowFish = state.lastGame.results.fishTypeCounts;
        const gameUrl = window.location.href;
        const shareText = `My results for ${gameUrl}\n`
            + Object.entries(toShowFish).map(([type, count]) => generateFishRow(type, count)).reduce((a, b) => a + b)
            + '---\n'
            + `Total: ${totalFishCount} fish, $${totalFishPrice}`;
        navigator.clipboard.writeText(shareText);
        uiShare.innerText = 'Copied!';
    };
}

const renderUI = (state) => {
    const depthMeters = Math.round(state.depth / 32);
    const depthText = depthMeters <= 0 ? '' : `Depth: ${depthMeters}m`;
    uiDepth.innerText = depthText;

    if (state.status !== 'results') {
        uiResults.style.display = 'none';
    }

    if (state.status === 'home') {
        uiHint.innerText = '[space/tap] start';
    } else if (state.status === 'descending' && depthMeters > 5 && depthMeters < 30) {
        uiHint.innerText = '[a] left, [d] right';
    } else if (state.status === 'results') {
        uiHint.innerText = '[space/tap] close';
        uiResults.style.display = 'flex';
        // Only render results once
        if (!state.resultsShown) {
            renderUIFishlist(state);
            state.resultsShown = true;
            uiShare.innerText = "Share";
            // Override existing onclick, because this must be generated each time
            uiShare.onclick = generateShareOnclick(state);
        }
    } else {
        uiHint.innerText = '';
    }
}

const render = (state) => {
    renderBg(state, ctx);
    
    if (state.status === 'descending' || state.status === 'ascending') {
        renderLure(state, ctx);
    }

    renderFish(state, ctx);

    renderUI(state);
}
