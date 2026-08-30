/// <reference types="vite/client" />

interface Window {
  onYouTubeIframeAPIReady?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  YT?: any;
}
