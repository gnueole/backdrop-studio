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
        
        const ctrlLogoFile = document.getElementById('logo-file');
        const ctrlLogoUrl = document.getElementById('logo-url');
        const ctrlLogoSize = document.getElementById('logo-size');
        const ctrlLogoOpacity = document.getElementById('logo-opacity');
        
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

        let uploadedLogoDataUrl = '';

        // Dynamic base URL resolver
        const baseBackdropUrl = window.location.origin + window.location.pathname.replace('config.html', '');

        // Define default brand colors from variables.css
        const brandDefaults = {
            business: {
                dark: { accent: '#38bdf8', glow: '#38bdf8', name: '#ffffff', title: '#38bdf8', shadow: '#000000' },
                light: { accent: '#0284c7', glow: '#0284c7', name: '#0f172a', title: '#0284c7', shadow: '#ffffff' }
            },
            artist: {
                dark: { accent: '#e2875c', glow: '#e2875c', name: '#ffffff', title: '#e2875c', shadow: '#000000' },
                light: { accent: '#c96537', glow: '#c96537', name: '#2c241e', title: '#c96537', shadow: '#ffffff' }
            }
        };

        function hexToRgba(hex, alpha) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
        }

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
            
            const finalLogo = uploadedLogoDataUrl || ctrlLogoUrl.value.trim();
            if (finalLogo) {
                queryParams.set('logo', finalLogo);
                if (ctrlLogoSize.value !== '2.4') queryParams.set('logosize', ctrlLogoSize.value);
                if (ctrlLogoOpacity.value !== '0.85') queryParams.set('logoopacity', ctrlLogoOpacity.value);
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

            const defaults = brandDefaults[ctrlMode.value][ctrlTheme.value];
            if (ctrlColorAccent.value.toLowerCase() !== defaults.accent.toLowerCase()) {
                queryParams.set('accent', ctrlColorAccent.value);
            }
            if (ctrlColorGlow.value.toLowerCase() !== defaults.glow.toLowerCase()) {
                queryParams.set('glow', ctrlColorGlow.value);
            }
            if (ctrlColorName.value.toLowerCase() !== defaults.name.toLowerCase()) {
                queryParams.set('namecolor', ctrlColorName.value);
            }
            if (ctrlColorTitle.value.toLowerCase() !== defaults.title.toLowerCase()) {
                queryParams.set('titlecolor', ctrlColorTitle.value);
            }
            if (ctrlColorShadow.value.toLowerCase() !== defaults.shadow.toLowerCase()) {
                queryParams.set('shadowcolor', ctrlColorShadow.value);
            }
            
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
                    btnQrToggle.textContent = ctrlMode.value === 'artist' ? 'E' : 'J';
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
            ctrlName, ctrlCompany, ctrlTitle, ctrlTitleSecondary, ctrlTitleTransition,
            ctrlLogoUrl, ctrlLogoSize, ctrlLogoOpacity,
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
                updateUrl();
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
                    updateUrl();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        // Mode Toggle Buttons Logic
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                ctrlMode.value = btn.getAttribute('data-mode');
                syncModeButtons();
                applyBrandDefaults();
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
            langButtons.forEach(btn => {
                if (btn.getAttribute('data-lang') === ctrlLang.value) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });

            // Set document lang attribute
            document.documentElement.setAttribute('lang', ctrlLang.value);

            // Dynamic Input Placeholders Translation
            const nameInput = document.getElementById('name-input');
            const companyInput = document.getElementById('company-input');
            const titleInput = document.getElementById('title-input');
            const titleSecondaryInput = document.getElementById('title-secondary-input');
            
            if (ctrlLang.value === 'en') {
                if (nameInput) nameInput.placeholder = "Leave empty for default";
                if (companyInput) companyInput.placeholder = "Leave empty / 'off'";
                if (titleInput) titleInput.placeholder = "Leave empty / 'off' to hide";
                if (titleSecondaryInput) titleSecondaryInput.placeholder = "Leave empty if no cycle";
            } else {
                if (nameInput) nameInput.placeholder = "Laisser vide pour défaut";
                if (companyInput) companyInput.placeholder = "Laisser vide / 'off'";
                if (titleInput) titleInput.placeholder = "Laisser vide / 'off' pour masquer";
                if (titleSecondaryInput) titleSecondaryInput.placeholder = "Laisser vide si aucun cycle";
            }

            // Dynamic Select Options Translation
            const titleTransition = document.getElementById('title-transition');
            if (titleTransition) {
                const options = titleTransition.options;
                if (ctrlLang.value === 'en') {
                    options[0].text = "None (Static)";
                    options[1].text = "Blur In/Out";
                    options[2].text = "Scrambled Letters";
                    options[3].text = "Airport Board (Split-flap)";
                    options[4].text = "3D Flip (Y-axis)";
                } else {
                    options[0].text = "Aucune (Fixe)";
                    options[1].text = "Flou (Blur In/Out)";
                    options[2].text = "Lettres mélangées (Scramble)";
                    options[3].text = "Panneau d'aéroport (Split-flap)";
                    options[4].text = "Flip 3D (Rotation Y)";
                }
            }

            // Dynamic Alignment Buttons Tooltips Translation
            const alignBtns = document.querySelectorAll('.align-btn');
            alignBtns.forEach(btn => {
                const pos = btn.getAttribute('data-pos');
                const align = btn.getAttribute('data-align');
                if (ctrlLang.value === 'en') {
                    let text = '';
                    if (pos === 'top') text = 'Top';
                    else if (pos === 'middle') text = 'Middle';
                    else if (pos === 'bottom') text = 'Bottom';
                    
                    if (align === 'left') text += ' left';
                    else if (align === 'right') text += ' right';
                    btn.title = text;
                } else {
                    let text = '';
                    if (pos === 'top') text = 'En haut';
                    else if (pos === 'middle') text = 'Au milieu';
                    else if (pos === 'bottom') text = 'En bas';
                    
                    if (align === 'left') text += ' à gauche';
                    else if (align === 'right') text += ' à droite';
                    btn.title = text;
                }
            });

            // Dynamic Format Buttons Tooltips Translation
            const formatBtns = document.querySelectorAll('.format-btn');
            formatBtns.forEach(btn => {
                const format = btn.getAttribute('data-format');
                if (ctrlLang.value === 'en') {
                    if (format === '169') btn.title = "OBS/Zoom Format (16:9)";
                    else if (format === '11') btn.title = "Square Profile Format (1:1)";
                    else if (format === 'banner') btn.title = "LinkedIn Banner Format (4:1)";
                } else {
                    if (format === '169') btn.title = "Format OBS/Zoom (16:9)";
                    else if (format === '11') btn.title = "Format Profil Carré (1:1)";
                    else if (format === 'banner') btn.title = "Format Bannière LinkedIn (4:1)";
                }
            });

            // Help Modal Button Tooltip
            const btnHelpModal = document.getElementById('btn-help-modal');
            if (btnHelpModal) {
                btnHelpModal.title = (ctrlLang.value === 'en') ? "How to use your Backdrop?" : "Comment utiliser votre Backdrop ?";
            }

            // Text Visibility Toggle Tooltip
            const toggleCard = document.getElementById('preset-toggle-text');
            if (toggleCard) {
                toggleCard.title = (ctrlLang.value === 'en') ? "Show/Hide name and title on render" : "Afficher/Masquer le nom et le titre sur le rendu";
            }

            // Random Preset Button Tooltip
            const btnRandom = document.getElementById('preset-random');
            if (btnRandom) {
                btnRandom.title = (ctrlLang.value === 'en') ? "Generate random harmonious colors" : "Générer des couleurs aléatoires harmonieuses";
            }

            // Copy URL Button Tooltip
            const urlCopyWrapper = document.getElementById('url-copy-wrapper');
            if (urlCopyWrapper) {
                urlCopyWrapper.title = (ctrlLang.value === 'en') ? "Copy URL to clipboard" : "Copier l'URL dans le presse-papier";
            }

            // Open Render Button Tooltip
            const btnOpen = document.getElementById('btn-open');
            if (btnOpen) {
                btnOpen.title = (ctrlLang.value === 'en') ? "Open full screen render in a new tab" : "Ouvrir le rendu plein écran dans un nouvel onglet";
            }

            // Export PNG Button Tooltip
            const btnPng = document.getElementById('btn-png');
            if (btnPng) {
                btnPng.title = (ctrlLang.value === 'en') ? "Download the render as a PNG image" : "Télécharger le rendu sous forme d'image PNG";
            }

            // Video Button Tooltip
            const btnVideo = document.getElementById('btn-video');
            if (btnVideo) {
                btnVideo.title = (ctrlLang.value === 'en') ? "Generate and download a looping MP4 video" : "Générer et télécharger une boucle vidéo MP4";
            }

            // Close Modal Button Tooltip
            const btnCloseModal = document.getElementById('btn-close-modal');
            if (btnCloseModal) {
                btnCloseModal.title = (ctrlLang.value === 'en') ? "Close" : "Fermer";
            }
        }

        // QR Code Persona Toggle Button Logic
        const btnQrPersonaToggle = document.getElementById('btn-qr-persona-toggle');
        if (btnQrPersonaToggle) {
            btnQrPersonaToggle.addEventListener('click', () => {
                if (ctrlMode.value === 'artist') {
                    ctrlMode.value = 'business';
                } else {
                    ctrlMode.value = 'artist';
                }
                applyBrandDefaults();
            });
        }

        // Theme Toggle Buttons Logic
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ctrlTheme.value = btn.getAttribute('data-theme');
                applyBrandDefaults();
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

                // Set inputs (harmonizing name as white and title as matching accent)
                ctrlColorAccent.value = accent;
                ctrlColorGlow.value = glow;
                ctrlColorName.value = '#ffffff';
                ctrlColorTitle.value = accent;

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
            ctrlColorTitle.value = randomAccent;

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
            try {
                const config = {
                    theme: ctrlTheme.value,
                    mode: ctrlMode.value,
                    lang: ctrlLang.value,
                    name: ctrlName.value,
                    title: ctrlTitle.value,
                    position: ctrlPosition.value,
                    align: ctrlAlign.value,
                    size: ctrlSize.value,
                    ratio: ctrlRatio.value,
                    accent: ctrlColorAccent.value,
                    glow: ctrlColorGlow.value,
                    namecolor: ctrlColorName.value,
                    titlecolor: ctrlColorTitle.value,
                    shadowcolor: ctrlColorShadow.value,
                    animation: ctrlAnimation.value,
                    speed: ctrlSpeed.value,
                    texteffect: ctrlTextEffect.value,
                    borderanim: ctrlAnimateBorder.checked,
                    transparentBg: ctrlTransparentBg.checked
                };
                localStorage.setItem('backdrop-studio-config', JSON.stringify(config));
            } catch (e) {
                console.error('Failed to save config to localStorage:', e);
            }
        }

        function loadConfigFromLocalStorage() {
            try {
                const data = localStorage.getItem('backdrop-studio-config');
                if (data) {
                    const config = JSON.parse(data);
                    
                    if (config.theme) ctrlTheme.value = config.theme;
                    if (config.mode) ctrlMode.value = config.mode;
                    if (config.lang) ctrlLang.value = config.lang;
                    if (config.name !== undefined) ctrlName.value = config.name;
                    if (config.title !== undefined) ctrlTitle.value = config.title;
                    if (config.position) ctrlPosition.value = config.position;
                    if (config.align) ctrlAlign.value = config.align;
                    if (config.size) ctrlSize.value = config.size;
                    if (config.ratio) {
                        ctrlRatio.value = config.ratio;
                        txtRatioVal.textContent = config.ratio;
                    }
                    if (config.accent) {
                        ctrlColorAccent.value = config.accent;
                        txtAccentHex.textContent = config.accent;
                    }
                    if (config.glow) {
                        ctrlColorGlow.value = config.glow;
                        txtGlowHex.textContent = config.glow;
                    }
                    if (config.namecolor) {
                        ctrlColorName.value = config.namecolor;
                        txtNameHex.textContent = config.namecolor;
                    }
                    if (config.titlecolor) {
                        ctrlColorTitle.value = config.titlecolor;
                        txtTitleHex.textContent = config.titlecolor;
                    }
                    if (config.shadowcolor) {
                        ctrlColorShadow.value = config.shadowcolor;
                        txtShadowHex.textContent = config.shadowcolor;
                    }
                    if (config.animation) ctrlAnimation.value = config.animation;
                    if (config.speed) ctrlSpeed.value = config.speed;
                    if (config.texteffect) ctrlTextEffect.value = config.texteffect;
                    if (config.borderanim !== undefined) ctrlAnimateBorder.checked = config.borderanim;
                    if (config.transparentBg !== undefined) ctrlTransparentBg.checked = config.transparentBg;

                    return true;
                }
            } catch (e) {
                console.error('Failed to load config from localStorage:', e);
            }
            return false;
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
        applyUiTheme();

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
