
export interface Exercise {
  name: string;
  sets: string;
  technique?: string;
  justification?: string;
  executionImages?: string[];
}

export interface TrainingDay {
  day: string;
  focus: string;
  groups: string;
  intensity: string;
  exercises?: Exercise[];
  activation?: Exercise[];
}

export interface Macro {
  label: string;
  percentage: string;
  grams: string;
  kcal: string;
  reason: string;
}

export interface CheckIn {
  date: string;
  weight: number;
  dayIndex: number;
}

export interface Substitution {
  original: string;
  elite: string;
  protection: string;
}

export interface UserPlan {
  id: string;
  name: string;
  cpf: string;
  age: number;
  sex: 'M' | 'F';
  isAdmin?: boolean;
  scheduleType: 'days' | 'sessions';
  objective: string;
  currentWeight: number;
  targetWeight: number;
  height: number;
  tmb: number;
  getd: number;
  caloricTarget: string;
  clinicalRestrictions: string[];
  prohibitedSubstitutions: Substitution[];
  weeklySchedule: TrainingDay[];
  macros: Macro[];
  supplements: { name: string; dosage: string; benefit: string }[];
  weightHistory: { date: string; weight: number }[];
  checkIns: CheckIn[];
}
