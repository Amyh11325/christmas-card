window.scroll(0, 0);

//Snowing Effect
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var particlesOnScreen = 300;
var particlesArray = [];
var w, h;
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;

function random(min, max) {
    return min + Math.random() * (max - min) + 1;
};
function clientResize(ev) {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
};
window.addEventListener("resize", clientResize);

function createSnowflakes() {
    for (var i = 0; i < particlesOnScreen; i++) {
        particlesArray.push({
            x: random(0, w),
            y: random(0, h),
            opacity: random(-.7, -.05),
            speedX: random(-.9, .9),
            speedY: random(1, 2.5),
            radius: random(1, 4),
        })
    }
};
function drawSnowflakes() {
    for (var i = 0; i < particlesArray.length; i++) {
        var gradient = ctx.createRadialGradient(particlesArray[i].x, particlesArray[i].y, 0, particlesArray[i].x, particlesArray[i].y, particlesArray[i].radius);
        gradient.addColorStop(0, "rgba(255, 255, 255," + particlesArray[i].opacity + ")");
        gradient.addColorStop(.8, "rgba(210, 236, 242," + particlesArray[i].opacity + ")");
        gradient.addColorStop(1, "rgba(237, 247, 249," + particlesArray[i].opacity + ")");

        ctx.beginPath();
        ctx.arc(particlesArray[i].x, particlesArray[i].y, particlesArray[i].radius, 0, Math.PI*2, false);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
};
function moveSnowflakes() {
    for (var i = 0; i < particlesArray.length; i++) {
        particlesArray[i].x += particlesArray[i].speedX;
        particlesArray[i].y += particlesArray[i].speedY;
        if (particlesArray[i].y > h) {
            particlesArray[i].x = Math.random() * w * 1.5;
            particlesArray[i].y = -5;
        }
        if (particlesArray[i].x > w + 5 || particlesArray[i].x < -5) {
            particlesArray[i].speedX = -particlesArray[i].speedX;
        }
    }
};
function updateSnowfall() {
    drawSnowflakes();
    moveSnowflakes();
};
createSnowflakes();

//Text pop up animation
const textBtn = document.getElementById("temp-btn");
const letters = document.querySelectorAll(".text-wrap>span");

const showText = () => {
    for (var i = 0; i < letters.length; i++) {
        letters[i].style.animationDelay = (i * .09) + "s" + ", " + ((i * 0.12) +4) + "s";
        letters[i].style.animationPlayState = "running, running";
        letters[i].style.animationIterationCount = 1 + ", infinite";
    }
};

//Interaction counting
const nInteractions = 5;
var interactions = 0;

const registerInteraction = () => {
    ++interactions;
    if (interactions == nInteractions) {
        showText();
    }
}

//Tree lights
const nLights = 12;
const lightOffColors = ["#7a1907", "#5e5e00", "#003b08", "#003847"];
const lightOnColors = [[0xe0, 0x32, 0x12], [0xeb, 0xeb, 0x02], [0x00, 0xe8, 0x1f], [0x00, 0x1d, 0xdb]];
const lightRadii = [0.7, 1];
const lightSizeRange = [3, 5];
const trees = document.getElementsByClassName("tree");
var lights = [];
var lightColors = [];
var lightTimeline = [];
var lightFrame = [];
var lightDuration = [];

const randomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};

const randomInt = (min, max) => {
    return Math.floor(randomFloat(min, max));
};

const shuffle = (array) => {
    for (var i = 0; i < array.length - 1; ++i) {
        const j = randomInt(i, array.length);
        const swap = array[i];
        array[i] = array[j];
        array[j] = swap;
    }
}

const checkCollision = (light1, light2) => {
    const x1 = light1.style.getPropertyValue("--x") * 1, y1 = light1.style.getPropertyValue("--y") * 1, r1 = light1.style.getPropertyValue("--size") * 1;
    const x2 = light2.style.getPropertyValue("--x") * 1, y2 = light2.style.getPropertyValue("--y") * 1, r2 = light2.style.getPropertyValue("--size") * 1;
    const dx = x2 - x1, dy = y2 - y1;
    return dx * dx + dy * dy < (r1 + r2) * (r1 + r2) * 1.6 * 1.6;
}

