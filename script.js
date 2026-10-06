  // 광주 현재 시각
  const clock = document.getElementById('clock');
  const tick = () => clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
  tick(); setInterval(tick, 10000);

  // 스크롤 시 부드럽게 등장
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // 방문자 수 (한 번 방문에 한 번만 셉니다)
  const visits = document.getElementById('visits');
  if (visits) {
    const api = 'https://abacus.jasoncameron.dev';
    const ns = 'xormrjjin-debug-github-io';
    const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '');
    let counted = false;
    try { counted = sessionStorage.getItem('counted') === '1'; } catch (e) {}
    const op = counted ? 'get' : 'hit';
    const count = key => fetch(`${api}/${op}/${ns}/${key}`)
      .then(r => r.ok ? r.json() : { value: 0 }).then(d => d.value || 0).catch(() => null);
    Promise.all([count('d' + day), count('total')]).then(([today, total]) => {
      if (total === null) return;
      visits.textContent = `Today ${today || 0} · Total ${total}`;
      try { sessionStorage.setItem('counted', '1'); } catch (e) {}
    });
  }

  // 사진첩 크게 보기
  const lb = document.getElementById('lightbox');
  if (lb) {
    const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
    document.querySelectorAll('.shot button').forEach(b => b.addEventListener('click', () => {
      img.src = b.dataset.src;
      cap.textContent = b.parentElement.querySelector('figcaption')?.textContent || '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    }));
    lb.addEventListener('click', e => { if (e.target !== img) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
