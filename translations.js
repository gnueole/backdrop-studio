export function syncLangButtons(lang) {
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Set document lang attribute
    document.documentElement.setAttribute('lang', lang);

    // Dynamic Input Placeholders Translation
    const nameInput = document.getElementById('name-input');
    const companyInput = document.getElementById('company-input');
    const titleInput = document.getElementById('title-input');
    const titleSecondaryInput = document.getElementById('title-secondary-input');
    
    if (lang === 'en') {
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

    // Dynamic Select/Input Options Translation
    const titleTransition = document.getElementById('title-transition');
    if (titleTransition && titleTransition.tagName === 'SELECT') {
        const options = titleTransition.options;
        if (lang === 'en') {
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

    // Dynamic Transition Buttons Tooltips Translation
    const transitionBtns = document.querySelectorAll('.transition-btn');
    transitionBtns.forEach(btn => {
        const trans = btn.getAttribute('data-transition');
        if (lang === 'en') {
            if (trans === 'none') btn.title = "None (Static)";
            else if (trans === 'blur') btn.title = "Blur (Blur In/Out)";
            else if (trans === 'scramble') btn.title = "Scrambled Letters (Scramble)";
            else if (trans === 'airport') btn.title = "Airport Board (Split-flap)";
            else if (trans === 'flip') btn.title = "3D Flip (Y-axis)";
        } else {
            if (trans === 'none') btn.title = "Aucune (Fixe)";
            else if (trans === 'blur') btn.title = "Flou (Blur In/Out)";
            else if (trans === 'scramble') btn.title = "Lettres mélangées (Scramble)";
            else if (trans === 'airport') btn.title = "Panneau d'aéroport (Split-flap)";
            else if (trans === 'flip') btn.title = "Flip 3D (Rotation Y)";
        }
    });

    // Dynamic Alignment Buttons Tooltips Translation
    const alignBtns = document.querySelectorAll('.align-btn');
    alignBtns.forEach(btn => {
        const pos = btn.getAttribute('data-pos');
        const align = btn.getAttribute('data-align');
        if (lang === 'en') {
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
        if (lang === 'en') {
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
        btnHelpModal.title = (lang === 'en') ? "How to use your Backdrop?" : "Comment utiliser votre Backdrop ?";
    }

    // Text Visibility Toggle Tooltip
    const toggleCard = document.getElementById('preset-toggle-text');
    if (toggleCard) {
        toggleCard.title = (lang === 'en') ? "Show/Hide name and title on render" : "Afficher/Masquer le nom et le titre sur le rendu";
    }

    // Random Preset Button Tooltip
    const btnRandom = document.getElementById('preset-random');
    if (btnRandom) {
        btnRandom.title = (lang === 'en') ? "Generate random harmonious colors" : "Générer des couleurs aléatoires harmonieuses";
    }

    // Copy URL Button Tooltip
    const urlCopyWrapper = document.getElementById('url-copy-wrapper');
    if (urlCopyWrapper) {
        urlCopyWrapper.title = (lang === 'en') ? "Copy URL to clipboard" : "Copier l'URL dans le presse-papier";
    }

    // Open Render Button Tooltip
    const btnOpen = document.getElementById('btn-open');
    if (btnOpen) {
        btnOpen.title = (lang === 'en') ? "Open full screen render in a new tab" : "Ouvrir le rendu plein écran dans un nouvel onglet";
    }

    // Export PNG Button Tooltip
    const btnPng = document.getElementById('btn-png');
    if (btnPng) {
        btnPng.title = (lang === 'en') ? "Download the render as a PNG image" : "Télécharger le rendu sous forme d'image PNG";
    }

    // Video Button Tooltip
    const btnVideo = document.getElementById('btn-video');
    if (btnVideo) {
        btnVideo.title = (lang === 'en') ? "Generate and download a looping MP4 video" : "Générer et télécharger une boucle vidéo MP4";
    }

    // Close Modal Button Tooltip
    const btnCloseModal = document.getElementById('btn-close-modal');
    if (btnCloseModal) {
        btnCloseModal.title = (lang === 'en') ? "Close" : "Fermer";
    }
}
