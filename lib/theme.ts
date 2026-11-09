export const themeOptions = ['system', 'light', 'dark'] as const;
export type ThemePreference = typeof themeOptions[number];
export const themeStorageKey = 'opn-theme';

export function parseThemePreference(value: string | null): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}

// Runs in the head before the page is painted. CSS follows the OS for system,
// including later OS changes and browsers with JavaScript disabled.
export const themeInitScript = "try{var t=localStorage.getItem('opn-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:'system'}catch{}";
