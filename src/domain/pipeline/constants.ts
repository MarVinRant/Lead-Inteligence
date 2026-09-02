import type { LeadStage } from '../leads/types';
export const PIPELINE_STAGES: LeadStage[] = ['Novo', 'Analisando', 'Qualificado', 'Contato preparado', 'Contatado', 'Respondeu', 'Interessado', 'Demonstração', 'Negociação', 'Fechado'];
export const EXIT_STAGES: LeadStage[] = ['Sem resposta', 'Não interessado', 'Adiado', 'Perdido', 'Reativação futura'];
