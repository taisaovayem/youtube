import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class HomeController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  index(): string {
    return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#171717" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <title>YouTube Audio</title>
    <style>
      :root { color-scheme: dark; font-family: system-ui, sans-serif; }
      body { align-items: center; background: #171717; color: #f5f5f5; display: flex; justify-content: center; margin: 0; min-height: 100vh; }
      main { box-sizing: border-box; max-width: 560px; padding: 24px; width: 100%; }
      h1 { font-size: 1.5rem; margin: 0 0 8px; }
      p { color: #bdbdbd; line-height: 1.5; margin: 0 0 24px; }
      form { display: flex; gap: 8px; }
      input { background: #292929; border: 1px solid #4a4a4a; border-radius: 8px; color: inherit; flex: 1; font: inherit; min-width: 0; padding: 12px; }
      button { background: #ef4444; border: 0; border-radius: 8px; color: white; cursor: pointer; font: inherit; font-weight: 700; padding: 12px 16px; }
      #result { margin-top: 24px; }
      #title { font-weight: 650; margin: 0 0 10px; }
      audio { width: 100%; }
      #status { color: #fca5a5; margin-top: 12px; min-height: 1.5em; }
    </style>
  </head>
  <body>
    <main>
      <form id="resolve-form">
        <input id="youtube-url" type="url" inputmode="url" placeholder="https://www.youtube.com/watch?v=…" aria-label="YouTube URL" required />
        <button type="submit">Phát</button>
      </form>
      <section id="result" hidden>
        <p id="title"></p>
        <audio id="audio-player" controls preload="none"></audio>
      </section>
      <div id="status" role="status" aria-live="polite"></div>
    </main>
    <script>
      const form = document.querySelector('#resolve-form');
      const input = document.querySelector('#youtube-url');
      const result = document.querySelector('#result');
      const title = document.querySelector('#title');
      const audio = document.querySelector('#audio-player');
      const status = document.querySelector('#status');

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        status.textContent = '';
        try {
          const response = await fetch('/api/resolve?url=' + encodeURIComponent(input.value));
          if (!response.ok) throw new Error('Không thể lấy audio cho link này.');
          const track = await response.json();
          title.textContent = track.title;
          result.hidden = false;
          audio.src = track.audioUrl;
          if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: track.title,
              artwork: track.artworkUrl ? [{ src: track.artworkUrl }] : [],
            });
            navigator.mediaSession.setActionHandler('play', () => audio.play());
            navigator.mediaSession.setActionHandler('pause', () => audio.pause());
          }
          await audio.play();
        } catch (error) {
          status.textContent = error instanceof Error ? error.message : 'Đã có lỗi xảy ra.';
        }
      });
    </script>
  </body>
</html>`;
  }
}
