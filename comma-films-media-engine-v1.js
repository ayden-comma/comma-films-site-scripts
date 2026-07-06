/* ============================================================
   Comma Films — home-new media engine v1
   Replaces (subsumes): client_pdf_fixes_v14, case_study_slider_video_dialog_v2,
   home_new_modal_url_sync_v3, home_new_layer_bts_fix_v1,
   home_new_mobile_perf_close_fix_v2, home_new_desktop_hover_video_fix_v1,
   inline Block 7 (modal engine), inline Block 5 (stat suffix, 21x),
   and the interim playback governor.
   NOT included: home_new_nav_fix_v1 (staging shim — delete at promotion,
   fix nav links in the Designer instead).
   Load: single <script src> at end of <body> on /home-new,
   AFTER the Splide CDN tag.
   ============================================================ */
(() => {
  'use strict';
  // Feature-detect rather than path-match, so this survives the
  // home-new -> home promotion without edits.
  if (!document.querySelector('[cms-modal-target]')) return;

  /* ---------------- Vimeo ID map (from CMS slugs) ---------------- */
  const vimeoMap = {
    "autobarn": "1101115914", "the-show": "1145838715", "borgs-pastry": "1106985002",
    "reddy-express": "1099887039", "haymes-paint": "1114769696", "rsl-victoria-2": "819376595",
    "mr-chens": "848968454", "mazda-2": "602965984", "gate-8": "1007572384",
    "reddy-express-coles-express-2": "988271619", "reddy-express-coles-express": "1029045473",
    "rsl-victoria": "878166118", "bare": "819754038", "sockdaily": "848967532",
    "mazda": "846832580", "suma-nurica": "819376788", "jed": "602967122",
    "flitcraft": "848624080", "the-kids-cancer-project": "819371464", "nissan": "848984061"
  };

  const MODAL = '[cms-modal-target]';
  const TRIGGER = '[cms-modal-trigger]';
  const POPUP = '.story_item-popup';
  const esc = s => (window.CSS && CSS.escape) ? CSS.escape(s) : String(s).replace(/"/g, '\\"');
  const isDesktop = matchMedia('(min-width:768px)');

  /* ---------------- All CSS in one injected block ----------------
     Merged from: v14 layout css, layer_bts_fix, mobile_perf css,
     desktop_hover css, csvd dialog css, spinner/cover css. */
  const css = `
  /* tiles */
  .work-item.new-des{position:relative;overflow:hidden;background:#000}
  .work-item.new-des:after{content:"";position:absolute;left:0;right:0;bottom:0;height:56%;z-index:2;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.84),rgba(0,0,0,.46) 44%,rgba(0,0,0,0))}
  .work-item.new-des .card-overly{z-index:1;pointer-events:none}
  .work-item.new-des .work-text.new{position:absolute;left:20px;right:20px;width:auto;max-width:calc(100% - 40px);z-index:20;overflow:visible;white-space:normal}
  .work-item.new-des .layout4_heading,.work-item.new-des .layout4_description-short{position:relative;z-index:21;white-space:normal}
  @media(min-width:768px){
    .work-item.new-des video.video-bg{display:block;visibility:visible;opacity:0;z-index:3;pointer-events:none;transition:opacity .18s ease}
    .work-item.new-des img.reel{display:block;visibility:visible;opacity:1;z-index:4;transition:opacity .18s ease}
    .work-item.new-des.is-video-hover video.video-bg{opacity:1}
    .work-item.new-des.is-video-hover img.reel{opacity:0}
  }
  @media(max-width:767px){
    .work-item.new-des video.video-bg{display:none!important}
    .work-item.new-des img.reel{display:block;opacity:1;visibility:visible}
  }
  /* popup hero */
  .story_item-pop-content .story_video-wrap,.story_item-pop-content .case-study_video{width:100%;display:block;background:#000;overflow:hidden;aspect-ratio:16/9;height:auto;position:relative;padding-top:0}
  .story_item-pop-content .story_video-wrap iframe,.story_item-pop-content .case-study_video iframe,
  .story_item-pop-content .story_video-wrap video,.story_item-pop-content .case-study_video video{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover;background:#000}
  .cf-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:50;opacity:1;transition:opacity .45s ease;pointer-events:none}
  .cf-cover.is-hidden{opacity:0}
  .cf-spin{position:absolute;inset:0;margin:auto;width:44px;height:44px;border:3px solid rgba(255,255,255,.15);border-top-color:#fff;border-radius:50%;animation:cfspin .8s linear infinite;z-index:100;pointer-events:none;transition:opacity .3s ease}
  .cf-spin.is-hidden{opacity:0}
  @keyframes cfspin{to{transform:rotate(360deg)}}
  .story_cross-wrap{z-index:60}
  /* gallery slider: only active slide visible/interactive */
  .story_slider-wrap-main,.story_slider-wrap-main .splide,.story_slider-wrap-main .splide__track{isolation:isolate}
  .story_slider-wrap-main .splide__track{overflow:hidden}
  .story_slider-wrap-main .splide__slide{pointer-events:none}
  .story_slider-wrap-main .splide__slide:not(.is-active){opacity:0;visibility:hidden}
  .story_slider-wrap-main .splide__slide.is-active{opacity:1;visibility:visible;pointer-events:auto;z-index:2}
  .story_slider-wrap-main .slider_lightbox{pointer-events:auto}
  .story_slider-wrap-main .gallery-text{z-index:30;pointer-events:none}
  /* vimeo dialog (csvd) */
  .csvd{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:5vw}
  .csvd_b{width:min(75rem,92vw);aspect-ratio:16/9;background:#000;position:relative}
  .csvd iframe{position:absolute;inset:0;width:100%;height:100%}
  .csvd_x{position:fixed;top:28px;right:32px;width:44px;height:44px;border-radius:50%;border:1px solid #ffffff38;background:#0c0c0e6b;cursor:pointer}
  .csvd_x:before,.csvd_x:after{content:"";position:absolute;left:13px;top:21px;width:18px;height:2px;background:#fff;border-radius:2px}
  .csvd_x:before{transform:rotate(45deg)}.csvd_x:after{transform:rotate(-45deg)}
  /* mobile popup chrome */
  @media(max-width:767px){
    .cf-popup-open .header,.cf-popup-open nav.header{pointer-events:none}
    .cf-popup-open .story_cross-wrap{display:flex!important;opacity:1;visibility:visible;pointer-events:auto;position:fixed;top:max(16px,env(safe-area-inset-top));right:16px;z-index:2147483647;transform:none}
  }`;
  const styleEl = document.createElement('style');
  styleEl.id = 'cf-media-engine';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------------- helpers ---------------- */
  const modalList = () => [...document.querySelectorAll(MODAL)];
  const isOpen = m => {
    if (!m) return false;
    const p = m.closest(POPUP);
    if (p && getComputedStyle(p).display === 'none') return false;
    return getComputedStyle(m).display !== 'none';
  };
  const activeModal = () => modalList().find(isOpen);
  const slugOf = m => (m.getAttribute('cms-modal-target') || '').trim();

  const stripVideo = v => {
    try {
      let ch = false;
      if (v.getAttribute('src')) { v.dataset.src = v.getAttribute('src'); v.removeAttribute('src'); ch = true; }
      v.querySelectorAll('source').forEach(s => { if (s.getAttribute('src')) { s.dataset.src = s.getAttribute('src'); s.removeAttribute('src'); ch = true; } });
      if (ch) { v.removeAttribute('autoplay'); v.pause(); v.load(); }
    } catch (e) {}
  };
  const restoreVideo = v => {
    try {
      let ch = false;
      if (!v.getAttribute('src') && v.dataset.src) { v.setAttribute('src', v.dataset.src); ch = true; }
      v.querySelectorAll('source').forEach(s => { if (!s.getAttribute('src') && s.dataset.src) { s.setAttribute('src', s.dataset.src); ch = true; } });
      v.muted = true; v.loop = true; v.playsInline = true; v.controls = false;
      if (ch) { try { v.load(); } catch (e) {} }
    } catch (e) {}
  };

  /* ---------------- popup hero: direct Vimeo, muted autoplay ----------------
     Fixes the eternal-spinner bug: (a) autoplay MUTED so Chrome allows it,
     controls stay on so the viewer unmutes with one click; (b) cover/spinner
     lift on iframe LOAD as a fallback, not only on the 'playing' event. */
  const heroWrap = m => m.querySelector('.case-study_video') || m.querySelector('.story_video-wrap');

  const ensureCover = (wrap, m) => {
    let cover = wrap.querySelector('.cf-cover');
    if (cover) return cover;
    const slug = slugOf(m);
    const trigger = document.querySelector(`[cms-modal-trigger="${esc(slug)}"]`);
    const tv = trigger && trigger.querySelector('video');
    const ti = trigger && trigger.querySelector('img');
    if (tv) {
      cover = tv.cloneNode(true);
      cover.className = 'cf-cover';
      cover.muted = true; cover.loop = true; cover.playsInline = true; cover.autoplay = true;
      cover.removeAttribute('controls');
    } else if (ti && ti.src) {
      cover = document.createElement('img');
      cover.className = 'cf-cover';
      cover.src = ti.src;
    } else return null;
    wrap.appendChild(cover);
    return cover;
  };
  const ensureSpinner = wrap => {
    let s = wrap.querySelector('.cf-spin');
    if (!s) { s = document.createElement('div'); s.className = 'cf-spin'; wrap.appendChild(s); }
    return s;
  };
  const lift = wrap => {
    wrap.querySelectorAll('.cf-spin').forEach(s => s.classList.add('is-hidden'));
    wrap.querySelectorAll('.cf-cover').forEach(c => { c.classList.add('is-hidden'); if (c.tagName === 'VIDEO') { try { c.pause(); } catch (e) {} } });
  };
  const drop = wrap => {
    wrap.querySelectorAll('.cf-spin').forEach(s => s.classList.add('is-hidden'));
    wrap.querySelectorAll('.cf-cover').forEach(c => { c.classList.remove('is-hidden'); if (c.tagName === 'VIDEO') { try { c.play().catch(() => {}); } catch (e) {} } });
  };

  const mountHero = m => {
    const wrap = heroWrap(m);
    if (!wrap) return;
    wrap.style.paddingTop = '56.25%';
    // Remove any legacy Webflow/Embedly iframe so ours is the only player
    wrap.querySelectorAll('iframe:not(.cf-hero)').forEach(f => f.remove());
    const id = vimeoMap[slugOf(m)];
    const cover = ensureCover(wrap, m);
    const spin = ensureSpinner(wrap);
    if (!id) { // no Vimeo mapped: cover video IS the hero, no spinner
      spin.classList.add('is-hidden');
      if (cover && cover.tagName === 'VIDEO') cover.play().catch(() => {});
      return;
    }
    spin.classList.remove('is-hidden');
    if (cover) { cover.classList.remove('is-hidden'); if (cover.tagName === 'VIDEO') cover.play().catch(() => {}); }
    let f = wrap.querySelector('iframe.cf-hero');
    if (!f) {
      f = document.createElement('iframe');
      f.className = 'cf-hero';
      f.setAttribute('frameborder', '0');
      f.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; encrypted-media');
      f.allowFullscreen = true;
      // muted=1 => autoplay actually permitted; controls=1 => viewer unmutes
      f.src = `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&controls=1&playsinline=1&api=1&autopause=0`;
      f.addEventListener('load', () => setTimeout(() => lift(wrap), 600)); // fallback lift
      wrap.appendChild(f);
    }
  };
  const unmountHero = m => {
    const wrap = heroWrap(m);
    if (!wrap) return;
    const f = wrap.querySelector('iframe.cf-hero');
    if (f) { try { f.contentWindow && f.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*'); } catch (e) {} f.remove(); }
    drop(wrap);
    wrap.querySelectorAll('.cf-cover').forEach(c => { if (c.tagName === 'VIDEO') { try { c.pause(); } catch (e) {} } });
  };

  // Vimeo postMessage: primary cover-lift on real playback
  window.addEventListener('message', ev => {
    let d = ev.data;
    try { if (typeof d === 'string') d = JSON.parse(d); } catch (e) { return; }
    if (!d) return;
    if (d.event === 'ready' && ev.source) {
      try {
        ev.source.postMessage(JSON.stringify({ method: 'addEventListener', value: 'playing' }), '*');
        ev.source.postMessage(JSON.stringify({ method: 'addEventListener', value: 'timeupdate' }), '*');
      } catch (e) {}
    }
    if (d.event === 'playing' || (d.event === 'timeupdate' && d.data && d.data.seconds > 0.1)) {
      document.querySelectorAll('iframe.cf-hero').forEach(f => {
        if (f.contentWindow === ev.source) {
          const wrap = f.closest('.story_video-wrap,.case-study_video');
          if (wrap) lift(wrap);
        }
      });
    }
  });

  /* ---------------- gallery sliders (Splide) ----------------
     type:'slide' — no clones, so no duplicate videos. rewind gives
     the same wraparound feel loop mode provided. */
  const sliders = new Map();
  const initSlider = el => {
    if (!window.Splide || !el || sliders.has(el)) { const s = sliders.get(el); if (s) { try { s.refresh(); } catch (e) {} } return; }
    const sp = new Splide(el, {
      type: 'slide', rewind: true, perPage: 2, perMove: 1, focus: 0, gap: '14px',
      arrows: true, pagination: false, speed: 500, drag: true, trimSpace: false,
      breakpoints: { 991: { perPage: 2 }, 767: { perPage: 1 } }
    });
    const syncSlideMedia = () => {
      el.querySelectorAll('.splide__slide').forEach(sl => {
        const v = sl.querySelector('video');
        if (!v) return;
        if (sl.classList.contains('is-active') && isDesktop.matches) { restoreVideo(v); v.play().catch(() => {}); }
        else { try { v.pause(); } catch (e) {} }
      });
    };
    sp.on('mounted moved', syncSlideMedia);
    sp.mount();
    sliders.set(el, sp);
    syncSlideMedia();
  };
  const initVisibleSliders = () => document.querySelectorAll(POPUP + ' .splide').forEach(initSlider);

  /* ---------------- modal engine (from Block 7, kept) ---------------- */
  const lockBody = on => {
    document.documentElement.style.overflow = on ? 'hidden' : '';
    document.body.style.overflow = on ? 'hidden' : '';
    document.documentElement.classList.toggle('locked', on);
    document.documentElement.classList.toggle('cf-popup-open', on);
    document.body.classList.toggle('cf-popup-open', on);
  };

  const setURL = slug => {
    const base = location.pathname;
    const u = slug ? base + '?work=' + encodeURIComponent(slug) : base;
    if (location.pathname + location.search !== u) history.replaceState(history.state, '', u);
  };

  const showModal = m => {
    if (!m) return;
    modalList().forEach(x => {
      if (x !== m && isOpen(x)) unmountHero(x);
      x.style.display = 'none';
    });
    m.style.display = 'block';
    const p = m.closest(POPUP) || document.querySelector(POPUP);
    if (p) { p.style.display = 'flex'; p.scrollTop = 0; }
    lockBody(true);
    setURL(slugOf(m));
    mountHero(m);
    setTimeout(initVisibleSliders, 120);
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  };

  const closePopup = () => {
    modalList().forEach(m => { if (isOpen(m)) unmountHero(m); m.style.display = 'none'; });
    const p = document.querySelector(POPUP);
    if (p) p.style.display = 'none';
    document.querySelectorAll(POPUP + ' video').forEach(v => { try { v.pause(); } catch (e) {} });
    lockBody(false);
    setURL('');
  };

  const openBySlug = slug => {
    const m = document.querySelector(`[cms-modal-target="${esc(slug)}"]`);
    if (m) { showModal(m); return true; }
    return false;
  };

  /* nav titles for prev/next (from Block 7) */
  const setupNavTitles = () => {
    const ms = modalList();
    const titleOf = m => ((m.querySelector('.story_heading,.story_title,h1,h2,.heading-style-h2') || {}).textContent || '').trim();
    ms.forEach((m, i) => {
      const nt = titleOf(ms[(i + 1) % ms.length]);
      const pt = titleOf(ms[(i - 1 + ms.length) % ms.length]);
      if (nt) m.querySelectorAll('.story_nav-title-next').forEach(e => e.textContent = nt);
      if (pt) m.querySelectorAll('.story_nav-title-prev').forEach(e => e.textContent = pt);
    });
  };

  /* ---------------- clicks / keys ---------------- */
  document.addEventListener('click', e => {
    if (!e.target || !e.target.closest) return;

    const trigger = e.target.closest(TRIGGER);
    if (trigger) { e.preventDefault(); openBySlug(trigger.getAttribute('cms-modal-trigger')); return; }

    const next = e.target.closest('.modal-next-btn'), prev = e.target.closest('.modal-prev-btn');
    if (next || prev) {
      const ms = modalList(), cur = activeModal(), i = ms.indexOf(cur);
      if (i >= 0) { e.preventDefault(); showModal(ms[next ? (i + 1) % ms.length : (i - 1 + ms.length) % ms.length]); }
      return;
    }

    // gallery video slide -> direct Vimeo dialog (from csvd)
    const lb = e.target.closest('.story_item-pop-content .slider-video-wrapper a.w-lightbox');
    if (lb) {
      let o; const j = lb.querySelector('.w-json');
      try { o = JSON.parse(j.textContent); } catch (x) {}
      const it = o && o.items && o.items[0];
      const idm = ((it && (it.url || it.originalUrl || it.html)) || '').match(/vimeo\.com\/(\d+)/);
      if (idm) {
        e.preventDefault(); e.stopImmediatePropagation();
        const w = lb.closest('.slider-video-wrapper');
        if (w) { const v = w.querySelector('video'); if (v) { try { v.pause(); } catch (x) {} } }
        // pause hero while dialog is up
        const cur = activeModal();
        if (cur) { const hf = cur.querySelector('iframe.cf-hero'); if (hf && hf.contentWindow) { try { hf.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*'); } catch (x) {} } }
        openDialog(idm[1]);
      }
      return;
    }

    const backdrop = e.target.closest(POPUP);
    if (backdrop && !e.target.closest('.story_item-pop-content')) { closePopup(); return; }
    if (e.target.closest('.story_cross-wrap') || e.target.closest('[aria-label="Close"]')) closePopup();
  }, true);

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.querySelector('.csvd')) { closeDialog(); return; }
    closePopup();
  });

  /* csvd dialog */
  function closeDialog() { const d = document.querySelector('.csvd'); if (d) d.remove(); }
  function openDialog(id) {
    closeDialog();
    const d = document.createElement('div'), b = document.createElement('div'), x = document.createElement('button'), f = document.createElement('iframe');
    d.className = 'csvd'; b.className = 'csvd_b'; x.className = 'csvd_x'; x.ariaLabel = 'Close video';
    f.src = 'https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0';
    f.setAttribute('frameborder', '0');
    f.allow = 'autoplay; fullscreen; picture-in-picture';
    f.allowFullscreen = true;
    b.appendChild(f); d.append(x, b);
    d.onclick = e => { if (e.target === d || e.target.closest('.csvd_x')) closeDialog(); };
    document.body.appendChild(d);
  }

  /* ---------------- tiles: desktop hover-to-play, mobile unloaded ---------------- */
  const tileVideo = card => card.querySelector('video.video-bg');
  document.addEventListener('pointerenter', e => {
    if (!isDesktop.matches || !e.target || !e.target.closest) return;
    const card = e.target.closest('.work-item.new-des');
    if (!card) return;
    const v = tileVideo(card);
    if (!v) return;
    card.classList.add('is-video-hover');
    restoreVideo(v);
    v.play().catch(() => {});
  }, true);
  document.addEventListener('pointerleave', e => {
    if (!e.target || !e.target.closest) return;
    const card = e.target.closest('.work-item.new-des');
    if (!card) return;
    card.classList.remove('is-video-hover');
    const v = tileVideo(card);
    if (v) { try { v.pause(); v.currentTime = 0; } catch (x) {} }
  }, true);

  /* ---------------- stat suffix (was Block 5 x21) ---------------- */
  const statSuffix = () => document.querySelectorAll('.story_stat-head').forEach(el => {
    const t = el.textContent.trim();
    const m = t.match(/^([+-]?\d*\.?\d+)(.*)$/);
    if (m && m[2] && !el.querySelector('.stat-suffix')) el.innerHTML = `${m[1]}<span class="stat-suffix">${m[2]}</span>`;
  });

  /* ---------------- startup ---------------- */
  const start = () => {
    // network hygiene: strip every popup video + legacy iframe up front
    document.querySelectorAll(POPUP + ' video').forEach(v => { v.preload = 'none'; stripVideo(v); });
    document.querySelectorAll(POPUP + ' iframe').forEach(f => f.remove()); // engine creates its own
    // mobile: also strip tile loop videos entirely
    if (!isDesktop.matches) document.querySelectorAll('.work-item.new-des video.video-bg').forEach(stripVideo);
    statSuffix();
    setupNavTitles();
    // deep link in
    const w = new URLSearchParams(location.search).get('work');
    if (w) setTimeout(() => openBySlug(w), 150);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
