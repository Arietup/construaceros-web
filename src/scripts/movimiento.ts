const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Muestra los elementos .reveal al entrar en viewport. Una sola vez cada uno. */
function activarReveals() {
  const elementos = document.querySelectorAll<HTMLElement>('.reveal');

  if (sinMovimiento) {
    elementos.forEach((el) => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('reveal-visible');
        observer.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
  );

  elementos.forEach((el) => observer.observe(el));
}

/** Anima los contadores de 0 al valor final cuando entran en pantalla. */
function activarContadores() {
  const contadores = document.querySelectorAll<HTMLElement>('[data-contador]');

  // El HTML ya trae el valor real: sin JavaScript el numero es correcto.
  // Aqui solo se anima, y solo lo que el visitante todavia no ha visto.
  if (sinMovimiento) return;

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        observer.unobserve(el);

        const destino = Number(el.dataset.contador);
        if (!Number.isFinite(destino)) return; // dato invalido: se queda el texto del HTML

        const duracion = 1400;
        const inicio = performance.now();

        const paso = (ahora: number) => {
          const avance = Math.min((ahora - inicio) / duracion, 1);
          // easeOutCubic: arranca rápido y frena al final.
          el.textContent = String(Math.round(destino * (1 - Math.pow(1 - avance, 3))));
          if (avance < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      });
    },
    { threshold: 0.5 },
  );

  contadores.forEach((el) => {
    // Solo se reinicia a cero lo que esta por debajo del pliegue. Lo que ya
    // se ve conserva su valor final: evita el salto de "20" a "0" en pantalla.
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.textContent = '0';
      observer.observe(el);
    }
  });
}

activarReveals();
activarContadores();
