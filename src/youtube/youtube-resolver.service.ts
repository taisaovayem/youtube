export interface AudioStreamInfo {
  id: string;
  title: string;
  thumbnail?: string;
  url: string;
  acodec: string;
  vcodec: string;
  ext: string;
}

export interface YoutubeInspector {
  inspect(url: string): Promise<AudioStreamInfo>;
}

export interface ResolvedAudio {
  videoId: string;
  title: string;
  artworkUrl?: string;
  directAudioUrl: string;
  mimeType: string;
}

export class YoutubeResolverService {
  constructor(private readonly inspector: YoutubeInspector) {}

  async resolve(inputUrl: string): Promise<ResolvedAudio> {
    this.assertYoutubeUrl(inputUrl);

    const stream = await this.inspector.inspect(inputUrl);
    if (stream.vcodec !== 'none' || !stream.url) {
      throw new Error('No audio-only stream is available');
    }

    return {
      videoId: stream.id,
      title: stream.title,
      artworkUrl: stream.thumbnail,
      directAudioUrl: stream.url,
      mimeType: this.mimeTypeFor(stream.ext),
    };
  }

  private assertYoutubeUrl(inputUrl: string): void {
    let url: URL;
    try {
      url = new URL(inputUrl);
    } catch {
      throw new Error('A YouTube URL is required');
    }

    const hostname = url.hostname.toLowerCase();
    if (
      hostname !== 'youtube.com' &&
      hostname !== 'www.youtube.com' &&
      hostname !== 'm.youtube.com' &&
      hostname !== 'youtu.be'
    ) {
      throw new Error('A YouTube URL is required');
    }
  }

  private mimeTypeFor(extension: string): string {
    return extension === 'm4a' ? 'audio/mp4' : `audio/${extension}`;
  }
}
