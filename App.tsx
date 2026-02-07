
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen, HoneyDrop } from './types';
import { HoneyPot, Bee, Flower } from './Illustrations';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.OPENING);
  const [idleText, setIdleText] = useState<string>('');
  const [clickCount, setClickCount] = useState(0);
  const [honeyDrops, setHoneyDrops] = useState<HoneyDrop[]>([]);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isTooSmall, setIsTooSmall] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [poohQuote] = useState<string>("\"A day without a friend is like a pot without a single drop of honey left inside.\"");

  useEffect(() => {
    const checkEnvironment = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 1. Check Portrait
      setIsPortrait(height > width && width < 1024);
      
      // 2. Check if landscape is too cramped (height < 420px is common for small phones)
      setIsTooSmall(width > height && height < 420);

      // 3. Detect In-App Browsers (Telegram, Instagram, etc)
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
    try {
      if (window.screen && window.screen.orientation && (window.screen.orientation as any).lock) {
        (window.screen.orientation as any).lock('landscape').catch(() => {});
      }
    } catch (e) {}

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

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.OPENING:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in duration-1000">
            <Flower className="w-16 h-16 md:w-20 md:h-20 mb-4 floating" />
            <h1 className="text-3xl md:text-5xl text-[#5d4037] mb-4 storybook-font font-bold">
              Hello Matilda 🌼
            </h1>
            <p className="text-xl md:text-2xl text-[#5d4037] mb-8 max-w-md leading-relaxed font-bold">
              I was just sitting here, thinking…<br/>
              <span className="text-lg italic font-normal text-[#8d6e63]">(which is often quite hard work)</span><br/>
            </p>
            <button
              onClick={() => handleScreenTransition(AppScreen.BUILDUP)}
              className="bg-[#fbc02d] text-[#5d4037] px-8 py-3 rounded-full text-xl hand-drawn-border hover:bg-[#fdd835] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
            >
              <span>🍯</span> Oh? What is it?
            </button>
          </div>
        );

      case AppScreen.BUILDUP:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Bee className="w-14 h-14 md:w-16 md:h-16 mb-4 floating" />
            <p className="text-xl md:text-3xl text-[#5d4037] mb-8 max-w-lg leading-relaxed storybook-font font-bold">
              Valentine's Day is coming soon.<br/>
              And I have no honey plans.<br/>
              Which is so sad.
            </p>
            <button
              onClick={() => handleScreenTransition(AppScreen.THE_ASK)}
              className="bg-[#c5e1a5] text-[#5d4037] px-8 py-3 rounded-full text-xl hand-drawn-border hover:bg-[#dcedc8] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3"
            >
              <span>🐝</span> Go on…
            </button>
          </div>
        );

      case AppScreen.THE_ASK:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in zoom-in duration-500">
            <HoneyPot className="w-20 h-20 md:w-28 md:h-28 mb-4 floating" />
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
                className="bg-[#fbc02d] text-[#5d4037] py-3 rounded-full text-lg hand-drawn-border hover:bg-[#fdd835] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🍯</span> Yes (this feels correct)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#fff176] text-[#5d4037] py-3 rounded-full text-lg hand-drawn-border hover:bg-[#fff59d] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🌻</span> Yes (but only if there is food)
              </button>
              <button
                onClick={() => handleScreenTransition(AppScreen.SUCCESS)}
                className="bg-[#aed581] text-[#5d4037] py-3 rounded-full text-lg hand-drawn-border hover:bg-[#c5e1a5] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🐝</span> Let me think… (still yes)
              </button>
            </div>
          </div>
        );

      case AppScreen.SUCCESS:
        return (
          <div className="flex flex-col items-center text-center px-4 z-10 animate-in fade-in zoom-in-50 duration-1000 overflow-y-auto max-h-[80vh]">
            <div className="flex gap-4 mb-4">
              <HoneyPot className="w-16 h-16 md:w-24 md:h-24 floating" />
              <Bee className="w-8 h-8 md:w-12 md:h-12 animate-bounce" />
            </div>
            <h1 className="text-3xl md:text-5xl text-[#5d4037] mb-4 storybook-font font-bold">
              Oh bother… how wonderful!
            </h1>
            <p className="text-lg md:text-2xl text-[#5d4037] mb-6 leading-relaxed max-w-md font-bold">
              I’m very glad I asked.<br/>
              I promise to be brave, kind,<br/>
              and to always share my honey.
            </p>
            <div className="p-3 bg-[#fffde7]/90 rounded-2xl border-2 border-dashed border-[#fbc02d] storybook-font text-xl text-[#5d4037] max-w-md shadow-inner italic">
              {poohQuote}
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden cursor-default"
      onClick={() => { setClickCount(prev => prev + 1); resetIdleTimer(); }}
    >
      {/* 1. Telegram / In-App Browser Guide */}
      {isInAppBrowser && !isPortrait && !isTooSmall && (
        <div className="fixed top-4 left-4 right-4 z-[110] bg-[#fffde7]/95 p-4 rounded-2xl hand-drawn-border shadow-2xl animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <Bee className="w-10 h-10 flex-shrink-0" />
            <p className="text-[#5d4037] text-lg storybook-font font-bold">
              Oh Bother! Telegram's window is a bit tight. For the full honey experience, tap the <span className="text-[#d4a017]">⋮</span> and select <span className="underline">Open in Chrome/Safari</span>!
            </p>
          </div>
        </div>
      )}

      {/* 2. Portrait Mode Guard */}
      {isPortrait && (
        <div className="fixed inset-0 z-[100] bg-[#fff9e6] flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-300">
          <Bee className="w-24 h-24 mb-6 floating" />
          <h2 className="text-4xl text-[#5d4037] storybook-font font-bold mb-4">Oh Bother!</h2>
          <p className="text-2xl text-[#8d6e63] storybook-font">
            This story is much better told sideways.<br/>
            Please rotate your device to landscape mode!
          </p>
          <div className="mt-10 w-20 h-12 border-4 border-[#5d4037] rounded-lg animate-pulse rotate-90" />
        </div>
      )}

      {/* 3. Small Landscape height guard */}
      {isTooSmall && !isPortrait && (
        <div className="fixed inset-0 z-[105] bg-[#fff9e6] flex flex-col items-center justify-center text-center p-6 animate-in fade-in duration-300 overflow-y-auto">
          <HoneyPot className="w-16 h-16 mb-4" />
          <h2 className="text-2xl text-[#5d4037] storybook-font font-bold mb-2">A Very Tight Squeeze!</h2>
          <p className="text-lg text-[#8d6e63] storybook-font">
            Your screen is a bit small for Pooh's big thoughts.<br/>
            Try hiding your browser bars or using a bigger device!
          </p>
          <p className="mt-4 text-sm italic">(Current height is too short for the honey pots)</p>
        </div>
      )}

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

      {/* Main Container */}
      <div className={`relative z-10 w-full max-w-2xl bg-white/85 backdrop-blur-sm p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] hand-drawn-border mx-4 shadow-2xl transition-all duration-500 ${(isPortrait || isTooSmall) ? 'blur-md opacity-0' : 'opacity-100'}`}>
        {renderScreen()}
      </div>

      {/* Easter Egg Messages */}
      {!isPortrait && !isTooSmall && (
        <div className="fixed bottom-12 left-0 w-full text-center pointer-events-none px-4">
          {idleText && (
            <p className="text-white text-2xl md:text-3xl animate-bounce storybook-font font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              {idleText}
            </p>
          )}
          {clickCount > 8 && screen !== AppScreen.SUCCESS && (
            <p className="text-white text-lg storybook-font italic font-bold drop-shadow-md">
              Thinking… thinking… still thinking very hard…
            </p>
          )}
        </div>
      )}

      {/* Footer Year */}
      {!isPortrait && !isTooSmall && (
        <div className="fixed bottom-4 right-6 text-white text-xl md:text-2xl storybook-font font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Hundred Acre Wood, 2026
        </div>
      )}
    </div>
  );
};

export default App;
