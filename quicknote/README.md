# QuickNote

[![Version](https://img.shields.io/badge/version-1.0.0-FF6363)](./package.json)

Capture a note from Raycast and append it to a daily Markdown file.

## Installation

Install QuickNote permanently:

```bash
npm install
npm run build
```

Open the generated `.raycast` file and choose **Install Extension**. QuickNote then runs without any terminal process.

In Raycast extension preferences, choose **Local** or **SSH**, then set the matching folder/connection fields. No destination path is assumed.

## Development

For local development and live reload:

```bash
npm install
npm run dev
```

Keep `npm run dev` running while developing. Stop it when finished; the permanent installation is independent.

### Local

Set **Local Notes Folder**, for example `~/Notes`.

### SSH

Set **SSH Target** (for example `user@host` or an SSH config alias) and **Remote Notes Folder**. Verify access first with `ssh <target>`.

QuickNote runs PowerShell remotely over SSH. The SSH target must have OpenSSH and key-based authentication configured.

## Behavior

Uses the Mac's local time and writes `<folder>/YYYY-MM-DD.md`. Creates the folder/file as needed, then appends `HH:MM: note text`. Existing content is preserved. Whitespace-only input is rejected.
