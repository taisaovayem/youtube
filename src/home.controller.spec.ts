import { describe, expect, it, vi } from 'vitest';

import { HomeController } from './home.controller.js';

describe('HomeController', () => {
  it('serves a page with a YouTube link field and an audio player', () => {
    const page = new HomeController().index();

    expect(page).toContain('id="youtube-url"');
    expect(page).toContain('<audio id="audio-player" controls');
    expect(page).toContain('/api/resolve?url=');
    expect(page).toContain('rel="icon" href="/favicon.ico"');
  });

  it('reads a pasted YouTube URL from the clipboard and resolves it immediately', async () => {
    const page = new HomeController().index();
    const script = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    const handlers = new Map<string, (event: { preventDefault(): void }) => Promise<void>>();
    const form = {
      addEventListener: (name: string, handler: (event: { preventDefault(): void }) => Promise<void>) => handlers.set(name, handler),
    };
    const pasteButton = {
      addEventListener: (name: string, handler: (event: { preventDefault(): void }) => Promise<void>) => handlers.set(`paste:${name}`, handler),
    };
    const input = { value: '' };
    const result = { hidden: true };
    const title = { textContent: '' };
    const audio = { play: vi.fn().mockResolvedValue(undefined), src: '' };
    const status = { textContent: '' };
    const readText = vi.fn().mockResolvedValue('https://www.youtube.com/watch?v=clipboard');
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ title: 'Clipboard track', audioUrl: '/audio/clipboard' }),
    });
    const document = {
      querySelector: (selector: string) => ({
        '#resolve-form': form,
        '#paste-from-clipboard': pasteButton,
        '#youtube-url': input,
        '#result': result,
        '#title': title,
        '#audio-player': audio,
        '#status': status,
      })[selector],
    };

    expect(script).toBeDefined();
    new Function('document', 'navigator', 'fetch', 'MediaMetadata', script)(
      document,
      { clipboard: { readText } },
      fetch,
      class MediaMetadata {},
    );

    await handlers.get('paste:click')?.({ preventDefault: () => undefined });

    expect(readText).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith('/api/resolve?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dclipboard');
    expect(title.textContent).toBe('Clipboard track');
    expect(audio.play).toHaveBeenCalledOnce();
  });
});
