// Recupera la fecha de la URL
const params = new URLSearchParams(window.location.search);
const fecha = params.get('fecha') || '01/01/2000';

const fechaDiv = document.getElementById('fecha-animada');
const imagenSorpresa = document.getElementById('imagen-sorpresa');
const contenedorBarra = document.getElementById('contenedor-barra');
const barra = document.getElementById('barra');

// Muestra la fecha
fechaDiv.textContent = fecha;

// 1 — Fecha cae al centro
setTimeout(() => {
    fechaDiv.style.top = '40%';
}, 100);

// 2 — Explota en estrellitas
setTimeout(() => {
    explotar();
}, 1300);

// 3 — Aparece imagen y barra
setTimeout(() => {
    fechaDiv.style.display = 'none';
    imagenSorpresa.style.opacity = '1';
    contenedorBarra.style.opacity = '1';

    // Inicia la barra
    setTimeout(() => {
        barra.style.width = '100%';
    }, 100);
}, 2300);


function explotar() {
    const rect = fechaDiv.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const emojis = ['⭐', '✨', '💫', '🌟', '⚡', '💙', '💙', '💙']; // ← más corazones azules

    for (let i = 0; i < 30; i++) {  // ← de 20 a 30
        const estrella = document.createElement('div');
        estrella.classList.add('estrella');
        estrella.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        estrella.style.left = cx + 'px';
        estrella.style.top = cy + 'px';

        const angulo = Math.random() * 360;
        const distancia = 120 + Math.random() * 200; // ← más distancia
        const dx = Math.cos(angulo) * distancia + 'px';
        const dy = Math.sin(angulo) * distancia + 'px';

        estrella.style.setProperty('--dx', dx);
        estrella.style.setProperty('--dy', dy);

        document.body.appendChild(estrella);
        estrella.addEventListener('animationend', () => estrella.remove());
    }

    fechaDiv.style.opacity = '0';
}


//Para el texto y demas.
const zonaBotones = document.getElementById('zona-botones');
const btnAceptar = document.getElementById('btn-aceptar');
const btnRechazar = document.getElementById('btn-rechazar');

// Aparece después de que la barra llena
setTimeout(() => {
    zonaBotones.style.opacity = '1';
}, 5800);

// Aceptar → va a otra página
btnAceptar.addEventListener('click', () => {
    window.location.href = 'vestir_personaje.html';
});

// Rechazar → se mueve 3 veces y desaparece
let clicksRechazo = 0;
const posiciones = [
    { left: '120px', top: '-60px' },
    { left: '-100px', top: '40px' },
    { left: '80px', top: '70px' },
    { left: '40px', top: '20px' }
];

btnRechazar.addEventListener('click', () => {
    if (clicksRechazo >= 4) return;

    const pos = posiciones[clicksRechazo];
    btnRechazar.style.left = pos.left;
    btnRechazar.style.top = pos.top;
    clicksRechazo++;

    if (clicksRechazo === 4) {
        setTimeout(() => {
            btnRechazar.style.opacity = '0';
            btnRechazar.style.transition += ', opacity 0.5s ease';
        }, 400);
    }
});