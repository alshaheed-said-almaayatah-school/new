// ====== إعدادات التقنيات ======
const techniques = {
    pomodoro: { name: '🍅 بومودورو', focus: 25, break: 5, longBreak: 20, desc: '25 دقيقة تركيز + 5 دقائق راحة' },
    fiftytwo: { name: '⚡ 52/17', focus: 52, break: 17, longBreak: 30, desc: '52 دقيقة تركيز + 17 دقيقة راحة' },
    deep: { name: '🧠 دراسة مكثفة', focus: 90, break: 30, longBreak: 45, desc: '90 دقيقة تركيز + 30 دقيقة راحة' }
};

// ====== المتغيرات العامة ======
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
let timerInterval;

// ====== عناصر DOM ======
const welcomeScreen = document.getElementById('welcomeScreen');
const mainScreen = document.getElementById('mainScreen');
const enterBtn = document.getElementById('enterBtn');
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
const techNameEl = document.getElementById('techName');
const techDescEl = document.getElementById('techDesc');
const progressRing = document.getElementById('progressRing');
const themeToggle = document.getElementById('themeToggle');
const soundSelect = document.getElementById('bgSound');

// ====== الانتقال من الترحيب للرئيسية ======
enterBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    mainScreen.classList.add('active');
});

// ====== تبديل التقنيات ======
techBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        techBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTech = btn.dataset.tech;
        const tech = techniques[currentTech];
        techNameEl.textContent = tech.name;
        techDescEl.textContent = tech.desc;
        resetTimer();
        updateDisplay();
    });
});

// ====== تحديث المؤقت ======
function updateDisplay() {
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
    updateProgress();
}

function updateProgress() {
    const tech = techniques[currentTech];
    const total = isBreak ? (sessionCount % 4 === 0 ? tech.longBreak : tech.break) : tech.focus;
    const totalSeconds = total * 60;
    const currentSeconds = minutes * 60 + seconds;
    const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 534;
    progressRing.style.strokeDashoffset = 534 - progress;
}

// ====== بدء المؤقت ======
function startTimer() {
    if (isRunning) return;
    isRunning = true;
    statusMsg.textContent = isBreak ? '☕ وقت الراحة' : '🧠 ركّز الآن!';
    phaseLabel.textContent = isBreak ? 'راحة' : 'تركيز';

    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                if (!isBreak) {
                    // انتهت جلسة تركيز
                    taskCount++;
                    taskCountEl.textContent = taskCount;
                    totalTasks++;
                    totalTasksEl.textContent = totalTasks;
                    
                    if (sessionCount % 4 === 0) {
                        minutes = techniques[currentTech].longBreak;
                        statusMsg.textContent = '🎉 راحة طويلة!';
                    } else {
                        minutes = techniques[currentTech].break;
                        statusMsg.textContent = '☕ راحة قصيرة';
                    }
                    isBreak = true;
                    phaseLabel.textContent = 'راحة';
                } else {
                    // انتهت الراحة
                    minutes = techniques[currentTech].focus;
                    isBreak = false;
                    sessionCount++;
                    sessionCountEl.textContent = sessionCount;
                    statusMsg.textContent = '🔁 جلسة جديدة';
                    phaseLabel.textContent = 'تركيز';
                }
                seconds = 0;
                updateDisplay();
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        // تحديث الوقت الكلي اليوم
        totalSecondsToday++;
        updateTodayTime();
        updateDisplay();
    }, 1000);
}

// ====== إيقاف المؤقت ======
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    statusMsg.textContent = '⏸ متوقف مؤقتاً';
}

// ====== إعادة ضبط المؤقت ======
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    const tech = techniques[currentTech];
    minutes = tech.focus;
    seconds = 0;
    isBreak = false;
    sessionCount = 1;
    sessionCountEl.textContent = sessionCount;
    phaseLabel.textContent = 'تركيز';
    statusMsg.textContent = '🔄 تمت إعادة الضبط';
    updateDisplay();
}

// ====== تحديث وقت اليوم ======
function updateTodayTime() {
    const hrs = Math.floor(totalSecondsToday / 3600);
    const mins = Math.floor((totalSecondsToday % 3600) / 60);
    todayTimeEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// ====== أحداث الأزرار ======
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

doneTaskBtn.addEventListener('click', () => {
    taskCount++;
    taskCountEl.textContent = taskCount;
    totalTasks++;
    totalTasksEl.textContent = totalTasks;
    statusMsg.textContent = '✅ مهمة مكتملة! أحسنت 👏';
});

// ====== تبديل المظهر ======
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? 'فاتح' : 'داكن';
});

// ====== صوت خلفية (تجسيدي) ======
soundSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'none') {
        statusMsg.textContent = '🔇 بدون صوت';
    } else {
        statusMsg.textContent = `🎵 تشغيل: ${val}`;
    }
});

// ====== تهيئة أولية ======
resetTimer();
updateDisplay();
