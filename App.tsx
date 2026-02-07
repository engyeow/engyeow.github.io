
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen, HoneyDrop } from './types';
import { HoneyPot, Bee, Flower } from './Illustrations';

const POOH_QUOTE = "\"A day without a friend is like a pot without a single drop of honey left inside.\"";

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.OPENING);
  const [idleText, setIdleText] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);
  const [honeyDrops, setHoneyDrops] = useState<HoneyDrop[]>([]);
  const [isPortrait, setIsPortrait] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkEnvironment = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 1. Detect if the user is in portrait mode on a mobile-sized screen
      setIsPortrait(height > width && width < 1024);
      
      // 2. Calculate dynamic scale factor for landscape
      if (width > height) {
        const baseHeight = 700;
        const baseWidth = 800;
        
        const hScale = height / baseHeight;
        const wScale = width / baseWidth;
        
        const newScale = Math.max(0.5, Math.min(1, Math.min(hScale, wScale)));
        setScaleFactor(newScale);
      } else {
        setScaleFactor(1);
      }

      // 3. Detect In-App Browsers
      const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isTelegram = /Telegram/i.test(ua);
      const isInstagram = /Instagram/i.test(ua);
      const isFB = /FBAN|FBAV/i.test(ua);
      setIsInAppBrowser(isTelegram || isInstagram || isFB);
    };

    checkEnvironment();
    window.addEventListener('resize', checkEnvironment);
    return () => window.removeEventListener('resize', checkEnvironment);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleText('');
    
    if (screen !== AppScreen.SUCCESS) {
      idleTimerRef.current = setTimeout(() => {
        setIdleText('Pooh is waiting patiently. Mostly.');
      }, 6000);
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
    const drops: HoneyDrop[] = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 5,
      size: 15 + Math.random() * 30
    }));
    setHoneyDrops(drops);
  };

  const renderScreen = () => {
    const iconSize = 90;
    
    switch (screen) {
      case AppScreen.OPENING:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in duration-1000">
            <Flower style={{ width: iconSize, height: iconSize }} className="mb-4 floating" />
            <h1 className="text-3xl md:text-5xl text-[#5d4037] mb-4 storybook-font font-bold">
              Hello Matilda 🌼
            </h1>
            <p className="text-xl md:text-2xl text-[#5d4037] mb-8 max-w-md leading-relaxed font-bold">
              I was just sitting here, thinking…<br/>
              <span className="text-lg italic font-normal text-[#8d6e63]">(which is often quite hard work)</span><br/>
            </p>
            <button
              onClick={() => handleScreenTransition(AppScreen.BUILDUP)}
              className="bg-[#fbc02d] text-[#5d4037] px-10 py-4 rounded-full text-xl md:text-2xl hand-drawn-border hover:bg-[#fdd835] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
            >
              <span>🍯</span> Oh? What is it?
            </button>
          </div>
        );

      case AppScreen.BUILDUP:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Bee style={{ width: iconSize * 0.9, height: iconSize * 0.9 }} className="mb-4 floating" />
            <p className="text-xl md:text-3xl text-[#5d4037] mb-8 max-w-lg leading-relaxed storybook-font font-bold">
              Valentine's Day is coming soon.<br/>
              And I have no honey plans.<br/>
              Which is so sad.
            </p>
            <button
              onClick={() => handleScreenTransition(AppScreen.THE_ASK)}
              className="bg-[#c5e1a5] text-[#5d4037] px-10 py-4 rounded-full text-xl md:text-2xl hand-drawn-border hover:bg-[#dcedc8] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
            >
              <span>🐝</span> Go on…
            </button>
          </div>
        );

      case AppScreen.THE_ASK:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in zoom-in duration-500">
            <HoneyPot style={{ width: iconSize * 1.3, height: iconSize * 1.6 }} className="mb-4 floating" />
            <p className="text-xl md:text-2xl text-[#5d4037] mb-1 storybook-font">
              So I thought to ask you
            </p>
            <p className="text-lg text-[#8d6e63] mb-4 italic">
              very politely, and with plenty of fun
            </p>
            <h2 className="text-3xl md:text-4xl text-[#d4a017] mb-8 font-bold storybook-font">
              Would you be my Valentine? 💛
            </h2>
            <div className="flex flex-col gap-3 w-full max-w-xs md:max-w-sm">
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fbc02d] text-[#5d4037] py-3 md:py-4 rounded-full text-lg md:text-xl hand-drawn-border hover:bg-[#fdd835] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🍯</span> Yes (this feels correct)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fff176] text-[#5d4037] py-3 md:py-4 rounded-full text-lg md:text-xl hand-drawn-border hover:bg-[#fff59d] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🌻</span> Yes (with lots of food!)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#ffd54f] text-[#5d4037] py-3 md:py-4 rounded-full text-lg md:text-xl hand-drawn-border hover:bg-[#ffca28] transition-all shadow-md flex items-center justify-center gap-2"
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
            <h1 className="text-2xl md:text-4xl text-[#5d4037] mb-2 storybook-font font-bold">
              Oh bother… how wonderful!
            </h1>
            <p className="text-lg md:text-xl text-[#5d4037] mb-4 leading-relaxed max-w-md font-bold">
              I’m very glad I asked.<br/>
              I promise to be kind, and to share my honey.
            </p>
            
            {/* The Specific Invitation */}
            <div className="bg-[#fffde7] p-5 rounded-2xl hand-drawn-border shadow-md mb-6 max-w-sm w-full border-[#d4a017]">
              <div className="text-[#d4a017] text-2xl mb-1">🔥</div>
              <h3 className="text-[#5d4037] text-xl font-bold storybook-font mb-2">Our Date Invitation:</h3>
              <p className="text-[#5d4037] text-lg font-bold leading-snug">
                Fireplace by Bedrock,<br/>
                One Holland Village #03-27<br/>
                <span className="text-[#d4a017]">7PM • 14 February 2026</span>
              </p>
            </div>

            <div className="p-4 bg-white/60 rounded-xl border border-dashed border-[#fbc02d] storybook-font text-lg text-[#5d4037] max-w-md shadow-inner italic">
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
      {/* Subtle In-App Browser Tooltip */}
      {isInAppBrowser && !isPortrait && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[110] bg-[#fffde7]/90 px-5 py-1.5 rounded-full border-2 border-[#fbc02d] shadow-md pointer-events-none">
          <p className="text-[#5d4037] text-sm storybook-font font-bold whitespace-nowrap">
             🍯 Tip: For a bigger story, open in Chrome or Safari!
          </p>
        </div>
      )}

      {/* Mobile Orientation Lock Alert */}
      {isPortrait && (
        <div className="fixed inset-0 z-[100] bg-[#fff9e6] flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
          <Bee className="w-24 h-24 mb-6 floating" />
          <h2 className="text-4xl text-[#5d4037] storybook-font font-bold mb-4">Oh Bother!</h2>
          <p className="text-2xl text-[#8d6e63] storybook-font">
            This story is much better told sideways.<br/>
            Please rotate your device to landscape mode!
          </p>
          <div className="mt-10 w-24 h-14 border-4 border-[#5d4037] rounded-lg animate-pulse rotate-90" />
        </div>
      )}

      {/* Golden Honey Rain for Success Screen */}
      {screen === AppScreen.SUCCESS && honeyDrops.map(drop => (
        <div 
          key={drop.id}
          className="honey-drop"
          style={{
            left: `${drop.left}%`,
            top: `-50px`,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          <svg width={drop.size} height={drop.size} viewBox="0 0 20 20">
             <path d="M10 2C10 2 6 8 6 12C6 14.2 7.8 16 10 16C12.2 16 14 14.2 14 12C14 8 10 2 10 2Z" fill="#FBC02D" opacity="0.75" />
          </svg>
        </div>
      ))}

      {/* Main Story Container - Absolute Centering and Dynamic Scaling */}
      <div 
        className={`relative z-10 w-[95%] max-w-2xl bg-white/90 backdrop-blur-md rounded-[3rem] hand-drawn-border shadow-2xl transition-all duration-700 ${isPortrait ? 'blur-md opacity-0' : 'opacity-100'} overflow-y-auto max-h-[95vh]`}
        style={{ 
          transform: `scale(${scaleFactor})`,
          transformOrigin: 'center center',
          padding: `3rem` 
        }}
      >
        {renderScreen()}
      </div>

      {/* Idle Easter Egg Text */}
      {!isPortrait && (
        <div className="fixed bottom-10 left-0 w-full text-center pointer-events-none px-4 z-20">
          {idleText && (
            <p className="text-white text-xl md:text-3xl animate-bounce storybook-font font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {idleText}
            </p>
          )}
          {clickCount > 10 && screen !== AppScreen.SUCCESS && (
            <p className="text-[#fbc02d] text-lg storybook-font italic font-bold drop-shadow-md">
               "Sometimes the smallest things take up the most room in your heart."
            </p>
          )}
        </div>
      )}

      {/* Decorative Signature */}
      {!isPortrait && (
        <div className="fixed bottom-6 right-8 text-white/80 text-lg md:text-2xl storybook-font font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] z-20">
          With Love, From Pooh • 2026
        </div>
      )}
    </div>
  );
};

export default App;
