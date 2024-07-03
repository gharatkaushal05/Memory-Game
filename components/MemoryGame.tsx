"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const generateDeck = () => {
  const memoryCards = [
    "cat",
    "croc",
    "dog",
    "elephant",
    "fox",
    "monkey",
    "owl",
    "zebra",
  ];
  const deck = [...memoryCards, ...memoryCards];
  return deck.sort(() => Math.random() - 0.5);
};

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false); // Initial visibility set to false
  const [gameStarted, setGameStarted] = useState<boolean>(false); // State for game started
  const [countdown, setCountdown] = useState<number>(5); // Countdown timer for visibility

  // Effect to toggle visibility and countdown after 5 seconds when gameStarted is true
  useEffect(() => {
    if (gameStarted && visible) {
      const visibilityTimer = setTimeout(() => {
        setVisible(false);
        setCountdown(5); // Reset countdown after visibility ends
      }, 5000);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1); // Update countdown every second
      }, 1000);

      // Clean up timers on component unmount or visibility change
      return () => {
        clearTimeout(visibilityTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [gameStarted, visible]); // Run effect when gameStarted or visible changes

  useEffect(() => {
    const checkForMatch = () => {
      const [first, second] = flipped;
      if (cards[first] === cards[second]) {
        setSolved([...solved, ...flipped]);
        setScore((prev) => prev + 20);
      }
      setFlipped([]);
    };

    if (flipped.length === 2) {
      setTimeout(() => {
        checkForMatch();
      }, 1000);
    }
  }, [cards, flipped, solved]);

  const handleClick = (index: number) => {
    if (!gameStarted || flipped.includes(index) || flipped.length >= 2) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const handleStart = () => {
    setGameStarted(true); // Start the game
    setVisible(true); // Show cards initially
  };

  const gameOver = solved.length === cards.length;

  const resetGame = () => {
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
    setScore(0);
    setVisible(false); // Reset visibility state
    setGameStarted(false); // Reset game started state
  };

  return (
    <div className="text-center flex items-center justify-center flex-col">
      {!gameStarted && (
        <button
          onClick={handleStart}
          className="p-5 bg-slate-500 rounded-xl mb-5"
        >
          Start Game
        </button>
      )}
      {gameOver && <h2>You WON! Congrats!</h2>}
      <div className="grid grid-cols-4 gap-5 mt-3">
        {cards.map((card, index) => (
          <div
            className={`bg-slate-200 w-28 h-28 flex justify-center items-center cursor-pointer transition-transform duration-300 ${
              flipped.includes(index) || solved.includes(index) || visible
                ? "rotate-360"
                : ""
            }`}
            key={index}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || solved.includes(index) || visible ? (
              <Image
                src={`/memory-cards/${card}.png`}
                width={100}
                height={100}
                alt="Memory Card"
              />
            ) : (
              "?"
            )}
          </div>
        ))}
      </div>
      {visible && (
        <p className="mt-3">
          Images will hide in {countdown} seconds
        </p>
      )}
      <p className="mt-3">EdCoins: {score}</p>
      {gameStarted && (
        <button
          onClick={resetGame}
          className="p-5 bg-slate-500 rounded-xl mt-5"
        >
          Restart Game
        </button>
      )}
    </div>
  );
}
