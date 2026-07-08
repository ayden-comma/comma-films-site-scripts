/* ============================================================
   Comma Films — home-new media engine v4
   v4 changes:
   - Fixes gallery only showing 2 slides with dead arrows: strips stale Splide
     init classes so the slider actually mounts (was silently no-opping on an
     already-"initialized" root); targets the gallery slider specifically, not
     the 21 leftover team sliders; builds a fresh track/list skeleton if absent.
   ---- v3 changes:
   - GALLERY REBUILD. Reads a per-case-study [cf-gallery-data] text field
     (lines of "type :: id-or-url :: caption"), builds unlimited mixed
     image/vimeo/youtube slides into the existing Splide track, replacing
     the old 5-item nested collection list. Thumbnails auto-pulled:
     youtube = static img URL; vimeo = api.vimeo.com/oembed (cached in
     sessionStorage). Malformed lines skipped with a console.warn.
   - Hides the raw [cf-gallery-data] source node and the legacy nested list.
   ---- (v2 changelog below) ----
   Comma Films — home-new media engine v2
   v2 changes:
   - Hero cover is now the POSTER IMAGE (not looping video). Falls back
     to the tile video's first frame when the poster is the "...Soon..."
     placeholder, so The Show doesn't show a "coming soon" graphic.
   - Mobile: nav suppressed (display:none) while a popup is open, and the
     close cross elevated above the nav's stacking context, fixing the
     unclickable-X and cut-off-hero-top on deep-link load.
   ---- (v1 baseline below) ----
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
  /* rebuilt gallery (v3) */
  [cf-gallery-data]{display:none!important}
  .cf-gal-slide{position:relative;overflow:hidden;background:#111;border-radius:10px;aspect-ratio:16/9}
  .cf-gal-slide img.cf-gal-thumb{width:100%;height:100%;object-fit:cover;display:block}
  .cf-gal-slide .cf-gal-play{position:absolute;inset:0;margin:auto;width:56px;height:56px;border-radius:50%;background:rgba(12,12,14,.55);border:1px solid #ffffff42;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2}
  .cf-gal-slide .cf-gal-play:after{content:"";margin-left:3px;border-style:solid;border-width:9px 0 9px 15px;border-color:transparent transparent transparent #fff}
  .cf-gal-slide.is-media{cursor:pointer}
  .cf-gal-slide .cf-gal-cap{position:absolute;left:0;right:0;bottom:0;padding:14px 16px;font-family:"Barlow Condensed",sans-serif;letter-spacing:.02em;color:#f2ede6;font-size:.95rem;background:linear-gradient(to top,rgba(0,0,0,.72),transparent);z-index:3}
  .cf-gallery-built .story_slider-wrap-main > .w-dyn-list{display:none!important}
  .story_cross-wrap{z-index:2147483000}
  /* popup must beat a sticky nav (nav z-index:99) at all times */
  .story_item-popup{z-index:100000!important}
  /* while a popup is open, kill the sticky nav so it can't overlay the hero */
  html.cf-popup-open .header,html.cf-popup-open nav.header,
  body.cf-popup-open .header,body.cf-popup-open nav.header{display:none!important}
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
    /* popup scrolls internally; start below the safe-area, hero not clipped */
    .cf-popup-open .story_item-popup{padding-top:max(8px,env(safe-area-inset-top))}
    .story_item-pop-content{margin-top:0}
    .cf-popup-open .story_cross-wrap{display:flex!important;opacity:1;visibility:visible;pointer-events:auto;position:fixed;top:max(12px,env(safe-area-inset-top));right:14px;z-index:2147483647;transform:none}
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

  // Cover = STILL poster image. If the poster is the "...Soon..." placeholder
  // (or missing), fall back to a frozen first frame of the tile video so the
  // hero never shows a "coming soon" graphic while Vimeo loads.
  const isPlaceholder = src => !src || /soon/i.test(src.split('/').pop().split('?')[0]);
  const ensureCover = (wrap, m) => {
    let cover = wrap.querySelector('.cf-cover');
    if (cover) return cover;
    const slug = slugOf(m);
    const trigger = document.querySelector(`[cms-modal-trigger="${esc(slug)}"]`);
    const ti = trigger && trigger.querySelector('img');
    const tv = trigger && trigger.querySelector('video');
    const posterSrc = ti && (ti.currentSrc || ti.src);

    if (posterSrc && !isPlaceholder(posterSrc)) {
      cover = document.createElement('img');
      cover.className = 'cf-cover';
      cover.src = posterSrc;
    } else if (tv) {
      // frozen first frame: clone the video, no autoplay/loop, hold at t=0
      cover = tv.cloneNode(true);
      cover.className = 'cf-cover';
      cover.removeAttribute('autoplay'); cover.autoplay = false;
      cover.muted = true; cover.loop = false; cover.playsInline = true;
      cover.removeAttribute('controls');
      restoreVideo(cover);
      cover.addEventListener('loadeddata', () => { try { cover.currentTime = 0.05; cover.pause(); } catch (e) {} });
    } else if (posterSrc) {
      cover = document.createElement('img');
      cover.className = 'cf-cover';
      cover.src = posterSrc;
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
    wrap.querySelectorAll('.cf-cover').forEach(c => { c.classList.remove('is-hidden'); if (c.tagName === 'VIDEO') { try { c.pause(); c.currentTime = 0.05; } catch (e) {} } });
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
    if (!id) { // no Vimeo mapped: freeze the cover as the hero still, no spinner
      spin.classList.add('is-hidden');
      return;
    }
    spin.classList.remove('is-hidden');
    if (cover) cover.classList.remove('is-hidden');
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

  // ---- parse "type :: id-or-url :: caption" lines ----
  const parseGallery = raw => {
    if (!raw) return [];
    return raw.split(/\r?\n/).map(line => {
      const t = line.trim();
      if (!t) return null;
      const parts = t.split(' :: ');
      if (parts.length < 2) { console.warn('[cf-gallery] skipped (need "type :: id :: caption"):', t); return null; }
      const type = parts[0].trim().toLowerCase();
      const ref = parts[1].trim();
      const caption = (parts.slice(2).join(' :: ') || '').trim();
      if (!['image', 'vimeo', 'youtube'].includes(type)) { console.warn('[cf-gallery] skipped (unknown type "' + type + '"):', t); return null; }
      if (!ref) { console.warn('[cf-gallery] skipped (no id/url):', t); return null; }
      return { type, ref, caption };
    }).filter(Boolean);
  };

  // ---- thumbnails ----
  const ytThumb = id => 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  const vimeoThumb = id => {
    const key = 'cfvt_' + id;
    try { const c = sessionStorage.getItem(key); if (c) return Promise.resolve(c); } catch (e) {}
    return fetch('https://vimeo.com/api/oembed.json?url=' + encodeURIComponent('https://vimeo.com/' + id))
      .then(r => r.json())
      .then(d => { const u = (d && d.thumbnail_url) ? d.thumbnail_url.replace(/_\d+x\d+/, '_960') : ''; try { if (u) sessionStorage.setItem(key, u); } catch (e) {} return u; })
      .catch(() => '');
  };

  // ---- build slides into an existing Splide root ----
  const buildGallery = (splideRoot, items) => {
    const list = splideRoot.querySelector('.splide__list');
    if (!list) return;
    list.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'splide__slide';
      const slide = document.createElement('div');
      slide.className = 'cf-gal-slide' + (it.type !== 'image' ? ' is-media' : '');
      const img = document.createElement('img');
      img.className = 'cf-gal-thumb'; img.loading = 'lazy'; img.alt = it.caption || '';
      slide.appendChild(img);
      if (it.type === 'image') { img.src = it.ref; }
      else if (it.type === 'youtube') {
        img.src = ytThumb(it.ref);
        slide.dataset.mediaType = 'youtube'; slide.dataset.mediaId = it.ref;
        const p = document.createElement('div'); p.className = 'cf-gal-play'; slide.appendChild(p);
      } else if (it.type === 'vimeo') {
        slide.dataset.mediaType = 'vimeo'; slide.dataset.mediaId = it.ref;
        const p = document.createElement('div'); p.className = 'cf-gal-play'; slide.appendChild(p);
        Promise.resolve(vimeoThumb(it.ref)).then(u => { if (u) img.src = u; });
      }
      if (it.caption) { const c = document.createElement('div'); c.className = 'cf-gal-cap'; c.textContent = it.caption; slide.appendChild(c); }
      li.appendChild(slide);
      list.appendChild(li);
    });
  };

  const mountSplide = (el, count) => {
    if (!window.Splide || !el) return;
    if (sliders.has(el)) { try { sliders.get(el).destroy(true); } catch (e) {} sliders.delete(el); }
    // Clear stale Splide state so a fresh instance actually initializes.
    // (Leftover is-initialized/is-active + splide--* classes make new Splide() no-op.)
    el.classList.forEach(c => { if (c.startsWith('splide--') || c === 'is-active' || c === 'is-initialized') el.classList.remove(c); });
    if (!el.classList.contains('splide')) el.classList.add('splide');
    try { delete el.splide; } catch (e) {}
    const sp = new Splide(el, {
      type: 'slide', rewind: true, perPage: 2, perMove: 1, focus: 0, gap: '14px',
      arrows: true, pagination: false, speed: 500, drag: true, trimSpace: false,
      breakpoints: { 767: { perPage: 1 } }
    });
    try { sp.mount(); sliders.set(el, sp); }
    catch (e) { console.warn('[cf-gallery] splide mount failed:', e && e.message); }
  };

  // Build the gallery for whichever modal is open, from its [cf-gallery-data].
  const buildVisibleGallery = () => {
    const m = activeModal();
    if (!m) return;
    const dataEl = m.querySelector('[cf-gallery-data]');
    const items = parseGallery(dataEl ? dataEl.textContent : '');
    // Target ONLY the gallery slider (inside story_slider-wrap-main), never the
    // 21 leftover team sliders elsewhere in the popup.
    const wrap = m.querySelector('.story_slider-wrap-main');
    const splideRoot = wrap ? (wrap.querySelector('.splide') || wrap) : null;
    if (!splideRoot) { console.warn('[cf-gallery] no slider wrap for', slugOf(m)); return; }
    if (!items.length) { console.warn('[cf-gallery] no valid items for', slugOf(m)); return; }
    // Ensure the required Splide skeleton exists (track/list) before building.
    if (!splideRoot.querySelector('.splide__track')) {
      const tr = document.createElement('div'); tr.className = 'splide__track';
      const ul = document.createElement('ul'); ul.className = 'splide__list';
      tr.appendChild(ul); splideRoot.innerHTML = ''; splideRoot.appendChild(tr);
    }
    buildGallery(splideRoot, items);
    m.classList.add('cf-gallery-built');
    wrap.classList.add('cf-gallery-built');
    mountSplide(splideRoot, items.length);
  };
  const initVisibleSliders = buildVisibleGallery;

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

    // rebuilt gallery: a media slide -> open dialog (vimeo or youtube)
    const slide = e.target.closest('.cf-gal-slide.is-media');
    if (slide) {
      e.preventDefault(); e.stopImmediatePropagation();
      const cur = activeModal();
      if (cur) { const hf = cur.querySelector('iframe.cf-hero'); if (hf && hf.contentWindow) { try { hf.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*'); } catch (x) {} } }
      openDialog(slide.dataset.mediaType, slide.dataset.mediaId);
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
  function openDialog(type, id) {
    closeDialog();
    const d = document.createElement('div'), b = document.createElement('div'), x = document.createElement('button'), f = document.createElement('iframe');
    d.className = 'csvd'; b.className = 'csvd_b'; x.className = 'csvd_x'; x.ariaLabel = 'Close video';
    f.src = (type === 'youtube')
      ? 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0'
      : 'https://player.vimeo.com/video/' + id + '?autoplay=1&title=0&byline=0&portrait=0';
    f.setAttribute('frameborder', '0');
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
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
