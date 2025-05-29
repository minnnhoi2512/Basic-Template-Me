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

      // If the card is already in a position, remove it first
      if (card.position !== null) {
        newDeck[cardIndex] = { suit: card.suit, rank: card.rank, position: null };
      }

      // Get all positioned cards sorted by position
      const positionedCards = newDeck
        .filter(c => c.position !== null)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      // If there are no positioned cards, just place the card at the new position
      if (positionedCards.length === 0) {
        newDeck[cardIndex] = { suit: card.suit, rank: card.rank, position: newPosition };
        return newDeck;
      }

      // Check if the target position is already occupied
      const isPositionOccupied = positionedCards.some(c => c.position === newPosition);

      if (isPositionOccupied) {
        // Create a temporary array to store the new positions
        const newPositions = new Map<number, { suit: Suit; rank: Rank }>();

        // 1. Shift cards at N to 51 forward by one (N→N+1, ..., 51→52)
        for (let pos = 51; pos >= newPosition; pos--) {
          const cardAtPos = newDeck.find(c => c.position === pos);
          if (cardAtPos) {
            newPositions.set(pos + 1, { suit: cardAtPos.suit, rank: cardAtPos.rank });
          }
        }
        // 2. Card at 52 moves to N (if any)
        const cardAt52 = newDeck.find(c => c.position === 52);
        if (cardAt52) {
          newPositions.set(newPosition, { suit: cardAt52.suit, rank: cardAt52.rank });
        }
        // 3. Cards before N (positions 1 to N-1) keep their positions (unless overwritten)
        for (let pos = 1; pos < newPosition; pos++) {
          if (!newPositions.has(pos)) {
            const cardAtPos = newDeck.find(c => c.position === pos);
            if (cardAtPos) {
              newPositions.set(pos, { suit: cardAtPos.suit, rank: cardAtPos.rank });
            }
          }
        }
        // 4. Place the dragged card at N
        newPositions.set(newPosition, { suit: card.suit, rank: card.rank });

        // Apply all the new positions
        for (const [position, cardData] of newPositions) {
          const cardToUpdate = newDeck.find(
            c => c.suit === cardData.suit && c.rank === cardData.rank
          );
          if (cardToUpdate) {
            const cardIndex = newDeck.findIndex(c => c === cardToUpdate);
            newDeck[cardIndex] = { ...cardData, position };
          }
        }
      } else {
        // If the position is not occupied, just place the card there
        newDeck[cardIndex] = { suit: card.suit, rank: card.rank, position: newPosition };
      }

      return newDeck;
    });
  };

  // Function to return card to pool
  const returnCardToPool = (cardIndex: number) => {
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      const card = newDeck[cardIndex];
      if (!card || card.position === null) return prevDeck;
      
      const removedPosition = card.position;
      newDeck[cardIndex] = { suit: card.suit, rank: card.rank, position: null };

      // Get all positioned cards after the removed position
      const cardsToShift = newDeck
        .filter(c => c.position !== null && c.position > removedPosition)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      // Create a temporary array to store the new positions
      const newPositions = new Map<number, { suit: Suit; rank: Rank }>();

      // Calculate new positions for all cards that need to shift
      for (const cardToShift of cardsToShift) {
        const currentPosition = cardToShift.position || 0;
        let newPosition = currentPosition - 1;
        if (newPosition < 1) {
          newPosition = 52;
        }
        newPositions.set(newPosition, { suit: cardToShift.suit, rank: cardToShift.rank });
      }

      // Apply all the new positions
      for (const [position, cardData] of newPositions) {
        const cardToUpdate = newDeck.find(
          c => c.suit === cardData.suit && c.rank === cardData.rank
        );
        if (cardToUpdate) {
          const cardIndex = newDeck.findIndex(c => c === cardToUpdate);
          newDeck[cardIndex] = { ...cardData, position };
        }
      }

      return newDeck;
    });
  };

  // Function to clear all positions
  const clearAllPositions = () => {
    setDeck((prevDeck) =>
      prevDeck.map((card) => ({ ...card, position: null }))
    );
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, card: Card) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(card));
    // Add dragging class to the card being dragged
    const target = e.target as HTMLElement;
    target.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Remove dragging class
    const target = e.target as HTMLElement;
    target.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number | null) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    const cardData = JSON.parse(e.dataTransfer.getData('text/plain')) as Card;
    const cardIndex = deck.findIndex(
      (c) => c.suit === cardData.suit && c.rank === cardData.rank
    );

    if (targetPosition === null) {
      returnCardToPool(cardIndex);
    } else {
      moveCardToPosition(cardIndex, targetPosition);
    }
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
          <div 
            className="deck-container"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, null)}
          >
            {poolCards.map((card) => (
              <div
                key={`${card.suit}-${card.rank}`}
                className={`card ${
                  card.suit === "♥" || card.suit === "♦" ? "red" : "black"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, card)}
                onDragEnd={handleDragEnd}
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
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, position)}
                >
                  {card ? (
                    <div
                      className={`card ${
                        card.suit === "♥" || card.suit === "♦" ? "red" : "black"
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card)}
                      onDragEnd={handleDragEnd}
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
