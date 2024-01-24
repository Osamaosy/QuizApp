// select element
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-answer');
let bullets = document.querySelector(".bullets");
let theResultsContainer = document.querySelector('.results');
let countdownElement  = document.querySelector('.countdown');

// set options
let currentIndex = 0 ;
let rightAnswers = 0;
let countDownInterv;

function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let quiztionObject = JSON.parse(this.responseText);
            let qCount = quiztionObject.length;

            // creat Bullets + set Quiztions count
            createBullets(qCount);
            // add quiztion data
            addQuiztionData(quiztionObject[currentIndex], qCount);

            // start cuont down
            counDown(20, qCount)

            // click on submit
            submitButton.onclick = () => {
                // get right answer
                let rightAnswer = quiztionObject[currentIndex].right_answer;
                currentIndex++;
                // check the answer
                checkAnswer(rightAnswer);

                quizArea.innerHTML = '';
                answerArea.innerHTML = '';
                // add next Quiztion
                addQuiztionData(quiztionObject[currentIndex], qCount);

                // clear and start count down
                clearInterval(countDownInterv);
                counDown(5,qCount);
                // handel bullets class
                handeleBullets();
                // show results
                showResults(qCount);
            }
        }
    };

    myRequest.open("GET", "htmlQuiztions.json", true);
    myRequest.send();
}


getQuestions();

function createBullets(num){
    countSpan.innerHTML = num;

    for(let i = 0; i<num ; i++)
    {
        // create bullet
        let theBullet = document.createElement('span');

        if(i === 0 ){
            theBullet.className = "on"
        }
        // Append bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }

}

function addQuiztionData(obj, count){
    if(currentIndex < count){

        // create h2 quiztion title
        let quiztionTitle = document.createElement("h2");
        // create Quiztion Text
        let quiztionText = document.createTextNode(obj.title);
        // append text to h2
        quiztionTitle.appendChild(quiztionText);
        // append h2 to quiz area
        quizArea.appendChild(quiztionTitle);

        // create the answer

        for(i =1 ; i<=4 ; i++)
        {
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';
            
            // create radio input
            let radioInput = document.createElement('input');
            // add type + name + id + data atribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            if(i === 1){
                radioInput.checked = true;
            }

            // create label text
            let theLable = document.createElement("label"); 
            let theLableText = document.createTextNode(obj[`answer_${i}`]);
            theLable.htmlFor = `answer_${i}`;
            theLable.appendChild(theLableText);

            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLable);
            answerArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer){
    let answers = document.getElementsByName('question');
    let theChoosenAnswer;

    for(let i =0 ; i<answers.length; i++){
        if (answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
    }
    
}

handeleBullets = () => {
    let bulletsSpan = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpan = Array.from(bulletsSpan);
    
    arrayOfSpan.forEach((span, index) =>{
        if(currentIndex === index){
            span.className = 'on';
        }
    });
}

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();
        
        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
          } else if (rightAnswers === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
          } else {
            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
          }

          theResultsContainer.innerHTML = theResults;
          theResultsContainer.style.padding = "10px";
          theResultsContainer.style.backgroundColor = "white";
          theResultsContainer.style.marginTop = "10px";
    }
}

function counDown(duration, count){
    if(currentIndex < count){
        let minutes,seconds;
        countDownInterv = setInterval(function(){
            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0)
            {
                clearInterval(countDownInterv);
                submitButton.click();
            }
        },1000)
    }

}