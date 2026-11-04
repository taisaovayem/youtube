import { describe, expect, it } from 'vitest';

import { YoutubeResolverService } from './youtube-resolver.service.js';

describe('YoutubeResolverService', () => {
  it('returns a direct audio-only stream for a YouTube link', async () => {
    const service = new YoutubeResolverService({
      async inspect() {
        return {
          id: 'dQw4w9WgXcQ',
          title: 'Test song',
          thumbnail: 'https://i.ytimg.com/test.jpg',
          url: 'https://example.googlevideo.com/audio.m4a',
          acodec: 'mp4a.40.2',
          vcodec: 'none',
          ext: 'm4a',
        };
      },
    });

    await expect(
      service.resolve('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).resolves.toEqual({
      videoId: 'dQw4w9WgXcQ',
      title: 'Test song',
      artworkUrl: 'https://i.ytimg.com/test.jpg',
      directAudioUrl: 'https://example.googlevideo.com/audio.m4a',
      mimeType: 'audio/mp4',
    });
  });

  it('rejects a URL outside YouTube', async () => {
    const service = new YoutubeResolverService({
      async inspect() {
        throw new Error('must not be called');
      },
    });

    await expect(service.resolve('https://example.com/song.mp3')).rejects.toThrow(
      'A YouTube URL is required',
    );
  });
});
