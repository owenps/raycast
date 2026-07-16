# QuickNote

Raycast command that appends quick notes to a daily Markdown file over SSH.

## Setup

1. Confirm SSH key access: `ssh hermes`.
2. Run `npm install` in this directory.
3. Run `npm run dev` and install the extension in Raycast.
4. Set **SSH Target** to your SSH alias (default `hermes`) and verify **Remote Notes Folder**.

The default remote folder is:

`C:\Users\hermes\AppData\Local\hermes\profiles\owen\notes\zibaldone`

## Behavior

QuickNote uses local Mac time and remotely writes:

`<configured folder>/YYYY-MM-DD.md`

It creates the folder/file as needed, then appends `HH:MM: note text`. Existing content is preserved. Whitespace-only input is rejected.

The remote command runs PowerShell through SSH. No SMB mount or backend service is required.
