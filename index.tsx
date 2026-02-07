import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- Shared Types ---
enum AppScreen {
  OPENING = 'OPENING',
  BUILDUP = 'BUILDUP',
  THE_ASK = 'THE_ASK',
  SUCCESS = 'SUCCESS'
}

interface HoneyDrop {
  id: number;
  left: number;
  duration: number;
  size: number;
}

// --- Illustrations ---
const HoneyPot: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 120 150" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 55 C25 40 45 32 60 32 C75 32 95 40 95 55 V105 C95 120 78 135 60 135 C42 135 25 120 25 105 V55Z" fill="#E0A21B" stroke="#6D4C41" strokeWidth="3" />
    <ellipse cx="60" cy="38" rx="42" ry="12" fill="#FFD54F" stroke="#6D4C41" strokeWidth="3" />
    <path d="M40 38 C42 48 38 55 42 60 C46 66 52 60 52 54 C52 48 50 44 50 38Z" fill="#FFECB3" />
    <path d="M35 70C48 74 72 74 85 70" stroke="#6D4C41" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <rect x="38" y="80" rx="10" ry="10" width="44" height="26" fill="#F5F5DC" stroke="#6D4C41" strokeWidth="2" />
    <text x="60" y="98" textAnchor="middle" fill="#6D4C41" style={{ fontSize: "12px", fontStyle: "italic", fontWeight: 700, letterSpacing: "1px" }}>HUNNY</text>
  </svg>
);

const Bee: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 80 60" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="38" cy="18" rx="12" ry="7" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" />
    <ellipse cx="50" cy="16" rx="10" ry="6" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1.5" />
    <ellipse cx="42" cy="34" rx="20" ry="14" fill="#FFEB3B" stroke="#5D4037" strokeWidth="2" />
    <path d="M34 22V46" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
    <path d="M42 20V48" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 22V46" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
    <circle cx="20" cy="32" r="10" fill="#FFEB3B" stroke="#5D4037" strokeWidth="2" />
    <circle cx="18" cy="30" r="2" fill="#3E2723" />
    <path d="M16 34C17.5 36 20.5 36 22 34" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="34" r="2" fill="#F8BBD0" opacity="0.7" />
    <path d="M16 18C12 12 8 14 10 18" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M64 34L72 32L64 30Z" fill="#5D4037" />
  </svg>
);

