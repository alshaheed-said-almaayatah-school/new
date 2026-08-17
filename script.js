// ====== بيانات التقنيات ======
const techniques = {
    pomodoro: { name: '🍅 بومودورو', focus: 25, break: 5, longBreak: 20 },
    fiftytwo: { name: '⚡ 52/17', focus: 52, break: 17, longBreak: 30 },
    deep: { name: '🧠 مكثّف', focus: 90, break: 30, longBreak: 45 }
};

// ====== الرسائل التحفيزية ======
const motivationalQuotes = [
    '💪 التركيز هو مفتاح النجاح، واصل!',
    '🌟 كل درس تنجزه يقربك من هدفك',
    '🔥 أنت أقوى مما تظن، استمر',
    '📚 المعرفة تُبنى درساً درساً',
    '✨ التركيز اليوم = نجاح الغد',
    '🎯 ركز على هدفك، وستحققه',
    '💡 العقل المتعّلم هو العقل الناجح',
    '🚀 خطوة صغيرة كل يوم = إنجاز كبير',
    '🌱 النجاح يبدأ بالانضباط',
    '⭐ أنت تبني مستقبلك الآن'
];

// ====== متغيرات التطبيق ======
let currentTech = 'pomodoro';
let timer;
let isRunning = false;
let isBreak = false;
let minutes = 25;
let seconds = 0;
let sessionCount = 1;
let taskCount = 0;
let totalTasks = 0;
let totalSecondsToday = 0;
let currentGoal = '2-lessons';
let goalLessons = 2;
let isEnglish = false;
let isSoundPlaying = false;
let soundInterval;

// ====== عناصر DOM ======
const welcomeScreen = document.getElementById('welcomeScreen');
const mainScreen = document.getElementById('mainScreen');
const enterBtn = document.getElementById('enterBtn');
const backBtn = document.getElementById('backBtn');
const langToggle = document.getElementById('langToggle');
const timerDisplay = document.getElementById('timerDisplay');
const phaseLabel = document.getElementById('phaseLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const sessionCountEl = document.getElementById('sessionCount');
const taskCountEl = document.getElementById('taskCount');
const totalTasksEl = document.getElementById('totalTasks');
const todayTimeEl = document.getElementById('todayTime');
const statusMsg = document.getElementById('statusMsg');
const doneTaskBtn = document.getElementById('doneTaskBtn');
const techBtns = document.querySelectorAll('.tech-btn');
const progressRing = document.getElementById('progressRing');
const themeToggle = document.getElementById('themeToggle');
const soundSelect = document.getElementById('bgSound');
const goalSelect = document.getElementById('goalSelect');
const goalDisplay = document.getElementById('goalDisplay');
const goalProgress = document.getElementById('goalProgress');
const motivationMessage = document.getElementById('motivationMessage');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeSub = document.getElementById('welcomeSub');
const welcomeDef = document.getElementById('welcomeDef');

// ====== الصوت ======
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new(window.AudioContext || window.webkitAudioContext)();
    }
}

function playSoundEffect(type) {
    initAudio();
    stopSoundEffect();

    if (type === 'none' || !audioCtx) return;

    try {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        let frequency = 200;
        let oscType = 'sine';
        let gainValue = 0.08;

        switch (type) {
            case 'rain':
                frequency = 300 + Math.random() * 100;
                oscType = 'sawtooth';
                gainValue = 0.03;
                filter.type = 'lowpass';
                filter.frequency.value = 400 + Math.random() * 200;
                break;
            case 'fire':
                frequency = 60 + Math.random() * 40;
                oscType = 'sawtooth';
                gainValue = 0.05;
                filter.type = 'lowpass';
                filter.frequency.value = 150 + Math.random() * 100;
                break;
            case 'waves':
                frequency = 100 + Math.random() * 50;
                oscType = 'sine';
                gainValue = 0.06;
                filter.type = 'lowpass';
                filter.frequency.value = 250 + Math.random() * 100;
                break;
            case 'forest':
                frequency = 200 + Math.random() * 150;
                oscType = 'triangle';
                gainValue = 0.04;
                filter.type = 'bandpass';
                filter.frequency.value = 400 + Math.random() * 200;
                filter.Q.value = 1.5;
                break;
            default:
                return;
        }

        oscillator.type = oscType;
        oscillator.frequency.value = frequency;
        gainNode.gain.value = gainValue;

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);

        // نكرر الصوت كل 200-400ms
        soundInterval = setInterval(() => {
            if (!audioCtx || document.hidden) return;

            try {
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                const filter2 = audioCtx.createBiquadFilter();

                osc2.connect(filter2);
                filter2.connect(gain2);
                gain2.connect(audioCtx.destination);

                let freqVar = 0;
                switch (type) {
                    case 'rain':
                        freqVar = 300 + Math.random() * 150;
                        osc2.type = 'sawtooth';
                        gain2.gain.value = 0.02 + Math.random() * 0.02;
                        filter2.type = 'lowpass';
                        filter2.frequency.value = 400 + Math.random() * 300;
                        break;
                    case 'fire':
                        freqVar = 60 + Math.random() * 50;
                        osc2.type = 'sawtooth';
                        gain2.gain.value = 0.04 + Math.random() * 0.02;
                        filter2.type = 'lowpass';
                        filter2.frequency.value = 150 + Math.random() * 150;
                        break;
                    case 'waves':
                        freqVar = 100 + Math.random() * 80;
                        osc2.type = 'sine';
                        gain2.gain.value = 0.04 + Math.random() * 0.03;
                        filter2.type = 'lowpass';
                        filter2.frequency.value = 200 + Math.random() * 200;
                        break;
                    case 'forest':
                        freqVar = 200 + Math.random() * 200;
                        osc2.type = 'triangle';
                        gain2.gain.value = 0.03 + Math.random() * 0.02;
                        filter2.type = 'bandpass';
                        filter2.frequency.value = 400 + Math.random() * 300;
                        filter2.Q.value = 1.5 + Math.random() * 0.5;
                        break;
                }

                osc2.frequency.value = freqVar;
                osc2.start();
                osc2.stop(audioCtx.currentTime + 0.2 + Math.random() * 0.2);

            } catch (e) {
                // تجاهل الأخطاء
            }
        }, 200 + Math.random() * 300);

        isSoundPlaying = true;
        statusMsg.textContent = isEnglish ? `🎵 Playing: ${type}` : `🎵 تشغيل: ${type}`;

    } catch (e) {
        console.log('Sound error:', e);
    }
}

function stopSoundEffect() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
    isSoundPlaying = false;
}

// ====== زر الدخول ======
enterBtn.addEventListener('click', function() {
    welcomeScreen.classList.remove('active');
    mainScreen.classList.add('active');
});

// ====== زر الرجوع ======
backBtn.addEventListener('click', function() {
    stopSoundEffect();
    pauseTimer();
    mainScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
});

// ====== اللغة ======
