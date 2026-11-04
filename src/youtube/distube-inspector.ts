import { Ytdl } from '@distube/ytdl-core';

import type { AudioStreamInfo, YoutubeInspector } from './youtube-resolver.service.js';

interface DirectAudioFormat {
  readonly hasAudio: boolean;
  readonly hasVideo: boolean;
  readonly container: string;
  readonly audioCodec: string | undefined;
  readonly audioBitrate: number | undefined;
  readonly isDrm?: boolean;
  readonly isOtf?: boolean;
  readonly url: string | undefined;
}

interface YoutubeInfo {
  readonly videoDetails: {
    readonly id: string;
    readonly title: string;
    readonly thumbnails: readonly { url: string }[];
  };
  readonly formats: readonly DirectAudioFormat[];
}

interface YoutubeClient {
  getInfo(url: string): Promise<YoutubeInfo>;
}

export class DistubeInspector implements YoutubeInspector {
  constructor(private readonly client: YoutubeClient = new Ytdl()) {}

  async inspect(url: string): Promise<AudioStreamInfo> {
    const info = await this.client.getInfo(url);
    const format = this.selectDirectAudio(info.formats);

    if (!format?.url) {
      throw new Error('No direct audio stream is available');
    }

    return {
      id: info.videoDetails.id,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.at(-1)?.url,
      url: format.url,
      acodec: format.audioCodec ?? '',
      vcodec: 'none',
      ext: format.container === 'mp4' ? 'm4a' : format.container,
    };
  }

  private selectDirectAudio(
    formats: readonly DirectAudioFormat[],
  ): DirectAudioFormat | undefined {
    const candidates = formats.filter(
      (format) =>
        format.hasAudio &&
        !format.hasVideo &&
        !format.isDrm &&
        !format.isOtf &&
        Boolean(format.url),
    );
    const aac = candidates.filter(
      (format) =>
        format.container === 'mp4' && format.audioCodec?.startsWith('mp4a'),
    );

    return [...(aac.length > 0 ? aac : candidates)].sort(
      (left, right) => (right.audioBitrate ?? 0) - (left.audioBitrate ?? 0),
    )[0];
  }
}
