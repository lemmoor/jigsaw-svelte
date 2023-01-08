import { writable } from 'svelte/store';

export const num_rows = writable(0);
export const bg_alpha = writable(0);
export const timer = writable(null);
export const gameEnded = writable(false);