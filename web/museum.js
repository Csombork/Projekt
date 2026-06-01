/*  Naptár-lapozó logika
    – felülről lefelé hajtódik (előre az időben)
    – lentről felfelé hajtódik vissza
    Az oldalak transform-origin: top center, tehát rotateX(-180deg) = lehajtás.
*/

const pages      = Array.from(document.querySelectorAll('.page'));
const yearSpans  = Array.from(document.querySelectorAll('.timeline span'));
const btnUp      = document.getElementById('up');
const btnDown    = document.getElementById('down');

let current   = 0;
let animating = false;

/* ── Kezdeti z-index beállítás ────────────────────────────── */
function initStack() {
    pages.forEach((p, i) => {
        p.style.zIndex = pages.length - i;
        // Elrejtjük a még nem aktív lapokat (de a DOM-ban maradnak)
        p.classList.remove('flipped');
    });
    updateTimeline();
    updateButtons();
}

/* ── Időegyenes frissítése ───────────────────────────────── */
function updateTimeline() {
    yearSpans.forEach((s, i) => {
        s.classList.toggle('active', i === current);
    });
}

/* ── Gombok állapota ─────────────────────────────────────── */
function updateButtons() {
    btnUp.disabled   = current === 0;
    btnDown.disabled = current === pages.length - 1;
}

/* ── Előre lapozás (lefelé hajtás) ──────────────────────── */
function flipForward() {
    if (animating || current >= pages.length - 1) return;
    animating = true;

    const pageEl = pages[current];

    // A lapozandó oldal kerüljön a tetejére
    pageEl.style.zIndex = pages.length + 10;

    // Lefelé hajtjuk (rotateX negatív = előre dől)
    pageEl.classList.add('flipped');

    pageEl.addEventListener('transitionend', () => {
        // Az elhajtott oldal kerüljön a többi mögé
        pageEl.style.zIndex = 0;
        current++;
        updateTimeline();
        updateButtons();
        animating = false;
    }, { once: true });
}

/* ── Vissza lapozás (felfelé hajtás) ────────────────────── */
function flipBack() {
    if (animating || current <= 0) return;
    animating = true;

    const pageEl = pages[current - 1];   // az előző lap

    // Hozzuk előre
    pageEl.style.zIndex = pages.length + 10;

    // Visszahajtjuk (flipped class eltávolítása = rotateX(0))
    pageEl.classList.remove('flipped');

    pageEl.addEventListener('transitionend', () => {
        pageEl.style.zIndex = pages.length - (current - 1);
        current--;
        updateTimeline();
        updateButtons();
        animating = false;
    }, { once: true });
}

/* ── Gombok ─────────────────────────────────────────────── */
btnDown.addEventListener('click', flipForward);
btnUp.addEventListener('click',   flipBack);

/* ── Időegyenes kattintás ────────────────────────────────── */
yearSpans.forEach((s, i) => {
    s.addEventListener('click', () => {
        if (i === current || animating) return;
        // Lépésenkénti ugrás, hogy az animáció helyes legyen
        const step = i > current ? flipForward : flipBack;
        function doStep() {
            if (current === i) return;
            step();
            // Várunk az animáció végére, aztán következő lépés
            const check = setInterval(() => {
                if (!animating) {
                    clearInterval(check);
                    if (current !== i) doStep();
                }
            }, 50);
        }
        doStep();
    });
});

/* ── Görgetés (egér-kerék) ──────────────────────────────── */
document.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) flipForward();
    else              flipBack();
}, { passive: true });

/* ── Érintés (swipe fel/le) ─────────────────────────────── */
let touchStartY = 0;
document.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) {
        if (dy > 0) flipForward();
        else        flipBack();
    }
}, { passive: true });

/* ── Init ───────────────────────────────────────────────── */
initStack();
