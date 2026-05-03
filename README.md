# Pear Desktop Controller for Vicinae

A powerful Vicinae extension to search and control your music on [Pear Desktop](https://github.com/pear-devs/pear-desktop/releases).

## Requirements

To use this extension, you must have:
1. **Pear Desktop** installed and running.
2. The **API Server** plugin enabled within Pear Desktop:
   - Open Pear Desktop Settings (Gear icon).
   - Go to **Plugins**.
   - Find **API Server** and toggle it **ON**.
   - (Optional) Ensure the port is set to the default `26538`.

## Installation

Note: This extension is not yet indexed in the Vicinae Store. To use it, you must clone the repository and build it manually:

1. Clone this repository to your local machine.
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. The extension will be built and automatically installed to your local Vicinae extensions directory.

## Features

### 🔍 Search & Play
- **Search Music**: Real-time search for songs, artists, and albums.
- **Play Now**: Instantly append a song to your queue and start playback.
- **Add to Queue**: Append songs to your current session without interrupting playback (`Cmd + A`).
- **Visuals**: High-quality thumbnails and metadata directly in the search results.

### 📜 Queue Management
- **View Queue**: See your entire current playlist.
- **Switch Tracks**: Click any item in the queue to jump to that song.
- **Remove Items**: Delete specific songs from the queue (`Cmd + Delete`).
- **Clear Queue**: Empty your entire session with one command.

### 🕹️ Quick Controls
- **Smart Play/Pause**: A palette command to resume music or skip to the next track if already playing.
- **Next/Previous Track**: Dedicated commands to navigate your queue.
- **Global Shortcuts**: Control playback from anywhere via the Vicinae command palette.

### 🛠️ Debugging
- **Raw Response View**: Inspect the underlying JSON data from the Pear Desktop API (`Cmd + Shift + D`).

## Development

If you want to modify this extension:

```bash
npm install
npm run dev
```
