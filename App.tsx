import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen, HoneyDrop } from './types';
import { HoneyPot, Bee, Flower } from './Illustrations';

const POOH_QUOTE = "\"A day without a friend is like a pot without a single drop of honey left inside.\"";

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.OPENING);
  const [idleText, setIdleText] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);
  const [honeyDrops, setHoneyDrops] = useState<HoneyDrop[]>([]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateScale = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Safety margins
    const targetWidth = 600;
    const targetHeight = 800;
    
    // Scale to fit whichever dimension is tighter
    const wScale = (width * 0.95) / targetWidth;
    const hScale = (height * 0.95) / targetHeight;
    
    let newScale = Math.min(wScale, hScale, 1.0);
    newScale = Math.max(newScale, 0.4); // Don't shrink to zero
    
    setScaleFactor(newScale);
  }, []);

  useEffect(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isTelegram = /Telegram/i.test(ua);
    const isInstagram = /Instagram/i.test(ua);
    const isFB = /FBAN|FBAV/i.test(ua);
    setIsInAppBrowser(isTelegram || isInstagram || isFB);

    return () => window.removeEventListener('resize', calculateScale);
  }, [calculateScale]);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleText('');
    
    if (screen !== AppScreen.SUCCESS) {
      idleTimerRef.current = setTimeout(() => {
        setIdleText('Pooh is waiting patiently. Mostly.');
      }, 8000);
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
    const drops: HoneyDrop[] = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      size: 20 + Math.random() * 20
    }));
    setHoneyDrops(drops);
  };

  const renderScreen = () => {
    const iconSize = 90;
    
    switch (screen) {
      case AppScreen.OPENING:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in duration-700">
            <Flower style={{ width: iconSize, height: iconSize }} className="mb-4 floating" />
            <h1 className="text-4xl md:text-5xl text-[#5d4037] mb-4 storybook-font font-bold">
              Hello Matilda 🌼
            </h1>
            <p className="text-2xl md:text-3xl text-[#5d4037] mb-8 max-w-md leading-relaxed font-bold">
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
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Bee style={{ width: iconSize * 0.9, height: iconSize * 0.9 }} className="mb-4 floating" />
            <p className="text-2xl md:text-3xl text-[#5d4037] mb-8 max-w-lg leading-relaxed storybook-font font-bold">
              Valentine's Day is coming soon.<br/>
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
          <div className="flex flex-col items-center text-center px-4 animate-in zoom-in duration-500">
            <HoneyPot style={{ width: iconSize * 1.3, height: iconSize * 1.6 }} className="mb-4 floating" />
            <p className="text-2xl md:text-3xl text-[#5d4037] mb-1 storybook-font">
              So I thought to ask you
            </p>
            <p className="text-xl text-[#8d6e63] mb-4 italic">
              very politely, and with plenty of fun
            </p>
            <h2 className="text-4xl md:text-5xl text-[#d4a017] mb-8 font-bold storybook-font">
              Would you be my Valentine? 💛
            </h2>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fbc02d] text-[#5d4037] py-4 rounded-full text-xl md:text-2xl hand-drawn-border hover:bg-[#fdd835] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🍯</span> Yes (this feels correct)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fff176] text-[#5d4037] py-4 rounded-full text-xl md:text-2xl hand-drawn-border hover:bg-[#fff59d] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🌻</span> Yes (with lots of food!)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#ffd54f] text-[#5d4037] py-4 rounded-full text-xl md:text-2xl hand-drawn-border hover:bg-[#ffca28] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🐝</span> Yes (forever and always)
              </button>
            </div>
          </div>
        );

      case AppScreen.SUCCESS:
        return (
          <div className="flex flex-col items-center text-center px-4 z-10 animate-in fade-in zoom-in-50 duration-1000">
            <div className="flex gap-4 mb-2 items-end">
              <HoneyPot style={{ width: iconSize * 0.8, height: iconSize }} className="floating" />
              <Bee style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} className="animate-bounce" />
            </div>
            <h1 className="text-3xl md:text-4xl text-[#5d4037] mb-2 storybook-font font-bold">
              Oh bother… how wonderful!
            </h1>
            <p className="text-xl md:text-2xl text-[#5d4037] mb-4 leading-relaxed max-w-md font-bold">
              I’m very glad I asked.<br/>
              I promise to be kind, and to share my honey.
            </p>
            
            <div className="bg-[#fffde7] p-5 rounded-[2rem] hand-drawn-border shadow-md mb-6 max-w-xs w-full border-[#d4a017]">
              <div className="text-[#d4a017] text-3xl mb-1">🔥</div>
              <h3 className="text-[#5d4037] text-xl font-bold storybook-font mb-1">Our Date Invitation:</h3>
              <p className="text-[#5d4037] text-lg font-bold leading-tight">
                Fireplace by Bedrock,<br/>
                One Holland Village #03-27<br/>
                <span className="text-[#d4a017] block mt-1">7PM • 14 February 2026</span>
              </p>
            </div>

            <div className="p-4 bg-white/60 rounded-2xl border border-dashed border-[#fbc02d] storybook-font text-lg text-[#5d4037] max-w-md shadow-inner italic">
              {POOH_QUOTE}
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden cursor-default"
      onClick={() => { setClickCount(prev => prev + 1); resetIdleTimer(); }}
    >
      {/* Golden Honey Rain */}
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

      {/* Main UI Container */}
      <div 
        className="relative z-10 w-[90%] max-w-[500px] bg-white/92 backdrop-blur-sm rounded-[3rem] hand-drawn-border shadow-2xl transition-all duration-700 flex flex-col items-center justify-center"
        style={{ 
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'center center',
          padding: '2.5rem 1.5rem',
          maxHeight: '96vh'
        }}
      >
        {renderScreen()}
      </div>

      {/* Secret Toast logic */}
      {isInAppBrowser && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[110] bg-[#fffde7]/95 px-6 py-2 rounded-full border-2 border-[#fbc02d] shadow-lg pointer-events-none">
          <p className="text-[#5d4037] text-sm storybook-font font-bold whitespace-nowrap">
             🍯 Tip: Open in Safari/Chrome for the best experience!
          </p>
        </div>
      )}

      {/* Secret / Idle Text */}
      <div className="fixed bottom-10 left-0 w-full text-center pointer-events-none px-4 z-20">
        {idleText && (
          <p className="text-white text-2xl md:text-3xl animate-bounce storybook-font font-bold drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
            {idleText}
          </p>
        )}
        {clickCount > 25 && (
          <p className="text-[#fbc02d] text-lg storybook-font italic font-bold drop-shadow-md">
             "Sometimes the smallest things take up the most room in your heart."
          </p>
        )}
      </div>

      <div className="fixed bottom-4 right-6 text-white/90 text-xl storybook-font font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] z-20 hidden sm:block">
        With Love, From Pooh • 2026
      </div>
    </div>
  );
};

export default App;
