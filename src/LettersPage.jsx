import { useState, useEffect, useRef, useCallback } from 'react';
import DecorativeFlower from './components/DecorativeFlower';

const FLOWER_TYPES = ['rose', 'tulip', 'daisy', 'sunflower', 'lavender', 'lily'];

const PETAL_COLORS = {
  rose: ['#e11d48', '#f43f5e', '#fda4af', '#9f1239'],
  tulip: ['#fb7185', '#f472b6', '#fca5a5', '#ec4899'],
  daisy: ['#ffffff', '#fef9c3', '#fefcf0', '#fef08a'],
  sunflower: ['#eab308', '#facc15', '#fef08a', '#ca8a04', '#78350f'],
  lavender: ['#c084fc', '#a855f7', '#d8b4fe', '#8b5cf6', '#6d28d9'],
  lily: ['#ffffff', '#fff1f2', '#ffe4e6', '#fda4af', '#ffe4e6']
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LettersPage() {
  const [data, setData] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [vaseFlowers, setVaseFlowers] = useState([]);
  const [activeLetter, setActiveLetter] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [burstingIds, setBurstingIds] = useState(new Set());
  const flowerRefs = useRef({});
  const petalIdRef = useRef(0);
  const [cascadeStyles, setCascadeStyles] = useState([]);
  const [showFinalLetter, setShowFinalLetter] = useState(false);

  useEffect(() => {
    fetch('/letters.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        const gaussianRandom = (mean = 0, std = 7) => {
          let u1 = 0, u2 = 0;

          while (u1 === 0) u1 = Math.random();
          while (u2 === 0) u2 = Math.random();

          const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

          return z0 * std + mean;
        };

        const flowerSizes = [35, 38, 41, 44, 47, 50, 53];
        const initialFlowers = json.flowers.map((letter, idx) => ({
          ...letter,
          type: letter.type || getRandomItem(FLOWER_TYPES),
          windLevel: 1,
          blooming: true,
          key: letter.id || idx,
          size: flowerSizes[idx % flowerSizes.length],
          zIndex: 10 + idx,
          delay: 0,
          initialRotation: gaussianRandom()
        }));
        setFlowers(initialFlowers);
      });
  }, []);

  useEffect(() => {
    if (flowers.length === 0 && data?.finalLetter) {
      setTimeout(() => setShowFinalLetter(true), 800);
    }
  }, [flowers.length, data]);

  const handleFlowerClick = (flower, e) => {
    e.stopPropagation();
    setActiveLetter(flower);
    setShowOverlay(true);
  };

  const closeLetter = useCallback(() => {
    const flowerToBurst = activeLetter;
    setShowOverlay(false);
    setActiveLetter(null);

    if (flowerToBurst) {
      const flowerEl = flowerRefs.current[flowerToBurst.key];
      if (!flowerEl) return;

      const rect = flowerEl.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 3;
      const colors = PETAL_COLORS[flowerToBurst.type] || PETAL_COLORS.rose;

      setBurstingIds(prev => new Set([...prev, flowerToBurst.key]));

      const newStyles = [];
      const count = 16 + Math.floor(Math.random() * 8);
      for (let i = 0; i < count; i++) {
        const id = petalIdRef.current++;
        const dx1 = (Math.random() * 200 - 100).toFixed(0) + 'px';
        const dy1 = (-60 - Math.random() * 80).toFixed(0) + 'px';
        const dx2 = (Math.random() * 400 - 200).toFixed(0) + 'px';
        const maxDy2 = window.innerHeight - originY - 150;
        const dy2Val = Math.min(maxDy2, 120 + Math.random() * 160);
        const dy2 = dy2Val.toFixed(0) + 'px';
        const dx3 = (Math.random() * 600 - 300).toFixed(0) + 'px';
        const maxDy = window.innerHeight - originY - 50;
        const dy3Val = Math.min(maxDy, 300 + Math.random() * 200);
        const dy3 = dy3Val.toFixed(0) + 'px';
        const size = 15 + Math.random() * 15;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = 2.5 + Math.random() * 2.0;
        const delay = (Math.random() * 0.2).toFixed(2);

        newStyles.push({
          id,
          originX,
          originY,
          size,
          color,
          dx1, dy1, dx2, dy2, dx3, dy3,
          duration,
          delay,
          initialRotation: Math.floor(Math.random() * 360)
        });
      }
      setCascadeStyles(prev => [...prev, ...newStyles]);

      setTimeout(() => {
        setVaseFlowers(prev => [...prev, {
          type: flowerToBurst.type || getRandomItem(FLOWER_TYPES),
          windLevel: 1,
          key: Date.now() + Math.random()
        }]);
      }, 400);

      setTimeout(() => {
        setBurstingIds(prev => {
          const next = new Set(prev);
          next.delete(flowerToBurst.key);
          return next;
        });
        setFlowers(prev => prev.filter(f => f.key !== flowerToBurst.key));
      }, 1200);
    }
  }, [activeLetter]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <p className="text-stone-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#e2dfda] transition-colors duration-700 overflow-hidden relative">
      {/* Cascade petals layer - positioned fixed, spawning at flower center */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {cascadeStyles.map(petal => (
          <div
            key={petal.id}
            className="absolute"
            style={{
              left: `${petal.originX}px`,
              top: `${petal.originY}px`,
              width: `${petal.size}px`,
              height: `${petal.size}px`,
              position: 'fixed',
              animation: `cascadePetal${petal.id} ${petal.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards ${petal.delay}s`,
              ['--dx1']: petal.dx1,
              ['--dy1']: petal.dy1,
              ['--dx2']: petal.dx2,
              ['--dy2']: petal.dy2,
              ['--dx3']: petal.dx3,
              ['--dy3']: petal.dy3,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" style={{ transform: `rotate(${petal.initialRotation}deg)` }}>
              <path
                d="M12,2 C18,8 22,14 18,20 C14,24 10,24 6,20 C2,14 6,8 12,2 Z"
                fill={petal.color}
                opacity="0.95"
              />
            </svg>
            <style>{`
              @keyframes cascadePetal${petal.id} {
                0% {
                  transform: translate(0, 0) rotate(${petal.initialRotation}deg) scale(1.1);
                  opacity: 1;
                }
                15% {
                  transform: translate(calc(var(--dx1) * 0.9), calc(var(--dy1) * 0.8)) rotate(calc(${petal.initialRotation}deg + 60deg)) scale(1);
                  opacity: 0.95;
                }
                50% {
                  transform: translate(calc(var(--dx2) * 0.8), calc(var(--dy2) * 0.6)) rotate(calc(${petal.initialRotation}deg + 180deg)) scale(0.85);
                  opacity: 0.85;
                }
                100% {
                  transform: translate(var(--dx3), var(--dy3)) rotate(calc(${petal.initialRotation}deg + 320deg)) scale(0.7);
                  opacity: 0.7;
                }
              }
            `}</style>
          </div>
        ))}
      </div>

      <div id="ambientPetalAtmosphere" className="fixed inset-0 pointer-events-none z-50" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#1a261a] to-[#0f150f]" />

      {/* Grass at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <svg viewBox="0 0 1200 100" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,100 Q50,60 100,80 T200,70 T300,85 T400,65 T500,90 T600,70 T700,85 T800,60 T900,80 T1000,70 T1100,85 T1200,75 L1200,100 Z" fill="#1a3a1a" opacity="0.6"/>
          <path d="M0,100 Q30,70 80,85 T180,75 T280,90 T380,65 T480,85 T580,70 T680,90 T780,60 T880,80 T980,70 T1080,90 T1180,70 L1200,80 L1200,100 Z" fill="#0f250f" opacity="0.8"/>
        </svg>
      </div>

      <header className="relative z-20 text-center pt-6 pb-2">
        <h1 className="text-3xl md:text-4xl font-light tracking-wide italic text-[#e2dfda]/80">{data.title}</h1>
        <p className="text-[10px] text-[#a8a29e]/60 mt-1 uppercase tracking-[0.2em]">Click a flower to read its letter</p>
      </header>

      <main className="relative z-20 h-[calc(100vh-100px)] flex flex-col items-center justify-end pb-4">
        {/* Flowers Garden - all aligned at bottom */}
        <div className="relative w-full flex justify-center" style={{ height: '85vh' }}>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end">
{flowers.map(flower => (
              <div
                key={flower.key}
                ref={el => flowerRefs.current[flower.key] = el}
                className={`absolute cursor-pointer transition-all duration-300 ${burstingIds.has(flower.key) ? 'plucked-fade' : ''}`}
                style={{
                  left: `calc(50% + ${(flower.key - flowers.length / 2) * 250}px)`,
                  transform: `rotate(${flower.initialRotation}deg)`,
                  transformOrigin: '50% 100%',
                  zIndex: flower.zIndex,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'flex-end'
                }}
                onClick={(e) => handleFlowerClick(flower, e)}
              >
                <DecorativeFlower
                  type={flower.type}
                  windLevel={burstingIds.has(flower.key) ? 0 : flower.windLevel}
                  blooming={flower.blooming}
                  garden
                  baseRotation={flower.initialRotation}
                  size={flower.size * 12}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {showFinalLetter && data?.finalLetter && (
        <div className="fixed inset-0 bg-[#1a1a1a] z-40 flex items-start justify-center p-8 overflow-y-auto">
          <div className="max-w-2xl w-full text-center pt-24 pb-32">
            <h2 className="text-4xl md:text-5xl font-light italic text-[#e2dfda] mb-12">{data.finalLetter.title}</h2>
            <div className="text-lg text-[#a8a29e] leading-relaxed space-y-6">
              {data.finalLetter.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .plucked-fade {
          animation: pluckFade 1.2s ease-out forwards !important;
        }
        @keyframes pluckFade {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          30% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
        }
      `}</style>

      {/* Letter Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-opacity duration-300 ${
          showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.target === e.currentTarget && closeLetter()}
      >
        <div
          className={`bg-[#1a1a1a]/95 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-[#444] transition-all duration-300 ${
            showOverlay ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-light italic text-[#e2dfda]">{activeLetter?.title}</h2>
            <button
              onClick={closeLetter}
              className="text-[#666] hover:text-[#999] transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="text-sm text-[#a8a29e] leading-relaxed space-y-4">
            {activeLetter?.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
