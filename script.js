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

// ====== عناصر DOM ======
const welcomeScreen = document.getElementById('welcomeScreen');
const mainScreen = document.getElementById('mainScreen');
const enterBtn = document.getElementById('enterBtn');
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

// ====== زر الدخول ======
enterBtn.addEventListener('click', function() {
    welcomeScreen.classList.remove('active');
    mainScreen.classList.add('active');
});

// ====== اللغة ======
langToggle.addEventListener('click', function() {
    isEnglish = !isEnglish;
    document.body.classList.toggle('lang-en', isEnglish);
    langToggle.textContent = isEnglish ? '🇸🇦 عربي' : '🇬🇧 English';

    if (isEnglish) {
        welcomeTitle.innerHTML = 'Welcome to <span class="gold">Learning &<br>Focus Strategies</span>';
        welcomeSub.textContent = 'Master the art of focus and boost your academic performance';
        welcomeDef.innerHTML =
            '<strong>📖 About this section:</strong><br>This section is dedicated to developing learning and focus skills through proven techniques like <strong>Pomodoro</strong>, <strong>52/17</strong>, and <strong>Deep Study</strong>. Our goal is to help you achieve your academic goals efficiently and without burnout.';
        document.querySelector('#goalLabel').textContent = '🎯 Set your goal:';
        document.querySelector('.btn-success').textContent = '✅ Completed a lesson';
        statusMsg.textContent = '✨ Ready to focus';
    } else {
        welcomeTitle.innerHTML = 'أهلاً بك في <span class="gold">قسم استراتيجيات<br>التعلم والتركيز</span>';
        welcomeSub.textContent = 'حيث تتقن فن التركيز وتُحسّن أداءك الدراسي';
        welcomeDef.innerHTML =
            '<strong>📖 تعريف القسم:</strong><br>هذا القسم مخصص لتطوير مهارات التعلم والتركيز من خلال تقنيات مدروسة مثل <strong>بومودورو</strong>، <strong>52/17</strong>، و<strong>الدراسة المكثفة</strong>. نهدف إلى مساعدتك على تحقيق أهدافك الأكاديمية بكفاءة وبدون إرهاق.';
        document.querySelector('#goalLabel').textContent = '🎯 حدّد هدفك:';
        document.querySelector('.btn-success').textContent = '✅ أنجزت درساً';
        statusMsg.textContent = '✨ جاهز للتركيز';
    }
});

// ====== تبديل التقنيات ======
techBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        techBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTech = this.dataset.tech;
        resetTimer();
        updateDisplay();
    });
});

// ====== الهدف ======
goalSelect.addEventListener('change', function() {
    const val = this.value;
    currentGoal = val;
    const parts = val.split('-');
    const num = parseInt(parts[0]);
    const type = parts[1];
    goalLessons = num;
    const label = isEnglish ?
        (type === 'lesson' ? `${num} lesson${num > 1 ? 's' : ''}` : `${num} unit${num > 1 ? 's' : ''}`) :
        (type === 'lesson' ? `${num} درس${num > 1 ? 'ً' : ''}` : `${num} وحدة${num > 1 ? 'ً' : ''}`);
    goalDisplay.textContent = isEnglish ? `🎯 Goal: ${label}` : `🎯 الهدف: ${label}`;
    updateGoalProgress();
});

function updateGoalProgress() {
    goalProgress.textContent = `${taskCount}/${goalLessons}`;
    if (taskCount >= goalLessons) {
        motivationMessage.textContent = isEnglish ?
            '🎉 Congratulations! You achieved your goal! 🎉' :
            '🎉 مبروك! لقد حققت هدفك! 🎉';
        document.querySelector('.btn-success').style.borderColor = '#d4a847';
        document.querySelector('.btn-success').style.color = '#d4a847';
    } else {
        document.querySelector('.btn-success').style.borderColor = 'rgba(212, 168, 71, 0.1)';
        document.querySelector('.btn-success').style.color = 'var(--text-primary)';
    }
}

// ====== المؤقت ======
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

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    statusMsg.textContent = isBreak ? (isEnglish ? '☕ Break time' : '☕ وقت الراحة') : (isEnglish ? '🧠 Focus now!' :
        '🧠 ركّز الآن!');
    phaseLabel.textContent = isBreak ? (isEnglish ? 'Break' : 'راحة') : (isEnglish ? 'Focus' : 'تركيز');

    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                isRunning = false;
                if (!isBreak) {
                    taskCount++;
                    taskCountEl.textContent = taskCount;
                    totalTasks++;
                    totalTasksEl.textContent = totalTasks;
                    updateGoalProgress();

                    if (sessionCount % 4 === 0) {
                        minutes = techniques[currentTech].longBreak;
                        statusMsg.textContent = isEnglish ? '🎉 Long break!' : '🎉 راحة طويلة!';
                    } else {
                        minutes = techniques[currentTech].break;
                        statusMsg.textContent = isEnglish ? '☕ Short break' : '☕ راحة قصيرة';
                    }
                    isBreak = true;
                    phaseLabel.textContent = isEnglish ? 'Break' : 'راحة';
                } else {
                    minutes = techniques[currentTech].focus;
                    isBreak = false;
                    sessionCount++;
                    sessionCountEl.textContent = sessionCount;
                    statusMsg.textContent = isEnglish ? '🔁 New session' : '🔁 جلسة جديدة';
                    phaseLabel.textContent = isEnglish ? 'Focus' : 'تركيز';
                    // رسالة تحفيزية عشوائية
                    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
                    motivationMessage.textContent = randomQuote;
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
        totalSecondsToday++;
        updateTodayTime();
        updateDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    statusMsg.textContent = isEnglish ? '⏸ Paused' : '⏸ متوقف مؤقتاً';
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    const tech = techniques[currentTech];
    minutes = tech.focus;
    seconds = 0;
    isBreak = false;
    sessionCount = 1;
    sessionCountEl.textContent = sessionCount;
    phaseLabel.textContent = isEnglish ? 'Focus' : 'تركيز';
    statusMsg.textContent = isEnglish ? '🔄 Reset' : '🔄 تمت إعادة الضبط';
    updateDisplay();
}

function updateTodayTime() {
    const hrs = Math.floor(totalSecondsToday / 3600);
    const mins = Math.floor((totalSecondsToday % 3600) / 60);
    todayTimeEl.textContent = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

// ====== أحداث الأزرار ======
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

doneTaskBtn.addEventListener('click', function() {
    taskCount++;
    taskCountEl.textContent = taskCount;
    totalTasks++;
    totalTasksEl.textContent = totalTasks;
    updateGoalProgress();
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    motivationMessage.textContent = randomQuote;
    statusMsg.textContent = isEnglish ? '✅ Lesson completed! Well done!' : '✅ درس مكتمل! أحسنت!';
});

// ====== تبديل المظهر ======
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-gold');
    this.textContent =
