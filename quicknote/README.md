<p align="center">
  <img src="assets/icon.png" width="128" alt="Quick Note logo">
</p>

# Quick Note

[![Version](https://img.shields.io/badge/version-1.0.0-FF6363)](./package.json)

Capture a note directly from Raycast Root Search and append it to a daily Markdown file.

![QuickNote example](https://raw.githubusercontent.com/owenps/raycast/main/quicknote/media/quicknote-example.png?v=2)

## Installation

Install Quick Note permanently:

```bash
npm install
npm run build
```

Open the generated `.raycast` file and choose **Install Extension**. Quick Note then runs without any terminal process.

In Raycast extension preferences, choose **Local** or **SSH**, then set the matching folder/connection fields. No destination path is assumed.

## Development

For local development and live reload:

```bash
npm install
npm run dev
```

Keep `npm run dev` running while developing. Stop it when finished; the permanent installation is independent.

> [!CAUTION]
> If development install fails with `Unable to install from local sources`, sign in to Raycast both in the app and CLI:
>
> ```bash
> npx ray login
> npx ray profile
> ```
> 
> The `author` in `package.json` must match your Raycast username.

### Local

Set **Local Notes Folder**, for example `~/Notes`.

### SSH

Set **SSH Target** (for example `user@host` or an SSH config alias) and **Remote Notes Folder**. Verify access first with `ssh <target>`.

Quick Note runs PowerShell remotely over SSH. The SSH target must have OpenSSH and key-based authentication configured.

## Behavior

Open Raycast, select **Quick Note**, type the note into the Root Search argument field, and press Enter. Uses the Mac's local time and writes `<folder>/YYYY-MM-DD.md`. Creates the folder/file as needed, then appends `HH:MM: note text`. Existing content is preserved. Whitespace-only input is rejected.
