import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { leadsRepository } from '../services/repositories/leadsRepository';
import type { Lead } from '../domain/leads/types';
export const useLeads = () => useQuery({ queryKey: ['leads'], queryFn: leadsRepository.list });
export const useLead = (id: string) => useQuery({ queryKey: ['leads', id], queryFn: () => leadsRepository.getById(id) });
export const useCreateLead = () => { const qc=useQueryClient(); return useMutation({mutationFn:(input:Partial<Lead>)=>leadsRepository.create(input),onSuccess:()=>qc.invalidateQueries({queryKey:['leads']})}); };
export const useUpdateLead = () => { const qc=useQueryClient(); return useMutation({mutationFn:({id,...input}:{id:string}&Partial<Lead>)=>leadsRepository.update(id,input),onSuccess:(_,v)=>{qc.invalidateQueries({queryKey:['leads']});qc.invalidateQueries({queryKey:['leads',v.id]});}}); };
