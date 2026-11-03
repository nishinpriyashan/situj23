/**
 * Audio Bus — a tiny shared channel between media on the page.
 *
 * Any component that plays speech (e.g. the birthday video) can "request a duck".
 * While at least one source is ducking, the background music lowers its volume
 * so voices are heard clearly. Sources are reference-counted by id, so several
 * videos can play/pause independently without fighting each other.
 */

type Listener = () => void;

const duckSources = new Set<string>();
const listeners = new Set<Listener>();

const emit = () => listeners.forEach((listener) => listener());

export const audioBus = {
  requestDuck(sourceId: string) {
    if (duckSources.has(sourceId)) return;
    duckSources.add(sourceId);
    emit();
  },

  releaseDuck(sourceId: string) {
    if (duckSources.delete(sourceId)) emit();
  },

  isDucked(): boolean {
    return duckSources.size > 0;
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

