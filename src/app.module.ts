import { Module } from '@nestjs/common';

import { AUDIO_RESOLVER, AudioController } from './audio/audio.controller.js';
import { HomeController } from './home.controller.js';
import { DistubeInspector } from './youtube/distube-inspector.js';
import { YoutubeResolverService } from './youtube/youtube-resolver.service.js';

@Module({
  controllers: [HomeController, AudioController],
  providers: [
    {
      provide: AUDIO_RESOLVER,
      useFactory: () => new YoutubeResolverService(new DistubeInspector()),
    },
  ],
})
export class AppModule {}
