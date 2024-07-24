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
    <div className="text-center flex items-center justify-center flex-col">
      {gameOver && <h2>You WON! Congrats!</h2>}
      <div className="grid grid-cols-4 gap-5 mt-3">
        {cards.map((card, index) => (
          <motion.div
            className="bg-customYellow w-28 h-28 flex justify-center items-center cursor-pointer rounded-xl relative"
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
                  width={100}
                  height={100}
                  alt="Memory Card"
                />
              ) : (
                <span className="text-3xl font-bold">?</span>
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
                  width={100}
                  height={100}
                  alt="Memory Card"
                />
              ) : (
                <span className="text-3xl font-bold">?</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {visible && (
        <p className="mt-3">
          Images will hide in {countdown} seconds
        </p>
      )}
      <div className="bg-customGray w-[120px] my-8 h-[50px] rounded-xl">
        <p className="mt-3">EdCoins: {score}</p>
      </div>

      {gameStarted && (
        <button
          onClick={resetGame}
          className="p-5 bg-customGray rounded-xl mt-5"
        >
          Restart Game
        </button>
      )}
      {!gameStarted && (
        <button
          onClick={handleStart}
          className="p-5 bg-customGray rounded-xl mt-5"
        >
          Start Game
        </button>
      )}
    </div>
  );
}
