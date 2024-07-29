
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [visible, setVisible] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  // Effect to toggle visibility and countdown after 5 seconds when gameStarted is true
  useEffect(() => {
    if (gameStarted && visible) {
      const visibilityTimer = setTimeout(() => {
        setVisible(false);
        setCountdown(5);
      }, 5000);

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => {
        clearTimeout(visibilityTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [gameStarted, visible]);

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
    setGameStarted(true);
    setVisible(true);
  };

  const gameOver = solved.length === cards.length;

  const resetGame = () => {
    setCards(generateDeck());
    setFlipped([]);
    setSolved([]);
    setScore(0);
    setVisible(false);
    setGameStarted(false);
  };

  return (
    <div className="text-center flex items-center justify-center flex-col p-4 md:p-6 lg:p-8">
      {gameOver && <h2 className="text-2xl md:text-3xl">You WON! Congrats!</h2>}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-5 mt-3">
        {cards.map((card, index) => (
          <motion.div
            className="bg-customYellow w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex justify-center items-center cursor-pointer rounded-xl relative"
            key={index}
            onClick={() => handleClick(index)}
            initial={{ rotateY: 0 }}
            animate={
              flipped.includes(index) || solved.includes(index) || visible
                ? { rotateY: 180 }
                : { rotateY: 0 }
            }
            transition={{ duration: 0.6 }}
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute w-full h-full flex items-center justify-center backface-hidden"
              style={{ backfaceVisibility: "hidden" }}
            >
              {flipped.includes(index) || solved.includes(index) || visible ? (
                <Image
                  src={`/memory-cards/${card}.png`}
                  width={80}
                  height={80}
                  alt="Memory Card"
                />
              ) : (
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">?</span>
              )}
            </div>
            <div
              className="absolute w-full h-full flex items-center justify-center"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {flipped.includes(index) || solved.includes(index) || visible ? (
                <Image
                  src={`/memory-cards/${card}.png`}
                  width={80}
                  height={80}
                  alt="Memory Card"
                />
              ) : (
                <span className="text-xl sm:text-2xl md:text-3xl font-bold">?</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {visible && (
        <p className="mt-3 text-sm sm:text-lg md:text-xl">
          Images will hide in {countdown} seconds
        </p>
      )}
      <div className="bg-customGray w-[80px] sm:w-[100px] md:w-[120px] my-2 sm:my-4 md:my-8 h-[30px] sm:h-[40px] md:h-[50px] rounded-xl">
        <p className="mt-1 text-xs sm:text-sm md:text-base">EdCoins: {score}</p>
      </div>

      {gameStarted && (
        <button
          onClick={resetGame}
          className="p-3 sm:p-4 md:p-5 bg-customGray rounded-xl mt-4 sm:mt-5 md:mt-6"
        >
          Restart Game
        </button>
      )}
      {!gameStarted && (
        <button
          onClick={handleStart}
          className="p-3 sm:p-4 md:p-5 bg-customGray rounded-xl mt-4 sm:mt-5 md:mt-6"
        >
          Start Game
        </button>
      )}
    </div>
  );
}


