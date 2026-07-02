import { initializeDevSession } from '@/lib/devSession';
import { useProgressStore } from '@/store/progressStore';

initializeDevSession();
useProgressStore.getState().hydrate();
