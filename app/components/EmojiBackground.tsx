"use client";

import { useState, useEffect } from "react";
import data from '@emoji-mart/data';

// Function to get random emojis from emoji-mart data
function getRandomEmojis(count: number): string[] {
  const selected: string[] = [];
  const categories = Object.values(data.categories);
  const allEmojis: string[] = [];
  
  // Collect all emoji native representations from all categories
  categories.forEach((category: any) => {
    if (category.emojis) {
      category.emojis.forEach((emojiId: string) => {
        const emoji = data.emojis[emojiId];
        if (emoji && emoji.skins && emoji.skins[0] && emoji.skins[0].native) {
          allEmojis.push(emoji.skins[0].native);
        }
      });
    }
  });
  
  // Select random emojis
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allEmojis.length);
    selected.push(allEmojis[randomIndex]);
  }
  
  return selected;
}

function generateNonOverlappingPositions(count: number): Array<{left: number, top: number, size: number}> {
  const positions: Array<{left: number, top: number, size: number}> = [];
  const minDistance = 8; // Minimum distance between emojis in percentage
  const maxAttempts = 1000; // Maximum attempts to place each emoji
  
  for (let i = 0; i < count; i++) {
    let placed = false;
    let attempts = 0;
    
    while (!placed && attempts < maxAttempts) {
      const newPosition = {
        left: Math.random() * 90 + 5, // 5-95% to keep emojis away from edges
        top: Math.random() * 90 + 5,  // 5-95% to keep emojis away from edges
        size: Math.random() * 1.2 + 0.8 // 0.8-2em size (slightly smaller for better spacing)
      };
      
      let isValidPosition = true;
      
      // Check distance from all existing positions
      for (const existingPos of positions) {
        const distance = Math.sqrt(
          Math.pow(newPosition.left - existingPos.left, 2) + 
          Math.pow(newPosition.top - existingPos.top, 2)
        );
        
        // Adjust minimum distance based on emoji sizes
        const requiredDistance = minDistance + (newPosition.size + existingPos.size) * 2;
        
        if (distance < requiredDistance) {
          isValidPosition = false;
          break;
        }
      }
      
      if (isValidPosition) {
        positions.push(newPosition);
        placed = true;
      }
      
      attempts++;
    }
    
    // If we couldn't place after max attempts, place it anyway but try to avoid center
    if (!placed) {
      positions.push({
        left: Math.random() * 30 + (i % 2 === 0 ? 5 : 65), // Alternate between left and right sides
        top: Math.random() * 30 + (i % 4 < 2 ? 5 : 65),   // Distribute in corners
        size: Math.random() * 0.8 + 0.6 // Smaller fallback size
      });
    }
  }
  
  return positions;
}

interface EmojiItem {
  emoji: string;
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  animationType: string;
}

export default function EmojiBackground() {
  const [backgroundEmojis, setBackgroundEmojis] = useState<EmojiItem[]>([]);

  useEffect(() => {
    // Generate 60-80 random emojis for a dense but non-overlapping background collage
    const emojiCount = Math.floor(Math.random() * 20) + 60;
    const selectedEmojis = getRandomEmojis(emojiCount);
    const positions = generateNonOverlappingPositions(emojiCount);
    
    const emojis = selectedEmojis.map((emoji, index) => ({
      emoji,
      id: index,
      left: positions[index].left,
      top: positions[index].top,
      size: positions[index].size,
      duration: Math.random() * 4 + 3, // 3-7s animation duration
      delay: Math.random() * 2, // 0-2s delay
      animationType: Math.random() > 0.5 ? 'animate-float' : 'animate-gentle-bob', // Random animation
    }));
    
    setBackgroundEmojis(emojis);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {backgroundEmojis.map((item) => (
        <div
          key={item.id}
          className={`absolute ${item.animationType} opacity-20 hover:opacity-50 transition-opacity duration-500 cursor-pointer`}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}em`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
                              }
