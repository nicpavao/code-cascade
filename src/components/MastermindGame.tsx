import { useState } from "react";
import "../mastermind.css"; // Import CSS file

const COLORS: string[] = ["red", "blue", "green", "yellow", "orange", "purple"];
const CODE_LENGTH = 4;

type Guess = {
  guess: string[];
  correctPosition: number;
  correctColor: number;
};

const generateSecretCode = (): string[] =>
  Array.from({ length: CODE_LENGTH }, () =>
    COLORS[Math.floor(Math.random() * COLORS.length)]
  );

export default function MastermindGame() {
  const [secretCode, setSecretCode] = useState<string[]>(generateSecretCode);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState<boolean>(false);

  const checkGuess = (): void => {
    if (currentGuess.length < CODE_LENGTH) return;

    let correctPosition = 0;
    let correctColor = 0;
    let checkedIndices = new Set<number>();

    currentGuess.forEach((color, index) => {
      if (color === secretCode[index]) {
        correctPosition++;
        checkedIndices.add(index);
      }
    });

    currentGuess.forEach((color, index) => {
      if (color !== secretCode[index] && secretCode.includes(color)) {
        const availableIndex = secretCode.findIndex(
          (c, i) => c === color && !checkedIndices.has(i)
        );
        if (availableIndex !== -1) {
          correctColor++;
          checkedIndices.add(availableIndex);
        }
      }
    });

    setGuesses([...guesses, { guess: currentGuess, correctPosition, correctColor }]);
    setCurrentGuess([]);

    if (correctPosition === CODE_LENGTH) setGameWon(true);
  };

  const restartGame = (): void => {
    setSecretCode(generateSecretCode());
    setGuesses([]);
    setCurrentGuess([]);
    setGameWon(false);
  };

  return (
    <div className="game-container">
      <h1 className="title">Mastermind</h1>
      {gameWon && <div className="win-message">🎉 Hoooooray</div>}
      <div className="grid">
        {guesses.map(({ guess, correctPosition, correctColor }, i) => (
          <div key={i} className="guess-row">
            {guess.map((color, idx) => (
              <div key={idx} className={`peg ${color}`}></div>
            ))}
            <div className="feedback">
              {[...Array(correctPosition)].map((_, i) => (
                <div key={`pos-${i}`} className="peg feedback-green"></div>
              ))}
              {[...Array(correctColor)].map((_, i) => (
                <div key={`col-${i}`} className="peg feedback-orange"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="color-selector">
        {COLORS.map((color) => (
          <button
            key={color}
            className={`color-button ${color}`}
            onClick={() =>
              setCurrentGuess((prev) =>
                prev.length < CODE_LENGTH ? [...prev, color] : prev
              )
            }
          >
            {color}
          </button>
        ))}
      </div>
      <button className="submit-btn" onClick={checkGuess}>Submit Guess</button>
      <button className="restart-btn" onClick={restartGame}>Restart Game</button>
    </div>
  );
}
