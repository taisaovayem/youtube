import { describe, expect, it } from 'vitest';

import { DistubeInspector } from './distube-inspector.js';

describe('DistubeInspector', () => {
  it('returns the highest-bitrate direct AAC audio stream without downloading it', async () => {
    const inspector = new DistubeInspector({
      async getInfo() {
        return {
          videoDetails: {
            id: 'dQw4w9WgXcQ',
            title: 'Test song',
            thumbnails: [{ url: 'https://i.ytimg.com/test.jpg' }],
          },
          formats: [
            {
              hasAudio: true,
              hasVideo: false,
              container: 'webm',
              audioCodec: 'opus',
              audioBitrate: 160,
              url: 'https://example.googlevideo.com/audio.webm',
            },
            {
              hasAudio: true,
              hasVideo: false,
              container: 'mp4',
              audioCodec: 'mp4a.40.2',
              audioBitrate: 128,
              url: 'https://example.googlevideo.com/audio.m4a',
            },
          ],
        };
      },
    });

    await expect(
      inspector.inspect('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).resolves.toEqual({
      id: 'dQw4w9WgXcQ',
      title: 'Test song',
      thumbnail: 'https://i.ytimg.com/test.jpg',
      url: 'https://example.googlevideo.com/audio.m4a',
      acodec: 'mp4a.40.2',
      vcodec: 'none',
      ext: 'm4a',
    });
  });

  it('rejects SABR-only audio because it would require a media proxy', async () => {
    const inspector = new DistubeInspector({
      async getInfo() {
        return {
          videoDetails: {
            id: 'dQw4w9WgXcQ',
            title: 'Test song',
            thumbnails: [],
          },
          formats: [
            {
              hasAudio: true,
              hasVideo: false,
              container: 'mp4',
              audioCodec: 'mp4a.40.2',
              audioBitrate: 128,
            },
          ],
        };
      },
    });

    await expect(
      inspector.inspect('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    ).rejects.toThrow('No direct audio stream is available');
  });
});
