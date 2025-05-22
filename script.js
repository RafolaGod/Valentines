let resultForMail = " ";
let selectedAnswersText = [];

document.addEventListener("DOMContentLoaded", function() {
    // Elementos de controle
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const startBtn = document.querySelector(".start-btn");
    const nextBtn = document.querySelectorAll(".next-btn");
    const entWishBtn = document.getElementById('enterWishBtn'); 
    const answers = document.querySelectorAll(".answer");

    const frames = [
        document.getElementById("frame1"),
        document.getElementById("frame2"),
        document.getElementById("frame3"),
        document.getElementById("frame4"),
        document.getElementById("frame5"),
        document.getElementById("frame6"),
        document.getElementById("frame7"),
        document.getElementById("frame8"),
        document.getElementById("frame9"),
        document.getElementById("frame10"),
        document.getElementById("frame11"),
        document.getElementById("frame12"),
        document.getElementById("frame13"),
        document.getElementById("frame14"),
        document.getElementById("frame15")
    ];

    let currentFrameIndex = 0;
    let results = { "⏳": 0, "🤗": 0, "🎁": 0, "💬": 0 };

    // ========================
    // MANIPULADORES PRINCIPAIS
    // ========================

    yesBtn.addEventListener("click", () => handleYesButton());

    function handleYesButton() {
        switchFrame(frames[0], frames[1]);
        let audio = document.getElementById("background-music");
        audio.volume = 0.5;
        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.addEventListener('click', () => {
                    audio.play();
                }, { once: true });
            });
        }
        audio.play();
    }

    // Transições com barra de espaço
    document.addEventListener("keydown", (e) => {
        if (e.key === " " && currentFrameIndex === 1) {
            switchFrame(frames[1], frames[2]);
        }
        if (e.key === " " && currentFrameIndex === 11) {
            switchFrame(frames[11], frames[12]);
        }
        if (e.key === " " && currentFrameIndex === 13) {
            switchFrame(frames[13], frames[14]);
        }
    });

    startBtn.addEventListener("click", () => switchFrame(frames[2], frames[3]));

    answers.forEach(answer => {
        answer.addEventListener("click", () => handleAnswerClick(answer));
    });

    nextBtn.forEach((btn, index) => {
        btn.addEventListener("click", () => handleNextButton(index));
    });

    entWishBtn.addEventListener("click", () => switchFrame(frames[12], frames[13]));

    // Botão "Nope" que se move
    document.addEventListener("mousemove", moveButton);
    let targetX = 0, targetY = 0;
    let isMoving = false;

    function moveButton(event) {
        const btnRect = noBtn.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(event.clientX - (btnRect.left + btnRect.width / 2), 2) +
            Math.pow(event.clientY - (btnRect.top + btnRect.height / 2), 2)
        );

        if (distance < 350 && !isMoving) {
            const { x, y } = getRandomPosition();
            targetX = x;
            targetY = y;
            isMoving = true;
            animateButton();
        }
    }

    function getRandomPosition() {
        return {
            x: Math.random() * (window.innerWidth - noBtn.offsetWidth),
            y: Math.random() * (window.innerHeight - noBtn.offsetHeight)
        };
    }

    function animateButton() {
        let startX = parseFloat(noBtn.style.left) || 0;
        let startY = parseFloat(noBtn.style.top) || 0;
        let progress = 0;
        let speed = 0.05;

        function step() {
            progress += speed;
            if (progress >= 1) {
                progress = 1;
                isMoving = false;
            }
            noBtn.style.left = `${lerp(startX, targetX, progress)}px`;
            noBtn.style.top = `${lerp(startY, targetY, progress)}px`;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function lerp(start, end, t) {
        return start + (end - start) * t;
    }

    function switchFrame(currentFrame, nextFrame) {
        if(currentFrameIndex > 1 && currentFrameIndex < 10){
            currentFrame.classList.add("hidden-right");
        } else {
            currentFrame.classList.add("hidden-down");
        }
        setTimeout(() => {
            currentFrame.style.display = "none";
            nextFrame.style.display = "flex";
            currentFrameIndex += 1;
        }, 500);
    }

    function handleAnswerClick(answer) {
        const selectedAnswers = document.querySelectorAll(".answer.selected");
        const answerText = answer.textContent.trim();

        if (answer.classList.contains("selected")) {
            answer.classList.remove("selected");
            results[answer.dataset.emoji] -= 1;
            selectedAnswersText = selectedAnswersText.filter(text => text !== answerText);
        } else if (selectedAnswers.length < 2) {
            answer.classList.add("selected");
            results[answer.dataset.emoji] += 1;
            selectedAnswersText.push(answerText);
        }

        console.log(selectedAnswersText);
    }

    function handleNextButton(btnIndex) {
        document.querySelectorAll(".answer.selected").forEach(answer => {
            answer.classList.remove("selected");
        });

        if (currentFrameIndex < 9 || currentFrameIndex > 9) {
            switchFrame(frames[currentFrameIndex], frames[currentFrameIndex + 1]);
        } else if(currentFrameIndex == 9) {
            switchFrame(frames[currentFrameIndex], frames[10]);
            showResults();
        }
    }

    function showResults() {
        const resultText = document.getElementById("result-text");
        const resultDescriptionText = document.getElementById("result-description-text");

        let resultHTML;
        let resultDescText;
        let switchResult;

        if(getMaxResult().includes(',')){
            switchResult = getMaxResult().split(",")[0];
        } else {
            switchResult = getMaxResult();
        }

        switch(switchResult) {
            case '⏳':
                resultHTML = `<div class="result-title">Seu estilo de amor: «TEMPO JUNTOS»:</div>`;
                resultDescText = `<div class="result-title">Você valoriza o tempo gasto</div>
                                  <div class="result-title">com seu ente querido.</div>
                                  <div class="result-title">O mais importante para você é a atenção</div>
                                  <div class="result-title">e momentos juntos ⏳</div>`;
                resultForMail = "⏳";
                break;

            case '🤗':
                resultHTML = `<div class="result-title">Seu estilo de amor: «TOQUE»:</div>`;
                resultDescText = `<div class="result-title">Você valoriza a intimidade física:</div>
                                  <div class="result-title">abraços, beijos, mãos dadas.</div>
                                  <div class="result-title">Esta é sua principal linguagem de amor 🤗</div>`;
                resultForMail = "🤗";
                break;

            case '🎁':
                resultHTML = `<div class="result-title">Seu estilo de amor: «PRESENTES»:</div>`;
                resultDescText = `<div class="result-title">Os sinais são importantes para você</div>
                                  <div class="result-title">Atenção e surpresas.</div>
                                  <div class="result-title">Você adora agradar e</div>
                                  <div class="result-title">receber presentes cheios de significado 🎁</div>`;
                resultForMail = "🎁";
                break;

            case '💬':
                resultHTML = `<div class="result-title">Seu estilo de amor: «PALAVRAS DE ENCORAJAMENTO»:</div>`;
                resultDescText = `<div class="result-title">Você expressa sentimentos por meio da gratidão 💬</div>
                                  <div class="result-title">elogios, reconhecimento e apoio.</div>
                                  <div class="result-title">Palavras calorosas são importantes para você</div>`;
                resultForMail = "💬";
                break;

            default:
                resultHTML = `<div class="result-title">${getMaxResult()}</div>`;
        }

        resultText.innerHTML = resultHTML;
        resultDescriptionText.innerHTML = resultDescText;
    }

    function getMaxResult() {
        const max = Math.max(...Object.values(results));
        return Object.entries(results)
            .filter(([_, value]) => value === max)
            .map(([emoji]) => emoji)
            .join(",");
    }

    // Animação de elogios na tela 12
    const compliments = document.querySelectorAll(".compliment");
    compliments.forEach((compliment, index) => {
        setTimeout(() => {
            compliment.style.animation = "fadeInUp 1s forwards";
        }, index * 500);
    });

    document.getElementById("frame12").style.display = "flex";
});

// Envio de desejos por e-mail
document.getElementById('enterWishBtn').addEventListener('click', function() {
    const wish1 = document.getElementById('wish1').value;
    const wish2 = document.getElementById('wish2').value;
    const wish3 = document.getElementById('wish3').value;
    const wish4 = "Resultado do teste: " + resultForMail;
    const resultString = selectedAnswersText.join(", ");

    const message = `1. ${wish1}\n2. ${wish2}\n3. ${wish3}\n4. ${wish4}\nRespostas escolhidas: ${resultString}\n`;

    emailjs.init('2oLkdF0MbjFbovK35');
    emailjs.send('service_vvz1cvm', 'template_n3qxkku', {
        message: message
    }).then(function(response) {
        // alert('Seus desejos foram enviados!');
    }, function(error) {
        // alert('Erro ao enviar: ' + JSON.stringify(error));
    });
});
