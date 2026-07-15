import { brandDefaults, transitionBrandColors, hexToRgba } from './brand-defaults.js';
import { syncLangButtons as syncLangButtonsModule } from './translations.js';
import { saveConfigToLocalStorage as saveConfigToLocalStorageModule, loadConfigFromLocalStorage as loadConfigFromLocalStorageModule } from './config-storage.js';

window.downloadFile = function(url, filename) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};

const previewIframe = document.getElementById('preview-iframe');
const outputUrl = document.getElementById('output-url');
        const urlCopyWrapper = document.getElementById('url-copy-wrapper');
        const btnOpen = document.getElementById('btn-open');
        const toast = document.getElementById('toast');

        previewIframe.addEventListener('load', () => {
            try {
                const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                const exportFormatVal = document.getElementById('export-format').value;
                if (iframeDoc && iframeDoc.body) {
                    iframeDoc.body.classList.remove('format-169', 'format-11', 'format-banner');
                    iframeDoc.body.classList.add('format-' + exportFormatVal);
                }
            } catch (e) {}
        });

        // Resolve page's host mode (for static dashboard UI styling color)
        const hostname = window.location.hostname;
        const hostMode = (hostname.indexOf('eole.me') !== -1) ? 'artist' : 'business';

        // Form controls
        const ctrlTheme = document.getElementById('theme');
        const ctrlMode = document.getElementById('mode');
        const ctrlLang = document.getElementById('lang');
        const ctrlName = document.getElementById('name-input');
        const ctrlCompany = document.getElementById('company-input');
        const ctrlTitle = document.getElementById('title-input');
        const ctrlTitleSecondary = document.getElementById('title-secondary-input');
        const ctrlTitleTransition = document.getElementById('title-transition');
        const ctrlTitleTransitionSpeed = document.getElementById('title-transition-speed');
        
        const ctrlLogoFile = document.getElementById('logo-file');
        const ctrlLogoUrl = document.getElementById('logo-url');
        const ctrlLogoSize = document.getElementById('logo-size');
        const ctrlLogoOpacity = document.getElementById('logo-opacity');
        const ctrlLogoPos = document.getElementById('logo-pos');
        
        const ctrlExportRes = document.getElementById('export-res');
        const ctrlVideoDuration = document.getElementById('video-duration');
        const ctrlBoomerang = document.getElementById('ctrl-boomerang');
        
        const ctrlPosition = document.getElementById('position');
        const ctrlAlign = document.getElementById('align');
        const ctrlSize = document.getElementById('size');
        const ctrlRatio = document.getElementById('ratio');
        const ctrlColorAccent = document.getElementById('color-accent');
        const ctrlColorGlow = document.getElementById('color-glow');
        const ctrlColorName = document.getElementById('color-name');
        const ctrlColorTitle = document.getElementById('color-title');
        const ctrlAnimation = document.getElementById('ctrl-animation');
        const ctrlSpeed = document.getElementById('ctrl-speed');
        const ctrlTextEffect = document.getElementById('text-effect');
        const txtAccentHex = document.getElementById('accent-hex');
        const txtGlowHex = document.getElementById('glow-hex');
        const txtNameHex = document.getElementById('name-hex');
        const txtTitleHex = document.getElementById('title-hex');
        const txtRatioVal = document.getElementById('ratio-val');
        const ctrlColorShadow = document.getElementById('color-shadow');
        const txtShadowHex = document.getElementById('shadow-hex');
        const ctrlAnimateBorder = document.getElementById('ctrl-animate-border');
        const ctrlTransparentBg = document.getElementById('ctrl-transparent-bg');

        // Bundle controls for modular passage
        const ctrls = {
            ctrlTheme, ctrlMode, ctrlLang, ctrlName, ctrlCompany, ctrlTitle, ctrlTitleSecondary, ctrlTitleTransition, ctrlTitleTransitionSpeed,
            ctrlLogoFile, ctrlLogoUrl, ctrlLogoSize, ctrlLogoOpacity, ctrlLogoPos,
            ctrlExportRes, ctrlVideoDuration, ctrlBoomerang, ctrlPosition, ctrlAlign, ctrlSize, ctrlRatio,
            ctrlColorAccent, ctrlColorGlow, ctrlColorName, ctrlColorTitle, ctrlAnimation, ctrlSpeed, ctrlTextEffect,
            txtAccentHex, txtGlowHex, txtNameHex, txtTitleHex, txtRatioVal, ctrlColorShadow, txtShadowHex,
            ctrlAnimateBorder, ctrlTransparentBg
        };

        // Detect browser language initially: Fr -> FR, * -> EN
        let initialLang = 'en';
        try {
            const navLang = navigator.language || navigator.userLanguage || '';
            if (navLang.toLowerCase().startsWith('fr')) {
                initialLang = 'fr';
            }
        } catch (e) {}
        if (ctrlLang) {
            ctrlLang.value = initialLang;
        }

        let uploadedLogoDataUrl = localStorage.getItem('backdrop-studio-local-logo') || '';

        // Logo preview helper functions
        const logoPreviewContainer = document.getElementById('logo-preview-container');
        const logoPreviewImg = document.getElementById('logo-preview-img');
        const btnRemoveLogo = document.getElementById('btn-remove-logo');

        function syncLogoPreview() {
            if (uploadedLogoDataUrl) {
                if (logoPreviewImg) logoPreviewImg.src = uploadedLogoDataUrl;
                if (logoPreviewContainer) logoPreviewContainer.style.display = 'flex';
            } else {
                if (logoPreviewContainer) logoPreviewContainer.style.display = 'none';
                if (logoPreviewImg) logoPreviewImg.src = '';
            }
        }
        syncLogoPreview();

        // Dynamic base URL resolver
        const baseBackdropUrl = window.location.origin + window.location.pathname.replace('config.html', '');

        // Apply defaults when mode or theme changes
        function applyBrandDefaults() {
            const mode = ctrlMode.value;
            const theme = ctrlTheme.value;
            const defaults = brandDefaults[mode][theme];
            
            ctrlColorAccent.value = defaults.accent;
            ctrlColorGlow.value = defaults.glow;
            ctrlColorName.value = defaults.name;
            ctrlColorTitle.value = defaults.title;
            ctrlColorShadow.value = defaults.shadow;
            
            txtAccentHex.textContent = defaults.accent;
            txtGlowHex.textContent = defaults.glow;
            txtNameHex.textContent = defaults.name;
            txtTitleHex.textContent = defaults.title;
            txtShadowHex.textContent = defaults.shadow;
            
            syncThemeButtons();
            if (typeof syncModeButtons === 'function') syncModeButtons();
            updateFooterText();
            updateUrl();
        }

        function updateFooterText() {
            const configFooter = document.getElementById('config-footer');
            if (!configFooter) return;
            const mode = ctrlMode.value;
            const versionStr = typeof __APP_VERSION__ !== 'undefined' ? ` &mdash; <span id="app-version" style="font-weight: 500;">${__APP_VERSION__}</span>` : '';
            if (mode === 'artist') {
                configFooter.innerHTML = 'Développé par <a href="https://eole.me" target="_blank" style="color: #9ca3af; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color=\'var(--accent-color, #fb923c)\'" onmouseout="this.style.color=\'#9ca3af\'">Éole</a> &mdash; <a href="https://eole.me" target="_blank" style="color: #9ca3af; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color=\'var(--accent-color, #fb923c)\'" onmouseout="this.style.color=\'#9ca3af\'">eole.me</a> &mdash; Copyright 2026' + versionStr;
            } else {
                configFooter.innerHTML = 'Développé par <a href="https://jobby.eole.me" target="_blank" style="color: #9ca3af; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color=\'var(--accent-color, #fb923c)\'" onmouseout="this.style.color=\'#9ca3af\'">Julien Avarre</a> &mdash; <a href="https://jobby.eole.me" target="_blank" style="color: #9ca3af; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color=\'var(--accent-color, #fb923c)\'" onmouseout="this.style.color=\'#9ca3af\'">jobby.eole.me</a> &mdash; Copyright 2026' + versionStr;
            }
        }

        function getQueryParams() {
            const queryParams = new URLSearchParams();
            if (ctrlTheme.value !== 'dark') queryParams.set('theme', ctrlTheme.value);
            if (ctrlMode.value !== hostMode) queryParams.set('mode', ctrlMode.value);
            if (ctrlLang.value !== 'fr') queryParams.set('hl', ctrlLang.value);
            
            const exportFormatVal = document.getElementById('export-format').value;
            if (exportFormatVal !== '169') {
                queryParams.set('format', exportFormatVal);
            }

            if (!showText) {
                queryParams.set('name', 'off');
                queryParams.set('title', 'off');
                queryParams.set('company', 'off');
            } else {
                if (ctrlName.value.trim() !== '') queryParams.set('name', ctrlName.value.trim());
                if (ctrlTitle.value.trim() !== '') queryParams.set('title', ctrlTitle.value.trim());
                if (ctrlTitleSecondary.value.trim() !== '') queryParams.set('title2', ctrlTitleSecondary.value.trim());
                if (ctrlCompany.value.trim() !== '') queryParams.set('company', ctrlCompany.value.trim());
            }
            
            if (ctrlTitleTransition.value !== 'none') queryParams.set('transanim', ctrlTitleTransition.value);
            if (ctrlTitleTransitionSpeed.value !== '5') queryParams.set('transspeed', ctrlTitleTransitionSpeed.value);
            
            const finalLogo = uploadedLogoDataUrl || ctrlLogoUrl.value.trim();
            if (finalLogo) {
                if (uploadedLogoDataUrl) {
                    queryParams.set('logo', 'local');
                    try {
                        localStorage.setItem('backdrop-studio-local-logo', uploadedLogoDataUrl);
                    } catch (e) {
                        console.warn('Failed to save local logo to localStorage:', e);
                    }
                } else {
                    queryParams.set('logo', finalLogo);
                }
                if (ctrlLogoSize.value !== '2.4') queryParams.set('logosize', ctrlLogoSize.value);
                if (ctrlLogoOpacity.value !== '0.85') queryParams.set('logoopacity', ctrlLogoOpacity.value);
                if (ctrlLogoPos.value !== 'top-right') queryParams.set('logopos', ctrlLogoPos.value);
            }
            
            if (ctrlBoomerang.checked) queryParams.set('boomerang', 'on');
            if (ctrlVideoDuration.value !== '5') queryParams.set('duration', ctrlVideoDuration.value);
            
            if (ctrlPosition.value !== 'bottom') queryParams.set('position', ctrlPosition.value);
            if (ctrlAlign.value !== 'right') queryParams.set('align', ctrlAlign.value);
            if (ctrlSize.value !== '2.2') queryParams.set('size', ctrlSize.value);
            if (ctrlRatio.value !== '0.45') queryParams.set('ratio', ctrlRatio.value);
            if (ctrlAnimation.value !== 'none') queryParams.set('animation', ctrlAnimation.value);
            if (ctrlSpeed.value !== 'medium') queryParams.set('speed', ctrlSpeed.value);
            if (ctrlTextEffect.value !== 'shadow-soft') queryParams.set('texteffect', ctrlTextEffect.value);
            if (ctrlAnimateBorder.checked) queryParams.set('borderanim', 'on');
            if (ctrlTransparentBg.checked) queryParams.set('bg', 'transparent');

            queryParams.set('accent', ctrlColorAccent.value);
            queryParams.set('glow', ctrlColorGlow.value);
            queryParams.set('namecolor', ctrlColorName.value);
            queryParams.set('titlecolor', ctrlColorTitle.value);
            queryParams.set('shadowcolor', ctrlColorShadow.value);
            
            return queryParams;
        }

        // ==============================================================================
        // 🌓 UI Theme Manager Helper Functions
        // ==============================================================================
        function getResolvedUiTheme() {
            const storedUiTheme = localStorage.getItem('backdrop-studio-ui-theme') || 'system';
            if (storedUiTheme === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            return storedUiTheme;
        }

        function applyUiTheme() {
            const storedUiTheme = localStorage.getItem('backdrop-studio-ui-theme') || 'system';
            
            // Add preference class to body to control the visible icon on the cycling button via CSS
            document.body.classList.remove('ui-theme-pref-system', 'ui-theme-pref-light', 'ui-theme-pref-dark');
            document.body.classList.add('ui-theme-pref-' + storedUiTheme);
        }

        function updateUrlTextOnly() {
            try {
                const resolvedTheme = getResolvedUiTheme();
                document.body.className = '';
                document.body.classList.add('theme-' + resolvedTheme);
                document.body.classList.add('mode-' + ctrlMode.value);
                document.body.style.setProperty('--accent-color', ctrlColorAccent.value);
                document.body.style.setProperty('--glow-color', hexToRgba(ctrlColorGlow.value, 0.3));
                
                // Update decorative glow elements dynamically
                const glowAccent = document.querySelector('.bg-glow-accent');
                const glowSecondary = document.querySelector('.bg-glow-secondary');
                if (glowAccent) {
                    glowAccent.style.background = ctrlColorAccent.value;
                }
                if (glowSecondary) {
                    glowSecondary.style.background = ctrlColorGlow.value;
                }
                
                applyUiTheme();
            } catch(e) {}

            const queryParams = getQueryParams();

            // Sync Aspect Ratio container class & label text visually
            const exportFormatVal = document.getElementById('export-format').value;
            const previewContainer = document.querySelector('.iframe-preview-container');
            const previewLabel = document.querySelector('.preview-section > label');
            if (previewContainer) {
                previewContainer.className = 'iframe-preview-container ratio-' + exportFormatVal;
            }
            if (previewLabel) {
                let ratioText = '16:9';
                if (exportFormatVal === '11') ratioText = '1:1';
                else if (exportFormatVal === 'banner') ratioText = '4:1';
                previewLabel.textContent = `Aperçu en temps réel (${ratioText})`;
            }

            // Sync the preview iframe's body class live
            try {
                const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                if (iframeDoc && iframeDoc.body) {
                    iframeDoc.body.classList.remove('format-169', 'format-11', 'format-banner');
                    iframeDoc.body.classList.add('format-' + exportFormatVal);
                }
            } catch (e) {}

            // Preview: toggle bg-transparent class on iframe body
            try {
                const iframeDoc2 = previewIframe.contentDocument || previewIframe.contentWindow.document;
                if (iframeDoc2 && iframeDoc2.body) {
                    if (ctrlTransparentBg.checked) {
                        iframeDoc2.body.classList.add('bg-transparent');
                    } else {
                        iframeDoc2.body.classList.remove('bg-transparent');
                    }
                }
            } catch(e) {}

            // Colors
            txtAccentHex.textContent = ctrlColorAccent.value;
            txtGlowHex.textContent = ctrlColorGlow.value;
            txtNameHex.textContent = ctrlColorName.value;
            txtTitleHex.textContent = ctrlColorTitle.value;
            txtShadowHex.textContent = ctrlColorShadow.value;

            const queryStr = queryParams.toString();
            const finalUrl = baseBackdropUrl + (queryStr ? '?' + queryStr : '');
            
            outputUrl.textContent = finalUrl;

            // Update QR Code image source in real-time
            try {
                const qrImg = document.getElementById('qr-code-img');
                const qrBadge = document.getElementById('qr-logo-badge');
                if (qrImg) {
                    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&ecc=H&data=${encodeURIComponent(finalUrl)}`;
                }
                if (qrBadge) {
                    if (ctrlMode.value === 'artist') {
                        qrBadge.textContent = 'Éole';
                        qrBadge.style.display = 'block';
                    } else {
                        qrBadge.textContent = 'Julien';
                        qrBadge.style.display = 'block';
                    }
                }
                const btnQrToggle = document.getElementById('btn-qr-persona-toggle');
                if (btnQrToggle) {
                    btnQrToggle.textContent = ctrlMode.value === 'artist' ? 'É' : 'J';
                    btnQrToggle.style.fontFamily = ctrlMode.value === 'artist' ? "var(--font-serif, 'Lora', Georgia, serif)" : "var(--font-title-sans, 'Outfit', sans-serif)";
                }
            } catch(e) {}
        }

        function updateIframeLive(ctrl) {
            try {
                const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
                if (!iframeDoc) return;
                
                if (ctrl.id === 'size' || ctrl.id === 'ratio') {
                    const nameEl = iframeDoc.getElementById('backdrop-name');
                    const titleEl = iframeDoc.getElementById('backdrop-title');
                    const companyEl = iframeDoc.getElementById('backdrop-company');
                    if (nameEl && titleEl) {
                        const numSize = parseFloat(ctrlSize.value);
                        const numRatio = parseFloat(ctrlRatio.value);
                        nameEl.style.fontSize = numSize + 'rem';
                        const computedTitleSize = numSize * numRatio;
                        titleEl.style.fontSize = computedTitleSize + 'rem';
                        if (companyEl) companyEl.style.fontSize = (computedTitleSize * 0.85) + 'rem';
                    }
                    if (ctrl.id === 'size') {
                        document.getElementById('size-val').textContent = ctrlSize.value + 'rem';
                    } else {
                        document.getElementById('ratio-val').textContent = Math.round(ctrlRatio.value * 100) + '%';
                    }
                } else if (ctrl.id === 'ctrl-animate-border') {
                    const borderEl = iframeDoc.querySelector('.backdrop-border');
                    if (borderEl) {
                        if (ctrlAnimateBorder.checked) {
                            borderEl.classList.add('border-animated');
                        } else {
                            borderEl.classList.remove('border-animated');
                        }
                    }
                } else if (ctrl.id === 'color-accent') {
                    iframeDoc.body.style.setProperty('--accent-color', ctrlColorAccent.value);
                    iframeDoc.body.style.setProperty('--accent-color-15', hexToRgba(ctrlColorAccent.value, 0.15));
                    txtAccentHex.textContent = ctrlColorAccent.value;
                } else if (ctrl.id === 'color-glow') {
                    iframeDoc.body.style.setProperty('--glow-color', ctrlColorGlow.value);
                    iframeDoc.body.style.setProperty('--glow-color-30', hexToRgba(ctrlColorGlow.value, 0.3));
                    txtGlowHex.textContent = ctrlColorGlow.value;
                } else if (ctrl.id === 'color-name') {
                    iframeDoc.body.style.setProperty('--text-color', ctrlColorName.value);
                    txtNameHex.textContent = ctrlColorName.value;
                } else if (ctrl.id === 'color-title') {
                    iframeDoc.body.style.setProperty('--title-color', ctrlColorTitle.value);
                    txtTitleHex.textContent = ctrlColorTitle.value;
                } else if (ctrl.id === 'color-shadow') {
                    iframeDoc.body.style.setProperty('--shadow-color', ctrlColorShadow.value);
                    iframeDoc.body.style.setProperty('--shadow-color-95', hexToRgba(ctrlColorShadow.value, 0.95));
                    iframeDoc.body.style.setProperty('--shadow-color-80', hexToRgba(ctrlColorShadow.value, 0.8));
                    iframeDoc.body.style.setProperty('--shadow-color-50', hexToRgba(ctrlColorShadow.value, 0.5));
                    iframeDoc.body.style.setProperty('--shadow-color-30', hexToRgba(ctrlColorShadow.value, 0.3));
                    txtShadowHex.textContent = ctrlColorShadow.value;
                } else if (ctrl.id === 'name-input' || ctrl.id === 'title-input') {
                    const nameEl = iframeDoc.getElementById('backdrop-name');
                    const titleEl = iframeDoc.getElementById('backdrop-title');
                    const mode = ctrlMode.value;
                    if (ctrl.id === 'name-input' && nameEl) {
                        const defaultName = (mode === 'artist') ? 'Éole' : 'Julien Avarre';
                        nameEl.textContent = ctrlName.value.trim() ? ctrlName.value : defaultName;
                    } else if (ctrl.id === 'title-input' && titleEl) {
                        const defaultTitle = (mode === 'artist') ? 'Artiste & Auteur' : 'Presales Engineer';
                        titleEl.textContent = ctrlTitle.value.trim() ? ctrlTitle.value : defaultTitle;
                        if (previewIframe.contentWindow.titles) {
                            previewIframe.contentWindow.titles[0] = ctrlTitle.value.trim() ? ctrlTitle.value : defaultTitle;
                        }
                    }
                } else if (ctrl.id === 'company-input') {
                    const companyEl = iframeDoc.getElementById('backdrop-company');
                    const companySepEl = iframeDoc.getElementById('backdrop-company-sep');
                    const titleEl = iframeDoc.getElementById('backdrop-title');
                    if (companyEl) {
                        companyEl.textContent = ctrlCompany.value.trim();
                        companyEl.style.display = ctrlCompany.value.trim() ? 'inline' : 'none';
                        if (companySepEl && titleEl) {
                            companySepEl.style.display = (titleEl.textContent.trim() && ctrlCompany.value.trim()) ? 'inline' : 'none';
                        }
                    }
                    if (previewIframe.contentWindow.companies) {
                        previewIframe.contentWindow.companies[0] = ctrlCompany.value.trim();
                    }
                } else if (ctrl.id === 'title-secondary-input') {
                    if (previewIframe.contentWindow.titles) {
                        previewIframe.contentWindow.titles[1] = ctrlTitleSecondary.value.trim();
                    }
                } else if (ctrl.id === 'logo-size') {
                    const logoEl = iframeDoc.getElementById('backdrop-logo');
                    if (logoEl) logoEl.style.height = ctrlLogoSize.value + 'rem';
                    document.getElementById('logo-size-val').textContent = ctrlLogoSize.value + 'rem';
                } else if (ctrl.id === 'logo-opacity') {
                    const logoEl = iframeDoc.getElementById('backdrop-logo');
                    if (logoEl) logoEl.style.opacity = ctrlLogoOpacity.value;
                    document.getElementById('logo-opacity-val').textContent = Math.round(ctrlLogoOpacity.value * 100) + '%';
                } else if (ctrl.id === 'logo-url') {
                    const logoEl = iframeDoc.getElementById('backdrop-logo');
                    const logoContainer = iframeDoc.getElementById('backdrop-logo-container');
                    if (logoEl && logoContainer) {
                        const val = ctrlLogoUrl.value.trim();
                        if (val) {
                            uploadedLogoDataUrl = '';
                            localStorage.removeItem('backdrop-studio-local-logo');
                            ctrlLogoFile.value = '';
                            syncLogoPreview();
                            logoEl.src = val;
                            logoContainer.style.display = 'block';
                        } else if (!uploadedLogoDataUrl) {
                            logoContainer.style.display = 'none';
                        }
                    }
                }
                
                updateUrlTextOnly();
            } catch(e) {}
        }

        function updateUrl() {
            updateUrlTextOnly();
            const queryParams = getQueryParams();
            const queryStr = queryParams.toString();
            const relativeUrl = './renderer.html' + (queryStr ? '?' + queryStr : '');
            previewIframe.src = relativeUrl;
            saveConfigToLocalStorage();
        }

        const controls = [
            ctrlTheme, ctrlMode,
            ctrlName, ctrlCompany, ctrlTitle, ctrlTitleSecondary, ctrlTitleTransition, ctrlTitleTransitionSpeed,
            ctrlLogoUrl, ctrlLogoSize, ctrlLogoOpacity, ctrlLogoPos,
            ctrlExportRes, ctrlVideoDuration, ctrlBoomerang,
            ctrlPosition, ctrlAlign, ctrlSize, ctrlRatio, ctrlColorAccent, ctrlColorGlow, ctrlLang, ctrlColorName, ctrlColorTitle, ctrlColorShadow, ctrlAnimation, ctrlSpeed, ctrlTextEffect, ctrlAnimateBorder, ctrlTransparentBg
        ];
        controls.forEach(ctrl => {
            if (ctrl.type === 'range' || ctrl.type === 'color' || ctrl.type === 'checkbox' || ctrl.type === 'text') {
                ctrl.addEventListener('input', () => {
                    updateIframeLive(ctrl);
                });
                ctrl.addEventListener('change', () => {
                    updateUrlTextOnly();
                });
            } else {
                ctrl.addEventListener('input', updateUrl);
                ctrl.addEventListener('change', updateUrl);
            }
        });

        // Logo local file upload with canvas resizing (CORS-safe, URL-safe)
        ctrlLogoFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) {
                uploadedLogoDataUrl = '';
                localStorage.removeItem('backdrop-studio-local-logo');
                syncLogoPreview();
                updateUrl();
                return;
            }
            // File size validation (max 500 KB)
            if (file.size > 500 * 1024) {
                alert(ctrlLang.value === 'en' ? "Image is too large (max 500 KB)" : "L'image est trop volumineuse (max 500 Ko)");
                ctrlLogoFile.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const maxDim = 120;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) {
                        if (width > maxDim) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    uploadedLogoDataUrl = canvas.toDataURL('image/png');
                    
                    // Clear URL input to avoid conflicts
                    ctrlLogoUrl.value = '';
                    syncLogoPreview();
                    updateUrl();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        // Delete/Remove uploaded logo logic
        if (btnRemoveLogo) {
            btnRemoveLogo.addEventListener('click', () => {
                uploadedLogoDataUrl = '';
                localStorage.removeItem('backdrop-studio-local-logo');
                ctrlLogoFile.value = '';
                syncLogoPreview();
                updateUrl();
            });
        }

        // Mode Toggle Buttons Logic
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const oldMode = ctrlMode.value;
                const oldTheme = ctrlTheme.value;
                const newMode = btn.getAttribute('data-mode');
                
                transitionBrandColors(ctrls, oldMode, oldTheme, newMode, oldTheme);
                
                ctrlMode.value = newMode;
                syncModeButtons();
                updateFooterText();
                updateUrl();
            });
        });

        function syncModeButtons() {
            modeButtons.forEach(btn => {
                if (btn.getAttribute('data-mode') === ctrlMode.value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Language Toggle Buttons Logic
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                ctrlLang.value = btn.getAttribute('data-lang');
                syncLangButtons();
                updateUrl();
            });
        });

        function syncLangButtons() {
            syncLangButtonsModule(ctrlLang.value);
        }

        // QR Code Persona Toggle Button Logic
        const btnQrPersonaToggle = document.getElementById('btn-qr-persona-toggle');
        if (btnQrPersonaToggle) {
            btnQrPersonaToggle.addEventListener('click', () => {
                const oldMode = ctrlMode.value;
                const oldTheme = ctrlTheme.value;
                const newMode = (oldMode === 'artist') ? 'business' : 'artist';
                
                transitionBrandColors(ctrls, oldMode, oldTheme, newMode, oldTheme);
                
                ctrlMode.value = newMode;
                if (typeof syncModeButtons === 'function') syncModeButtons();
                updateFooterText();
                updateUrl();
            });
        }

        // Theme Toggle Buttons Logic
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const oldMode = ctrlMode.value;
                const oldTheme = ctrlTheme.value;
                const newTheme = btn.getAttribute('data-theme');
                
                transitionBrandColors(ctrls, oldMode, oldTheme, oldMode, newTheme);
                
                ctrlTheme.value = newTheme;
                updateUrl();
            });
        });

        function syncThemeButtons() {
            themeButtons.forEach(btn => {
                if (btn.getAttribute('data-theme') === ctrlTheme.value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Animation Grid Toggle Logic
        const animButtons = document.querySelectorAll('.anim-btn');
        animButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                animButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ctrlAnimation.value = btn.getAttribute('data-anim');
                updateUrl();
            });
        });

        // Speed Toggle Logic
        const speedButtons = document.querySelectorAll('.speed-btn');
        speedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                speedButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ctrlSpeed.value = btn.getAttribute('data-speed');
                updateUrl();
            });
        });
        
        // Format Toggle Logic
        const formatButtons = document.querySelectorAll('.format-btn');
        formatButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                formatButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const formatVal = btn.getAttribute('data-format');
                document.getElementById('export-format').value = formatVal;
                updateUrlTextOnly();
            });
        });

        // Text Effect Toggle Logic
        const textEffectButtons = document.querySelectorAll('.texteffect-btn');
        textEffectButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                textEffectButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ctrlTextEffect.value = btn.getAttribute('data-effect');
                updateUrl();
            });
        });

        // Copy wrapper trigger
        urlCopyWrapper.addEventListener('click', () => {
            navigator.clipboard.writeText(outputUrl.textContent).then(() => {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 2500);
            });
        });

        // Open full screen
        btnOpen.addEventListener('click', () => {
            window.open(outputUrl.textContent, '_blank');
        });

        // PNG Export trigger via iframe method
        const btnPng = document.getElementById('btn-png');
        const exportFormat = document.getElementById('export-format');
        btnPng.addEventListener('click', () => {
            try {
                previewIframe.contentWindow.capturePng(exportFormat.value, ctrlExportRes.value);
            } catch (e) {
                console.error(e);
            }
        });

        // Presets & Text Visibility Toggle Logic
        let showText = true;
        const toggleCard = document.getElementById('preset-toggle-text');
        const colorPresets = document.querySelectorAll('.color-preset');

        toggleCard.addEventListener('click', () => {
            showText = !showText;
            if (showText) {
                toggleCard.classList.add('active');
                toggleCard.classList.remove('inactive');
                toggleCard.querySelector('.toggle-icon').textContent = 'Aa';
                ctrlName.disabled = false;
                ctrlTitle.disabled = false;
            } else {
                toggleCard.classList.remove('active');
                toggleCard.classList.add('inactive');
                toggleCard.querySelector('.toggle-icon').textContent = '~Aa~';
                ctrlName.disabled = true;
                ctrlTitle.disabled = true;
            }
            updateUrl();
        });

        colorPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                // Remove active class from all color presets, add to clicked one
                colorPresets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');

                // Get colors
                const accent = preset.getAttribute('data-accent');
                const glow = preset.getAttribute('data-glow');
                const title = preset.getAttribute('data-title') || accent;

                // Set inputs (harmonizing name as white and title as distinct matching color)
                ctrlColorAccent.value = accent;
                ctrlColorGlow.value = glow;
                ctrlColorName.value = '#ffffff';
                ctrlColorTitle.value = title;

                updateUrl();
            });
        });

        // Random / Surprise button logic
        const btnRandom = document.getElementById('preset-random');
        btnRandom.addEventListener('click', () => {
            colorPresets.forEach(p => p.classList.remove('active'));
            
            // Helper to generate nice vibrant HSL colors
            const randomColor = () => {
                const h = Math.floor(Math.random() * 360);
                const s = 75 + Math.floor(Math.random() * 25); // 75-100%
                const l = 45 + Math.floor(Math.random() * 15); // 45-60%
                
                // Convert HSL to Hex
                const hDecimal = h / 360;
                const sDecimal = s / 100;
                const lDecimal = l / 100;
                let r, g, b;
                if (sDecimal === 0) {
                    r = g = b = lDecimal;
                } else {
                    const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
                    const p = 2 * lDecimal - q;
                    const hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1/6) return p + (q - p) * 6 * t;
                        if (t < 1/2) return q;
                        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    };
                    r = hue2rgb(p, q, hDecimal + 1/3);
                    g = hue2rgb(p, q, hDecimal);
                    b = hue2rgb(p, q, hDecimal - 1/3);
                }
                const toHex = x => {
                    const hex = Math.round(x * 255).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                };
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            };

            const randomAccent = randomColor();
            ctrlColorAccent.value = randomAccent;
            ctrlColorGlow.value = randomColor();
            ctrlColorName.value = '#ffffff';
            // Title and Accent should not be exactly the same color
            ctrlColorTitle.value = randomColor();

            updateUrl();
        });

        // If color picker inputs are changed manually, remove active state from presets
        [ctrlColorAccent, ctrlColorGlow, ctrlColorName, ctrlColorTitle].forEach(ctrl => {
            ctrl.addEventListener('input', () => {
                colorPresets.forEach(p => p.classList.remove('active'));
            });
        });

        // Sync with global localStorage state on page load
        try {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                ctrlTheme.value = storedTheme;
            }
            const storedMode = localStorage.getItem('mode');
            if (storedMode) {
                ctrlMode.value = storedMode;
            }
            const storedLang = localStorage.getItem('lang');
            if (storedLang) {
                ctrlLang.value = storedLang;
            }
        } catch (e) {}

        // Bind Visual alignment grid selector
        const alignButtons = document.querySelectorAll('.align-btn');
        const hiddenPos = document.getElementById('position');
        const hiddenAlign = document.getElementById('align');

        alignButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                alignButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                hiddenPos.value = btn.getAttribute('data-pos');
                hiddenAlign.value = btn.getAttribute('data-align');
                updateUrl();
            });
        });

        function syncAlignmentUI() {
            const posVal = hiddenPos.value;
            const alignVal = hiddenAlign.value;
            alignButtons.forEach(btn => {
                if (btn.getAttribute('data-pos') === posVal && btn.getAttribute('data-align') === alignVal) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Bind Visual logo position grid selector
        const logoPosButtons = document.querySelectorAll('.logo-pos-btn');
        const hiddenLogoPos = document.getElementById('logo-pos');

        logoPosButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                logoPosButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                hiddenLogoPos.value = btn.getAttribute('data-value');
                // Trigger change event to update iframe and URL
                hiddenLogoPos.dispatchEvent(new Event('input'));
                hiddenLogoPos.dispatchEvent(new Event('change'));
            });
        });

        function syncLogoPosUI() {
            if (!hiddenLogoPos) return;
            const logoPosVal = hiddenLogoPos.value;
            logoPosButtons.forEach(btn => {
                if (btn.getAttribute('data-value') === logoPosVal) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Bind Visual title transition speed/duration selector
        const durationButtons = document.querySelectorAll('.duration-btn');
        const hiddenDuration = document.getElementById('title-transition-speed');

        durationButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                durationButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                hiddenDuration.value = btn.getAttribute('data-speed');
                hiddenDuration.dispatchEvent(new Event('input'));
                hiddenDuration.dispatchEvent(new Event('change'));
            });
        });

        function syncDurationUI() {
            if (!hiddenDuration) return;
            const durationVal = hiddenDuration.value;
            durationButtons.forEach(btn => {
                if (btn.getAttribute('data-speed') === durationVal) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Bind Visual title transition selector
        const transitionButtons = document.querySelectorAll('.transition-btn');
        const hiddenTransition = document.getElementById('title-transition');

        transitionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                transitionButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                hiddenTransition.value = btn.getAttribute('data-transition');
                hiddenTransition.dispatchEvent(new Event('input'));
                hiddenTransition.dispatchEvent(new Event('change'));
            });
        });

        function syncTransitionUI() {
            if (!hiddenTransition) return;
            const transitionVal = hiddenTransition.value;
            transitionButtons.forEach(btn => {
                if (btn.getAttribute('data-transition') === transitionVal) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        // Help Modal Controls
        const btnHelpModal = document.getElementById('btn-help-modal');
        const helpModal = document.getElementById('help-modal');
        const btnCloseModal = document.getElementById('btn-close-modal');

        if (btnHelpModal && helpModal && btnCloseModal) {
            btnHelpModal.addEventListener('click', () => {
                helpModal.style.display = 'flex';
                // Trigger reflow
                helpModal.offsetHeight;
                helpModal.classList.add('show');
            });

            const closeModal = () => {
                helpModal.classList.remove('show');
                setTimeout(() => {
                    helpModal.style.display = 'none';
                }, 300);
            };

            btnCloseModal.addEventListener('click', closeModal);
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    closeModal();
                }
            });
        }

        // Video Exporter click handler
        const btnVideo = document.getElementById('btn-video');
        if (btnVideo) {
            btnVideo.addEventListener('click', () => {
                const originalText = btnVideo.querySelector('span').textContent;
                btnVideo.querySelector('span').textContent = 'Exportation...';
                btnVideo.disabled = true;
                btnVideo.style.opacity = '0.7';

                const durationVal = parseFloat(ctrlVideoDuration.value) || 5;

                const exportModal = document.getElementById('export-modal');
                const exportProgressBar = document.getElementById('export-progress-bar');
                const exportProgressText = document.getElementById('export-progress-text');

                if (exportModal && exportProgressBar && exportProgressText) {
                    exportProgressBar.style.width = '0%';
                    exportProgressText.textContent = '0%';
                    exportModal.style.display = 'flex';
                    // Trigger reflow
                    exportModal.offsetHeight;
                    exportModal.classList.add('show');
                }

                const hideModal = () => {
                    if (exportModal) {
                        exportModal.classList.remove('show');
                        setTimeout(() => {
                            exportModal.style.display = 'none';
                        }, 300);
                    }
                };

                const btnCancelExport = document.getElementById('btn-cancel-export');
                if (btnCancelExport) {
                    btnCancelExport.onclick = () => {
                        try {
                            previewIframe.contentWindow.videoExportCancelled = true;
                        } catch (e) {
                            console.error(e);
                        }
                    };
                }

                try {
                    previewIframe.contentWindow.captureVideo(exportFormat.value, durationVal, (pct) => {
                        const roundedPct = Math.round(pct);
                        if (exportProgressBar) exportProgressBar.style.width = roundedPct + '%';
                        if (exportProgressText) exportProgressText.textContent = roundedPct + '%';
                    })
                        .then(() => {
                            btnVideo.querySelector('span').textContent = originalText;
                            btnVideo.disabled = false;
                            btnVideo.style.opacity = '1';
                            hideModal();
                        })
                        .catch(e => {
                            console.error(e);
                            btnVideo.querySelector('span').textContent = originalText;
                            btnVideo.disabled = false;
                            btnVideo.style.opacity = '1';
                            hideModal();
                        });
                } catch (e) {
                    console.error(e);
                    btnVideo.querySelector('span').textContent = originalText;
                    btnVideo.disabled = false;
                    btnVideo.style.opacity = '1';
                    hideModal();
                }
            });
        }

        // LocalStorage loading/saving
        function saveConfigToLocalStorage() {
            saveConfigToLocalStorageModule(ctrls);
        }

        function loadConfigFromLocalStorage() {
            return loadConfigFromLocalStorageModule(ctrls);
        }

        // Initialize default view
        const hasLoadedFromStorage = loadConfigFromLocalStorage();
        if (!hasLoadedFromStorage) {
            applyBrandDefaults();
        } else {
            syncThemeButtons();
            if (typeof syncModeButtons === 'function') syncModeButtons();
            updateFooterText();
            updateUrl();
        }
        syncAlignmentUI();
        syncLogoPosUI();
        syncDurationUI();
        syncTransitionUI();
        syncLangButtons();

        // Bind UI Theme cycling button in the app header
        const uiThemeCycleBtn = document.getElementById('ui-theme-cycle-btn');
        if (uiThemeCycleBtn) {
            uiThemeCycleBtn.addEventListener('click', () => {
                const storedUiTheme = localStorage.getItem('backdrop-studio-ui-theme') || 'system';
                let nextUiTheme = 'light';
                if (storedUiTheme === 'system') {
                    nextUiTheme = 'light';
                } else if (storedUiTheme === 'light') {
                    nextUiTheme = 'dark';
                } else if (storedUiTheme === 'dark') {
                    nextUiTheme = 'system';
                }
                localStorage.setItem('backdrop-studio-ui-theme', nextUiTheme);
                updateUrlTextOnly();
            });
        }

        // Watch for system color scheme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            const storedUiTheme = localStorage.getItem('backdrop-studio-ui-theme') || 'system';
            if (storedUiTheme === 'system') {
                updateUrlTextOnly();
            }
        });

        // Initial UI theme application
        updateUrlTextOnly();

        // Bind Logo click to reset local configuration and reload the page
        const logoTrigger = document.getElementById('logo-trigger');
        if (logoTrigger) {
            logoTrigger.addEventListener('click', () => {
                localStorage.removeItem('backdrop-studio-config');
                window.location.href = window.location.pathname;
            });
        }

        // Bind Settings Tabs Navigation (Contenu / Style / Disposition)
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        if (tabButtons.length > 0 && tabContents.length > 0) {
            tabButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    tabButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    const targetTab = btn.getAttribute('data-tab');
                    tabContents.forEach(content => {
                        if (content.getAttribute('data-tab-content') === targetTab) {
                            content.classList.add('active');
                        } else {
                            content.classList.remove('active');
                        }
                    });
                });
            });
        }
