export function floorMotionEnabled(preference: boolean | null, deviceReducedMotion: boolean) {
  return preference ?? !deviceReducedMotion;
}
