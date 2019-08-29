* Record at 1440 width, 103x25 terminal size
* Convert using `ffmpeg -i ttr-hackernews.mp4 -vf "scale=700:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -r 10 ttr-hackernews.gif`
