function goTo(page){
    window.location.href = page; 
}

function detectMobileOrNarrow() {
    if (window.innerWidth < 1000) goTo('/narrow');
}

detectMobileOrNarrow();

window.onresize = detectMobileOrNarrow;
