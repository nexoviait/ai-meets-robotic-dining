import type { Workflow } from "./concierge-workflows";

export const OPEN_EVENT = "aihub:open-concierge";
export const FLOW_EVENT = "aihub:concierge-workflow";
let pending: Workflow["id"] | null = null;

/** Opens the AI Concierge from anywhere, optionally starting a guided workflow. */
export function openConcierge(workflow?: Workflow["id"]) {
  pending = workflow ?? null;
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  if (workflow) window.dispatchEvent(new CustomEvent(FLOW_EVENT, { detail: workflow }));
}

export function takePendingWorkflow() {
  const w = pending;
  pending = null;
  return w;
}
