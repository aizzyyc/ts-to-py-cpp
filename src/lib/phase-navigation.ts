export interface PhaseViewportPosition {
  id: string;
  top: number;
}

export function getActivePhaseId(phases: PhaseViewportPosition[], activationLine: number): string | null {
  const firstPhase = phases[0];
  if (!firstPhase) return null;

  let activePhaseId = firstPhase.id;
  for (const phase of phases) {
    if (phase.top <= activationLine) activePhaseId = phase.id;
  }
  return activePhaseId;
}
