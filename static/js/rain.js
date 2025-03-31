// script.js
class Raindrop {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * -this.canvas.height;
        this.speed = Math.random() * 5 + 8;
        this.length = Math.random() * 20 + 15;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.wind = (Math.random() - 0.5) * 0.3;
    }

    update() {
        this.y += this.speed;
        this.x += this.wind;

        if (this.y > this.canvas.height + this.length) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.wind * 3, this.y + this.length);
        ctx.strokeStyle = `rgba(174, 194, 224, ${this.opacity})`;
        ctx.lineWidth = Math.random() * 1.5 + 0.5;
        ctx.stroke();
    }
}

class RainEffect {
    constructor() {
        this.canvas = document.getElementById('rainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.raindrops = [];
        this.resizeObserver = new ResizeObserver(this.resize.bind(this));
        
        this.init();
    }

    init() {
        this.resize();
        this.createDrops();
        this.addEventListeners();
        this.animate();
    }

    createDrops() {
        const dropCount = Math.floor((this.canvas.width * this.canvas.height) / 3000);
        this.raindrops = Array.from({ length: dropCount }, () => new Raindrop(this.canvas));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addEventListeners() {
        this.resizeObserver.observe(document.documentElement);
        window.addEventListener('resize', this.resize.bind(this));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.raindrops.forEach(drop => {
            drop.update();
            drop.draw(this.ctx);
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

// 初始化雨滴效果
document.addEventListener('DOMContentLoaded', () => {
    new RainEffect();
});