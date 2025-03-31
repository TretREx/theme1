// 获取元素
const video = document.getElementById('video');
const playBtn = document.querySelector('.play-btn');
const progress = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-container');
const volumeSlider = document.querySelector('.volume-slider');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');

// 播放/暂停切换
playBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playBtn.textContent = '⏸';
    } else {
        video.pause();
        playBtn.textContent = '▶';
    }
});

// 更新进度条
video.addEventListener('timeupdate', updateProgress);

// 点击进度条跳转
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
});

// 音量控制
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
});

// 格式化时间显示
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 更新进度条和时间
function updateProgress() {
    const progressPercent = (video.currentTime / video.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(video.currentTime);
    durationEl.textContent = formatTime(video.duration);
}

// 全屏功能
document.querySelector('.fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// 初始化视频时长
video.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(video.duration);
});