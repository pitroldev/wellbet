/**
 * Constantes de tema compartilhadas entre o script anti-flash (Server Component,
 * no layout) e o toggle (Client Component). Sem "use client" de propósito —
 * pode ser importado dos dois lados.
 */
export const THEME_STORAGE_KEY = "charya-theme";

/** Script inline aplicado no topo do <body> antes do paint — evita piscar o tema. */
export const themeNoFlashScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k)||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
