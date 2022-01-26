function goTo(page){
    window.location.href = page; 
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        detectMobileOrNarrow();
    });
} else {
    detectMobileOrNarrow();
}

function detectMobileOrNarrow() {
    if (window.innerWidth < 1000) goTo('/narrow');
    console.log('detectMobileOrNarrow() says: ' + window.innerWidth);
}

window.onresize = detectMobileOrNarrow;
