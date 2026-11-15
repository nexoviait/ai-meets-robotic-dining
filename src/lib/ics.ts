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

const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function buildIcs(opts: { id: string; title: string; start: Date; hours: number; location: string; description: string }) {
  const end = new Date(opts.start.getTime() + opts.hours * 3600_000);
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AI HUB BD//Booking//EN", "BEGIN:VEVENT",
    `UID:${opts.id}@aihubbd.com`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(opts.start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:${opts.title}`, `LOCATION:${opts.location}`, `DESCRIPTION:${opts.description}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
