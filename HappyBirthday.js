window.addEventListener('load', () => {
  const carga = document.getElementById('pantalla-carga');
  carga.style.opacity = '0';
  setTimeout(() => carga.style.display = 'none', 600);
});

const pantalla = document.getElementById('pantalla');

document.querySelectorAll('.Numeros').forEach(btn => {
    btn.addEventListener('click', () => {
        const valor = pantalla.value.replace(/\//g, '');

        // Máximo 8 dígitos (DDMMAAAA)
        if (valor.length >= 8) return;

        pantalla.value = formatearFecha(valor + btn.textContent);
    });
});

document.querySelector('.enter').addEventListener('click', () => {
    const valor = pantalla.value;

    if (valor !== '16/08/2026') {
        alert('Fecha incorrecta.');
        pantalla.value = '';
        return;
    }

    window.location.href = 'Carga.html?fecha=' + pantalla.value;
});

function formatearFecha(valor) {
    // Agrega las barras automáticamente → DD/MM/AAAA
    if (valor.length <= 2) return valor;
    if (valor.length <= 4) return valor.slice(0,2) + '/' + valor.slice(2);
    return valor.slice(0,2) + '/' + valor.slice(2,4) + '/' + valor.slice(4);
}


// Agrega funcionalidad al botón de borrar.
document.querySelector('.borrar').addEventListener('click', () => {
    pantalla.value = pantalla.value.slice(0, -1);
});