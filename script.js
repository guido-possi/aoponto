document.addEventListener('DOMContentLoaded', (event) => {
    let startButton = document.getElementById('startButton');
    let timerDisplay = document.getElementById('timer');
    let alarmSound = document.getElementById('alarmSound');
    let timeInput = document.getElementById('timeInput');
    let alarmSelect = document.getElementById('alarmSelect');
    let testAlarmButton = document.getElementById('testAlarmButton');
    let timer;
    let timeLeft;
    let alarmCount = 0;
    let alarmInterval;

    startButton.addEventListener('click', () => {
        if (timer) {
            clearInterval(timer);
        }
        timeLeft = parseInt(timeInput.value) * 60;
        updateTimerDisplay();

        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                playAlarm();
            }
        }, 1000);
    });

    testAlarmButton.addEventListener('click', () => {
        alarmSound.src = alarmSelect.value;
        alarmSound.play();
    });

    function playAlarm() {
        alarmSound.src = alarmSelect.value;
        alarmSound.play();
        alarmCount = 1;
        alarmInterval = setInterval(() => {
            if (alarmCount < 3) {
                alarmSound.play();
                alarmCount++;
            } else {
                clearInterval(alarmInterval);
            }
        }, 3000);
    }

    function updateTimerDisplay() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
