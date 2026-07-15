export const brandDefaults = {
    business: {
        dark: { accent: '#0ea5e9', glow: '#0ea5e9', name: '#ffffff', title: '#38bdf8', shadow: '#000000' },
        light: { accent: '#0284c7', glow: '#0284c7', name: '#0f172a', title: '#0369a1', shadow: '#ffffff' }
    },
    artist: {
        dark: { accent: '#f97316', glow: '#f97316', name: '#ffffff', title: '#e2875c', shadow: '#000000' },
        light: { accent: '#c96537', glow: '#c96537', name: '#2c241e', title: '#7c2d12', shadow: '#ffffff' }
    }
};

export function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

export function transitionBrandColors(ctrls, oldMode, oldTheme, newMode, newTheme) {
    const oldDefaults = brandDefaults[oldMode][oldTheme];
    const newDefaults = brandDefaults[newMode][newTheme];
    
    if (ctrls.ctrlColorAccent.value === oldDefaults.accent) {
        ctrls.ctrlColorAccent.value = newDefaults.accent;
        ctrls.txtAccentHex.textContent = newDefaults.accent;
    }
    if (ctrls.ctrlColorGlow.value === oldDefaults.glow) {
        ctrls.ctrlColorGlow.value = newDefaults.glow;
        ctrls.txtGlowHex.textContent = newDefaults.glow;
    }
    if (ctrls.ctrlColorName.value === oldDefaults.name) {
        ctrls.ctrlColorName.value = newDefaults.name;
        ctrls.txtNameHex.textContent = newDefaults.name;
    }
    if (ctrls.ctrlColorTitle.value === oldDefaults.title) {
        ctrls.ctrlColorTitle.value = newDefaults.title;
        ctrls.txtTitleHex.textContent = newDefaults.title;
    }
    if (ctrls.ctrlColorShadow.value === oldDefaults.shadow) {
        ctrls.ctrlColorShadow.value = newDefaults.shadow;
        ctrls.txtShadowHex.textContent = newDefaults.shadow;
    }
}
