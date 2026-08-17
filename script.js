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
let goalLessons = 2;
let isEnglish = false;

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
const goalSelect = document.getElementById('goalSelect');
const goalDisplay = document.getElementById('goalDisplay');
const goalProgress = document.getElementById('goalProgress');
const motivationMessage = document.getElementById('motivationMessage');
const welcomeTitle = document.getElementById('welcomeTitle');
const welcomeSub = document.getElementById('welcomeSub');
const welcomeDef = document.getElementById('welcomeDef');
const goalLabel = document.getElementById('goalLabel');

// ====== زر الدخول ======
enterBtn.addEventListener('click', function(e) {
    e.preventDefault();
    welcomeScreen.classList.remove('active');
    mainScreen.classList.add('active');
});

// ====== زر الرجوع ======
backBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    // إيقاف المؤقت إذا كان شغال
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
    mainScreen.classList.remove('active');
    welcomeScreen.classList.add('active');
    statusMsg.textContent = isEnglish ? '✨ Ready to focus' : '✨ جاهز للتركيز';
});

// ====== اللغة ======
langToggle.addEventListener('click', function(e) {
    e.preventDefault();
    isEnglish = !isEnglish;
    document.body.classList.toggle('lang-en', isEnglish);
    langToggle.textContent = isEnglish ? '🇸🇦 عربي' : '🇬🇧 English';

    if (isEnglish) {
        welcomeTitle.innerHTML = 'Welcome to <span class="gold">Learning &<br>Focus Strategies</span>';
        welcomeSub.textContent = 'Master the art of focus and boost your academic performance';
        welcomeDef.innerHTML =
            '<strong>📖 About this section:</strong><br>This section is dedicated to developing learning and focus skills through proven techniques like <strong>Pomodoro</strong>, <strong>52/17</strong>, and <strong>Deep Study</strong>. Our goal is to help you achieve your academic goals efficiently and without burnout.';
        goalLabel.textContent = '🎯 Set your goal:';
        doneTaskBtn.textContent = '✅ Completed a lesson';
        statusMsg.textContent = '✨ Ready to focus';
        updateGoalDisplay();
    } else {
        welcomeTitle.innerHTML = 'أهلاً بك في <span class="gold">قسم استراتيجيات<br>التعلم والتركيز</span>';
        welcomeSub.textContent = 'حيث تتقن فن التركيز وتُحسّن أداءك الدراسي';
        welcomeDef.innerHTML =
            '<strong>📖 تعريف القسم:</strong><br>هذا القسم مخصص لتطوير مهارات التعلم والتركيز من خلال تقنيات مدروسة مثل <strong>بومودورو</strong>، <strong>52/17</strong>، و<strong>الدراسة المكثفة</strong>. نهدف إلى مساعدتك على تحقيق أهدافك الأكاديمية بكفاءة وبدون إرهاق.';
        goalLabel.textContent = '🎯 حدّد هدفك:';
        doneTaskBtn.textContent = '✅ أنجزت درساً';
        statusMsg.textContent = '✨ جاهز للتركيز';
        updateGoalDisplay();
    }
});

// ====== تبديل التقنيات ======
techBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        techBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentTech = this.dataset.tech;
        resetTimer();
        updateDisplay();
    });
});

// ====== الهدف ======
goalSelect.addEventListener('change', function(e) {
    e.preventDefault();
    const val = this.value;
    const parts = val.split('-');
    const num = parseInt(parts[0]);
    goalLessons = num;
    updateGoalDisplay();
    updateGoalProgress();
});

function updateGoalDisplay() {
    const val = goalSelect.value;
    const parts = val.split('-');
    const num = parseInt(parts[0]);
    const type = parts[1];
    const label = isEnglish ?
        (type === 'lesson' ? `${num} lesson${num > 1 ? 's' : ''}` : `${num} unit${num > 1 ? 's' : ''}`) :
        (type === 'lesson' ? `${num} درس${num > 1 ? 'ً' : ''}` : `${num} وحدة${num > 1 ? 'ً' : ''}`);
    goalDisplay.textContent = isEnglish ? `🎯 Goal: ${label}` : `🎯 الهدف: ${label}`;
}

function updateGoalProgress() {
    goalProgress.textContent = `${taskCount}/${goalLessons}`;
    if (taskCount >= goalLessons) {
        motivationMessage.textContent = isEnglish ?
            '🎉 Congratulations! You achieved your goal! 🎉' :
            '🎉 مبروك! لقد حققت هدفك! 🎉';
        doneTaskBtn.style.borderColor = '#d4a847';
        doneTaskBtn.style.color = '#d4a847';
    } else {
        doneTaskBtn.style.borderColor = 'rgba(212, 168, 71, 0.1)';
        doneTaskBtn.style.color = 'var(--text-primary)';
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

// ====== أحداث الأزرار (مع منع الـ default) ======
startBtn.addEventListener('click', function(e) {
    e.preventDefault();
    startTimer();
});

pauseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    pauseTimer();
});

resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    resetTimer();
});

doneTaskBtn.addEventListener('click', function(e) {
    e.preventDefault();
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
themeToggle.addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.toggle('dark-gold');
    this.textContent = document.body.classList.contains('dark-gold') ? 'داكن' : 'فاتح';
});

// ====== تهيئة أولية ======
resetTimer();
updateGoalDisplay();
updateGoalProgress();
