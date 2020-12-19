window.scroll(0, 0);

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
    ctx.clearRect(0, 0, w, h);
    drawSnowflakes();
    moveSnowflakes();
};
setInterval(updateSnowfall, 50);
createSnowflakes();



