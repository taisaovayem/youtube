import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import type { ResolvedAudio } from '../youtube/youtube-resolver.service.js';

interface AudioResolver {
  resolve(url: string): Promise<ResolvedAudio>;
}

export const AUDIO_RESOLVER = Symbol('AUDIO_RESOLVER');

@Controller('api')
export class AudioController {
  constructor(@Inject(AUDIO_RESOLVER) private readonly resolver: AudioResolver) {}

  @Get('resolve')
  async resolve(@Query('url') url: string) {
    const audio = await this.resolver.resolve(url);
    return {
      title: audio.title,
      artworkUrl: audio.artworkUrl,
      audioUrl: `/api/audio?url=${encodeURIComponent(url)}`,
    };
  }

  @Get('audio')
  async play(@Query('url') url: string, @Res() response: Response): Promise<void> {
    const audio = await this.resolver.resolve(url);
    response.redirect(302, audio.directAudioUrl);
  }
}
