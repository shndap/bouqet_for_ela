import { useEffect, useRef } from 'react';

const FLOWER_SVGS = {
  rose: `
    <svg class="flower-svg w-full h-full overflow-visible" viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="roseStemGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2d5a27"/>
          <stop offset="100%" stop-color="#3f7a37"/>
        </linearGradient>
        <linearGradient id="rosePetalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fb7185"/>
          <stop offset="60%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#be123c"/>
        </linearGradient>
        <linearGradient id="roseCoreGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffe4e6"/>
          <stop offset="100%" stop-color="#e11d48"/>
        </linearGradient>
      </defs>
      <path class="stem-path" d="M60,85 Q62,150 60,220" stroke="url(#roseStemGrad)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <g class="leaves">
        <path d="M61,130 C42,125 30,135 25,145 C35,155 50,150 59,138" fill="url(#roseStemGrad)" opacity="0.95" style="animation: leafSway 4s ease-in-out infinite alternate; transform-origin: 61px 130px;"/>
        <path d="M60,105 C78,100 90,105 95,115 C85,127 70,125 61,113" fill="url(#roseStemGrad)" opacity="0.95" style="animation: leafSway 5s ease-in-out infinite alternate-reverse; transform-origin: 60px 105px;"/>
      </g>
      <path d="M42,80 C48,98 72,98 78,80 C70,100 50,100 42,80 Z" fill="#2d5a27"/>
      <g class="bloom-group transition-transform duration-700 origin-[60px_75px]">
        <path class="petal-outer" style="--tuck: -12deg;" d="M25,75 C2,82 8,38 32,32 C44,14 76,14 88,32 C112,38 118,82 95,75 C88,95 32,95 25,75 Z" fill="url(#rosePetalGrad)" opacity="0.95"/>
        <path class="petal-inner" d="M32,70 C14,70 20,46 38,40 C50,26 70,26 82,40 C100,46 106,70 88,70 C82,82 38,82 32,70 Z" fill="url(#rosePetalGrad)"/>
        <path class="petal-inner" d="M42,74 C30,64 36,48 52,48 C60,34 72,40 72,50 C86,56 82,74 68,76 C58,78 50,78 42,74 Z" fill="url(#roseCoreGrad)" opacity="0.9"/>
        <g class="rose-core">
          <path d="M48,72 C42,65 45,56 54,57 C58,51 64,51 66,57 C75,59 72,68 64,72 Q56,76 48,72 Z" fill="#be123c"/>
          <path d="M50,66 C48,60 58,52 62,60 C64,56 68,60 66,66 C60,71 55,71 50,66 Z" fill="#9f1239"/>
        </g>
      </g>
    </svg>
  `,
  tulip: `
    <svg class="flower-svg w-full h-full overflow-visible" viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tulipStemGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#386a34"/>
          <stop offset="100%" stop-color="#4e8f49"/>
        </linearGradient>
        <linearGradient id="tulipPetalBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fda4af"/>
          <stop offset="100%" stop-color="#f43f5e"/>
        </linearGradient>
        <linearGradient id="tulipPetalFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffe4e6"/>
          <stop offset="40%" stop-color="#fb7185"/>
          <stop offset="100%" stop-color="#e11d48"/>
        </linearGradient>
      </defs>
      <path class="stem-path" d="M60,90 Q58,160 60,220" stroke="url(#tulipStemGrad)" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      <g class="leaves">
        <path d="M60,160 C38,130 30,80 42,40 C40,70 45,120 60,160 Z" fill="url(#tulipStemGrad)" opacity="0.9" style="animation: leafSway 4.5s ease-in-out infinite alternate; transform-origin: 60px 160px;"/>
        <path d="M60,140 C78,110 85,70 78,30 C82,60 75,110 60,140 Z" fill="url(#tulipStemGrad)" opacity="0.85" style="animation: leafSway 5.5s ease-in-out infinite alternate-reverse; transform-origin: 60px 140px;"/>
      </g>
      <g class="bloom-group transition-transform duration-700 origin-[60px_85px]">
        <path class="petal-outer" style="--tuck: -16deg;" d="M38,80 C28,45 50,15 60,12 C70,15 92,45 82,80 C70,100 50,100 38,80 Z" fill="url(#tulipPetalBack)"/>
        <path class="petal-outer" style="--tuck: -10deg;" d="M32,76 C22,48 40,28 52,25 C46,45 44,66 44,82 C38,81 34,79 32,76 Z" fill="url(#tulipPetalFront)" opacity="0.95"/>
        <path class="petal-outer" style="--tuck: 10deg;" d="M88,76 C98,48 80,28 68,25 C74,45 76,66 76,82 C82,81 86,79 88,76 Z" fill="url(#tulipPetalFront)" opacity="0.95"/>
        <path class="petal-inner" d="M42,82 C34,50 52,24 60,22 C68,24 86,50 78,82 C68,94 52,94 42,82 Z" fill="url(#tulipPetalFront)"/>
      </g>
    </svg>
  `,
  daisy: `
    <svg class="flower-svg w-full h-full overflow-visible" viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="daisyStem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#417c3c"/>
          <stop offset="100%" stop-color="#55a34f"/>
        </linearGradient>

        <radialGradient id="daisyCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="60%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#a16207"/>
        </radialGradient>
      </defs>

      <path class="stem-path" d="M60,80 Q62,150 60,220"
            stroke="url(#daisyStem)" stroke-width="2.5"
            stroke-linecap="round" fill="none"/>

      <g class="leaves" style="animation: leafSway 4.8s ease-in-out infinite alternate; transform-origin: 60px 140px;">
        <path d="M59,140 Q30,130 18,142 Q38,155 59,140"
              fill="url(#daisyStem)" opacity="0.9"/>
        <path d="M60,110 Q90,105 102,118 Q80,130 60,110"
              fill="url(#daisyStem)" opacity="0.9"/>
      </g>

      <g class="bloom-group transition-transform duration-700 origin-[60px_75px]">

        <g>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#ffffff" transform="rotate(0 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#fafafa" transform="rotate(30 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#ffffff" transform="rotate(60 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#fafafa" transform="rotate(90 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#ffffff" transform="rotate(120 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#fafafa" transform="rotate(150 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#ffffff" transform="rotate(180 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#fafafa" transform="rotate(210 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#ffffff" transform="rotate(240 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#fafafa" transform="rotate(270 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#ffffff" transform="rotate(300 60 75)"/>
          <path d="M60,75 C58,60 58,40 60,28 C62,40 62,60 60,75 Z"
                fill="#fafafa" transform="rotate(330 60 75)"/>
        </g>

        <circle cx="60" cy="75" r="13" fill="url(#daisyCenter)"/>
        <circle cx="60" cy="75" r="13"
                fill="none" stroke="#92400e"
                stroke-width="0.8" opacity="0.6"/>

        <circle cx="60" cy="75" r="6" fill="#7c2d12" opacity="0.35"/>
      </g>
    </svg>
    `,
  sunflower: `
    <svg class="flower-svg w-full h-full overflow-visible" viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sunflowerStem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#3f7229"/>
          <stop offset="100%" stop-color="#56983b"/>
        </linearGradient>
        <linearGradient id="sunPetalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <radialGradient id="sunCenter">
          <stop offset="0%" stop-color="#1c1917"/>
          <stop offset="55%" stop-color="#44403c"/>
          <stop offset="100%" stop-color="#78716c"/>
        </radialGradient>
      </defs>
      <path class="stem-path" d="M60,85 Q59,150 60,220" stroke="url(#sunflowerStem)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <g class="leaves">
        <path d="M60,140 C35,135 20,155 15,170 C30,180 48,165 60,155" fill="url(#sunflowerStem)" opacity="0.95" style="animation: leafSway 4.2s ease-in-out infinite alternate; transform-origin: 60px 140px;"/>
        <path d="M60,115 C85,110 100,130 105,145 C90,155 72,140 60,130" fill="url(#sunflowerStem)" opacity="0.95" style="animation: leafSway 5s ease-in-out infinite alternate-reverse; transform-origin: 60px 115px;"/>
      </g>
      <g class="bloom-group transition-transform duration-700 origin-[60px_75px]" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.12));">
        <g class="ray-florets-outer petal-outer" style="--tuck: -14deg;">
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(0, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(22.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(45, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(67.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(90, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(112.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(135, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(157.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(180, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(202.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(225, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(247.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(270, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(292.5, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(315, 60, 75)"/>
          <path d="M54,75 C54,10 66,10 66,75 Z" fill="url(#sunPetalGrad)" transform="rotate(337.5, 60, 75)"/>
        </g>
        <g class="ray-florets-inner petal-inner">
          <g transform="scale(0.85) translate(10.5, 13)">
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(11, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(56, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(101, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(146, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(191, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(236, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(281, 60, 75)"/>
            <path d="M55,75 C55,20 65,20 65,75 Z" fill="#facc15" transform="rotate(326, 60, 75)"/>
          </g>
        </g>
        <circle class="petal-inner" cx="60" cy="75" r="18" fill="url(#sunCenter)"/>
        <circle class="petal-inner" cx="60" cy="75" r="16" fill="none" stroke="#d97706" stroke-width="0.8" stroke-dasharray="1.5, 1.5" opacity="0.8"/>
        <circle class="petal-inner" cx="60" cy="75" r="11" fill="none" stroke="#fbbf24" stroke-width="0.8" stroke-dasharray="1, 1" opacity="0.75"/>
        <circle class="petal-inner" cx="60" cy="75" r="5" fill="#1c1917"/>
      </g>
    </svg>
  `,
  lavender: `
    <svg class="flower-svg w-full h-full overflow-visible" viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lavenderStem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#475f3a"/>
          <stop offset="100%" stop-color="#5f7e4e"/>
        </linearGradient>
        <linearGradient id="lavenderBloomGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d8b4fe"/>
          <stop offset="100%" stop-color="#8b5cf6"/>
        </linearGradient>
        <linearGradient id="lavenderBloomGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#6d28d9"/>
        </linearGradient>
      </defs>
      <path class="stem-path" d="M60,40 Q61,140 60,220" stroke="url(#lavenderStem)" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <g class="leaves" style="animation: leafSway 4s ease-in-out infinite alternate; transform-origin: 60px 150px;">
        <path d="M59,150 Q36,140 24,160 Q44,152 59,150" fill="url(#lavenderStem)" opacity="0.8"/>
        <path d="M60,130 Q84,120 96,140 Q76,132 60,130" fill="url(#lavenderStem)" opacity="0.8"/>
        <path d="M59,105 Q41,100 30,115 Q46,108 59,105" fill="url(#lavenderStem)" opacity="0.75"/>
      </g>
      <g class="bloom-group transition-transform duration-700 origin-[60px_70px]" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1));">
        <g class="petal-outer" style="--tuck: -16deg;" transform="translate(0, 45) scale(1.2) translate(-10, -18)">
          <circle cx="51" cy="90" r="6" fill="url(#lavenderBloomGrad1)"/>
          <circle cx="69" cy="90" r="6" fill="url(#lavenderBloomGrad2)"/>
          <circle cx="60" cy="85" r="5.5" fill="url(#lavenderBloomGrad1)"/>
          <circle cx="48" cy="96" r="5" fill="url(#lavenderBloomGrad2)"/>
          <circle cx="72" cy="96" r="5" fill="url(#lavenderBloomGrad1)"/>
        </g>
        <g class="petal-outer" style="--tuck: -8deg;" transform="translate(0, 25) scale(1.2) translate(-10, -14)">
          <circle cx="52" cy="75" r="6" fill="url(#lavenderBloomGrad2)"/>
          <circle cx="68" cy="75" r="6" fill="url(#lavenderBloomGrad1)"/>
          <circle cx="60" cy="70" r="5.5" fill="url(#lavenderBloomGrad2)"/>
          <circle cx="47" cy="80" r="4.5" fill="url(#lavenderBloomGrad1)"/>
          <circle cx="73" cy="80" r="4.5" fill="url(#lavenderBloomGrad2)"/>
        </g>
        <g class="petal-inner" transform="translate(0, 5) scale(1.15) translate(-7.8, -4)">
          <circle cx="53" cy="60" r="5.5" fill="url(#lavenderBloomGrad1)"/>
          <circle cx="67" cy="60" r="5.5" fill="url(#lavenderBloomGrad2)"/>
          <circle cx="60" cy="54" r="6" fill="url(#lavenderBloomGrad1)"/>
        </g>
        <g class="petal-inner" transform="translate(0, -15) scale(1.1)">
          <circle cx="54" cy="45" r="5" fill="url(#lavenderBloomGrad2)"/>
          <circle cx="66" cy="45" r="5" fill="url(#lavenderBloomGrad1)"/>
          <circle cx="60" cy="39" r="5" fill="url(#lavenderBloomGrad2)"/>
        </g>
        <circle class="petal-inner" cx="60" cy="18" r="4" fill="url(#lavenderBloomGrad2)"/>
        <circle class="petal-inner" cx="60" cy="10" r="2.5" fill="url(#lavenderBloomGrad1)"/>
      </g>
    </svg>
  `,
  lily: `
    <svg class="flower-svg w-full h-full overflow-visible" viewBox="0 0 120 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lilyStem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#345e37"/>
          <stop offset="100%" stop-color="#467e4b"/>
        </linearGradient>
        <linearGradient id="lilyPetal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#ffe4e6"/>
          <stop offset="100%" stop-color="#fecdd3"/>
        </linearGradient>
      </defs>
      <path class="stem-path" d="M60,90 Q58,150 60,220" stroke="url(#lilyStem)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <g class="leaves">
        <path d="M59,150 C38,130 18,140 10,155 C22,160 44,160 59,152" fill="url(#lilyStem)" opacity="0.95" style="animation: leafSway 4s ease-in-out infinite alternate; transform-origin: 59px 150px;"/>
        <path d="M61,120 C82,100 102,110 110,125 C97,130 75,130 61,122" fill="url(#lilyStem)" opacity="0.95" style="animation: leafSway 4.8s ease-in-out infinite alternate-reverse; transform-origin: 61px 120px;"/>
      </g>
      <g class="bloom-group transition-transform duration-700 origin-[60px_85px]" style="filter: drop-shadow(0 2px 5px rgba(0,0,0,0.08));">
        <path class="petal-outer" style="--tuck: -14deg;" d="M60,85 C38,55 30,20 40,10 C52,28 58,60 60,85 Z" fill="url(#lilyPetal)"/>
        <path class="petal-outer" style="--tuck: 14deg;" d="M60,85 C82,55 90,20 80,10 C68,28 62,60 60,85 Z" fill="url(#lilyPetal)"/>
        <path class="petal-outer" style="--tuck: 0deg;" d="M60,85 C60,45 60,5 60,-5 C65,10 65,50 60,85 Z" fill="url(#lilyPetal)" opacity="0.9"/>
        <path class="petal-outer" style="--tuck: -10deg;" d="M60,85 C30,80 8,60 2,45 C18,40 46,62 60,85 Z" fill="url(#lilyPetal)"/>
        <path class="petal-outer" style="--tuck: 10deg;" d="M60,85 C90,80 112,60 118,45 C102,40 74,62 60,85 Z" fill="url(#lilyPetal)"/>
        <g class="stamens">
          <path d="M60,85 Q60,50 58,30" stroke="#854d0e" stroke-width="1.5" fill="none" opacity="0.8"/>
          <ellipse cx="58" cy="28" rx="2.5" ry="1.5" fill="#451a03"/>
          <path d="M60,85 Q50,55 44,35" stroke="#a16207" stroke-width="1.1" fill="none" opacity="0.75"/>
          <ellipse cx="44" cy="33" rx="2.2" ry="1.2" fill="#78350f" transform="rotate(-15, 44, 33)"/>
          <path d="M60,85 Q70,55 76,35" stroke="#a16207" stroke-width="1.1" fill="none" opacity="0.75"/>
          <ellipse cx="76" cy="33" rx="2.2" ry="1.2" fill="#78350f" transform="rotate(15, 76, 33)"/>
        </g>
        <path class="petal-inner" d="M60,85 C38,95 28,75 38,62 C46,55 56,72 60,85 Z" fill="url(#lilyPetal)" opacity="0.95"/>
        <path class="petal-inner" d="M60,85 C82,95 92,75 82,62 C74,55 64,72 60,85 Z" fill="url(#lilyPetal)" opacity="0.95"/>
      </g>
    </svg>
  `
};

