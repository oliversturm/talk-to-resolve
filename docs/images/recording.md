Recording with terminalizer is much easier and prettier. Optimizing the image for a reasonable filesize is harder though.

- `terminalizer record -c ./terminalizer-config.yml ttr-hackernews.terminalizer`
- `terminalizer render ttr-hackernews.terminalizer.yml -o ttr-hackernews-orig.gif`
- optimize in gimp
- `gifsicle -O3 --lossy=90 --colors=256 -o ttr-hackernews.gif ttr-hackernews.gimp-optimized.gif`

