
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen, HoneyDrop } from './types';
import { HoneyPot, Bee, Flower } from './Illustrations';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.OPENING);
  const [idleText, setIdleText] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);
  const [honeyDrops, setHoneyDrops] = useState<HoneyDrop[]>([]);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [poohQuote] = useState<string>("\"A day without a friend is like a pot without a single drop of honey left inside.\"");

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleText('');
    
    if (screen !== AppScreen.SUCCESS) {
      idleTimerRef.current = setTimeout(() => {
        setIdleText('Pooh is waiting patiently. Mostly.');
      }, 5000);
    }
  }, [screen]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleScreenTransition = (next: AppScreen) => {
    setScreen(next);
    setClickCount(0);
    if (next === AppScreen.SUCCESS) {
      startHoneyAnimation();
    }
  };

  const startHoneyAnimation = () => {
    const drops: HoneyDrop[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 4,
      size: 15 + Math.random() * 25
    }));
    setHoneyDrops(drops);
  };

  const handleRandomClick = () => {
    setClickCount(prev => prev + 1);
    resetIdleTimer();
  };

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.OPENING:
        return (
          <div className="flex flex-col items-center text-center px-8 animate-in fade-in duration-1000">
            <Flower className="w-20 h-20 mb-6 floating" />
            <h1 className="text-4xl md:text-5xl text-[#5d4037] mb-6 storybook-font font-bold">
              Hello Matilda 🌼
            </h1>
            <p className="text-2xl md:text-3xl text-[#5d4037] mb-10 max-w-md leading-relaxed font-bold">
              I was just sitting here, thinking…<br/>
              <span className="text-xl italic font-normal text-[#8d6e63]">(which is often quite hard work)</span><br/>
            </p>
            <button
              onClick={() => handleScreenTransition(AppScreen.BUILDUP)}
              className="bg-[#fbc02d] text-[#5d4037] px-10 py-4 rounded-full text-2xl hand-drawn-border hover:bg-[#fdd835] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
            >
              <span>🍯</span> Oh? What is it?
            </button>
          </div>
        );

      case AppScreen.BUILDUP:
        return (
          <div className="flex flex-col items-center text-center px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Bee className="w-16 h-16 mb-6 floating" />
            <p className="text-2xl md:text-4xl text-[#5d4037] mb-10 max-w-lg leading-relaxed storybook-font font-bold">
              Valentines Day is coming soon.<br/>
              And I have no honey plans.<br/>
              Which is so sad.
            </p>
            <button
              onClick={() => handleScreenTransition(AppScreen.THE_ASK)}
              className="bg-[#c5e1a5] text-[#5d4037] px-10 py-4 rounded-full text-2xl hand-drawn-border hover:bg-[#dcedc8] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
            >
              <span>🐝</span> Go on…
            </button>
          </div>
        );

      case AppScreen.THE_ASK:
        return (
          <div className="flex flex-col items-center text-center px-8 animate-in zoom-in duration-500">
            <HoneyPot className="w-28 h-28 mb-6 floating" />
            <p className="text-2xl md:text-3xl text-[#5d4037] mb-2 storybook-font">
              So I thought to ask you
            </p>
            <p className="text-xl text-[#8d6e63] mb-8 italic">
              very politely, and with plenty of fun
            </p>
            <h2 className="text-4xl md:text-5xl text-[#d4a017] mb-12 font-bold storybook-font">
              Would you be my Valentine? 💛
            </h2>
            <div className="flex flex-col gap-5 w-full max-w-sm">
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fbc02d] text-[#5d4037] py-4 rounded-full text-xl hand-drawn-border hover:bg-[#fdd835] transition-all shadow-md flex items-center justify-center gap-3"
              >
                <span>🍯</span> Yes (this feels correct)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fff176] text-[#5d4037] py-4 rounded-full text-xl hand-drawn-border hover:bg-[#fff59d] transition-all shadow-md flex items-center justify-center gap-3"
              >
                <span>🌻</span> Yes (but only if there is food)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#aed581] text-[#5d4037] py-4 rounded-full text-xl hand-drawn-border hover:bg-[#c5e1a5] transition-all shadow-md flex items-center justify-center gap-3"
              >
                <span>🐝</span> Let me think… (still yes)
              </button>
            </div>
          </div>
        );

      case AppScreen.SUCCESS:
        return (
          <div className="flex flex-col items-center text-center px-8 z-10 animate-in fade-in zoom-in-50 duration-1000">
            <div className="flex gap-6 mb-8">
              <HoneyPot className="w-24 h-24 floating" />
              <Bee className="w-12 h-12 animate-bounce" />
            </div>
            <h1 className="text-5xl md:text-6xl text-[#5d4037] mb-8 storybook-font font-bold">
              Oh bother… how wonderful!
            </h1>
            <p className="text-2xl md:text-3xl text-[#5d4037] mb-10 leading-relaxed max-w-md font-bold">
              I’m very glad I asked.<br/><br/>
              I promise to be brave, kind,<br/>
              and to always share my honey.
            </p>
            <div className="mt-3 p-3 bg-[#fffde7]/90 rounded-2xl border-2 border-dashed border-[#fbc02d] storybook-font text-2xl text-[#5d4037] max-w-lg shadow-inner">
              {poohQuote}
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden cursor-default"
      onClick={handleRandomClick}
    >
      
      {/* Success Animation */}
      {screen === AppScreen.SUCCESS && honeyDrops.map(drop => (
        <div 
          key={drop.id}
          className="honey-drop"
          style={{
            left: `${drop.left}%`,
            top: `-50px`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          <svg width={drop.size} height={drop.size} viewBox="0 0 20 20">
             <path d="M10 2C10 2 6 8 6 12C6 14.2 7.8 16 10 16C12.2 16 14 14.2 14 12C14 8 10 2 10 2Z" fill="#FBC02D" opacity="0.8" />
          </svg>
        </div>
      ))}

      {/* Main Container - Slightly higher opacity to contrast with the lush background image */}
      <div className="relative z-10 w-full max-w-2xl bg-white/75 backdrop-blur-sm p-10 md:p-16 rounded-[3rem] hand-drawn-border mx-4 shadow-2xl transition-all duration-500">
        {renderScreen()}
      </div>

      {/* Easter Egg Messages */}
      <div className="fixed bottom-12 left-0 w-full text-center pointer-events-none px-4">
        {idleText && (
          <p className="text-[#5d4037] text-2xl animate-bounce storybook-font font-bold drop-shadow-md">
            {idleText}
          </p>
        )}
        {clickCount > 5 && screen !== AppScreen.SUCCESS && (
          <p className="text-[#5d4037] text-lg storybook-font italic font-bold">
            Thinking… thinking… still thinking very hard…
          </p>
        )}
      </div>

      {/* Footer Quote Style - Updated to 2026 */}
      {screen !== AppScreen.SUCCESS && (
        <div className="fixed bottom-6 right-6 text-white text-xl storybook-font font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Hundred Acre Wood, 2026
        </div>
      )}
    </div>
  );
};

export default App;
