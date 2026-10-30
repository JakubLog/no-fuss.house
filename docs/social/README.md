# Social: posty z case studies

Plan postów na LinkedIn i Instagram (`plan-postow-no-fuss.md`), okładki (`okladki/`), stille (`stille/`)
i źródła animacji. MP4 nie są w repo (zasada z `.gitignore`: surowe eksporty wideo poza gitem);
renderuje się je stąd.

## Render

Z katalogu `docs/social` (potrzebny Node, Playwright z Chromium i ffmpeg):

```sh
node render.js ah feed video out     # sceny: intro ah otb busybee ourmoney sassy process
node render.js ah story video out    # feed = 1080×1350 (4:5), story = 1080×1920 (9:16)
node covers.js feed,story            # okładki → out/okladki
node stills.js                       # stille → out/stille
```

Animacja to jedna strona (`anim/anim.html?scene=…&fmt=…`) z funkcją `render(t)`, nagrywana klatka
po klatce (30 kl./s) i składana w H.264 (profil Main, cicha ścieżka AAC). Teksty i czasy zmienia się
w `anim/anim.html` (obiekt `CASES` i tablice `ARR`). Tokeny z `DESIGN.md`, zrzuty z `public/assets`.
Kroje TikTok Sans i Geist Mono (OFL) leżą w `fonts/`.
