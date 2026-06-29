export type ClubLevel = 1 | 2 | 3 | 4;
export type PlayerStatus = 'star' | 'starter' | 'rotation' | 'reserve' | 'prospect';
export type PlayerPersonality = 'leader' | 'professional' | 'temperamental' | 'quiet' | 'ambitious';

export interface Player {
  id: number;
  name: string;
  position: string;
  age: number;
  overall: number;
  potential: number;
  height: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defense: number;
  physical: number;
  fatigue: number;
  morale: number;
  happiness: number;
  status: PlayerStatus;
  salary: number;
  contractYears: number;
  injuryWeeks: number;
  personality: PlayerPersonality;
  secondaryPositions?: string[];
  positions?: string[];
  allRawPositions?: string;
}

export interface Team {
  id: number;
  name: string;
  abbreviation: string;
  city: string;
  clubLevel: ClubLevel;
  balance: number;
  monthlyIncome: number;
  objective: string;
  players: Player[];
}

export interface League {
  id: string; // e.g. 'br_a'
  name: string;
  country: string;
  teams: Team[];
}

export interface CoachProfile {
  name: string;
  nationality: string;
  age: number;
  tacticalStyle: 'tiki_taka' | 'gegenpressing' | 'park_the_bus' | 'offensive';
  favoriteFormation: string;
  background: 'pro_license' | 'ex_player' | 'phys_ed' | 'negotiator';
}

