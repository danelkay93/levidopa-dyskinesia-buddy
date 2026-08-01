import { useEffect, useState } from 'react';

function getMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
  return window.matchMedia(query);
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => getMediaQuery(query)?.matches ?? false);

  useEffect(() => {
    const media = getMediaQuery(query);
    if (!media) return undefined;

    const listener = () => setMatches(media.matches);
    listener();
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
