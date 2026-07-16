# QuickNote

Capture a note from Raycast and append it to a daily Markdown file.

## Setup

1. Run `npm install` in this directory.
2. Run `npm run dev` and install the extension in Raycast.
3. Choose **Local** or **SSH** under extension preferences.
4. Set the matching folder/connection fields. No destination path is assumed.

### Local

Set **Local Notes Folder**, for example `~/Notes`.

### SSH

Set **SSH Target** (for example `user@host` or an SSH config alias) and **Remote Notes Folder**. Verify access first with `ssh <target>`.

QuickNote runs PowerShell remotely over SSH. The SSH target must have OpenSSH and key-based authentication configured.

## Behavior

Uses the Mac's local time and writes `<folder>/YYYY-MM-DD.md`. Creates the folder/file as needed, then appends `HH:MM: note text`. Existing content is preserved. Whitespace-only input is rejected.
