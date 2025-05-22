let resultForMail = " ";
let selectedAnswersText = [];
//let resultString = " ";
document.addEventListener("DOMContentLoaded", function() {
    // Элементы управления
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");
    const startBtn = document.querySelector(".start-btn");
    const nextBtn = document.querySelectorAll(".next-btn");
   //const nextBtnBel = document.getElementById(".next-btn-bel");
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

    // Текущий фрейм и результаты
    let currentFrameIndex = 0;
    let results = { "⏳": 0, "🤗": 0, "🎁": 0, "💬": 0 };

    // ========================
    // ОСНОВНЫЕ ОБРАБОТЧИКИ
    // ========================

    // 1. Переход на фрейм с инструкцией (Of course)
    yesBtn.addEventListener("click", () => handleYesButton());
    function handleYesButton() {
        switchFrame(frames[0], frames[1]);
        let audio = document.getElementById("background-music");
        audio.volume = 0.5; // Устанавливаем громкость (от 0.0 до 1.0)
    
        // Пытаемся запустить музыку сразу
        let playPromise = audio.play();

        // Если браузер заблокировал автозапуск, ждем взаимодействия пользователя
        if (playPromise !== undefined) {
            playPromise.catch(() => {
            document.addEventListener('click', () => {
                audio.play();
            }, { once: true }); // Срабатывает только один раз
        });
    }
        audio.play();
    }
    // 2. Переход к первому вопросу (Start)
    document.addEventListener("keydown", (e) => {
        if (e.key === " " && currentFrameIndex === 1) {
            switchFrame(frames[1], frames[2]);
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === " " && currentFrameIndex === 11) {
            switchFrame(frames[11], frames[12]);
        }
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === " " && currentFrameIndex === 13) {
            switchFrame(frames[13], frames[14]);
        }
    })


    startBtn.addEventListener("click", () => switchFrame(frames[2], frames[3]));
    // 3. Обработка выбора ответов
    answers.forEach(answer => {
        answer.addEventListener("click", () => handleAnswerClick(answer));
    });

    // 4. Обработка кнопок NEXT
    nextBtn.forEach((btn, index) => {
        btn.addEventListener("click", () => handleNextButton(index));
    });
    entWishBtn.addEventListener("click", () => switchFrame(frames[12], frames[13]));

    // nextBtnBel.forEach((btn, index) => {
    //     btn.addEventListener("click", () => switchFrame(frames[10], frames[11]));
    // });
    
    


    // 5. Убегающая кнопка "Nope"
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
            x: Math.max(0, Math.min(
                Math.random() * (window.innerWidth - noBtn.offsetWidth),
                window.innerWidth - noBtn.offsetWidth
            )),
            y: Math.max(0, Math.min(
                Math.random() * (window.innerHeight - noBtn.offsetHeight),
                window.innerHeight - noBtn.offsetHeight
            ))
        };
    }

    function animateButton() {
        let startX = parseFloat(noBtn.style.left) || 0;
        let startY = parseFloat(noBtn.style.top) || 0;
        let progress = 0;
        let speed = 0.05; // Чем меньше, тем плавнее движение

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


    // Переключение фреймов с анимацией
    function switchFrame(currentFrame, nextFrame) {
        if(currentFrameIndex > 1 && currentFrameIndex < 10){
        
        currentFrame.classList.add("hidden-right");
        }
        else{
            currentFrame.classList.add("hidden-down");
        }
        setTimeout(() => {
            currentFrame.style.display = "none";
            nextFrame.style.display = "flex";
            currentFrameIndex+=1

        }, 500);
    }

    // Обработка выбора ответа
    // Глобальный массив для хранения текста выбранных ответов


function handleAnswerClick(answer) {
    const selectedAnswers = document.querySelectorAll(".answer.selected");
    const answerText = answer.textContent.trim(); // Получаем текст ответа

    if (answer.classList.contains("selected")) {
        // Отмена выбора
        answer.classList.remove("selected");
        results[answer.dataset.emoji] -= 1;

        // Удаляем текст ответа из массива
        selectedAnswersText = selectedAnswersText.filter(text => text !== answerText);
    } else if (selectedAnswers.length < 2) {
        // Выбор (максимум 2 ответа)
        answer.classList.add("selected");
        results[answer.dataset.emoji] += 1;

        // Добавляем текст ответа в массив
        selectedAnswersText.push(answerText);
    }

    // Для проверки выведем массив в консоль
    console.log(selectedAnswersText);
}


    // Обработка кнопки NEXT
    function handleNextButton(btnIndex) {
        // Сброс выбранных ответов перед переходом
        document.querySelectorAll(".answer.selected").forEach(answer => {
            answer.classList.remove("selected");
        });

         //Переход к следующему фрейму или результатам
         if (currentFrameIndex < 9 || currentFrameIndex >9 ) { // 7 вопросов (frame3-frame9)
             switchFrame(frames[currentFrameIndex], frames[currentFrameIndex + 1]);
             
         } else if(currentFrameIndex ==9) {
             switchFrame(frames[currentFrameIndex], frames[10]);
             showResults();
         }
        
    }

    //Mostrar resultados
    // função showResults() {
    // const resultText = document.getElementById("texto-resultado");
    // const maxEmoji = Object.entries(resultados).reduce(
    // (a, b) => a[1] > b[1] ? uma: b
    // )[0];
        
    // // Textos de resultados (podem ser personalizados)
    // const resultMessages = {
    // "⏳": "Seu estilo de amor: Tempo juntos! 🕰️",
    // "🤗": "Seu estilo de amor: Intimidade física! 💞",
    // "🎁": "Seu estilo de amor: Presentes e carinho! 🎀",
    // "💬": "Seu estilo de amor: palavras de encorajamento! 💌"
    // };
        
    //     resultText.textContent = resultMessages[maxEmoji];
    // }

    // ... (предыдущий код без изменений)
    
    function showResults() {
    const resultText = document.getElementById("result-text");
    const resultDescriptionText = document.getElementById("result-description-text");
    // Формируем текст с результатами
    let resultHTML;
    let resultDescText;
    let switchResult;
    if(getMaxResult().length > 1){
        let switchResultArray = getMaxResult().split(",");
        switchResult = switchResultArray[0];
        console.log(switchResult);
    }   
    else {
        switchResult = getMaxResult();
    }
    
    switch(switchResult)
    {
        case '⏳': resultHTML =` <div class="result-title">Seu estilo de amor: «TEMPO JUNTOS»:</div>`;
                    resultDescText = `<div class="result-title">Você valoriza o tempo gasto</div>
                                    <div class="result-title">com seu ente querido.</div>
                                    <div class="result-title">O mais importante para você é a atenção</div>
                                    <div class="result-title"> e momentos juntos ⏳ </div>
                                        
                    `;
                    resultadoParaCorreio = "⏳";
        quebrar;

        case '🤗': resultHTML =` <div class="result-title">Seu estilo de amor: «TOQUE»:</div>`;
                    resultDescText = `<div class="result-title">Você valoriza a intimidade física: </div>
                                        <div class="result-title">abraços, beijos, mãos dadas.</div>
                                        <div class="result-title">Esta é sua principal linguagem de amor🤗 </div>
                    `;
                    resultadoParaCorreio = "🤗";
        break;
        case '🎁': resultHTML =` <div class="result-title">Seu estilo de amor: «PRESENTES»:</div>`;
                    resultDescText = `<div class="result-title">Os sinais são importantes para você</div>
                                        <div class="result-title">Atenção e surpresas.</div>
                                        <div class="result-title">Você adora agradar e</div>
                                        <div class="result-title">Receba presentes,</div>
                                        <div class="result-title">cheio de significado 🎁 </div>
                    
                    `;
                    resultForMail = "🎁";
        break;
        case '💬':resultHTML =` <div class="result-title">Seu estilo de amor: «PALAVRAS DE ENCORAJAMENTO»:</div>`;
                resultDescText = `<div class="result-title">Você expressa sentimentos por meio da gratidão 💬 </div>
                                    <div class="result-title">elogios, reconhecimento e apoio.</div>
                                    <div class="result-title">Palavras calorosas são importantes para você</div>
                                    <div class="result-title">Obrigado 💬</div>
                `;  
                resultadoParaCorreio = "💬";
        break;
        default:
            resultHTML =` <div class="result-title">${getMaxResult()}</div>`;

    }

    resultText.innerHTML = resultHTML;
    resultDescriptionText.innerHTML = resultDescText;
    //document.getElementById("frame11").style.display = "flex";
}

function getMaxResult() {
    const max = Math.max(...Object.values(results));
    const emojis = Object.entries(results)
        .filter(([_, value]) => value === max)
        .map(([emoji]) => emoji);
        
    return emojis.join(",");
}
document.addEventListener("DOMContentLoaded", function () {
    const compliments = document.querySelectorAll(".compliment");

    compliments.forEach((compliment, index) => {
        // Задержка для каждого комплимента
        setTimeout(() => {
            compliment.style.animation = "fadeInUp 1s forwards";
        }, index * 500); // Каждый комплимент появляется через 0.5 секунды после предыдущего
    });

    // Показываем фрейм
    document.getElementById("frame12").style.display = "flex";
});

});




document.getElementById('enterWishBtn').addEventListener('click', function() {

    console.log('number:', resultForMail);
    

    const wish1 = document.getElementById('wish1').value;
    const wish2 = document.getElementById('wish2').value;
    const wish3 = document.getElementById('wish3').value;
    const wish4 = "Результат теста" + String(resultForMail);
    const resultString = selectedAnswersText.join(", ");

    const message = `1. ${wish1}\n2. ${wish2}\n3. ${wish3}\n4.${wish4}\n Выбранные ответы:${resultString}\n`;
    
    // Инициализация EmailJS
    emailjs.init('2oLkdF0MbjFbovK35'); // Замените на ваш User ID из EmailJS

    // Отправка email
    emailjs.send('service_vvz1cvm', 'template_n3qxkku', {
        message: message
    }).then(function(response) {
        //alert('Ваши желания отправлены!');
    }, function(error) {
        //alert('Ошибка при отправке: ' + JSON.stringify(error));
    });
    
});
