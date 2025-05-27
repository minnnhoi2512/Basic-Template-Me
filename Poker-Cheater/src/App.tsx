import { useState } from "react";
import "./App.css";

// Define card types
type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

interface Card {
  suit: Suit;
  rank: Rank;
  position: number | null; // null means card is in pool
}

function App() {
  // Initialize deck with all 52 cards in pool (position: null)
  const [deck, setDeck] = useState<Card[]>(() => {
    const suits: Suit[] = ["♠", "♥", "♦", "♣"];
    const ranks: Rank[] = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    const cards: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({ suit, rank, position: null });
      }
    }
    return cards;
  });

  // Function to move card from pool to position
  const moveCardToPosition = (cardIndex: number, newPosition: number) => {
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const card = newDeck[cardIndex];
      if (!card) return prevDeck;
      
      // Check if position is already taken
      const positionTaken = newDeck.some(
        (c) => c.position === newPosition && c !== card
      );
      
      if (positionTaken) {
        return prevDeck; // Don't update if position is taken
      }

      newDeck[cardIndex] = { suit: card.suit, rank: card.rank, position: newPosition };
      return newDeck;
    });
  };

  // Function to return card to pool
  const returnCardToPool = (cardIndex: number) => {
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const card = newDeck[cardIndex];
      if (!card) return prevDeck;
      
      newDeck[cardIndex] = { suit: card.suit, rank: card.rank, position: null };
      return newDeck;
    });
  };

  // Function to clear all positions
  const clearAllPositions = () => {
    setDeck((prevDeck) =>
      prevDeck.map((card) => ({ ...card, position: null }))
    );
  };

  // Get cards in pool and positioned cards
  const poolCards = deck.filter((card) => card.position === null);
  const positionedCards = deck
    .filter((card) => card.position !== null)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return (
    <div className="poker-app">
      <h1>Poker Card Position Tracker</h1>
      
      <div className="app-container">
        {/* Card Pool Section */}
        <div className="pool-section">
          <h2>Card Pool</h2>
          <div className="deck-container">
            {poolCards.map((card) => (
              <div
                key={`${card.suit}-${card.rank}`}
                className={`card ${
                  card.suit === "♥" || card.suit === "♦" ? "red" : "black"
                }`}
                onClick={() => {
                  // Find first available position
                  const firstAvailablePosition = Array.from(
                    { length: 52 },
                    (_, i) => i + 1
                  ).find(
                    (pos) =>
                      !deck.some((c) => c.position === pos)
                  );
                  if (firstAvailablePosition !== undefined) {
                    moveCardToPosition(
                      deck.findIndex(
                        (c) => c.suit === card.suit && c.rank === card.rank
                      ),
                      firstAvailablePosition
                    );
                  }
                }}
              >
                <div className="card-content">
                  <span className="rank">{card.rank}</span>
                  <span className="suit">{card.suit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Position Section */}
        <div className="position-section">
          <div className="position-header">
            <h2>Card Positions</h2>
            <button 
              className="clear-all-button"
              onClick={clearAllPositions}
              disabled={positionedCards.length === 0}
            >
              Clear All
            </button>
          </div>
          <div className="deck-container">
            {Array.from({ length: 52 }, (_, i) => i + 1).map((position) => {
              const card = positionedCards.find((c) => c.position === position);
              return (
                <div
                  key={position}
                  className={`position-slot ${card ? "filled" : "empty"}`}
                >
                  {card ? (
                    <div
                      className={`card ${
                        card.suit === "♥" || card.suit === "♦" ? "red" : "black"
                      }`}
                      onClick={() =>
                        returnCardToPool(
                          deck.findIndex(
                            (c) => c.suit === card.suit && c.rank === card.rank
                          )
                        )
                      }
                    >
                      <div className="card-content">
                        <span className="rank">{card.rank}</span>
                        <span className="suit">{card.suit}</span>
                      </div>
                      <div className="position-number">{position}</div>
                    </div>
                  ) : (
                    <div className="empty-slot">{position}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
