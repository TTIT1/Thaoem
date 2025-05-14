const images = [
    'images/img1.png',
    'images/img2.jpg',
    'images/img3.jpg',
    'images/img4.jpg',
    'images/img5.jpg',
    'images/img6.jpg',
    'images/img7.jpg',
    'images/img8.jpg',
    'images/img9.jpg',
];

const messages = [
    'Chúc em luôn xinh đẹp và hạnh phúc nhé!',
    'Cảm ơn em đã đến bên anh, cùng anh đi qua bao kỷ niệm.',
    'Mỗi khoảnh khắc bên em đều thật tuyệt vời.',
    'Anh mong em luôn cười thật tươi như thế này!',
    'Dù có chuyện gì, anh cũng sẽ luôn bên em.',
    'Chúc em tuổi mới nhiều thành công và may mắn!',
    'Mỗi ngày bên em là một ngày thật ý nghĩa.',
    'Chúc em luôn tự tin, mạnh mẽ và rạng rỡ như ánh mặt trời!',
    'Anh sẽ luôn ở đây, cùng em vượt qua mọi thử thách. Yêu em nhiều!' 
];

const finalBackground = 'images/img7.png';
const finalMessage = 'Happy Birthday! Chúc em tuổi mới hiểu biết và thành công hơn trong cuộc sống. Mong rằng nụ cười trên gương mặt em sẽ mãi mãi như bây giờ!';

let current = 0;
const img = document.getElementById('birthday-image');
const msg = document.getElementById('birthday-message');
const btn = document.getElementById('next-btn');
const heartsContainer = document.querySelector('.hearts');
let heartInterval = null;
const loveModal = document.getElementById('love-modal');
const acceptBtn = document.getElementById('accept-btn');
const declineBtn = document.getElementById('decline-btn');
const finalImage = document.getElementById('final-image');
let countdownEl = null;
const declineToast = document.getElementById('decline-toast');
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let isPlaying = false;

function randomColor() {
    const colors = ['#ff5eae', '#ffb6c1', '#ff3b3f', '#fff', '#ff7eb9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    const left = Math.random() * 100;
    heart.style.left = left + 'vw';
    heart.style.bottom = '-40px';
    const color = randomColor();
    heart.innerHTML = `<svg viewBox=\"0 0 32 29.6\"><path fill=\"${color}\" d=\"M23.6,0c-2.7,0-5.1,1.3-6.6,3.3C15.5,1.3,13.1,0,10.4,0C4.7,0,0,4.7,0,10.4c0,6.1,5.2,11.1,13.1,18.2l2.1,1.9l2.1-1.9C26.8,21.5,32,16.5,32,10.4C32,4.7,27.3,0,23.6,0z\"/></svg>`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 3500);
}

function startHearts() {
    if (!heartInterval) {
        heartInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) createHeart();
        }, 250);
    }
}

function stopHearts() {
    clearInterval(heartInterval);
    heartInterval = null;
    heartsContainer.innerHTML = '';
}

function showSlide(idx) {
    if (idx < images.length) {
        img.src = images[idx];
        msg.textContent = messages[idx];
        startHearts();
        if (countdownEl) countdownEl.remove();
        // Hiện lại 2 ảnh static nếu bị ẩn trước đó
        const flyupContainer = document.querySelector('.flyup-container');
        if (flyupContainer && flyupContainer.children.length === 0) {
            const leftImg = document.createElement('img');
            leftImg.src = 'images/banh.png';
            leftImg.className = 'static-flyup static-flyup-left';
            const rightImg = document.createElement('img');
            rightImg.src = 'images/codau-chure.png';
            rightImg.className = 'static-flyup static-flyup-right';
            flyupContainer.appendChild(leftImg);
            flyupContainer.appendChild(rightImg);
        }
    } else {
        // Hiển thị background chúc mừng sinh nhật
        let bg = document.createElement('img');
        bg.src = finalBackground;
        bg.className = 'background-img';
        document.body.appendChild(bg);
        img.style.opacity = 0;
        setTimeout(() => img.style.display = 'none', 700);
        msg.textContent = finalMessage;
        msg.style.color = '#fff';
        msg.style.textShadow = '2px 2px 8px #d72660, 0 0 12px #000';
        btn.style.display = 'none';
        stopHearts();
        // Thêm đồng hồ đếm ngược
        countdownEl = document.createElement('div');
        countdownEl.style.marginTop = '18px';
        countdownEl.style.fontSize = '1.1rem';
        countdownEl.style.color = '#fff';
        countdownEl.style.fontWeight = 'bold';
        countdownEl.style.textShadow = '1px 1px 6px #d72660, 0 0 8px #000';
        let timeLeft = 10;
        countdownEl.textContent = `Sẽ có một điều bất ngờ sau: ${timeLeft} giây...`;
        msg.parentNode.appendChild(countdownEl);
        let timer = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = `Sẽ có một điều bất ngờ sau: ${timeLeft} giây...`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                countdownEl.remove();
                loveModal.style.display = 'flex';
            }
        }, 1000);
        hideStaticFlyups();
    }
}

