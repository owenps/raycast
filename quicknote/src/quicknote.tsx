import {
  Action,
  ActionPanel,
  Form,
  getPreferenceValues,
  showToast,
  Toast,
} from "@raycast/api";
import { spawn } from "node:child_process";

interface Preferences {
  sshTarget: string;
  remoteFolder: string;
}

interface FormValues {
  note: string;
}

function localDateAndTime(date = new Date()): { date: string; time: string } {
  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
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
  async function handleSubmit(values: FormValues) {
    const note = values.note.trim();
    if (!note) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Nothing to save",
        message: "Enter a note first",
      });
      return;
    }

    const { sshTarget, remoteFolder } = getPreferenceValues<Preferences>();
    const { date, time } = localDateAndTime();
    const entry = `${time}: ${note}\n`;

    try {
      await appendRemotely(sshTarget.trim(), remoteFolder.trim(), date, entry);
      await showToast({
        style: Toast.Style.Success,
        title: "Saved",
        message: `${date}.md on ${sshTarget}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not write the note";
      await showToast({ style: Toast.Style.Failure, title: "Save failed", message });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Note" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="note" title="Note" placeholder="Capture a thought…" autoFocus />
    </Form>
  );
}
