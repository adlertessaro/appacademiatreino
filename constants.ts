
import { UserPlan } from './types';

export const USERS: UserPlan[] = [
  {
    id: 'admin',
    name: 'Administrador Treinador',
    cpf: '00000000000',
    isAdmin: true,
    age: 35,
    sex: 'M',
    scheduleType: 'days',
    objective: 'Gestão de Atletas',
    currentWeight: 0,
    targetWeight: 0,
    height: 0,
    tmb: 0,
    getd: 0,
    caloricTarget: '-',
    clinicalRestrictions: [],
    prohibitedSubstitutions: [],
    weeklySchedule: [],
    macros: [],
    supplements: [],
    weightHistory: [],
    checkIns: []
  },
  {
    id: '1',
    name: 'Atleta Elite 01',
    cpf: '12345678901',
    age: 32,
    sex: 'M',
    scheduleType: 'days',
    objective: 'Recomposição Corporal & Performance (Muay Thai)',
    currentWeight: 97,
    targetWeight: 87,
    height: 174,
    tmb: 1880,
    getd: 3242,
    caloricTarget: '2400 - 2500 kcal',
    clinicalRestrictions: [
      'Ciatalgia crônica L4-L5',
      'Protrusão discal S1',
      'Sensibilidade a compressão axial'
    ],
    prohibitedSubstitutions: [
      { original: 'Remada Curvada com Barra', elite: 'Remada T com apoio no peito', protection: 'Eliminação do estresse isométrico lombar' },
      { original: 'Agachamento com Barra Livre', elite: 'Agachamento Búlgaro com Halteres', protection: 'Redução da carga axial e maior estabilidade' }
    ],
    weightHistory: [
      { date: '2023-10-01', weight: 100 },
      { date: '2023-11-01', weight: 97 }
    ],
    checkIns: [],
    weeklySchedule: [
      {
        day: 'Segunda-feira',
        focus: 'Muay Thai',
        groups: 'Cardiovascular, Core e Explosão',
        intensity: 'Alta (Metabólica)',
        exercises: [{ 
          name: 'Sessão Técnica Muay Thai', 
          sets: '60 min', 
          technique: 'Foco em Volume',
          executionImages: ['https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=800']
        }]
      }
    ],
    macros: [
      { label: 'Proteína', percentage: '35%', grams: '218g', kcal: '875', reason: 'Preservação de FFM' }
    ],
    supplements: [
      { name: 'Creatina', dosage: '5g diários', benefit: 'Força' }
    ]
  }
];