btn.addEventListener('click', () => {
    current++;
    showSlide(current);
});

// Bỏ hoàn toàn logic chạy trốn chuột cho nút "Tôi không thèm"
// let declineMoveCount = 0;
let declineScale = 1;
let acceptScale = 1;
declineBtn.addEventListener('mousedown', (e) => {
    showDeclineToast();
    // Mỗi lần bấm, nút nhỏ lại, nút đồng ý to ra
    declineScale *= 0.85;
    acceptScale *= 1.12;
    declineBtn.style.transform = `scale(${declineScale})`;
    acceptBtn.style.transform = `scale(${acceptScale})`;
});

function showDeclineToast() {
    declineToast.style.display = 'flex';
    declineToast.classList.remove('fade');
    setTimeout(() => {
        declineToast.style.display = 'none';
    }, 2000);
}

// Khởi tạo slide đầu tiên
showSlide(0);

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        music.pause();
        musicBtn.textContent = 'Bật nhạc';
    } else {
        music.play();
        musicBtn.textContent = 'Tắt nhạc';
    }
    isPlaying = !isPlaying;
});

acceptBtn.addEventListener('click', () => {
    loveModal.style.display = 'none';
    hideStaticFlyups();
    finalImage.style.display = 'flex';
    // Đảm bảo text chỉ hiện khi ảnh đã load xong
    const finalImgWrapper = document.querySelector('.final-image-wrapper');
    const finalImg = finalImgWrapper.querySelector('img');
    const thankyouText = finalImgWrapper.querySelector('.thankyou-text');
    thankyouText.style.opacity = 0;
    finalImg.onload = () => {
        thankyouText.style.opacity = 1;
    };
    if (finalImg.complete) {
        thankyouText.style.opacity = 1;
    }
});

// Thêm 2 ảnh static vào khi trang load
window.addEventListener('DOMContentLoaded', () => {
    // KHÔNG phát nhạc tự động nữa, chỉ phát khi bấm 'Bắt đầu'
    const flyupContainer = document.querySelector('.flyup-container');
    if (flyupContainer) {
        flyupContainer.innerHTML = '';
        const leftImg = document.createElement('img');
        leftImg.src = 'images/banh.png';
        leftImg.className = 'static-flyup static-flyup-left';
        const rightImg = document.createElement('img');
        rightImg.src = 'images/codau-chure.png';
        rightImg.className = 'static-flyup static-flyup-right';
        flyupContainer.appendChild(leftImg);
        flyupContainer.appendChild(rightImg);
    }
    const jsonModal = document.getElementById('json-modal');
    const startBtn = document.getElementById('start-btn');
    // Load animation từ file JSON
    fetch('images/intro-image.json')
        .then(response => response.json())
        .then(animationData => {
            lottie.loadAnimation({
                container: document.getElementById('json-lottie'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            });
        })
        .catch(err => {
            console.error('Lottie load error:', err);
        });
    startBtn.addEventListener('click', () => {
        jsonModal.style.display = 'none';
        // Bắt đầu chương trình chính
        showSlide(0);
        // Phát nhạc nền và ẩn nút bật nhạc
        music.play();
        musicBtn.style.display = 'none';
        isPlaying = true;
    });
});

// Ẩn 2 ảnh static khi đến tấm background hoặc tấm cuối
function hideStaticFlyups() {
    const flyupContainer = document.querySelector('.flyup-container');
    if (flyupContainer) flyupContainer.innerHTML = '';
}