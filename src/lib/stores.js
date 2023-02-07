import { writable } from 'svelte/store';

export const num_rows = writable(5);
export const bg_alpha = writable(0.4);
export const timer = writable(null);
export const gameEnded = writable(false);
export const gameStarted = writable(false);
