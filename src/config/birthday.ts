/**
 * SITUJ'S DREAMY BIRTHDAY EXPERIENCE
 * Central Personalization Configuration
 * 
 * All editable personal details, messages, dates, and media paths are configured here.
 * Edit this file to customize the experience for Situj!
 */

import { SITUJ_PHOTOS, type SitujPhoto } from './photos';

export type MemoryPhoto = SitujPhoto;

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
  iconType: 'sparkles' | 'heart' | 'calendar' | 'music' | 'cake' | 'utensils';
}

export interface BirthdayConfig {
  recipient: {
    fullName: string;
    nickname: string;
    birthdayDate: string; // ISO format: YYYY-MM-DD
    age: number;
    anniversaryDate: string; // August milestone - configurable date placeholder
    anniversaryNote: string;
  };
  security: {
    secretPassword: string;
    hint: string;
  };
  music: {
    songTitle: string;
    artist: string;
    audioFile: string;
    fallbackAudioFiles?: string[];
    defaultTrack?: 'original' | 'funniest' | 'birthday' | 'romantic';
  };
  personalDetails: {
    favoriteThings: string[];
    specialFeatures: {
      smile: string;
      kindness: string;
      personality: string;
      chin: string;
    };
    favoriteTreats: {
      food: string;
      chocolates: string;
      treatMessage: string;
    };
  };
  specialMemory: {
    title: string;
    fullMessage: string;
    highlightQuote: string;
  };
  timeline: TimelineMilestone[];
  memories: MemoryPhoto[];
  loveLetter: {
    title: string;
    paragraphs: string[];
    signature: string;
    closingTitle: string;
  };
  giftSurprise: {
    title: string;
    subtitle: string;
    videoUrl: string; // E.g., '/videos/birthday-montage.mp4'
    fallbackMontagePhotos: MemoryPhoto[];
    finalMessage: string;
    romanticTreatNote: string;
  };
  companions: {
    squadName: string;
    characters: Record<CompanionId, CompanionConfig>;
    /** Revealed once she has met every character */
    secretNote: {
      title: string;
      message: string;
    };
  };
}

export type CompanionId = 'choco' | 'mochi' | 'sprinkles' | 'twinkle';

export interface CompanionConfig {
  name: string;
  emoji: string;
  /** Lines shown in the speech bubble, one per tap (cycles) */
  lines: string[];
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  recipient: {
    fullName: 'KShesthra Situge',
    nickname: 'Situj',
    birthdayDate: '2026-11-05',
    age: 23,
    // Milestone: One year together since August (confirm exact day and year here)
    anniversaryDate: 'August 2025', 
    anniversaryNote: 'One beautiful year together since August 💕',
  },

  security: {
    secretPassword: '1905',
    hint: 'A special 4-digit secret code just between us (1905)',
  },

  music: {
    songTitle: 'Until I Found You',
    artist: 'Stephen Sanchez',
    audioFile: '/website song/Stephen Sanchez - Until I Found You (Official Video).mp4',
    fallbackAudioFiles: [
      '/audio/until-i-found-you.m4a',
      '/audio/until-i-found-you.mp4',
    ],
    defaultTrack: 'original',
  },

  personalDetails: {
    favoriteThings: [
      'Her radiant smile',
      'Her genuine kindness',
      'Her irresistible cute personality',
      'Her adorable chin',
      'Delicious food adventures',
      'Sweet chocolates',
    ],
    specialFeatures: {
      smile: 'Your smile lights up even the darkest room and melts away all my worries.',
      kindness: 'The pure, gentle warmth in the way you care for others.',
      personality: 'Cute, playful, romantic, and endlessly captivating.',
      chin: 'That adorable little chin of yours that I adore more than words can say.',
    },
    favoriteTreats: {
      food: 'All the yummiest hearty meals and gourmet foodie dates',
      chocolates: 'Silky, sweet artisan chocolates that bring out your brightest grin',
      treatMessage: 'Sweet Treats for My Sweetest Girl 🍫✨',
    },
  },

  specialMemory: {
    title: 'Our Most Special Memory',
    fullMessage: `Out of all the beautiful moments in my life, the moments with you will always have a special place in my heart.

From the day we met to every little moment we've shared, you've given me memories I'll always treasure. It's not just the big moments that matter to me, but also the little things — your smile, your laughter, our conversations, and the happiness I feel whenever I'm with you.

If I could go back in time, I'd choose to experience those beautiful moments with you all over again.

And if there's one thing I wish for, it's to create a thousand more beautiful memories with you. Because my favourite part of every memory is having you in it.`,
    highlightQuote: 'My favourite part of every memory is having you in it.',
  },

