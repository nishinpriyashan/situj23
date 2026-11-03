import React, { useId } from 'react';

/**
 * Hand-built SVG cartoon characters for "The Sweet Squad".
 * Pure vector art — crisp at any size, zero image downloads.
 */

export type CartoonMood = 'idle' | 'happy';

export interface CartoonProps {
  mood?: CartoonMood;
  className?: string;
  /** Offsets the blink so characters don't blink in sync */
  blinkDelay?: string;
}

const INK = '#2B1630';

/** Safe, unique SVG id (React ids may contain characters url(#…) dislikes) */
const useSvgId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

interface FaceProps {
  cx: number;
  cy: number;
  mood: CartoonMood;
  eyeGap?: number;
  mouthY?: number;
  scale?: number;
  blinkDelay?: string;
  showBlush?: boolean;
}

const CartoonFace: React.FC<FaceProps> = ({
  cx,
  cy,
  mood,
  eyeGap = 13,
  mouthY = 9,
  scale = 1,
  blinkDelay = '0s',
  showBlush = true,
}) => (
  <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
    {showBlush && (
      <>
        <ellipse cx={-eyeGap - 6} cy={mouthY - 1} rx={6} ry={3.6} fill="#FF8FB8" opacity={0.7} />
        <ellipse cx={eyeGap + 6} cy={mouthY - 1} rx={6} ry={3.6} fill="#FF8FB8" opacity={0.7} />
      </>
    )}

    {mood === 'happy' ? (
      <>
        <path
          d={`M${-eyeGap - 5} 1 Q${-eyeGap} -6 ${-eyeGap + 5} 1`}
          stroke={INK}
          strokeWidth={2.8}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M${eyeGap - 5} 1 Q${eyeGap} -6 ${eyeGap + 5} 1`}
          stroke={INK}
          strokeWidth={2.8}
          fill="none"
          strokeLinecap="round"
        />
        <path d={`M-7 ${mouthY - 2} Q0 ${mouthY + 10} 7 ${mouthY - 2} Z`} fill={INK} />
        <path d={`M-3.5 ${mouthY + 3} Q0 ${mouthY + 6.5} 3.5 ${mouthY + 3}`} fill="#FF6B95" />
      </>
    ) : (
      <>
        <g className="cartoon-blink" style={{ animationDelay: blinkDelay }}>
          <ellipse cx={-eyeGap} cy={0} rx={4.3} ry={5.4} fill={INK} />
          <ellipse cx={eyeGap} cy={0} rx={4.3} ry={5.4} fill={INK} />
          <circle cx={-eyeGap + 1.5} cy={-2} r={1.6} fill="#fff" />
          <circle cx={eyeGap + 1.5} cy={-2} r={1.6} fill="#fff" />
        </g>
        <path
          d={`M-5 ${mouthY - 1} Q0 ${mouthY + 3.5} 5 ${mouthY - 1}`}
          stroke={INK}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
      </>
    )}
  </g>
);

const GroundShadow: React.FC<{ y?: number; rx?: number; opacity?: number }> = ({
  y = 124,
  rx = 30,
  opacity = 0.22,
}) => <ellipse cx={60} cy={y} rx={rx} ry={5} fill="#000" opacity={opacity} />;

/* ------------------------------------------------------------------ */
/* Choco — a cheeky chocolate bar (her favourite treat)                */
/* ------------------------------------------------------------------ */
export const ChocoCharacter: React.FC<CartoonProps> = ({ mood = 'idle', className, blinkDelay }) => {
  const grad = useSvgId('choco-grad');
  const bite = useSvgId('choco-bite');

  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9A5538" />
          <stop offset="1" stopColor="#5A2B1C" />
        </linearGradient>
        <mask id={bite}>
          <rect x="0" y="0" width="120" height="130" fill="#fff" />
          <circle cx="95" cy="15" r="9" fill="#000" />
          <circle cx="101" cy="27" r="7" fill="#000" />
          <circle cx="86" cy="9" r="6" fill="#000" />
        </mask>
      </defs>

      <GroundShadow />

      {/* Legs & shoes */}
      <rect x="43" y="100" width="9" height="18" rx="4.5" fill="#4A2418" />
      <rect x="68" y="100" width="9" height="18" rx="4.5" fill="#4A2418" />
      <ellipse cx="47" cy="119" rx="8.5" ry="4.2" fill="#F7B8D0" />
      <ellipse cx="73" cy="119" rx="8.5" ry="4.2" fill="#F7B8D0" />

      {/* Arms */}
      <path d="M26 66 Q12 60 14 46" stroke="#4A2418" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M94 66 Q108 60 106 46" stroke="#4A2418" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="45" r="5.5" fill="#4A2418" />
      <circle cx="106" cy="45" r="5.5" fill="#4A2418" />

      <g mask={`url(#${bite})`}>
        {/* Bar */}
        <rect x="24" y="14" width="72" height="92" rx="14" fill={`url(#${grad})`} />
        {/* Squares */}
        <rect x="32" y="21" width="25" height="17" rx="4" fill="#A9643F" opacity="0.75" />
        <rect x="63" y="21" width="25" height="17" rx="4" fill="#A9643F" opacity="0.75" />
        {/* Shine */}
        <rect x="29" y="19" width="5" height="48" rx="2.5" fill="#fff" opacity="0.14" />
        {/* Foil wrapper */}
        <path
          d="M24 76 L32 71 L40 76 L48 71 L56 76 L64 71 L72 76 L80 71 L88 76 L96 71 L96 92 Q96 106 82 106 L38 106 Q24 106 24 92 Z"
          fill="#F7B8D0"
        />
        <rect x="24" y="84" width="72" height="12" fill="#FFE1EC" />
        <text
          x="60"
          y="93"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="800"
          letterSpacing="1.5"
          fill="#6541A5"
          fontFamily="Outfit, sans-serif"
        >
          SWEET
        </text>
      </g>

      <CartoonFace cx={60} cy={53} mood={mood} blinkDelay={blinkDelay} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Mochi — a cuddly teddy bear hugging a heart                         */
/* ------------------------------------------------------------------ */
export const MochiCharacter: React.FC<CartoonProps> = ({ mood = 'idle', className, blinkDelay }) => {
  const fur = useSvgId('mochi-fur');

  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={fur} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#E3AA80" />
          <stop offset="1" stopColor="#B87650" />
        </radialGradient>
      </defs>

      <GroundShadow />

      {/* Feet */}
      <ellipse cx="41" cy="117" rx="11" ry="7.5" fill="#B5764F" />
      <ellipse cx="79" cy="117" rx="11" ry="7.5" fill="#B5764F" />
      <ellipse cx="41" cy="118" rx="5.5" ry="3.8" fill="#F3D2B5" />
      <ellipse cx="79" cy="118" rx="5.5" ry="3.8" fill="#F3D2B5" />

      {/* Body */}
      <ellipse cx="60" cy="95" rx="31" ry="26" fill={`url(#${fur})`} />
      <ellipse cx="60" cy="99" rx="18" ry="16" fill="#F3D2B5" />

      {/* Ears */}
      <circle cx="30" cy="24" r="13" fill="#C98B63" />
      <circle cx="90" cy="24" r="13" fill="#C98B63" />
      <circle cx="30" cy="24" r="7" fill="#F7B8D0" />
      <circle cx="90" cy="24" r="7" fill="#F7B8D0" />

      {/* Head */}
      <circle cx="60" cy="50" r="32" fill={`url(#${fur})`} />
      <ellipse cx="60" cy="63" rx="13.5" ry="10.5" fill="#F3D2B5" />
      <ellipse cx="60" cy="58.5" rx="4.6" ry="3.3" fill="#3B2130" />

      <CartoonFace cx={60} cy={47} mood={mood} eyeGap={14} mouthY={17} blinkDelay={blinkDelay} />

      {/* Heart hug */}
      <g transform="translate(60 97) scale(1.45)">
        <path
          d="M0 9 C-13 -1 -13 -12 -5.5 -12 C-1.5 -12 0 -9 0 -7 C0 -9 1.5 -12 5.5 -12 C13 -12 13 -1 0 9 Z"
          fill="#FF6B95"
          stroke="#FFE1EC"
          strokeWidth="1.6"
        />
        <ellipse cx="-4.5" cy="-7" rx="2.2" ry="1.4" fill="#fff" opacity="0.6" />
      </g>
      {/* Arms */}
      <ellipse cx="38" cy="93" rx="8" ry="12.5" fill="#C98B63" transform="rotate(-32 38 93)" />
      <ellipse cx="82" cy="93" rx="8" ry="12.5" fill="#C98B63" transform="rotate(32 82 93)" />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Sprinkles — a birthday cupcake with a flickering candle             */
/* ------------------------------------------------------------------ */
export const SprinklesCharacter: React.FC<CartoonProps> = ({
  mood = 'idle',
  className,
  blinkDelay,
}) => {
  const frosting = useSvgId('sprinkles-frost');
  const sprinkles = [
    { x: 40, y: 58, r: 25, c: '#FFE066' },
    { x: 52, y: 46, r: -30, c: '#7FD3FF' },
    { x: 68, y: 47, r: 40, c: '#FFFFFF' },
    { x: 80, y: 58, r: -20, c: '#6541A5' },
    { x: 60, y: 60, r: 70, c: '#FF6B95' },
    { x: 47, y: 64, r: -60, c: '#FFFFFF' },
    { x: 73, y: 64, r: 15, c: '#FFE066' },
    { x: 60, y: 36, r: -45, c: '#7FD3FF' },
  ];

  return (
    <svg viewBox="0 -12 120 142" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={frosting} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD3E4" />
          <stop offset="1" stopColor="#F49BC0" />
        </linearGradient>
      </defs>

      <GroundShadow />

      {/* Candle */}
      <rect x="57" y="6" width="6" height="22" rx="2" fill="#FFE1EC" />
      <path d="M57 11 L63 8 M57 17 L63 14 M57 23 L63 20" stroke="#B9A0F5" strokeWidth="1.6" />
      <g className="cartoon-flame">
        <path d="M60 -8 Q67 1 60 6 Q53 1 60 -8 Z" fill="#FFB03A" />
        <path d="M60 -3 Q63.5 2 60 4.5 Q56.5 2 60 -3 Z" fill="#FFF3B0" />
      </g>

      {/* Frosting */}
      <g fill={`url(#${frosting})`}>
        <ellipse cx="60" cy="69" rx="35" ry="10" />
        <circle cx="36" cy="61" r="14" />
        <circle cx="52" cy="52" r="16" />
        <circle cx="70" cy="52" r="16" />
        <circle cx="84" cy="61" r="14" />
        <circle cx="60" cy="38" r="13" />
      </g>
      <circle cx="47" cy="46" r="4" fill="#fff" opacity="0.35" />
      <circle cx="56" cy="33" r="2.5" fill="#fff" opacity="0.4" />
      {sprinkles.map((s, i) => (
        <rect
          key={i}
          x={s.x - 3}
          y={s.y - 1}
          width="6"
          height="2.2"
          rx="1.1"
          fill={s.c}
          transform={`rotate(${s.r} ${s.x} ${s.y})`}
        />
      ))}

      {/* Arms */}
      <path d="M33 88 Q21 86 19 75" stroke="#8C6FD6" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M87 88 Q99 86 101 75" stroke="#8C6FD6" strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* Wrapper */}
      <path d="M29 72 L91 72 L83 116 Q82 120 78 120 L42 120 Q38 120 37 116 Z" fill="#B9A0F5" />
      <g stroke="#9B7FE0" strokeWidth="3" strokeLinecap="round">
        <line x1="39" y1="74" x2="44" y2="118" />
        <line x1="50" y1="74" x2="52" y2="118" />
        <line x1="60" y1="74" x2="60" y2="118" />
        <line x1="70" y1="74" x2="68" y2="118" />
        <line x1="81" y1="74" x2="76" y2="118" />
      </g>
      <rect x="40" y="84" width="40" height="22" rx="11" fill="#CBB7FA" opacity="0.9" />

      <CartoonFace cx={60} cy={92} mood={mood} eyeGap={11} mouthY={8} scale={0.92} blinkDelay={blinkDelay} />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Twinkle — a glowing little star                                     */
/* ------------------------------------------------------------------ */
export const TwinkleCharacter: React.FC<CartoonProps> = ({
  mood = 'idle',
  className,
  blinkDelay,
}) => {
  const glow = useSvgId('twinkle-glow');
  const body = useSvgId('twinkle-body');
  const star =
    'M60 16 L72.9 44.2 L103.7 47.8 L80.9 68.8 L87 99.2 L60 84 L33 99.2 L39.1 68.8 L16.3 47.8 L47.1 44.2 Z';

  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE58A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFE58A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1A8" />
          <stop offset="1" stopColor="#FFB86B" />
        </linearGradient>
      </defs>

      <GroundShadow y={124} rx={20} opacity={0.12} />
      <circle cx="60" cy="62" r="56" fill={`url(#${glow})`} />

      <path
        d={star}
        fill={`url(#${body})`}
        stroke="#FFD36E"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="40" rx="4" ry="7" fill="#fff" opacity="0.45" transform="rotate(25 50 40)" />

      <CartoonFace cx={60} cy={63} mood={mood} eyeGap={11} mouthY={8} scale={0.95} blinkDelay={blinkDelay} />

      {/* Orbiting sparkles */}
      <g fill="#FFF8FC">
        <path className="cartoon-twinkle" d="M104 18 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" />
        <path
          className="cartoon-twinkle"
          style={{ animationDelay: '0.8s' }}
          d="M14 92 l1.6 4.4 l4.4 1.6 l-4.4 1.6 l-1.6 4.4 l-1.6 -4.4 l-4.4 -1.6 l4.4 -1.6 Z"
        />
      </g>
    </svg>
  );
};

