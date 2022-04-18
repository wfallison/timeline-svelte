import { writable } from 'svelte/store';

export let articleResults = writable(0);
export let loading = writable(false);
export let uniqueTitlesAndColors = writable(0);
export let searchCriteria = writable(0);
