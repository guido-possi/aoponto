document.addEventListener('DOMContentLoaded', (event) => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const resetButton = document.getElementById('resetButton');
    const pauseButton = document.getElementById('pauseButton');
    const timerDisplay = document.getElementById('timer');
    const alarmSound = document.getElementById('alarmSound');
    const timeInput = document.getElementById('timeInput');
    const alarmSelect = document.getElementById('alarmSelect');
    const testAlarmButton = document.getElementById('testAlarmButton');
    const volumeControl = document.getElementById('volumeControl');
    const currentTimeDisplay = document.getElementById('currentTime');

    let timer;
    let timeLeft;
    let isPaused = false;
    let alarmCount = 0;
    let alarmInterval;
    let alarmCycleCount = 0;
    let resetAlarmTimeout;
    let totalAlarmRepeats = 5;

    // Carregar configurações armazenadas
    if (localStorage.getItem('timeInput')) {
        timeInput.value = localStorage.getItem('timeInput');
    }
    if (localStorage.getItem('alarmSelect')) {
        alarmSelect.value = localStorage.getItem('alarmSelect');
    }

    // Solicitar permissão para notificações
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notificações permitidas');
            }
        });
    }

    // Mostrar o horário atual ao carregar a página
    showCurrentTime();
    
    // Iniciar o cronômetro automaticamente ao carregar a página
    startTimer();

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopAlarm);
    resetButton.addEventListener('click', resetTimer);
    pauseButton.addEventListener('click', togglePause);
    testAlarmButton.addEventListener('click', testAlarm);
    volumeControl.addEventListener('input', updateVolume);

    function startTimer() {
        if (!isPaused) {
            timeLeft = parseInt(timeInput.value) * 60;
        }

        if (timer) {
            clearInterval(timer);
        }

        updateTimerDisplay();
        saveSettings();

        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    playAlarm();
                }
            }
        }, 1000);
    }

    function stopAlarm() {
        clearInterval(alarmInterval);
        clearTimeout(resetAlarmTimeout);
        alarmSound.pause();
        alarmSound.currentTime = 0;
        stopButton.style.display = 'none';
        alarmCycleCount = 0;
    }

    function resetTimer() {
        clearInterval(timer);
        isPaused = false;
        timeLeft = parseInt(timeInput.value) * 60;
        updateTimerDisplay();
    }

    function togglePause() {
        if (isPaused) {
            isPaused = false;
            startTimer();
        } else {
            isPaused = true;
            clearInterval(timer);
        }
    }

    function playAlarm() {
        alarmSound.src = alarmSelect.value;
        alarmSound.play();
        stopButton.style.display = 'block';
        alarmCount = 1;
        alarmCycleCount++;

        alarmInterval = setInterval(() => {
            if (alarmCount < 3) {
                alarmSound.play();
                alarmCount++;
            } else {
                clearInterval(alarmInterval);
            }
        }, 3000);

        if (alarmCycleCount < totalAlarmRepeats) {
            resetAlarmTimeout = setTimeout(playAlarm, 40000);
        }

        sendNotification();
    }

    function testAlarm() {
        alarmSound.src = alarmSelect.value;
        alarmSound.play();
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function saveSettings() {
        localStorage.setItem('timeInput', timeInput.value);
        localStorage.setItem('alarmSelect', alarmSelect.value);
    }

    function updateVolume() {
        alarmSound.volume = volumeControl.value;
    }

    function showCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        currentTimeDisplay.textContent = `Saída almoço: ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    }

    function sendNotification() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification('Ao Ponto - Countdown Timer', {
                    body: 'O cronômetro terminou!',
                    icon: 'icon.png',
                    badge: 'icon.png'
                });
            });
        }
    }
});
