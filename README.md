# MMM-LocalPhotos

A [MagicMirror²](https://magicmirror.builders/) module that displays a rotating background photo slideshow from a local directory.

## Features

- Rotates through images in a directory (scanned recursively)
- Supports jpg, jpeg, png, gif, webp
- Shuffles photos for variety on each load
- Configurable change interval
- Works well with light/dark theme switching — point `photosDir` at a symlink that switches between photo sets

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/olopez70/MMM-LocalPhotos.git
```

## Configuration

Add to your `config/config.js`:

```js
{
    module: "MMM-LocalPhotos",
    position: "fullscreen_below",
    config: {
        photosDir: "/home/user/Pictures/magic-mirror/current",
        changeInterval: 5 * 60 * 1000,
    }
}
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `photosDir` | string | `"/home/user/Pictures/magic-mirror"` | Absolute path to the photos directory (scanned recursively) |
| `changeInterval` | number | `300000` | Time between photo changes in ms (default: 5 min) |
| `transitionDuration` | number | `2000` | Fade transition duration in ms |

## Light/Dark Theme Integration

This module works with [MMM-ThemeSwitcher](https://github.com/olopez70/MMM-ThemeSwitcher) for per-theme photo sets. Organize photos into `dark/` and `light/` subdirectories, then point `photosDir` at a `current` symlink that switches between them:

```
~/Pictures/magic-mirror/
├── dark/      ← dark-themed backgrounds
├── light/     ← light-themed backgrounds
└── current -> dark/   ← symlink updated by set-theme.sh
```
