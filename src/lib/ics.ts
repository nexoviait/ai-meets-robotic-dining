export function downloadText(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

const fmt = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

/** Escapes a TEXT value per RFC 5545 §3.3.11 (backslash, semicolon, comma and newlines). */
export const escapeIcsText = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Folds content lines longer than 75 octets (RFC 5545 §3.1) without splitting UTF-8 characters. */
function fold(line: string) {
  const enc = new TextEncoder();
  const parts: string[] = [];
  let cur = "";
  let size = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (size + n > (parts.length ? 74 : 75)) {
      parts.push(cur);
      cur = "";
      size = 0;
    }
    cur += ch;
    size += n;
  }
  parts.push(cur);
  return parts.join("\r\n ");
}

export function buildIcs(opts: {
  id: string;
  title: string;
  start: Date;
  hours: number;
  location: string;
  description: string;
}) {
  const end = new Date(opts.start.getTime() + opts.hours * 3600_000);
  return (
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AI HUB BD//Booking//EN",
      "BEGIN:VEVENT",
      `UID:${opts.id}@aihubbd.com`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(opts.start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${escapeIcsText(opts.title)}`,
      `LOCATION:${escapeIcsText(opts.location)}`,
      `DESCRIPTION:${escapeIcsText(opts.description)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .map(fold)
      .join("\r\n") + "\r\n"
  );
}
