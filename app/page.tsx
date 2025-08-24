"use client";

import { useState, useEffect } from "react";

const EMOJIS = [
  // Faces & People
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤡", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕",
  
  // Family & People
  "👶", "🧒", "👦", "👧", "🧑", "👨", "👩", "🧓", "👴", "👵", "👱", "👨‍🦳", "👩‍🦳", "👨‍🦰", "👩‍🦰", "👨‍⚕️", "👩‍⚕️", "👨‍🌾", "👩‍🌾", "👨‍🍳", "👩‍🍳", "👨‍🎓", "👩‍🎓", "👨‍🎤", "👩‍🎤", "👨‍🏫", "👩‍🏫", "👨‍🏭", "👩‍🏭", "👨‍💻", "👩‍💻", "👨‍💼", "👩‍💼", "👨‍🔧", "👩‍🔧", "👨‍🔬", "👩‍🔬", "👨‍🎨", "👩‍🎨", "👨‍🚒", "👩‍🚒", "👨‍✈️", "👩‍✈️", "👨‍🚀", "👩‍🚀", "👨‍⚖️", "👩‍⚖️", "🤵", "👰", "🤱", "🤰", "👼", "🎅", "🤶", "🦸", "🦹", "🧙", "🧚", "🧛", "🧜", "🧝", "🧞", "🧟", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🙇", "🤦", "🤷", "💆", "💇", "🚶", "🏃", "💃", "🕺", "👯", "🧖", "🧗", "🏌️", "🏄", "🚣", "🏊", "⛹️", "🏋️", "🚴", "🚵", "🏇", "🤸", "🤼", "🤽", "🤾", "🤹", "🧘", "🛀", "🛌",

  // Animals & Nature
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦏", "🦛", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁", "🐀", "🐿️", "🦔",

  // Food & Drinks
  "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥖", "🍞", "🥨", "🥯", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯",

  // Activities & Sports
  "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️‍♀️", "🏋️", "🤼‍♀️", "🤼", "🤸‍♀️", "🤸", "⛹️‍♀️", "⛹️", "🤺", "🤾‍♀️", "🤾", "🏌️‍♀️", "🏌️", "🏇", "🧘‍♀️", "🧘", "🏄‍♀️", "🏄", "🏊‍♀️", "🏊", "🤽‍♀️", "🤽", "🚣‍♀️", "🚣", "🧗‍♀️", "🧗", "🚵‍♀️", "🚵", "🚴‍♀️", "🚴", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️",

  // Travel & Places
  "🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴", "🛹", "🚁", "🛸", "🚀", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚢", "🛥️", "🚤", "⛵", "🛶", "⚓", "🚧", "⛽", "🚨", "🚥", "🚦", "🛑", "🚏", "🗺️", "🗿", "🗽", "🗼", "🏰", "🏯", "🏟️", "🎡", "🎢", "🎠", "⛲", "⛱️", "🏖️", "🏝️", "🏜️", "🌋", "⛰️", "🏔️", "🗻", "🏕️", "⛺", "🛖", "🏠", "🏡", "🏘️", "🏚️", "🏗️", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🛕", "🕍", "🕎", "🏙️", "🌃", "🌆", "🌇", "🌉", "♨️", "🎠", "🎪", "🎭", "🖼️", "🎨", "🧵", "🪡", "🧶", "🪢",

  // Objects & Symbols
  "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏰", "⏱️", "⏲️", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪓", "🪚", "🔩", "⚙️", "🪤", "🧲", "🔫", "💣", "🧨", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🧫", "🧪", "🌡️", "🏷️", "🔖", "🚽", "🪠", "🚿", "🛁", "🪥", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🪣", "🧼", "🧽", "🧯", "🛒", "🚨",

  // Symbols & Celebration
  "🎉", "🎊", "🎈", "🎀", "🎁", "🎂", "🎄", "🎆", "🎇", "🧨", "✨", "🎃", "👻", "💀", "☠️", "🎭", "🎪", "🎨", "🎬", "🎤", "🎧", "🎼", "🎵", "🎶", "🎹", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎲", "♠️", "♥️", "♦️", "♣️", "♟️", "🃏", "🎴", "🀄", "🎯", "🔮", "🎳", "🎮", "🎰", "🧩", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "♥️", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚕️", "♻️", "⚜️", "🔱", "📛", "🔰", "⭕", "✅", "☑️", "✔️", "❌", "❎", "➰", "➿", "〰️", "✳️", "✴️", "❇️", "‼️", "⁉️", "❓", "❔", "❕", "❗", "〽️", "⚠️", "🚸", "🔅", "🔆", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕",

  // Countries & Flags
  "🏳️", "🏴", "🏁", "🚩", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇦", "🇧🇼", "🇧🇷", "🇮🇴", "🇻🇬", "🇧🇳", "🇧🇬", "🇧🇫", "🇧🇮", "🇰🇭", "🇨🇲", "🇨🇦", "🇮🇨", "🇨🇻", "🇧🇶", "🇰🇾", "🇨🇫", "🇹🇩", "🇨🇱", "🇨🇳", "🇨🇽", "🇨🇨", "🇨🇴", "🇰🇲", "🇨🇬", "🇨🇩", "🇨🇰", "🇨🇷", "🇨🇮", "🇭🇷", "🇨🇺", "🇨🇼", "🇨🇾", "🇨🇿", "🇩🇰", "🇩🇯", "🇩🇲", "🇩🇴", "🇪🇨", "🇪🇬", "🇸🇻", "🇬🇶", "🇪🇷", "🇪🇪", "🇪🇹", "🇪🇺", "🇫🇰", "🇫🇴", "🇫🇯", "🇫🇮", "🇫🇷", "🇬🇫", "🇵🇫", "🇹🇫", "🇬🇦", "🇬🇲", "🇬🇪", "🇩🇪", "🇬🇭", "🇬🇮", "🇬🇷", "🇬🇱", "🇬🇩", "🇬🇵", "🇬🇺", "🇬🇹", "🇬🇬", "🇬🇳", "🇬🇼", "🇬🇾", "🇭🇹", "🇭🇳", "🇭🇰", "🇭🇺", "🇮🇸", "🇮🇳", "🇮🇩", "🇮🇷", "🇮🇶", "🇮🇪", "🇮🇲", "🇮🇱", "🇮🇹", "🇯🇲", "🇯🇵", "🎌", "🇯🇪", "🇯🇴", "🇰🇿", "🇰🇪", "🇰🇮", "🇽🇰", "🇰🇼", "🇰🇬", "🇱🇦", "🇱🇻", "🇱🇧", "🇱🇸", "🇱🇷", "🇱🇾", "🇱🇮", "🇱🇹", "🇱🇺", "🇲🇴", "🇲🇰", "🇲🇬", "🇲🇼", "🇲🇾", "🇲🇻", "🇲🇱", "🇲🇹", "🇲🇭", "🇲🇶", "🇲🇷", "🇲🇺", "🇾🇹", "🇲🇽", "🇫🇲", "🇲🇩", "🇲🇨", "🇲🇳", "🇲🇪", "🇲🇸", "🇲🇦", "🇲🇿", "🇲🇲", "🇳🇦", "🇳🇷", "🇳🇵", "🇳🇱", "🇳🇨", "🇳🇿", "🇳🇮", "🇳🇪", "🇳🇬", "🇳🇺", "🇳🇫", "🇰🇵", "🇲🇵", "🇳🇴", "🇴🇲", "🇵🇰", "🇵🇼", "🇵🇸", "🇵🇦", "🇵🇬", "🇵🇾", "🇵🇪", "🇵🇭", "🇵🇳", "🇵🇱", "🇵🇹", "🇵🇷", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇺", "🇷🇼", "🇼🇸", "🇸🇲", "🇸🇦", "🇸🇳", "🇷🇸", "🇸🇨", "🇸🇱", "🇸🇬", "🇸🇽", "🇸🇰", "🇸🇮", "🇬🇸", "🇸🇧", "🇸🇴", "🇿🇦", "🇰🇷", "🇸🇸", "🇪🇸", "🇱🇰", "🇧🇱", "🇸🇭", "🇰🇳", "🇱🇨", "🇵🇲", "🇻🇨", "🇸🇩", "🇸🇷", "🇸🇿", "🇸🇪", "🇨🇭", "🇸🇾", "🇹🇼", "🇹🇯", "🇹🇿", "🇹🇭", "🇹🇱", "🇹🇬", "🇹🇰", "🇹🇴", "🇹🇹", "🇹🇳", "🇹🇷", "🇹🇲", "🇹🇨", "🇹🇻", "🇻🇮", "🇺🇬", "🇺🇦", "🇦🇪", "🇬🇧", "🇺🇳", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇺", "🇻🇦", "🇻🇪", "🇻🇳", "🇼🇫", "🇪🇭", "🇾🇪", "🇿🇲", "🇿🇼"
];

function getRandomEmojis(count: number): string[] {
  const selected: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * EMOJIS.length);
    selected.push(EMOJIS[randomIndex]);
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

export default function Home() {
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 relative overflow-hidden">
      {/* WhatsApp-style Emoji Collage Background */}
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

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-200" 
            style={{fontFamily: 'Cinzel, Georgia, serif'}}>
          NostalgeAI
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 relative z-10">
        
        {/* Central Text */}
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-800 dark:text-slate-200 leading-tight mb-4"
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            Do you want to step down the{' '}
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              memory lane
            </span>
            ?
          </h2>
        </div>

        {/* Dive In Button */}
        <div className="relative group">
          <button className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out min-w-[200px] backdrop-blur-sm border border-amber-500/20"
                  style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            
            {/* Button Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-3">
              <span>Dive in</span>
              <svg 
                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
          </button>
          
          {/* Button Shadow */}
          <div className="absolute inset-0 bg-amber-600/30 rounded-full blur-xl scale-110 group-hover:scale-125 transition-transform duration-300 -z-10"></div>
        </div>

      </div>
    </div>
  );
}