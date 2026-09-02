import { StrictMode } from 'react'; import { createRoot } from 'react-dom/client'; import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; import App from './App'; import { AuthProvider } from './features/auth/AuthProvider'; import './styles/index.css';
const client=new QueryClient();
async function start(){const useSupabase=import.meta.env.VITE_DATA_SOURCE==='supabase';if(!useSupabase&&import.meta.env.VITE_USE_MSW!=='false'){const {worker}=await import('./mocks/browser');await worker.start({onUnhandledRequest:'bypass'});}createRoot(document.getElementById('root')!).render(<StrictMode><QueryClientProvider client={client}><AuthProvider><App/></AuthProvider></QueryClientProvider></StrictMode>)}
start();
