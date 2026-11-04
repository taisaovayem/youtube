import { describe, expect, it } from 'vitest';

import { AudioController } from './audio.controller.js';

describe('AudioController', () => {
  const resolver = {
    async resolve() {
      return {
        videoId: 'dQw4w9WgXcQ',
        title: 'Test song',
        artworkUrl: 'https://i.ytimg.com/test.jpg',
        directAudioUrl: 'https://example.googlevideo.com/audio.m4a',
        mimeType: 'audio/mp4',
      };
    },
  };

  it('returns a local playback URL without exposing the direct stream URL', async () => {
    const controller = new AudioController(resolver);

    await expect(
      controller.resolve('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).resolves.toEqual({
      title: 'Test song',
      artworkUrl: 'https://i.ytimg.com/test.jpg',
      audioUrl: '/api/audio?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DdQw4w9WgXcQ',
    });
  });

  it('redirects the audio element to the direct stream without proxying it', async () => {
    const controller = new AudioController(resolver);
    const response = new RedirectResponse();

    await controller.play('https://www.youtube.com/watch?v=dQw4w9WgXcQ', response);

    expect(response.statusCode).toBe(302);
    expect(response.location).toBe('https://example.googlevideo.com/audio.m4a');
  });
});

class RedirectResponse {
  statusCode?: number;
  location?: string;

  redirect(statusCode: number, location: string): this {
    this.statusCode = statusCode;
    this.location = location;
    return this;
  }
}
