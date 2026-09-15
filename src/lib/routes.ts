import type { Track } from "./lessons";
import type { Goal } from "./progress";

const ALL_TRACKS: Track[] = ["common", "python", "cpp"];

export function getVisibleTracks(goal: Goal | null): Track[] {
  if (goal === "ai") return ["python"];
  if (goal === "robotics") return ["cpp"];
  return ALL_TRACKS;
}

export function isTrackVisible(track: Track, goal: Goal | null): boolean {
  return getVisibleTracks(goal).includes(track);
}
