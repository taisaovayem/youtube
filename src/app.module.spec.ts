import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';

import { AudioController } from './audio/audio.controller.js';
import { AppModule } from './app.module.js';
import { HomeController } from './home.controller.js';

describe('AppModule', () => {
  it('wires the home page and audio endpoints into the Nest application', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(module.get(HomeController)).toBeInstanceOf(HomeController);
    expect(module.get(AudioController)).toBeInstanceOf(AudioController);
  });
});