export default function DecorativeFlower({ type = 'rose', windLevel = 1, blooming = true, vase = false, garden = false, baseRotation = 0, size = 50 }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current || vase) return;

    if (windLevel === 0) {
      wrapperRef.current.style.animation = 'none';
      return;
    }

    const duration = '6s';
    const minDeg = -2 + baseRotation;
    const maxDeg = 3 + baseRotation;
    const bendMin = '-2px';
    const bendMax = '2px';

    wrapperRef.current.style.setProperty('--sway-min', `${minDeg}deg`);
    wrapperRef.current.style.setProperty('--sway-max', `${maxDeg}deg`);
    wrapperRef.current.style.setProperty('--bend-min', bendMin);
    wrapperRef.current.style.setProperty('--bend-max', bendMax);
    const delay = (Math.random() * -4).toFixed(2) + 's';
    wrapperRef.current.style.animation = `windSway ${duration} ease-in-out infinite alternate ${delay}`;
  }, [windLevel, vase, baseRotation]);

  const sizeConfig = vase
    ? { width: 32, height: 50 }
    : { width: size, height: size * 1.1 };

  return (
    <div
      className="relative flex items-end justify-center overflow-visible select-none transition-all duration-500"
      style={{ width: `${sizeConfig.width}px`, height: `${sizeConfig.height}px` }}
    >
      <div
        ref={wrapperRef}
        className="relative flex items-end justify-center origin-bottom transition-all duration-500 w-full h-full"
        style={{ transformOrigin: '50% 100%' }}
      >
        <div
          className="w-full h-full"
          style={{ width: `${sizeConfig.width}px`, height: `${sizeConfig.height}px` }}
          dangerouslySetInnerHTML={{ __html: FLOWER_SVGS[type] || FLOWER_SVGS.rose }}
        />
        {blooming && (
          <style>{`
            .flower-svg .petal-outer { transform: scale(1.22) rotate(0deg); opacity: 1; }
            .flower-svg .petal-inner { transform: scale(1.15); }
          `}</style>
        )}
      </div>
    </div>
  );
}
