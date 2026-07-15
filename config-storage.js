export function saveConfigToLocalStorage(ctrls) {
    try {
        const config = {
            theme: ctrls.ctrlTheme.value,
            mode: ctrls.ctrlMode.value,
            lang: ctrls.ctrlLang.value,
            name: ctrls.ctrlName.value,
            title: ctrls.ctrlTitle.value,
            position: ctrls.ctrlPosition.value,
            align: ctrls.ctrlAlign.value,
            size: ctrls.ctrlSize.value,
            ratio: ctrls.ctrlRatio.value,
            accent: ctrls.ctrlColorAccent.value,
            glow: ctrls.ctrlColorGlow.value,
            namecolor: ctrls.ctrlColorName.value,
            titlecolor: ctrls.ctrlColorTitle.value,
            shadowcolor: ctrls.ctrlColorShadow.value,
            animation: ctrls.ctrlAnimation.value,
            speed: ctrls.ctrlSpeed.value,
            texteffect: ctrls.ctrlTextEffect.value,
            borderanim: ctrls.ctrlAnimateBorder.checked,
            transparentBg: ctrls.ctrlTransparentBg.checked,
            logopos: ctrls.ctrlLogoPos.value,
            transspeed: ctrls.ctrlTitleTransitionSpeed.value
        };
        localStorage.setItem('backdrop-studio-config', JSON.stringify(config));
    } catch (e) {
        console.error('Failed to save config to localStorage:', e);
    }
}

export function loadConfigFromLocalStorage(ctrls) {
    try {
        const data = localStorage.getItem('backdrop-studio-config');
        if (data) {
            const config = JSON.parse(data);
            
            if (config.theme) ctrls.ctrlTheme.value = config.theme;
            if (config.mode) ctrls.ctrlMode.value = config.mode;
            if (config.lang) ctrls.ctrlLang.value = config.lang;
            if (config.name !== undefined) ctrls.ctrlName.value = config.name;
            if (config.title !== undefined) ctrls.ctrlTitle.value = config.title;
            if (config.position) ctrls.ctrlPosition.value = config.position;
            if (config.align) ctrls.ctrlAlign.value = config.align;
            if (config.size) ctrls.ctrlSize.value = config.size;
            if (config.ratio) {
                ctrls.ctrlRatio.value = config.ratio;
                ctrls.txtRatioVal.textContent = config.ratio;
            }
            if (config.accent) {
                ctrls.ctrlColorAccent.value = config.accent;
                ctrls.txtAccentHex.textContent = config.accent;
            }
            if (config.glow) {
                ctrls.ctrlColorGlow.value = config.glow;
                ctrls.txtGlowHex.textContent = config.glow;
            }
            if (config.namecolor) {
                ctrls.ctrlColorName.value = config.namecolor;
                ctrls.txtNameHex.textContent = config.namecolor;
            }
            if (config.titlecolor) {
                ctrls.ctrlColorTitle.value = config.titlecolor;
                ctrls.txtTitleHex.textContent = config.titlecolor;
            }
            if (config.shadowcolor) {
                ctrls.ctrlColorShadow.value = config.shadowcolor;
                ctrls.txtShadowHex.textContent = config.shadowcolor;
            }
            if (config.animation) ctrls.ctrlAnimation.value = config.animation;
            if (config.speed) ctrls.ctrlSpeed.value = config.speed;
            if (config.texteffect) ctrls.ctrlTextEffect.value = config.texteffect;
            if (config.borderanim !== undefined) ctrls.ctrlAnimateBorder.checked = config.borderanim;
            if (config.transparentBg !== undefined) ctrls.ctrlTransparentBg.checked = config.transparentBg;
            if (config.logopos) ctrls.ctrlLogoPos.value = config.logopos;
            if (config.transspeed) ctrls.ctrlTitleTransitionSpeed.value = config.transspeed;

            return true;
        }
    } catch (e) {
        console.error('Failed to load config from localStorage:', e);
    }
    return false;
}
