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
textBtn.addEventListener("click", showText);

//Tree lights
const nLights = 16;
const lightColors = [["#7a1907", "#e03212"], ["#5e5e00", "#ebeb02"], ["#003b08", "#00e81f"], ["#003847", "#00addb"]];
const lightRadii = [0.7, 1]
const lightSizeRange = [4, 6];
const trees = document.getElementsByClassName("tree");
var lights = [];

const randomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};

const randomInt = (min, max) => {
    return Math.floor(randomFloat(min, max));
};

const checkCollision = (light1, light2) => {
    const x1 = light1.x, y1 = light1.y, r1 = light1.size;
    const x2 = light2.x, y2 = light2.y, r2 = light2.size;
    const dx = x2 - x1, dy = y2 - y1;
    return dx * dx + dy * dy < (r1 + r2) * (r1 + r2);
}

const createLights = () => {
    for (var i = 0; i < trees.length; ++i) {
        lights.push([]);
        const rect = trees[i].getBoundingClientRect();
        const scale = rect.width / trees[i].offsetWidth;
        // ugly hard code oops
        const leftBound = rect.left + 0.41 * rect.width;
        const rightBound = rect.right - 0.39 * rect.width;
        const topBound = rect.top + 0.45 * rect.height;
        const bottomBound = rect.bottom - 0.13 * rect.height;
        const topThreshold = rect.top + 0.47 * rect.height;
        const topThresholdLeft = rect.left + 0.44 * rect.width;
        const topThresholdRight = rect.right - 0.42 * rect.width;
        for (var j = 0; j < nLights; ++j) {
            lights[i].push({
                x: randomFloat(leftBound, rightBound),
                y: randomFloat(topBound, bottomBound),
                size: scale * randomFloat(lightSizeRange[0], lightSizeRange[1]),
                color: randomInt(0, lightColors.length),
                lit: 0
            });

            // resolve collision
            while (true) {
                var collide = false;
                for (var k = 0; k < j; ++k) {
                    if (checkCollision(lights[i][j], lights[i][k])) {
                        collide = true;
                        break;
                    }
                }
                if (collide || lights[i][j].y < topThreshold && (lights[i][j].x < topThresholdLeft || lights[i][j].x > topThresholdRight)) {
                    lights[i][j].x = randomFloat(leftBound, rightBound);
                    lights[i][j].y = randomFloat(topBound, bottomBound);
                } else {
                    break;
                }
            }
        }

        // temporary solution
        var button = document.createElement("button");
        button.innerHTML = "Lights on";
        const capture = i;
        button.addEventListener("click", () => {
            for (var l = 0; l < nLights; ++l) {
                lights[capture][l].lit = 1;
            }
        });
        trees[i].appendChild(button);
        button.style.position = "absolute";
        button.style.top = "100%";
        button.style.left = "33%";
    }
};

const showLights = () => {
    for (var i = 0; i < lights.length; ++i) {
        for (var j = 0; j < nLights; ++j) {
            const light = lights[i][j];
            var gradient = ctx.createRadialGradient(light.x - light.size, light.y - light.size, 0, light.x - light.size, light.y - light.size, light.size);
            gradient.addColorStop(0.6, lightColors[light.color][light.lit]);
            gradient.addColorStop(lightRadii[light.lit], "#0c40");

            ctx.beginPath();
            ctx.arc(light.x - light.size, light.y - light.size, light.size, 0, 2 * Math.PI);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
};

createLights();

const show = () => {
    ctx.clearRect(0, 0, w, h);
    showLights();
    updateSnowfall();
};
setInterval(show, 50);

//Fire interaction
const fireBtn = document.getElementById("fire-btn");
const flameWrap = document.getElementById("flame-wrap");
const showFire = () => {
    flameWrap.style.animationPlayState = "running";
    flameWrap.style.animationIterationCount = 1;
}
fireBtn.addEventListener("click", showFire);