  timeline: [
    {
      date: 'The Beginning',
      title: 'The Day We First Met',
      description: 'The moment my world became infinitely brighter and more meaningful.',
      iconType: 'sparkles',
    },
    {
      date: 'August Milestone',
      title: 'Our One Year Milestone',
      description: 'Celebrating one unforgettable year together since August. 365+ days of love, laughter, and happiness.',
      iconType: 'heart',
    },
    {
      date: 'Every Date & Adventure',
      title: 'Food, Chocolates & Cozy Laughs',
      description: 'Sharing our favorite treats, exploring delicious meals, and making each other laugh till our cheeks hurt.',
      iconType: 'utensils',
    },
    {
      date: 'The Little Things',
      title: 'Falling For Everything About You',
      description: 'Your gentle kindness, that captivating personality, and that cute little chin I cherish every day.',
      iconType: 'music',
    },
    {
      date: 'November 5, 2026',
      title: 'Happy 23rd Birthday, Situj!',
      description: 'A brand new chapter celebrating the most incredible person in my universe.',
      iconType: 'cake',
    },
  ],

  // Full collection of Situj's photos (romantic, pilot, and hilarious goofy moments)
  memories: SITUJ_PHOTOS,

  loveLetter: {
    title: 'A Little Letter for You, Situj',
    paragraphs: [
      'Happy Birthday, my Situj. ❤️',
      'I love your smile, your kindness, and the beautiful personality that makes you who you are. Even the smallest things about you, including that cute little chin of yours, make you special to me.',
      'I hope this new year of your life brings you endless happiness, beautiful memories, delicious food, and all the chocolates your heart desires.',
      'Thank you for all the little moments that have become such precious memories to me. I wish we could relive our favorite moments together and create thousands more.',
      'You deserve so much love, today and always.',
      'Happy 23rd Birthday, my love. 💗',
    ],
    signature: 'Forever & Always Yours, [Your Name] 💕',
    closingTitle: 'With all my heart,',
  },

  giftSurprise: {
    title: 'One Last Surprise, Situj… 🎁',
    subtitle: 'Something special is waiting for you.',
    videoUrl: '/Video/WhatsApp Video 2026-11-03 at 07.51.17.mp4',
    fallbackMontagePhotos: SITUJ_PHOTOS.filter((p) =>
      [
        'photo-pilot-couple',
        'photo-chin-framing',
        'photo-cheek-squish',
        'photo-pink-dress-full-corridor',
        'photo-3d-squad',
        'photo-dinner-date-bracelet',
        'photo-bus-ride-smiles',
        'photo-red-dress-bliss-eyes-closed',
        'photo-party-dance-eyes-shut',
        'photo-pilot-portrait-arms-crossed',
      ].includes(p.id)
    ),
    finalMessage: 'Made with love, especially for you, Situj. ❤️',
    romanticTreatNote: 'Reserved for unlimited chocolates, delicious dinners, and endless forehead kisses! 🍫🎂🥂',
  },

  // Tap-able cartoon friends that appear around the experience.
  // Edit names and lines freely — each tap shows the next line.
  companions: {
    squadName: 'The Sweet Squad',
    characters: {
      choco: {
        name: 'Choco',
        emoji: '🍫',
        lines: [
          "Psst… I'm the sweetest thing here. Well, after you, Situj 🍫",
          'Chocolates taste better when they are shared with your favourite person.',
          'Happy 23rd! I saved the best piece just for you 💗',
        ],
      },
      mochi: {
        name: 'Mochi',
        emoji: '🧸',
        lines: [
          'Bear hug incoming! 🧸💗',
          'Your kindness makes everyone around you feel at home.',
          "I'm guarding this little heart. It belongs to you, Situj.",
        ],
      },
      sprinkles: {
        name: 'Sprinkles',
        emoji: '🧁',
        lines: [
          'Only one candle on me, but it is full of wishes for you! 🧁',
          'Birthday rule: extra frosting, extra food, extra smiles.',
          'Close your eyes and make a big wish, Situj ✨',
        ],
      },
      twinkle: {
        name: 'Twinkle',
        emoji: '⭐',
        lines: [
          "I'm a star, but your smile shines brighter ⭐",
          'Even that cute little chin of yours deserves a spotlight 🌟',
          'Wishing you a whole sky full of happy days.',
        ],
      },
    },
    secretNote: {
      title: 'You found the whole Sweet Squad! 💗',
      message:
        'Every little character here was made to make you smile — because your smile is my favourite thing in the world. Happy 23rd Birthday, Situj. Stay sweet, stay you.',
    },
  },
};
