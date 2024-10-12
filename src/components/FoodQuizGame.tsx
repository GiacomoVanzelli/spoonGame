import React, { useState, useEffect } from 'react';
import { Question, veryEasyQuestions, easyQuestions, mediumQuestions, hardQuestions, veryHardQuestions, expertiseQuestions } from './questions';
import { AnalogClock } from './AnalogClock';
import '../css/FoodQuizGame.css'; 
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FoodQuizGame: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCounter, setCorrectCounter] = useState<number>(() => {
    const saved = localStorage.getItem('correctCounter');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lives, setLives] = useState<number>(() => {
    const saved = localStorage.getItem('lives');
    return saved ? parseInt(saved, 10) : 3;
  });
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem('level');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [highestUnlockedLevel, setHighestUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('highestUnlockedLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [requiredSpoons, setRequiredSpoons] = useState<number>(25);
  const [requiredSpoonsForMedium, setRequiredSpoonsForMedium] = useState<number>(100);
  const [requiredSpoonsForHard, setRequiredSpoonsForHard] = useState<number>(400);
  const [requiredSpoonsForVeryHard, setRequiredSpoonsForVeryHard] = useState<number>(1600);
  const [requiredSpoonsForExpertise, setRequiredSpoonsForExpertise] = useState<number>(64000);
  const [currentReward, setCurrentReward] = useState<number>(1);

  useEffect(() => {
    shuffleQuestions();
    setCurrentReward(Math.pow(2, level - 1));
  }, [level]);

  useEffect(() => {
    localStorage.setItem('correctCounter', correctCounter.toString());
  }, [correctCounter]);

  useEffect(() => {
    localStorage.setItem('lives', lives.toString());
  }, [lives]);

  useEffect(() => {
    localStorage.setItem('level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('highestUnlockedLevel', highestUnlockedLevel.toString());
  }, [highestUnlockedLevel]);

  useEffect(() => {
    document.body.style.backgroundColor = '#800080';
    document.body.style.color = 'white';
    document.body.style.margin = '0';
    document.body.style.height = '100vh';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
      document.body.style.margin = '';
      document.body.style.height = '';
      document.body.style.display = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
    };
  }, []);

  useEffect(() => {
    if (lives === 0) {
      setShowScore(true);
      return;
    }

    let timer: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (timer) clearInterval(timer);
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, lives, isTimerRunning]);

  const shuffleQuestions = () => {
    let questionSet;
    switch(level) {
      case 1:
        questionSet = veryEasyQuestions;
        break;
      case 2:
        questionSet = easyQuestions;
        break;
      case 3:
        questionSet = mediumQuestions;
        break;
      case 4:
        questionSet = hardQuestions;
        break;
      case 5:
        questionSet = veryHardQuestions;
        break;
      case 6:
        questionSet = expertiseQuestions;
        break;
      default:
        questionSet = veryEasyQuestions;
    }
    const shuffledQuestions = shuffleArray(questionSet).map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));
    setQuestions(shuffledQuestions);
  };

  const handleAnswerClick = (selectedOption: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(selectedOption);
    setIsAnswered(true);
    setIsTimerRunning(false);
    
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setCorrectCounter(prevCounter => prevCounter + currentReward);
    } else {
      handleIncorrectAnswer();
    }
  };

  const handleIncorrectAnswer = () => {
    setLives(prevLives => {
      const newLives = prevLives - 1;
      if (newLives === 0) {
        setShowScore(true);
      }
      return newLives;
    });
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(10);
    setIsTimerRunning(true);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleTimerEnd = () => {
    if (!isAnswered) {
      handleIncorrectAnswer();
      setIsAnswered(true);
      setIsTimerRunning(false);
    }
  };

  const handlePurchaseNextLevel = () => {
    if (level === highestUnlockedLevel) {
      if (level === 1 && correctCounter >= requiredSpoons) {
        setCorrectCounter(prevCounter => prevCounter - requiredSpoons);
        setHighestUnlockedLevel(prevLevel => prevLevel + 1);
        setRequiredSpoons(prevRequired => prevRequired + 25);
      } else if (level === 2 && correctCounter >= requiredSpoonsForMedium) {
        setCorrectCounter(prevCounter => prevCounter - requiredSpoonsForMedium);
        setHighestUnlockedLevel(prevLevel => prevLevel + 1);
      } else if (level === 3 && correctCounter >= requiredSpoonsForHard) {
        setCorrectCounter(prevCounter => prevCounter - requiredSpoonsForHard);
        setHighestUnlockedLevel(prevLevel => prevLevel + 1);
      } else if (level === 4 && correctCounter >= requiredSpoonsForVeryHard) {
        setCorrectCounter(prevCounter => prevCounter - requiredSpoonsForVeryHard);
        setHighestUnlockedLevel(prevLevel => prevLevel + 1);
      } else if (level === 5 && correctCounter >= requiredSpoonsForExpertise) {
        setCorrectCounter(prevCounter => prevCounter - requiredSpoonsForExpertise);
        setHighestUnlockedLevel(prevLevel => prevLevel + 1);
      }
    }
  };

  const handleGoToNextLevel = () => {
    if (level < highestUnlockedLevel) {
      setLevel(prevLevel => prevLevel + 1);
      setCurrentQuestion(0);
      setTimeLeft(10);
      shuffleQuestions();
      setCurrentReward(prevReward => prevReward * 2);
    }
  };

  const handlePreviousLevel = () => {
    if (level > 1) {
      setLevel(prevLevel => prevLevel - 1);
      setCurrentQuestion(0);
      setTimeLeft(10);
      shuffleQuestions();
      setCurrentReward(prevReward => prevReward / 2);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setLives(3);
    setTimeLeft(10);
    setIsTimerRunning(true);
    shuffleQuestions();
  };

  const renderHearts = () => {
    const hearts = ['💔', '💔', '💔'];
    for (let i = 2; i >= 3 - lives; i--) {
      hearts[i] = '❤️';
    }
    return hearts.join('');
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="food-quiz-game">
      <div className="correct-counter">🥄 {correctCounter}</div>
      <div className="lives-counter">{renderHearts()}</div>
      <h1>Level {level}: {level === 1 ? "Very Easy" : level === 2 ? "Easy" : level === 3 ? "Medium" : level === 4 ? "Hard" : level === 5 ? "Very Hard" : "Expertise"}</h1>
      <div className="reward-info">Reward per correct answer: {currentReward} 🥄</div>
      {showScore ? (
        <div className="score-section">
          <h2>Game Over!</h2>
          <p>You scored {score} out of {questions.length}</p>
          <p>Current Level: {level}</p>
          <p>Spoons earned this round: {score * currentReward}</p>
          <button className="game-button" onClick={restartGame}>Restart Level</button>
        </div>
      ) : (
        <div className="question-section">
          <div className="timer">
            <AnalogClock timeLeft={timeLeft} totalTime={10} />
          </div>
          <p className="question-text">{questions[currentQuestion].question}</p>
          <div className="answer-options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={isAnswered}
                className={`answer-button ${selectedAnswer === option ? 'selected' : ''} ${isAnswered && option === questions[currentQuestion].correctAnswer ? 'correct' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
          {isAnswered && (
            <button className="game-button" onClick={handleNextQuestion}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
          )}
          <div className="level-button-container">
            {level > 1 && (
              <button 
                className="level-button" 
                onClick={handlePreviousLevel}
              >
                Previous Level
              </button>
            )}
            {level === highestUnlockedLevel && level < 6 && (
              <button 
                className="level-button" 
                onClick={handlePurchaseNextLevel}
                disabled={
                  level === 1 ? correctCounter < requiredSpoons : 
                  level === 2 ? correctCounter < requiredSpoonsForMedium :
                  level === 3 ? correctCounter < requiredSpoonsForHard :
                  level === 4 ? correctCounter < requiredSpoonsForVeryHard :
                  correctCounter < requiredSpoonsForExpertise
                }
              >
                Purchase Next Level {
                  level === 1 ? requiredSpoons : 
                  level === 2 ? requiredSpoonsForMedium :
                  level === 3 ? requiredSpoonsForHard :
                  level === 4 ? requiredSpoonsForVeryHard :
                  requiredSpoonsForExpertise
                } 🥄
              </button>
            )}
            {level < highestUnlockedLevel && (
              <button 
                className="level-button" 
                onClick={handleGoToNextLevel}
              >
                Go to Next Level
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default FoodQuizGame;