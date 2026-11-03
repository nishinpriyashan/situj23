import { useCallback, useEffect, useId, useSyncExternalStore } from 'react';
import type React from 'react';
import { audioBus } from '../utils/audioBus';

/** Subscribe to whether background music should currently be lowered. */
export function useIsMusicDucked(): boolean {
  return useSyncExternalStore(audioBus.subscribe, audioBus.isDucked, () => false);
}

/**
 * Attach the returned handlers to a <video> (or <audio>) element.
 * Music is lowered while the media is actually audible (playing, not muted,
 * volume above zero) and restored when it pauses, ends, is muted, or unmounts.
 */
export function useDuckMusicWhilePlaying() {
  const sourceId = useId();

  const sync = useCallback(
    (event: React.SyntheticEvent<HTMLMediaElement>) => {
      const media = event.currentTarget;
      const isAudible = !media.paused && !media.ended && !media.muted && media.volume > 0;
      if (isAudible) {
        audioBus.requestDuck(sourceId);
      } else {
        audioBus.releaseDuck(sourceId);
      }
    },
    [sourceId]
  );

  // Always restore the music if the player disappears mid-playback
  useEffect(() => () => audioBus.releaseDuck(sourceId), [sourceId]);

  return {
    onPlay: sync,
    onPlaying: sync,
    onPause: sync,
    onEnded: sync,
    onVolumeChange: sync,
    onEmptied: sync,
  };
}

