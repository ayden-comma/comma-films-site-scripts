/* ============================================================
   Comma Films — home-new media engine v21
   v16 changes:
   - In-popup arrows repositioned to flank the strip left/right, vertically centered
     (were at top:-56px, hidden above the strip where there is no room).
   - Lightbox main image much bigger: cell 60vw->84vw, padding 20vw->8vw so peeks are
     thin slivers and the active image dominates. Added max-height:82vh so it never
     overflows the viewport.
   ---- v15 changes:
   - In-popup strip: desktop arrows restored (circular, top-right, white->red hover),
     wired to scroll the strip by one cell; trackpad/swipe scroll still works; dots stay.
     Arrows hidden on mobile (swipe+dots there).
   - Fullscreen lightbox main image +50% on desktop (cell 40vw->60vw, side padding
     30vw->20vw so peeks are thinner slivers).
   ---- v14 changes:
   - BOTH galleries (in-popup strip above credits AND fullscreen lightbox) now use
     peek + dots scroll-snap on both desktop and mobile. In-popup circular arrows removed.
   - Peek cells given a SOLID dark background (#0e0c0a) so neighbors are opaque, not
     see-through to the popup behind. Dots are clickable to jump.
   ---- v13 changes:
   - MOBILE lightbox rebuilt as Instagram-style scroll-snap strip: active item
     centered and live, neighbors peek at the edges (as thumbnails, since a live
     video iframe cannot be peeked), dots below show position + more-exist. No arrows.
     Swipe is native scroll-snap (fast). Fixes centering (pure flex, no vw calc) and
     the wasted vertical space. Desktop lightbox unchanged (arrows + one item).
   - Active-cell autoplay only on the item you first tapped; scrolling to a video
     loads it paused.
   ---- v12 changes:
   - Main popup on mobile now has a proper top gap (was flush to screen top); close
     X moved down so it clears the video controls.
   - Lightbox arrows moved from center BACK to below the media, on the caption line
     (caption centered between them), matching desktop caption position.
   - Stronger stuck-red fix: on touch, hover states forced neutral for arrows AND X;
     red only during active press.
   ---- v11 changes:
   - Mobile lightbox centered on the page (was top-aligned/loading too high); X
     stays pinned top-right and clears the media. Arrows flank the centered media.
   - Fixed sticky-red button on touch: hover states disabled on @media(hover:none),
     red only shows on :active (actual press), not stuck after a tap.
   - (Desktop caption font already Hanken Grotesk from v9 - confirmed live, no change.)
   ---- v10 changes:
   - Fixed red-BAR bug: hover override now scoped to .splide__arrow--prev/--next
     buttons only, never the full-width .splide__arrows container.
   - All buttons (lightbox X, lightbox arrows, thumbnail-strip arrows): white icon
     at rest -> hover fills red + icon goes black; X also rotates 90deg (ref .lb-close).
   - Mobile: lightbox arrows moved from screen-bottom to just below the media, on the
     caption line. Swipe made responsive (fires on touchmove, threshold 35px, plus a
     transparent swipe-catcher over the video iframe so touches are not swallowed).
   ---- v9 changes:
   - Gallery captions + lightbox caption now Hanken Grotesk 14.5px/400 (matches credit names).
   - All button hovers use title red rgb(232,90,79): lightbox arrows AND the
     thumbnail-strip circular arrows (Webflow override). Lightbox arrows are red chevrons.
   - Mobile: swipe left/right steps through lightbox items; arrows moved to bottom.
   ---- v8 changes:
   - Lightbox X + outside-click now close ONLY the lightbox, returning to the
     open popup (was closing the whole popup - capture-phase handler bug).
   - Lightbox steps through the whole gallery (mixed image/video) via arrows or
     Left/Right keys, with a caption + "n / total" counter.
   - Autoplay rule: only the item you CLICK autoplays; any video you arrive at by
     stepping loads paused. Images never autoplay (nothing to play).
   ---- v7 changes:
   - Images now open in the lightbox dialog (fitted to natural aspect, not forced 16:9).
   - Hover zoom+brightness lift now on ALL slides incl. images (images get no play
     button - a play triangle on a still would mislead; they get pointer cursor).
   - Per-slide bottom vignette matched to the home-tile gradient (in front of thumb,
     behind caption) so captions pop.
   ---- v6 changes:
   - Reuses the existing circular popup arrows (.splide__arrow--prev/--next)
     to drive the stepper, instead of injecting custom nav buttons. Keeps the
     look you already had. No longer clears the whole wrap (that was deleting
     the arrows); only rebuilds the media track.
   ---- v5 changes:
   - Gallery rebuilt as a transform-stepper ported from the case-study mockup
     (drops Splide entirely, which kept failing to mount). Flex track + translateX,
     cloned slides for infinite 2-up wrap, swipe. Bottom vignette on captions.
     Captions use Red Hat Display to match the popup.
   ---- v4 changes:
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
  .work-item.new-des:after{content:"";position:absolute;left:0;right:0;bottom:0;height:56%;z-index:5;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.84),rgba(0,0,0,.46) 44%,rgba(0,0,0,0))}
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
  /* ===== gallery (v17: transform-stepper, seamless loop, ported from mockup) ===== */
  [cf-gallery-data]{display:none!important}
  .cf-gal{position:relative;margin-top:8px}
  .cf-gal-vp{overflow:hidden}
  .cf-gal-track{display:flex;gap:14px;will-change:transform;padding:0 12%}
  @media(max-width:600px){.cf-gal-track{padding:0 4%}}
  .cf-gal-cell{flex:0 0 67%;position:relative;aspect-ratio:16/9;border-radius:10px;overflow:hidden;background:#000;border:1px solid #ffffff14;cursor:pointer;opacity:.55;transition:opacity .35s cubic-bezier(.22,.61,.36,1)}
  @media(max-width:600px){.cf-gal-cell{flex:0 0 90%}}
  .cf-gal-cell.is-active{opacity:1}
  .cf-gal-cell img.cf-gal-thumb{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.9);transition:transform .8s cubic-bezier(.22,.61,.36,1),filter .55s}
  .cf-gal-cell.cf-portrait img.cf-gal-thumb{object-fit:contain}
  .cf-gal-cell:hover img.cf-gal-thumb{transform:scale(1.03);filter:brightness(1)}
  .cf-gal-cell:after{content:"";position:absolute;left:0;right:0;bottom:0;height:56%;z-index:1;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.84),rgba(0,0,0,.46) 44%,rgba(0,0,0,0))}
  .cf-gal-cell .cf-gal-play{position:absolute;inset:0;margin:auto;width:56px;height:56px;border-radius:50%;background:rgba(12,12,14,.5);border:1px solid #ffffff42;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2;opacity:.85;transition:opacity .3s,transform .3s}
  .cf-gal-cell:hover .cf-gal-play{opacity:1;transform:scale(1.06)}
  .cf-gal-cell .cf-gal-play:after{content:"";margin-left:3px;border-style:solid;border-width:9px 0 9px 15px;border-color:transparent transparent transparent #fff}
  .cf-gal-cell .cf-gal-cap{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:30px 16px 13px;font-family:"Hanken Grotesk",sans-serif;font-size:14.5px;font-weight:400;color:rgb(243,239,230)}
  .cf-gal-arrow{position:absolute;top:calc(50% - 22px);width:44px;height:44px;border-radius:50%;border:1px solid #ffffff2e;background:rgba(20,18,16,.75);cursor:pointer;display:grid;place-items:center;z-index:20;transition:background .25s,border-color .25s,opacity .25s}
  .cf-gal-arrow svg{width:18px;height:18px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:stroke .25s}
  .cf-gal-arrow:hover{background:rgb(232,90,79);border-color:rgb(232,90,79)}
  .cf-gal-arrow:hover svg{stroke:#000}
  .cf-gal-arrow-prev{left:8px}.cf-gal-arrow-next{right:8px}
  @media(max-width:600px){.cf-gal-arrow{display:none}}
  .cf-gal-dots{display:flex;justify-content:center;gap:7px;margin-top:16px}
  .cf-gal-dot{width:7px;height:7px;border-radius:50%;background:#ffffff40;cursor:pointer;transition:background .25s,transform .25s}
  .cf-gal-dot.is-active{background:rgb(232,90,79);transform:scale(1.25)}
  .cf-gallery-built .story_slider-wrap-main .splide,.cf-gallery-built .story_slider-wrap-main .splide__list,.cf-gallery-built .story_slider-wrap-main .splide__track{display:none!important}
  .story_cross-wrap{z-index:2147483000}
  .story_item-popup{z-index:100000!important}
  html.cf-popup-open .header,html.cf-popup-open nav.header,
  body.cf-popup-open .header,body.cf-popup-open nav.header{display:none!important}
  /* ===== lightbox (v17) ===== */
  .csvd{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.9);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0}
  .csvd_x{position:fixed;top:24px;right:28px;width:44px;height:44px;border-radius:50%;border:1px solid #ffffff2e;background:rgba(11,11,12,.7);cursor:pointer;z-index:1000001;transition:background .25s,transform .25s cubic-bezier(.22,.61,.36,1),border-color .25s}
  .csvd_x:before,.csvd_x:after{content:"";position:absolute;left:13px;top:21px;width:18px;height:2px;background:#fff;border-radius:2px;transition:background .25s}
  .csvd_x:before{transform:rotate(45deg)}.csvd_x:after{transform:rotate(-45deg)}
  .csvd_x:hover{background:rgb(232,90,79);border-color:rgb(232,90,79);transform:rotate(90deg)}
  .csvd_x:hover:before,.csvd_x:hover:after{background:#000}
  .csvd_vp{width:100vw;overflow:hidden}
  .csvd_track{display:flex;gap:16px;padding:0 17vw;will-change:transform;align-items:center}
  @media(max-width:600px){.csvd_track{padding:0 1%}}
  .csvd_cell{flex:0 0 66vw;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:.7;transition:opacity .6s cubic-bezier(.33,1,.68,1)}
  @media(max-width:600px){.csvd_cell{flex:0 0 98vw}}
  .csvd_cell.is-live{opacity:1}
  .csvd_cell .cell-media{position:relative;display:inline-block;max-height:82vh;max-width:100%}
  @media(max-width:600px){.csvd_cell .cell-media{max-height:72vh}}
  .csvd_cell img,.csvd_cell iframe{max-width:100%;max-height:82vh;width:auto;height:auto;object-fit:contain;display:block;border-radius:12px;background:#000;filter:brightness(.55);transition:filter .6s cubic-bezier(.33,1,.68,1);border:0}
  @media(max-width:600px){.csvd_cell img,.csvd_cell iframe{max-height:72vh}}
  .csvd_cell.is-live img,.csvd_cell.is-live iframe{filter:brightness(1)}
  .csvd_cell iframe{width:80vw;height:45vw;max-width:66vw;max-height:82vh}
  @media(max-width:600px){.csvd_cell iframe{width:98vw;height:55vw;max-width:98vw}}
  .csvd_cell .cf-gal-play{position:absolute;inset:0;margin:auto;width:64px;height:64px;border-radius:50%;background:rgba(12,12,14,.5);border:1px solid #ffffff42;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2}
  .csvd_cell .cf-gal-play:after{content:"";margin-left:3px;border-style:solid;border-width:10px 0 10px 17px;border-color:transparent transparent transparent #fff}
  .csvd_cell .cell-cap{margin-top:12px;font-family:"Hanken Grotesk",sans-serif;font-size:14px;color:rgb(243,239,230);text-align:center;opacity:0;transition:opacity .4s}
  .csvd_cell.is-live .cell-cap{opacity:1}
  .csvd_nav{position:fixed;top:50%;transform:translateY(-50%);width:52px;height:52px;border-radius:50%;border:1px solid #ffffff2e;background:rgba(11,11,12,.7);cursor:pointer;display:grid;place-items:center;z-index:1000000;transition:background .25s,transform .25s,border-color .25s}
  .csvd_nav:hover{background:rgb(232,90,79);border-color:rgb(232,90,79)}
  .csvd_nav svg{width:20px;height:20px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:stroke .25s}
  .csvd_nav:hover svg{stroke:#000}
  .csvd_prev{left:24px}.csvd_next{right:24px}
  @media(max-width:600px){.csvd_nav{display:none}}
  .csvd_dots{display:flex;position:absolute;left:0;right:0;bottom:34px;justify-content:center;gap:7px;margin:0;z-index:1000000}
  .csvd_dot{width:7px;height:7px;border-radius:50%;background:#ffffff45;cursor:pointer;transition:background .25s,transform .25s}
  .csvd_dot.is-active{background:rgb(232,90,79);transform:scale(1.25)}
  .csvd_catch{display:none}
  @media(max-width:600px){.csvd_catch{display:block;position:fixed;left:0;right:0;top:12%;height:64%;z-index:999998}}
  @media(hover:none){
    .csvd_x:hover{background:rgba(11,11,12,.7)!important;border-color:#ffffff2e!important;transform:none!important}
    .csvd_x:hover:before,.csvd_x:hover:after{background:#fff!important}
    .cf-gal-dot:active,.csvd_dot:active{background:rgb(232,90,79)!important}
  }
  /* mobile popup chrome */
  @media(max-width:767px){
    .cf-popup-open .story_item-popup{padding-top:max(40px,calc(env(safe-area-inset-top) + 32px))}
    .story_item-pop-content{margin-top:0}
    .cf-popup-open .story_cross-wrap{display:flex!important;opacity:1;visibility:visible;pointer-events:auto;position:fixed;top:max(48px,calc(env(safe-area-inset-top) + 40px));right:16px;z-index:2147483647;transform:none}
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

  /* ---------------- gallery (v5): transform-stepper, no Splide ----------------
     Ported from the case-study mockup: flex track + translateX steps, cloned
     slides for infinite wrap, 2-up (1-up under 600px), swipe support. */
  const galleries = new Map(); // wrap element -> {teardown}
  let currentGalleryItems = []; // items feeding the fullscreen lightbox
  let dialogIndex = 0;          // current position in the lightbox

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

  const ytThumb = id => 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  const vimeoThumb = id => {
    const key = 'cfvt_' + id;
    try { const c = sessionStorage.getItem(key); if (c) return Promise.resolve(c); } catch (e) {}
    return fetch('https://vimeo.com/api/oembed.json?url=' + encodeURIComponent('https://vimeo.com/' + id))
      .then(r => r.json())
      .then(d => { const u = (d && d.thumbnail_url) ? d.thumbnail_url.replace(/_\d+x\d+/, '_960') : ''; try { if (u) sessionStorage.setItem(key, u); } catch (e) {} return u; })
      .catch(() => '');
  };

  // build one gallery cell (image/video thumb + play + caption)
  // tag an <img>'s cell with orientation once loaded: landscape/square fills, portrait letterboxes
  const tagOrient = (img, el) => {
    const apply = () => { if (!img.naturalWidth) return; el.classList.toggle('cf-portrait', img.naturalHeight > img.naturalWidth); el.classList.add('cf-oriented'); };
    if (img.complete && img.naturalWidth) apply(); else img.addEventListener('load', apply, { once: true });
  };

  const makeCell = (it, realI) => {
    const cell = document.createElement('div');
    cell.className = 'cf-gal-cell'; cell.dataset.real = realI;
    const img = document.createElement('img');
    img.className = 'cf-gal-thumb'; img.loading = 'lazy'; img.alt = it.caption || '';
    cell.appendChild(img);
    if (it.type === 'image') { img.src = it.ref; cell.dataset.mediaType = 'image'; cell.dataset.mediaSrc = it.ref; }
    else if (it.type === 'youtube') { img.src = ytThumb(it.ref); cell.dataset.mediaType = 'youtube'; cell.dataset.mediaId = it.ref; const p = document.createElement('div'); p.className = 'cf-gal-play'; cell.appendChild(p); }
    else if (it.type === 'vimeo') { cell.dataset.mediaType = 'vimeo'; cell.dataset.mediaId = it.ref; const p = document.createElement('div'); p.className = 'cf-gal-play'; cell.appendChild(p); Promise.resolve(vimeoThumb(it.ref)).then(u => { if (u) img.src = u; }); }
    tagOrient(img, cell);
    if (it.caption) { const c = document.createElement('div'); c.className = 'cf-gal-cap'; c.textContent = it.caption; cell.appendChild(c); }
    return cell;
  };

  // In-popup gallery: transform-stepper with seamless loop (ported from mockup).
  const buildStepper = (wrap, items) => {
    if (galleries.has(wrap)) { try { galleries.get(wrap).teardown(); } catch (e) {} galleries.delete(wrap); }
    // hide any leftover Splide arrows/track from the old CMS markup
    wrap.querySelectorAll('.splide__arrows, .splide__arrow--prev, .splide__arrow--next, [class*="arrow--prev"], [class*="arrow--next"]').forEach(el => { el.style.display = 'none'; });
    wrap.querySelectorAll('.cf-gal').forEach(el => el.remove());

    currentGalleryItems = items.slice();
    const N = items.length;
    const gal = document.createElement('div'); gal.className = 'cf-gal';
    const vp = document.createElement('div'); vp.className = 'cf-gal-vp';
    const track = document.createElement('div'); track.className = 'cf-gal-track';
    const dots = document.createElement('div'); dots.className = 'cf-gal-dots';
    const CLONES = 2;
    const layout = [];
    for (let i = N - CLONES; i < N; i++) layout.push((i + N) % N);
    for (let i = 0; i < N; i++) layout.push(i);
    for (let i = 0; i < CLONES; i++) layout.push(i);
    layout.forEach(real => track.appendChild(makeCell(items[real], real)));
    items.forEach((it, i) => { const d = document.createElement('span'); d.className = 'cf-gal-dot'; d.dataset.i = i; dots.appendChild(d); });
    vp.appendChild(track);
    const navPrev = document.createElement('button'); navPrev.className = 'cf-gal-arrow cf-gal-arrow-prev'; navPrev.type = 'button'; navPrev.setAttribute('aria-label', 'Previous'); navPrev.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
    const navNext = document.createElement('button'); navNext.className = 'cf-gal-arrow cf-gal-arrow-next'; navNext.type = 'button'; navNext.setAttribute('aria-label', 'Next'); navNext.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
    gal.append(vp, dots, navPrev, navNext); wrap.appendChild(gal);

    let pos = CLONES, animating = false, dragMoved = false;
    const offsetFor = i => { const c = track.children[i]; const vpW = vp.clientWidth; return -(c.offsetLeft - (vpW - c.offsetWidth) / 2); };
    const place = (i, animate) => { track.style.transition = animate ? 'transform .5s cubic-bezier(.22,.61,.36,1)' : 'none'; track.style.transform = 'translateX(' + offsetFor(i) + 'px)'; };
    const realOf = i => +track.children[i].dataset.real;
    const syncUI = () => {
      const real = realOf(pos);
      dots.querySelectorAll('.cf-gal-dot').forEach((d, i) => d.classList.toggle('is-active', i === real));
      [...track.children].forEach((c, i) => c.classList.toggle('is-active', i === pos));
    };
    const go = dir => {
      if (animating) return; animating = true;
      let target = pos + dir;
      if (target < CLONES) { place(pos + N, false); void track.offsetWidth; pos += N; target = pos + dir; }
      else if (target >= CLONES + N) { place(pos - N, false); void track.offsetWidth; pos -= N; target = pos + dir; }
      pos = target; place(pos, true); syncUI();
    };
    const onEnd = e => { if (e.propertyName === 'transform') animating = false; };
    track.addEventListener('transitionend', onEnd);
    const onPrev = () => go(-1), onNext = () => go(1);
    navPrev.addEventListener('click', onPrev); navNext.addEventListener('click', onNext);
    const onDot = ev => { const d = ev.target.closest('.cf-gal-dot'); if (!d || animating) return; animating = true; pos = CLONES + (+d.dataset.i); place(pos, true); syncUI(); };
    dots.addEventListener('click', onDot);
    // click a cell -> open lightbox (unless it was a swipe-drag)
    const onCellClick = ev => { const cell = ev.target.closest('.cf-gal-cell'); if (!cell || dragMoved) return; openDialog(+cell.dataset.real, true); };
    track.addEventListener('click', onCellClick);
    // swipe (mobile) — lock to horizontal, block vertical page-scroll during a sideways swipe
    let sx = 0, sy = 0, sw = false, axis = null;
    const ts = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; sw = true; axis = null; dragMoved = false; };
    const tm = e => {
      if (!sw) return;
      const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'x') { dragMoved = true; if (e.cancelable) e.preventDefault(); } // stop page scroll while swiping sideways
    };
    const te = e => { if (!sw) return; sw = false; if (axis !== 'x') return; const dx = e.changedTouches[0].clientX - sx; if (dx < -45) go(1); else if (dx > 45) go(-1); };
    vp.addEventListener('touchstart', ts, { passive: true });
    vp.addEventListener('touchmove', tm, { passive: false }); // non-passive so preventDefault works
    vp.addEventListener('touchend', te, { passive: true });
    const onResize = () => place(pos, false);
    window.addEventListener('resize', onResize);
    requestAnimationFrame(() => { place(pos, false); syncUI(); });

    galleries.set(wrap, { teardown: () => {
      track.removeEventListener('transitionend', onEnd);
      navPrev.removeEventListener('click', onPrev); navNext.removeEventListener('click', onNext);
      dots.removeEventListener('click', onDot); track.removeEventListener('click', onCellClick);
      window.removeEventListener('resize', onResize);
    } });
  };

  const buildVisibleGallery = () => {
    const m = activeModal();
    if (!m) return;
    const dataEl = m.querySelector('[cf-gallery-data]');
    const items = parseGallery(dataEl ? dataEl.textContent : '');
    const wrap = m.querySelector('.story_slider-wrap-main');
    if (!wrap) { console.warn('[cf-gallery] no slider wrap for', slugOf(m)); return; }
    if (!items.length) { console.warn('[cf-gallery] no valid items for', slugOf(m)); return; }
    buildStepper(wrap, items);
    m.classList.add('cf-gallery-built');
    wrap.classList.add('cf-gallery-built');
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

    // --- lightbox is open: it owns all clicks. Never fall through to popup close. ---
    if (document.querySelector('.csvd')) {
      if (e.target.closest('.csvd_x') || e.target.closest('.csvd_nav')) { /* handled by dialog */ return; }
      // interactive regions never close: desktop media box, mobile strip/cells/dots/caption
      const inside = e.target.closest('.csvd_vp, .csvd_cell, .csvd_dots, .csvd_nav, .csvd_x');
      if (!inside) { e.preventDefault(); e.stopImmediatePropagation(); closeDialog(); }
      return;
    }

    const trigger = e.target.closest(TRIGGER);
    if (trigger) { e.preventDefault(); openBySlug(trigger.getAttribute('cms-modal-trigger')); return; }

    const next = e.target.closest('.modal-next-btn'), prev = e.target.closest('.modal-prev-btn');
    if (next || prev) {
      const ms = modalList(), cur = activeModal(), i = ms.indexOf(cur);
      if (i >= 0) { e.preventDefault(); showModal(ms[next ? (i + 1) % ms.length : (i - 1 + ms.length) % ms.length]); }
      return;
    }

    // rebuilt gallery: any media slide -> open lightbox at that item (clicked = autoplay)
    const slide = e.target.closest('.cf-gal-slide.is-media');
    if (slide) {
      e.preventDefault(); e.stopImmediatePropagation();
      const cur = activeModal();
      if (cur) { const hf = cur.querySelector('iframe.cf-hero'); if (hf && hf.contentWindow) { try { hf.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*'); } catch (x) {} } }
      const idx = parseInt(slide.dataset.galIndex, 10) || 0;
      openDialog(idx, true); // true = user-initiated -> autoplay this one
      return;
    }

    const backdrop = e.target.closest(POPUP);
    if (backdrop && !e.target.closest('.story_item-pop-content')) { closePopup(); return; }
    if (e.target.closest('.story_cross-wrap') || e.target.closest('[aria-label="Close"]')) closePopup();
  }, true);

  document.addEventListener('keydown', e => {
    if (document.querySelector('.csvd')) {
      if (e.key === 'Escape') { closeDialog(); }
      else if (e.key === 'ArrowRight') { stepDialog(1); }
      else if (e.key === 'ArrowLeft') { stepDialog(-1); }
      return;
    }
    if (e.key === 'Escape') closePopup();
  });

  /* csvd lightbox — desktop: arrows + one item. mobile: scroll-snap strip, peek + dots. */
  function closeDialog() { const d = document.querySelector('.csvd'); if (d) d.remove(); }

  // media node for a cell: live iframe (with autoplay flag) or image; wrapped in .cell-media
  function cellMedia(it, autoplay) {
    const media = document.createElement('div'); media.className = 'cell-media';
    if (it.type === 'image') {
      const im = document.createElement('img'); im.src = it.ref; im.alt = it.caption || ''; media.appendChild(im);
    } else {
      const f = document.createElement('iframe');
      const ap = autoplay ? '1' : '0';
      f.src = (it.type === 'youtube')
        ? 'https://www.youtube.com/embed/' + it.ref + '?rel=0&autoplay=' + ap
        : 'https://player.vimeo.com/video/' + it.ref + '?title=0&byline=0&portrait=0&autoplay=' + ap;
      f.setAttribute('frameborder', '0'); f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media'; f.allowFullscreen = true;
      media.appendChild(f);
    }
    return media;
  }
  // thumbnail (no live iframe) for non-active cells
  function cellThumb(it) {
    const media = document.createElement('div'); media.className = 'cell-media';
    const im = document.createElement('img');
    if (it.type === 'image') im.src = it.ref;
    else if (it.type === 'youtube') im.src = ytThumb(it.ref);
    else if (it.type === 'vimeo') { Promise.resolve(vimeoThumb(it.ref)).then(u => { if (u) im.src = u; }); }
    media.appendChild(im);
    if (it.type !== 'image') { const p = document.createElement('div'); p.className = 'cf-gal-play'; media.appendChild(p); }
    return media;
  }
  function fillCell(cell, it, live, autoplay) {
    cell.innerHTML = '';
    cell.appendChild(live ? cellMedia(it, autoplay) : cellThumb(it));
    if (it.caption) { const c = document.createElement('div'); c.className = 'cell-cap'; c.textContent = it.caption; cell.appendChild(c); }
  }

  let lbTrack = null, lbPos = 0, lbAnim = false, lbClones = 2;

  function openDialog(index, autoplay) {
    closeDialog();
    const items = currentGalleryItems;
    if (!items.length) return;
    const N = items.length;
    const d = document.createElement('div'); d.className = 'csvd';
    const x = document.createElement('button'); x.className = 'csvd_x'; x.setAttribute('aria-label', 'Close'); x.type = 'button';
    const vp = document.createElement('div'); vp.className = 'csvd_vp';
    lbTrack = document.createElement('div'); lbTrack.className = 'csvd_track'; vp.appendChild(lbTrack);
    const prev = document.createElement('button'); prev.className = 'csvd_nav csvd_prev'; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous'); prev.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
    const next = document.createElement('button'); next.className = 'csvd_nav csvd_next'; next.type = 'button'; next.setAttribute('aria-label', 'Next'); next.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
    const dots = document.createElement('div'); dots.className = 'csvd_dots';
    d.append(x, vp, prev, next, dots);

    lbClones = Math.min(2, N);
    const layout = [];
    for (let i = N - lbClones; i < N; i++) layout.push((i + N) % N);
    for (let i = 0; i < N; i++) layout.push(i);
    for (let i = 0; i < lbClones; i++) layout.push(i);
    layout.forEach(real => { const cell = document.createElement('div'); cell.className = 'csvd_cell'; cell.dataset.real = real; fillCell(cell, items[real], false, false); lbTrack.appendChild(cell); });
    items.forEach((it, i) => { const dot = document.createElement('span'); dot.className = 'csvd_dot'; dot.dataset.i = i; dots.appendChild(dot); });
    if (N < 2) { prev.style.display = 'none'; next.style.display = 'none'; }
    document.body.appendChild(d);
    lockBody(true);

    lbPos = lbClones + (index || 0);
    lbAnim = false;
    // make the initial cell live + autoplay if user-initiated
    fillCell(lbTrack.children[lbPos], items[realOfLb(lbPos)], true, !!autoplay);
    lbTrack.children[lbPos].classList.add('is-live');

    const onEnd = e => { if (e.propertyName === 'transform') lbAnim = false; };
    lbTrack.addEventListener('transitionend', onEnd);
    x.addEventListener('click', ev => { ev.stopPropagation(); closeDialog(); });
    prev.addEventListener('click', ev => { ev.stopPropagation(); lbGo(-1); });
    next.addEventListener('click', ev => { ev.stopPropagation(); lbGo(1); });
    dots.addEventListener('click', ev => { const dot = ev.target.closest('.csvd_dot'); if (!dot || lbAnim) return; lbGoTo(+dot.dataset.i); });
    d.addEventListener('click', ev => { if (!ev.target.closest('.csvd_vp,.csvd_dots,.csvd_nav,.csvd_x')) closeDialog(); });
    // swipe — axis-locked; a catcher overlay handles swipes over the video iframe
    let sx = 0, sy = 0, sw = false, axis = null;
    const lbTs = e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; sw = true; axis = null; };
    const lbTm = e => {
      if (!sw) return;
      const t = e.touches[0], dx = t.clientX - sx, dy = t.clientY - sy;
      if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'x' && e.cancelable) e.preventDefault();
    };
    const lbTe = e => { if (!sw) return; sw = false; if (axis !== 'x') return; const dx = e.changedTouches[0].clientX - sx; if (dx < -45) lbGo(1); else if (dx > 45) lbGo(-1); };
    d.addEventListener('touchstart', lbTs, { passive: true });
    d.addEventListener('touchmove', lbTm, { passive: false });
    d.addEventListener('touchend', lbTe, { passive: true });
    // transparent catcher over the media so swipes register above the video iframe;
    // a stationary tap on it is forwarded as a click (so the video play control still works)
    const catcher = document.createElement('div'); catcher.className = 'csvd_catch';
    let cMoved = false, cx = 0, cy = 0;
    catcher.addEventListener('touchstart', e => { const t = e.touches[0]; cx = t.clientX; cy = t.clientY; cMoved = false; }, { passive: true });
    catcher.addEventListener('touchmove', e => { const t = e.touches[0]; if (Math.abs(t.clientX - cx) > 8 || Math.abs(t.clientY - cy) > 8) cMoved = true; }, { passive: true });
    catcher.addEventListener('touchend', e => {
      if (cMoved) return; // it was a swipe, already handled by d's listeners
      // stationary tap: forward to the live iframe area (toggle play) by briefly disabling the catcher
      catcher.style.pointerEvents = 'none';
      const el = document.elementFromPoint(cx, cy);
      if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: cx, clientY: cy }));
      setTimeout(() => { catcher.style.pointerEvents = ''; }, 0);
    }, { passive: true });
    d.appendChild(catcher);

    requestAnimationFrame(() => { lbPlace(false); lbSync(); });
  }
  const realOfLb = i => +lbTrack.children[i].dataset.real;
  const lbOffset = i => { const c = lbTrack.children[i]; const vpW = lbTrack.parentElement.clientWidth; return -(c.offsetLeft - (vpW - c.offsetWidth) / 2); };
  const lbPlace = animate => { lbTrack.style.transition = animate ? 'transform .5s cubic-bezier(.22,.61,.36,1)' : 'none'; lbTrack.style.transform = 'translateX(' + lbOffset(lbPos) + 'px)'; };
  const lbSync = () => {
    const items = currentGalleryItems, real = realOfLb(lbPos);
    [...lbTrack.children].forEach((c, i) => {
      const wasLive = c.classList.contains('is-live');
      const nowLive = i === lbPos;
      c.classList.toggle('is-live', nowLive);
      // upgrade the newly-active cell to a live (paused) player; downgrade others to thumb
      if (nowLive && !wasLive) fillCell(c, items[+c.dataset.real], true, false);
      else if (!nowLive && wasLive) fillCell(c, items[+c.dataset.real], false, false);
    });
    const d = document.querySelector('.csvd');
    if (d) d.querySelectorAll('.csvd_dot').forEach((dot, i) => dot.classList.toggle('is-active', i === real));
  };
  const lbGo = dir => {
    if (lbAnim) return; lbAnim = true;
    const N = currentGalleryItems.length;
    let target = lbPos + dir;
    if (target < lbClones) { lbPlace(false); lbPos += N; lbPlace(false); void lbTrack.offsetWidth; target = lbPos + dir; }
    else if (target >= lbClones + N) { lbPlace(false); lbPos -= N; lbPlace(false); void lbTrack.offsetWidth; target = lbPos + dir; }
    lbPos = target; lbPlace(true); lbSync();
  };
  const lbGoTo = realIdx => { if (lbAnim) return; lbAnim = true; lbPos = lbClones + realIdx; lbPlace(true); lbSync(); };
  function renderDialogItem() {} // legacy no-op (kept so any stray caller doesn't throw)
  function stepDialog(dir) { lbGo(dir); } // legacy alias used by keydown handler

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
