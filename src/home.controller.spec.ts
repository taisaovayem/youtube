import { describe, expect, it } from 'vitest';

import { HomeController } from './home.controller.js';

describe('HomeController', () => {
  it('serves a page with a YouTube link field and an audio player', () => {
    const page = new HomeController().index();

    expect(page).toContain('id="youtube-url"');
    expect(page).toContain('<audio id="audio-player" controls');
    expect(page).toContain('/api/resolve?url=');
    expect(page).toContain('rel="icon" href="/favicon.ico"');
  });
});