const Flower: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => (
  <svg viewBox="0 0 80 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    {[...Array(12)].map((_, i) => (
      <ellipse key={`outer-${i}`} cx="40" cy="16" rx="7" ry="16" fill="#FBC02D" stroke="#F9A825" strokeWidth="1.2" transform={`rotate(${i * 30} 40 40)`} />
    ))}
    {[...Array(12)].map((_, i) => (
      <ellipse key={`inner-${i}`} cx="40" cy="20" rx="5" ry="12" fill="#FFEE58" stroke="#FBC02D" strokeWidth="1" transform={`rotate(${i * 30 + 15} 40 40)`} />
    ))}
    <circle cx="40" cy="40" r="14" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
    <circle cx="36" cy="36" r="4" fill="#A1887F" opacity="0.4" />
  </svg>
);

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.OPENING);
  const [idleText, setIdleText] = useState<string>('');
  const [honeyDrops, setHoneyDrops] = useState<HoneyDrop[]>([]);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [isLandscape, setIsLandscape] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const h = window.innerHeight;
      const w = window.innerWidth;
      const landscape = w > h;
      setIsLandscape(landscape);
      
      // Adjusted target height to be more realistic for landscape fitting
      const targetHeight = landscape ? 600 : 780;
      const targetWidth = landscape ? 650 : 380;

      const hScale = h / targetHeight;
      const wScale = w / targetWidth;
      
      const newScale = Math.min(1, hScale, wScale);
      setScaleFactor(Math.max(0.35, newScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIdleText('');
    if (screen !== AppScreen.SUCCESS) {
      idleTimerRef.current = setTimeout(() => {
        setIdleText('Pooh is waiting patiently...');
      }, 7000);
    }
  }, [screen]);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer]);

  const handleAction = (next: AppScreen) => {
    setScreen(next);
    if (next === AppScreen.SUCCESS) {
      const drops: HoneyDrop[] = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 3 + Math.random() * 4,
        size: 15 + Math.random() * 20
      }));
      setHoneyDrops(drops);
    }
  };

  const renderContent = () => {
    const iconBaseSize = isLandscape ? 60 : 85;
    switch (screen) {
      case AppScreen.OPENING:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in duration-700 landscape-compact">
            <Flower style={{ width: iconBaseSize, height: iconBaseSize }} className="mb-2 md:mb-4 floating" />
            <h1 className="text-3xl md:text-5xl text-[#5d4037] mb-1 md:mb-3 storybook-font font-bold">Hello Matilda 🌼</h1>
            <p className="text-lg md:text-2xl text-[#5d4037] mb-4 md:mb-6 max-w-md leading-relaxed font-bold">
              I was just sitting here, thinking…<br/>
              <span className="text-base md:text-lg italic font-normal text-[#8d6e63]">(which is often hard work)</span>
            </p>
            <button onClick={() => handleAction(AppScreen.BUILDUP)} className="bg-[#fbc02d] text-[#5d4037] px-8 py-2 md:py-3 rounded-full text-lg md:text-2xl hand-drawn-border hover:bg-[#fdd835] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3">
              <span>🍯</span> Oh? What is it?
            </button>
          </div>
        );
      case AppScreen.BUILDUP:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 landscape-compact">
            <Bee style={{ width: iconBaseSize, height: iconBaseSize }} className="mb-2 md:mb-4 floating" />
            <p className="text-xl md:text-3xl text-[#5d4037] mb-4 md:mb-6 max-w-lg leading-relaxed storybook-font font-bold">
              Valentine's Day is coming soon.<br/>And I have no honey plans.<br/>Which is so very sad.
            </p>
            <button onClick={() => handleAction(AppScreen.THE_ASK)} className="bg-[#c5e1a5] text-[#5d4037] px-8 py-2 md:py-3 rounded-full text-lg md:text-2xl hand-drawn-border hover:bg-[#dcedc8] transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-3">
              <span>🐝</span> Go on…
            </button>
          </div>
        );
      case AppScreen.THE_ASK:
        return (
          <div className="flex flex-col items-center text-center px-4 animate-in zoom-in duration-500 landscape-compact">
            <HoneyPot style={{ width: iconBaseSize * 1.1, height: iconBaseSize * 1.3 }} className="mb-1 md:mb-2 floating" />
            <p className="text-lg md:text-2xl text-[#5d4037] mb-0 md:mb-1 storybook-font">So I thought to ask you</p>
            <p className="text-sm md:text-lg text-[#8d6e63] mb-2 md:mb-4 italic landscape-hide">very politely, and with plenty of fun</p>
            <h2 className="text-2xl md:text-4xl text-[#d4a017] mb-4 md:mb-6 font-bold storybook-font">Would you be my Valentine? 💛</h2>
            <div className={`flex ${isLandscape ? 'flex-row gap-2' : 'flex-col gap-2'} w-full max-w-xs md:max-w-md`}>
              <button onClick={() => handleAction(AppScreen.SUCCESS)} className="flex-1 bg-[#fbc02d] text-[#5d4037] py-2 rounded-full text-sm md:text-xl hand-drawn-border hover:bg-[#fdd835] transition-all shadow-md"><span>🍯</span> Yes</button>
              <button onClick={() => handleAction(AppScreen.SUCCESS)} className="flex-1 bg-[#fff176] text-[#5d4037] py-2 rounded-full text-sm md:text-xl hand-drawn-border hover:bg-[#fff59d] transition-all shadow-md"><span>🌻</span> Definitely</button>
              <button onClick={() => handleAction(AppScreen.SUCCESS)} className="flex-1 bg-[#ffd54f] text-[#5d4037] py-2 rounded-full text-sm md:text-xl hand-drawn-border hover:bg-[#ffca28] transition-all shadow-md"><span>🐝</span> Always</button>
            </div>
          </div>
        );
      case AppScreen.SUCCESS:
        return (
          <div className="flex flex-col items-center text-center px-4 z-10 animate-in fade-in zoom-in-50 duration-1000 landscape-compact">
            <div className="flex gap-4 mb-1 md:mb-2 items-end">
              <HoneyPot style={{ width: iconBaseSize * 0.6, height: iconBaseSize * 0.8 }} className="floating" />
              <Bee style={{ width: iconBaseSize * 0.3, height: iconBaseSize * 0.3 }} className="animate-bounce" />
            </div>
            <h1 className="text-xl md:text-3xl text-[#5d4037] mb-1 storybook-font font-bold">Oh bother… how wonderful!</h1>
            <p className="text-base md:text-xl text-[#5d4037] mb-3 md:mb-4 leading-relaxed max-w-md font-bold">I’m very glad I asked.<br/>I promise to share my honey.</p>
            <div className="bg-[#fffde7] p-3 md:p-4 rounded-2xl hand-drawn-border shadow-md mb-2 md:mb-4 max-w-xs w-full border-[#d4a017]">
              <div className="text-[#d4a017] text-lg mb-0 landscape-hide">🔥</div>
              <h3 className="text-[#5d4037] text-sm md:text-lg font-bold storybook-font mb-0 md:mb-1">Our Date Invitation:</h3>
              <p className="text-[#5d4037] text-sm md:text-lg font-bold leading-tight">Fireplace by Bedrock,<br/>One Holland Village #03-27<br/><span className="text-[#d4a017]">7PM • 14 February 2026</span></p>
            </div>
            <div className="p-2 md:p-3 bg-white/60 rounded-xl border border-dashed border-[#fbc02d] storybook-font text-xs md:text-base text-[#5d4037] max-w-md shadow-inner italic leading-snug landscape-hide">
              "A day without a friend is like a pot without a single drop of honey left inside."
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden" onClick={resetIdleTimer}>
      {/* Falling honey animation */}
      {screen === AppScreen.SUCCESS && honeyDrops.map(drop => (
        <div key={drop.id} className="honey-drop" style={{ left: `${drop.left}%`, top: `-50px`, animationDuration: `${drop.duration}s`, animationDelay: `${Math.random() * 2}s` }}>
          <svg width={drop.size} height={drop.size} viewBox="0 0 20 20"><path d="M10 2C10 2 6 8 6 12C6 14.2 7.8 16 10 16C12.2 16 14 14.2 14 12C14 8 10 2 10 2Z" fill="#FBC02D" opacity="0.45" /></svg>
        </div>
      ))}

      {/* Main Content Container */}
      <div 
        className="relative z-10 w-[94%] max-w-lg bg-white/75 backdrop-blur-md rounded-[2.5rem] hand-drawn-border shadow-2xl transition-all duration-500 no-scrollbar overflow-hidden" 
        style={{ 
          transform: `scale(${scaleFactor})`, 
          transformOrigin: 'center center', 
          padding: isLandscape ? '1.5rem 1rem' : '2.5rem 1rem',
          maxHeight: '94vh'
        }}
      >
        {renderContent()}
      </div>

      {/* Floating Hint Text */}
      <div className={`fixed ${isLandscape ? 'bottom-2' : 'bottom-10'} left-0 w-full text-center pointer-events-none px-4 z-20`}>
        {idleText && <p className="text-white text-lg md:text-2xl animate-bounce storybook-font font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{idleText}</p>}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
