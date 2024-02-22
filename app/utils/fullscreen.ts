import { IS_LOCAL } from './constants';

declare global {
  interface Document {
    readonly webkitCurrentFullScreenElement?: Element | null;
    readonly webkitFullscreenElement?: Element | null;
    readonly mozFullScreenElement?: Element | null;
    readonly msFullscreenElement?: Element | null;

    readonly fullscreen: boolean;
    readonly webkitIsFullScreen?: boolean;
    readonly mozFullScreen?: boolean;

    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }

  interface HTMLElement {
    webkitRequestFullscreen(options?: FullscreenOptions): Promise<void>;
    mozRequestFullScreen(options?: FullscreenOptions): Promise<void>;
    msRequestFullscreen(options?: FullscreenOptions): Promise<void>;
  }
}

export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    document.webkitCurrentFullScreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement ||
    document.webkitIsFullScreen ||
    document.mozFullScreen
  );
}

export async function toggleFullscreen(): Promise<void> {
  const toggleFullscreenAction = isFullscreen() ? exitFullscreen : requestFullscreen;

  try {
    await toggleFullscreenAction();
  } catch (error) {
    console.warn(error);
  }
}

async function exitFullscreen(): Promise<void> {
  const exitFullscreenMethod =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen;

  if (exitFullscreenMethod) {
    try {
      await exitFullscreenMethod.call(document);
    } catch (error) {
      console.warn(error);
    }
  }
}

async function requestFullscreen(): Promise<void> {
  const requestFullscreenMethod =
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen ||
    document.documentElement.mozRequestFullScreen ||
    document.documentElement.msRequestFullscreen;

  if (requestFullscreenMethod && !IS_LOCAL) {
    try {
      await requestFullscreenMethod.call(document.documentElement);
    } catch (error) {
      console.warn(error);
    }
  }
}
