import { SignalState, SignalTier } from '../../types';

export interface SignalStateTransition {
  from: SignalState;
  to: SignalState;
  timestamp: number;
  reason: string;
}

/**
 * Deterministic Signal State Machine transitions logic.
 * Controls transitions between states and guides notification/alarm dispatch rules.
 */
export function handleStateTransition(
  currentState: SignalState,
  newTier: SignalTier,
  choppiness: number,
  adx: number
): {
  nextState: SignalState;
  actionRequired: 'NOTIFY' | 'ALARM' | 'LOG' | 'NONE';
  message: string;
} {
  let nextState: SignalState = currentState;
  let actionRequired: 'NOTIFY' | 'ALARM' | 'LOG' | 'NONE' = 'NONE';
  let message = '';

  // Calculate next state
  if (choppiness > 61.8) {
    nextState = 'RISK';
    message = 'Market switched to extreme range choppiness';
  } else if (adx < 12) {
    nextState = 'INVALID';
    message = 'Sluggish directional index: Trend strength holds insufficient potential';
  } else {
    switch (newTier) {
      case 'A+':
      case 'A':
        nextState = 'READY';
        message = `High conviction signal tier unlocked: ${newTier}`;
        break;
      case 'B':
        nextState = 'WATCHING';
        message = 'Moderate confidence pattern detected. Entering watch state';
        break;
      case 'C':
        nextState = 'WAITING';
        message = 'Entering waiting phase - Low momentum background values';
        break;
      case 'NO TRADE':
        nextState = 'INVALID';
        message = 'Trigger rules rejected overall technical checklist';
        break;
    }
  }

  // Determine notification actions
  if (currentState !== nextState) {
    if (nextState === 'READY') {
      actionRequired = 'ALARM';
    } else if (nextState === 'RISK') {
      actionRequired = 'NOTIFY';
    } else {
      actionRequired = 'LOG';
    }
  }

  return { nextState, actionRequired, message };
}
