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

  if (sinMovimiento) {
    contadores.forEach((el) => (el.textContent = el.dataset.contador!));
    return;
  }

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        observer.unobserve(el);

        const destino = Number(el.dataset.contador);
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

  contadores.forEach((el) => observer.observe(el));
}

activarReveals();
activarContadores();
