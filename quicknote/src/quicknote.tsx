import {
  Action,
  ActionPanel,
  getPreferenceValues,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { spawn } from "node:child_process";
import { useState } from "react";
import { appendFile, mkdir } from "node:fs/promises";
import * as path from "node:path";

interface Preferences {
  storageMode: "local" | "ssh";
  localFolder?: string;
  sshTarget?: string;
  remoteFolder?: string;
}

function localDateAndTime(date = new Date()): { date: string; time: string } {
  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function expandHome(folder: string): string {
  return folder.replace(/^~(?=$|\/)/, process.env.HOME ?? "~");
}

function appendRemotely(target: string, folder: string, date: string, entry: string): Promise<void> {
  const payload = Buffer.from(JSON.stringify({ folder, date, entry }), "utf8").toString("base64");
  const script = `
$payload = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${payload}')) | ConvertFrom-Json
New-Item -ItemType Directory -Force -Path $payload.folder | Out-Null
$file = Join-Path $payload.folder ($payload.date + '.md')
[IO.File]::AppendAllText($file, $payload.entry, [Text.UTF8Encoding]::new($false))
`;

  return new Promise((resolve, reject) => {
    const child = spawn("ssh", [target, "powershell.exe", "-NoProfile", "-NonInteractive", "-Command", "-"], {
      stdio: ["pipe", "ignore", "pipe"],
    });
    let errorOutput = "";
    child.stderr.on("data", (chunk: Buffer) => {
      errorOutput += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(errorOutput.trim() || `ssh exited with code ${code}`));
    });
    child.stdin.end(script);
  });
}

export default function QuickNote() {
  const [note, setNote] = useState("");

  async function handleSubmit() {
    const trimmedNote = note.trim();
    if (!trimmedNote) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Nothing to save",
        message: "Enter a note first",
      });
      return;
    }

    const { storageMode, localFolder, sshTarget, remoteFolder } = getPreferenceValues<Preferences>();
    const { date, time } = localDateAndTime();
    const entry = `${time}: ${trimmedNote}\n`;

    try {
      if (storageMode === "ssh") {
        if (!sshTarget?.trim() || !remoteFolder?.trim()) {
          throw new Error("Set SSH Target and Remote Notes Folder in preferences");
        }
        await appendRemotely(sshTarget.trim(), remoteFolder.trim(), date, entry);
      } else {
        if (!localFolder?.trim()) throw new Error("Set Local Notes Folder in preferences");
        const folder = expandHome(localFolder.trim());
        await mkdir(folder, { recursive: true });
        await appendFile(path.join(folder, `${date}.md`), entry, "utf8");
      }
      await showToast({
        style: Toast.Style.Success,
        title: "Saved",
        message: `${date}.md`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not write the note";
      await showToast({ style: Toast.Style.Failure, title: "Save failed", message });
    }
  }

  return (
    <List
      filtering={false}
      searchText={note}
      onSearchTextChange={setNote}
      searchBarPlaceholder="Type a note and press Enter…"
    >
      <List.Item
        title={note || "Type a note to save"}
        subtitle={note ? "Press Enter to save" : undefined}
        actions={
          <ActionPanel>
            <Action title="Save Note" onAction={handleSubmit} />
          </ActionPanel>
        }
      />
    </List>
  );
}