const lerp = (rgb1, rgb2, r, n) => {
    red = Math.floor(rgb1[0] + (rgb2[0] - rgb1[0]) * r / n);
    green = Math.floor(rgb1[1] + (rgb2[1] - rgb1[1]) * r / n);
    blue = Math.floor(rgb1[2] + (rgb2[2] - rgb1[2]) * r / n);
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

const createLights = () => {
    for (var i = 0; i < trees.length; ++i) {
        const tree = trees[i];
        const scale = tree.getBoundingClientRect().width / tree.offsetWidth;
        // ugly hard code oops
        const leftBound = 0.4 * tree.offsetWidth;
        const rightBound = 0.6 * tree.offsetWidth;
        const topBound = 0.45 * tree.offsetHeight;
        const bottomBound = 0.87 * tree.offsetHeight;
        const topThreshold = 0.47 * tree.offsetHeight;
        const topThresholdLeft = 0.43 * tree.offsetWidth;
        const topThresholdRight = 0.57 * tree.offsetWidth;

        var bad = 0;
        lights.push([]);
        lightColors.push([]);
        lightDuration.push([]);
        lightTimeline.push([]);
        lightFrame.push(0);
        for (j = 0; j < nLights; ++j) {
            lights[i].push(document.createElement("div"));
            var light = lights[i][j];
            light.className = "tree-light";
            const size = randomFloat(lightSizeRange[0], lightSizeRange[1]);
            light.style.setProperty("--size", size);
            light.style.width = light.style.height = "200px";
            light.style.setProperty("--x", randomFloat(leftBound, rightBound));
            light.style.setProperty("--y", randomFloat(topBound, bottomBound));

            // resolve collision
            var count = 0;
            while (count < 100) {
                var collide = false;
                for (var k = 0; k < j; ++k) {
                    if (checkCollision(light, lights[i][k])) {
                        collide = true;
                        break;
                    }
                }
                if (collide || light.style.getPropertyValue("--y") < topThreshold && (light.style.getPropertyValue("--x") < topThresholdLeft || light.style.getPropertyValue("--x") > topThresholdRight)) {
                    light.style.setProperty("--x", randomFloat(leftBound, rightBound));
                    light.style.setProperty("--y", randomFloat(topBound, bottomBound));
                } else {
                    break;
                }
                ++count;
            }
            if (count == 100) {
                lights.pop();
                lights.push([]);
                j = -1;
                continue;
            }
            light.style.top = light.style.getPropertyValue("--y") - 100 + "px";
            light.style.left = light.style.getPropertyValue("--x") - 100 + "px";

            lightColors[i].push([]);
            for (var k = 0; k < lightOnColors.length; ++k) {
                lightColors[i][j].push(k);
            }
            shuffle(lightColors[i][j]);

            lightTimeline[i].push([]);
            const duration = randomInt(250, 501);
            lightDuration[i].push(duration);
            lightTimeline[i][j].push(0);
            lightTimeline[i][j].push(randomInt(lightTimeline[i][j][0] + 25, duration - 90));
            lightTimeline[i][j].push(randomInt(lightTimeline[i][j][1] + 25, duration - 60));
            lightTimeline[i][j].push(randomInt(lightTimeline[i][j][2] + 25, duration - 30));

            light.style.backgroundImage = "radial-gradient(" + lightOffColors[lightColors[i][j][0]] + " " + (60 * size / 100) + "%, transparent " + (70 * size / 100) + "%)";
            light.style.backgroundPosition = "0 0";
        }

        for (j = 0; j < nLights; ++j) {
            tree.append(lights[i][j]);
        }

        const button = document.createElement("button");
        button.className = "tree-btn";
        const captureI = i;
        button.addEventListener("click", () => {
            animateLight = () => {
                for (j = 0; j < nLights; ++j) {
                    var cur = 0;
                    const frame = lightFrame[captureI] % lightDuration[captureI][j];
                    while (cur < 3 && frame >= lightTimeline[captureI][j][cur + 1]) {
                        ++cur;
                    }
                    lights[captureI][j].style.backgroundImage = "radial-gradient(" + lerp(lightOnColors[lightColors[captureI][j][cur]], lightOnColors[lightColors[captureI][j][(cur + 1) % 4]], frame - lightTimeline[captureI][j][cur], (lightTimeline[captureI][j][(cur + 1) % 4] - lightTimeline[captureI][j][cur] + lightDuration[captureI][j]) % lightDuration[captureI][j]) + " " + 40 * lights[captureI][j].style.getPropertyValue("--size") / 100 + "%, transparent " + lights[captureI][j].style.getPropertyValue("--size") + "%)";
                }
                ++lightFrame[captureI];
            }
            setInterval(animateLight, 50);
            registerInteraction();
            button.disabled = true;
            button.style.setProperty("--color", "#ffffff00");
        });
        button.style.position = "absolute";
        button.style.top = "100%";
        button.style.left = "33%";
        trees[i].appendChild(button);
    }
};

createLights();

const show = () => {
    ctx.clearRect(0, 0, w, h);
    updateSnowfall();
};
setInterval(show, 50);

//Fire interaction
const fireBtn = document.getElementById("fire-btn");
const flameWrap = document.getElementById("flame-wrap");
const showFire = () => {
    flameWrap.style.animationPlayState = "running";
    flameWrap.style.animationIterationCount = 1;
    registerInteraction();
    fireBtn.disabled = true;
}
fireBtn.addEventListener("click", showFire);

//Cloud movement
var speed = [];
var cloudPos = [3, 90, 23, 46, 68];

const moveClouds = () => {
    const clouds = [
        document.getElementById("cloud1"),
        document.getElementById("cloud2"),
        document.getElementById("cloud3"),
        document.getElementById("cloud4"),
        document.getElementById("cloud5")
    ];
    for (var i = 0; i < 5; ++i) {
        speed.push(randomFloat(0.05, 0.1));
        const captureI = i;
        const move = () => {
            cloudPos[captureI] += speed[captureI];
            if (cloudPos[captureI] >= 100) {
                cloudPos[captureI] = -12;
            }
            clouds[captureI].style.left = cloudPos[captureI] + "%";
        };
        setInterval(move, 50);
    }
};

moveClouds();
