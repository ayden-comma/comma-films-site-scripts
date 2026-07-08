/* ============================================================
   Comma Films — home-new media engine v16
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
  /* rebuilt gallery (v6) — transform-stepper, reuses existing circular arrows */
  [cf-gallery-data]{display:none!important}
  .cf-gal{position:relative;margin-top:8px}
  .cf-gal-arrow{position:absolute;top:calc(50% - 22px);width:44px;height:44px;border-radius:50%;border:1px solid #ffffff2e;background:rgba(20,18,16,.75);cursor:pointer;display:grid;place-items:center;z-index:20;transition:background .25s,border-color .25s,opacity .25s}
  .cf-gal-arrow svg{width:18px;height:18px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:stroke .25s}
  .cf-gal-arrow:hover{background:rgb(232,90,79);border-color:rgb(232,90,79)}
  .cf-gal-arrow:hover svg{stroke:#000}
  .cf-gal-arrow.is-disabled{opacity:.3;pointer-events:none}
  .cf-gal-arrow-prev{left:8px}.cf-gal-arrow-next{right:8px}
  @media(max-width:600px){.cf-gal-arrow{display:none}}
  .cf-gal-strip{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 12%}
  .cf-gal-strip::-webkit-scrollbar{display:none}
  .cf-gal-slide.cf-gal-cell{flex:0 0 62%;scroll-snap-align:center;position:relative;aspect-ratio:16/10;border-radius:10px;overflow:hidden;background:#0e0c0a;border:1px solid #ffffff14;cursor:pointer;opacity:.55;transition:opacity .35s cubic-bezier(.22,.61,.36,1)}
  .cf-gal-slide.cf-gal-cell.is-active{opacity:1}
  @media(max-width:600px){.cf-gal-strip{padding:0 14vw}.cf-gal-slide.cf-gal-cell{flex:0 0 72vw}}
  .cf-gal-dots{display:flex;justify-content:center;gap:7px;margin-top:16px}
  .cf-gal-dot{width:7px;height:7px;border-radius:50%;background:#ffffff40;cursor:pointer;transition:background .25s,transform .25s}
  .cf-gal-dot.is-active{background:rgb(232,90,79);transform:scale(1.25)}
  .cf-gal-slide img.cf-gal-thumb{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.9);transition:transform .8s cubic-bezier(.22,.61,.36,1),filter .55s}
  .cf-gal-slide:hover img.cf-gal-thumb{transform:scale(1.05);filter:brightness(1)}
  /* readability scrim: matches home-tile vignette (in front of thumb, behind text) */
  .cf-gal-slide:after{content:"";position:absolute;left:0;right:0;bottom:0;height:56%;z-index:1;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.84),rgba(0,0,0,.46) 44%,rgba(0,0,0,0))}
  .cf-gal-slide .cf-gal-play{position:absolute;inset:0;margin:auto;width:56px;height:56px;border-radius:50%;background:rgba(12,12,14,.5);border:1px solid #ffffff42;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2;opacity:.85;transition:opacity .3s,transform .3s}
  .cf-gal-slide:hover .cf-gal-play{opacity:1;transform:scale(1.06)}
  .cf-gal-slide .cf-gal-play:after{content:"";margin-left:3px;border-style:solid;border-width:9px 0 9px 15px;border-color:transparent transparent transparent #fff}
  .cf-gal-slide .cf-gal-cap{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:30px 16px 13px;font-family:"Hanken Grotesk",sans-serif;font-size:14.5px;font-weight:400;letter-spacing:normal;color:rgb(243,239,230)}
  .cf-gallery-built .story_slider-wrap-main .splide__list{display:none!important}
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
  .csvd_b--img{aspect-ratio:auto;width:auto;max-width:92vw;max-height:88vh;background:transparent;display:flex;align-items:center;justify-content:center}
  .csvd_img{max-width:92vw;max-height:88vh;width:auto;height:auto;display:block;border-radius:6px}
  .csvd iframe{position:absolute;inset:0;width:100%;height:100%}
  /* X: white icon at rest -> hover fills red, icon black, rotates 90deg (ref .lb-close) */
  .csvd_x{position:fixed;top:24px;right:28px;width:44px;height:44px;border-radius:50%;border:1px solid #ffffff2e;background:rgba(11,11,12,.7);cursor:pointer;z-index:1000001;transition:background .25s,transform .25s cubic-bezier(.22,.61,.36,1),border-color .25s}
  .csvd_x:before,.csvd_x:after{content:"";position:absolute;left:13px;top:21px;width:18px;height:2px;background:#fff;border-radius:2px;transition:background .25s}
  .csvd_x:before{transform:rotate(45deg)}.csvd_x:after{transform:rotate(-45deg)}
  .csvd_x:hover{background:rgb(232,90,79);border-color:rgb(232,90,79);transform:rotate(90deg)}
  .csvd_x:hover:before,.csvd_x:hover:after{background:#000}
  /* lightbox arrows: white outline icon -> hover red fill, icon black */
  .csvd_nav{position:fixed;top:50%;transform:translateY(-50%);width:52px;height:52px;border-radius:50%;border:1px solid #ffffff2e;background:rgba(11,11,12,.7);cursor:pointer;display:grid;place-items:center;z-index:1000000;transition:background .25s,transform .25s cubic-bezier(.22,.61,.36,1),border-color .25s}
  .csvd_nav:hover{background:rgb(232,90,79);border-color:rgb(232,90,79);transform:translateY(-50%) scale(1.05)}
  .csvd_nav svg{width:20px;height:20px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;transition:stroke .25s}
  .csvd_nav:hover svg{stroke:#000}
  .csvd_prev{left:24px}.csvd_next{right:24px}
  .csvd_cap{position:fixed;left:0;right:0;bottom:26px;text-align:center;font-family:"Hanken Grotesk",sans-serif;font-size:13px;letter-spacing:normal;color:rgb(243,239,230);z-index:1000000;pointer-events:none}
  /* Lightbox = scroll-snap strip on BOTH breakpoints. Old box/arrows unused. */
  .csvd_b,.csvd_nav{display:none!important}
  .csvd{flex-direction:column;align-items:center;justify-content:center;padding:0}
  .csvd_strip{display:flex;gap:16px;width:100vw;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 8vw;align-items:center}
  .csvd_strip::-webkit-scrollbar{display:none}
  .csvd_cell{flex:0 0 84vw;scroll-snap-align:center;height:auto;aspect-ratio:16/10;max-height:82vh;border-radius:12px;overflow:hidden;background:#0e0c0a;position:relative;display:flex;align-items:center;justify-content:center;opacity:.4;transition:opacity .3s;box-shadow:0 0 0 1px #ffffff10}
  .csvd_cell.is-live{opacity:1}
  .csvd_cell img,.csvd_cell iframe{width:100%;height:100%;object-fit:cover;display:block;border:0}
  .csvd_cell .cf-gal-play{position:absolute;inset:0;margin:auto;width:56px;height:56px}
  .csvd_cap{position:static;margin:22px auto 12px;text-align:center;line-height:1.3;padding:0 24px}
  .csvd_dots{display:flex;justify-content:center;gap:7px;margin-bottom:20px}
  .csvd_dot{width:7px;height:7px;border-radius:50%;background:#ffffff45;cursor:pointer;transition:background .25s,transform .25s}
  .csvd_dot.is-active{background:rgb(232,90,79);transform:scale(1.25)}
  .csvd_peekmedia{position:relative;width:100%;height:100%}
  .csvd_peekmedia img{width:100%;height:100%;object-fit:cover;display:block}
  @media(max-width:600px){
    .csvd_x{top:max(14px,env(safe-area-inset-top));right:16px}
    .csvd_strip{gap:12px;padding:0 14vw}
    .csvd_cell{flex:0 0 72vw}
    .csvd_dots{margin-bottom:max(24px,env(safe-area-inset-bottom))}
  }
  /* touch: no sticky hover */
  @media(hover:none){
    .csvd_x:hover{background:rgba(11,11,12,.7)!important;border-color:#ffffff2e!important;transform:none!important}
    .csvd_x:hover:before,.csvd_x:hover:after{background:#fff!important}
    .cf-gal-dot:active,.csvd_dot:active{background:rgb(232,90,79)!important}
  }
  /* thumbnail-strip circular arrows -> red fill on hover, white icon (scoped to buttons only, NOT the container) */
  .story_slider-wrap-main .splide__arrow--prev:hover,.story_slider-wrap-main .splide__arrow--next:hover{background:rgb(232,90,79)!important;border-color:rgb(232,90,79)!important}
  .story_slider-wrap-main .splide__arrow--prev:hover svg,.story_slider-wrap-main .splide__arrow--next:hover svg,.story_slider-wrap-main .splide__arrow--prev:hover svg path,.story_slider-wrap-main .splide__arrow--next:hover svg path{stroke:#000!important;fill:#000!important}
  /* mobile popup chrome */
  @media(max-width:767px){
    /* clear top gap so the card + close X sit below the browser chrome, not flush */
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

  const makeSlide = (it, i) => {
    const s = document.createElement('div');
    s.className = 'cf-gal-slide is-media';
    if (i != null) s.dataset.galIndex = i;
    const img = document.createElement('img');
    img.className = 'cf-gal-thumb'; img.loading = 'lazy'; img.alt = it.caption || '';
    s.appendChild(img);
    if (it.type === 'image') { img.src = it.ref; s.dataset.mediaType = 'image'; s.dataset.mediaSrc = it.ref; }
    else if (it.type === 'youtube') { img.src = ytThumb(it.ref); s.dataset.mediaType = 'youtube'; s.dataset.mediaId = it.ref; const p = document.createElement('div'); p.className = 'cf-gal-play'; s.appendChild(p); }
    else if (it.type === 'vimeo') { s.dataset.mediaType = 'vimeo'; s.dataset.mediaId = it.ref; const p = document.createElement('div'); p.className = 'cf-gal-play'; s.appendChild(p); Promise.resolve(vimeoThumb(it.ref)).then(u => { if (u) img.src = u; }); }
    if (it.caption) { const c = document.createElement('div'); c.className = 'cf-gal-cap'; c.textContent = it.caption; s.appendChild(c); }
    return s;
  };

  const arrowSvg = dir => dir === 'prev'
    ? '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';

  // In-popup gallery strip: scroll-snap, active centered, neighbors peek, dots below.
  // Circular arrows are hidden (replaced by swipe + dots on both breakpoints).
  const buildStepper = (wrap, items) => {
    if (galleries.has(wrap)) { try { galleries.get(wrap).teardown(); } catch (e) {} galleries.delete(wrap); }
    // hide the old circular arrows
    wrap.querySelectorAll('.splide__arrows, .splide__arrow--prev, .splide__arrow--next, [class*="arrow--prev"], [class*="arrow--next"]').forEach(el => { el.style.display = 'none'; });
    wrap.querySelectorAll('.cf-gal, .splide__track, .splide__list').forEach(el => el.remove());

    currentGalleryItems = items.slice();
    const gal = document.createElement('div'); gal.className = 'cf-gal';
    const strip = document.createElement('div'); strip.className = 'cf-gal-strip';
    const dots = document.createElement('div'); dots.className = 'cf-gal-dots';
    items.forEach((it, i) => {
      const cell = document.createElement('div'); cell.className = 'cf-gal-slide'; cell.dataset.galIndex = i;
      const inner = makeSlide(it, i);
      // move the inner slide's content into the cell (makeSlide already builds the media+caption)
      cell.className = inner.className + ' cf-gal-cell';
      cell.dataset.galIndex = i;
      if (inner.dataset.mediaType) cell.dataset.mediaType = inner.dataset.mediaType;
      if (inner.dataset.mediaSrc) cell.dataset.mediaSrc = inner.dataset.mediaSrc;
      if (inner.dataset.mediaId) cell.dataset.mediaId = inner.dataset.mediaId;
      while (inner.firstChild) cell.appendChild(inner.firstChild);
      strip.appendChild(cell);
      const dot = document.createElement('span'); dot.className = 'cf-gal-dot'; dot.dataset.i = i; dots.appendChild(dot);
    });
    gal.append(strip, dots); wrap.appendChild(gal);

    // Desktop nav arrows (hidden on mobile via CSS). Scroll the strip by one cell.
    const navPrev = document.createElement('button'); navPrev.className = 'cf-gal-arrow cf-gal-arrow-prev'; navPrev.type = 'button'; navPrev.setAttribute('aria-label', 'Previous'); navPrev.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
    const navNext = document.createElement('button'); navNext.className = 'cf-gal-arrow cf-gal-arrow-next'; navNext.type = 'button'; navNext.setAttribute('aria-label', 'Next'); navNext.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
    gal.append(navPrev, navNext);

    const activeIdx = () => {
      const mid = strip.scrollLeft + strip.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      Array.from(strip.children).forEach((c, i) => { const cc = c.offsetLeft + c.clientWidth / 2; const dist = Math.abs(cc - mid); if (dist < bestDist) { bestDist = dist; best = i; } });
      return best;
    };
    const scrollToCell = i => { const cell = strip.children[i]; if (cell) cell.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };
    const onArrowPrev = () => scrollToCell(Math.max(0, activeIdx() - 1));
    const onArrowNext = () => scrollToCell(Math.min(items.length - 1, activeIdx() + 1));
    navPrev.addEventListener('click', onArrowPrev);
    navNext.addEventListener('click', onArrowNext);

    const syncDots = () => {
      const mid = strip.scrollLeft + strip.clientWidth / 2;
      let best = 0, bestDist = Infinity;
      Array.from(strip.children).forEach((c, i) => { const cc = c.offsetLeft + c.clientWidth / 2; const dist = Math.abs(cc - mid); if (dist < bestDist) { bestDist = dist; best = i; } });
      dots.querySelectorAll('.cf-gal-dot').forEach((dot, i) => dot.classList.toggle('is-active', i === best));
      strip.querySelectorAll('.cf-gal-cell').forEach((c, i) => c.classList.toggle('is-active', i === best));
      navPrev.classList.toggle('is-disabled', best === 0);
      navNext.classList.toggle('is-disabled', best === items.length - 1);
    };
    let st;
    const onScroll = () => { clearTimeout(st); st = setTimeout(syncDots, 60); syncDots(); };
    strip.addEventListener('scroll', onScroll, { passive: true });
    const onDot = ev => { const dot = ev.target.closest('.cf-gal-dot'); if (!dot) return; const i = parseInt(dot.dataset.i, 10); const cell = strip.children[i]; if (cell) cell.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); };
    dots.addEventListener('click', onDot);
    requestAnimationFrame(syncDots);

    galleries.set(wrap, { teardown: () => { strip.removeEventListener('scroll', onScroll); dots.removeEventListener('click', onDot); navPrev.removeEventListener('click', onArrowPrev); navNext.removeEventListener('click', onArrowNext); } });
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
      const inside = e.target.closest('.csvd_b, .csvd_strip, .csvd_cell, .csvd_dots, .csvd_cap');
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
      else if (!isMobileLB() && e.key === 'ArrowRight') { stepDialog(1); }
      else if (!isMobileLB() && e.key === 'ArrowLeft') { stepDialog(-1); }
      return;
    }
    if (e.key === 'Escape') closePopup();
  });

  /* csvd lightbox — desktop: arrows + one item. mobile: scroll-snap strip, peek + dots. */
  function closeDialog() { const d = document.querySelector('.csvd'); if (d) d.remove(); }
  const isMobileLB = () => window.matchMedia('(max-width:600px)').matches;

  // ---------- shared: build one media node ----------
  function mediaNode(it, autoplay) {
    if (it.type === 'image') {
      const im = document.createElement('img'); im.className = 'csvd_img'; im.src = it.ref; im.alt = it.caption || '';
      return im;
    }
    const f = document.createElement('iframe');
    const ap = autoplay ? '1' : '0';
    f.src = (it.type === 'youtube')
      ? 'https://www.youtube.com/embed/' + it.ref + '?rel=0&autoplay=' + ap
      : 'https://player.vimeo.com/video/' + it.ref + '?title=0&byline=0&portrait=0&autoplay=' + ap;
    f.setAttribute('frameborder', '0');
    f.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    f.allowFullscreen = true;
    return f;
  }
  // thumbnail-only node for peeking neighbors (never a live iframe)
  function peekThumb(it) {
    const im = document.createElement('img'); im.className = 'csvd_img';
    if (it.type === 'image') im.src = it.ref;
    else if (it.type === 'youtube') im.src = ytThumb(it.ref);
    else if (it.type === 'vimeo') { Promise.resolve(vimeoThumb(it.ref)).then(u => { if (u) im.src = u; }); }
    const wrap = document.createElement('div'); wrap.className = 'csvd_peekmedia'; wrap.appendChild(im);
    if (it.type !== 'image') { const p = document.createElement('div'); p.className = 'cf-gal-play'; wrap.appendChild(p); }
    return wrap;
  }

  /* ---------- DESKTOP render (unchanged behavior) ---------- */
  function renderDialogItem(autoplay) {
    const d = document.querySelector('.csvd'); if (!d) return;
    const box = d.querySelector('.csvd_b'); if (!box) return;
    const it = currentGalleryItems[dialogIndex]; if (!it) return;
    box.innerHTML = '';
    box.classList.toggle('csvd_b--img', it.type === 'image');
    box.appendChild(mediaNode(it, autoplay));
    let cap = d.querySelector('.csvd_cap');
    if (!cap) { cap = document.createElement('div'); cap.className = 'csvd_cap'; d.appendChild(cap); }
    const total = currentGalleryItems.length;
    cap.textContent = (it.caption || '') + (total > 1 ? '   ' + (dialogIndex + 1) + ' / ' + total : '');
  }

  function stepDialog(dir) {
    const total = currentGalleryItems.length;
    if (total < 2) return;
    dialogIndex = (dialogIndex + dir + total) % total;
    renderDialogItem(false);
  }

  /* ---------- MOBILE render: scroll-snap strip, active item live, neighbors peek ---------- */
  function renderMobileStrip(d, startIndex, autoplay) {
    const total = currentGalleryItems.length;
    const strip = d.querySelector('.csvd_strip');
    const dots = d.querySelector('.csvd_dots');
    const cap = d.querySelector('.csvd_cap');
    strip.innerHTML = ''; dots.innerHTML = '';
    currentGalleryItems.forEach((it, i) => {
      const cell = document.createElement('div'); cell.className = 'csvd_cell'; cell.dataset.i = i;
      cell.appendChild(peekThumb(it)); // start as thumbnail; upgrade active to live below
      strip.appendChild(cell);
      const dot = document.createElement('span'); dot.className = 'csvd_dot'; dots.appendChild(dot);
    });
    // make the active cell live (autoplay only if user-initiated)
    upgradeActiveCell(d, startIndex, autoplay);
    // scroll active into center without animation
    requestAnimationFrame(() => {
      const cell = strip.children[startIndex];
      if (cell) strip.scrollLeft = cell.offsetLeft - (strip.clientWidth - cell.clientWidth) / 2;
      syncDotsCap(d);
    });
  }
  function upgradeActiveCell(d, i, autoplay) {
    const strip = d.querySelector('.csvd_strip');
    const cell = strip.children[i]; if (!cell) return;
    const it = currentGalleryItems[i];
    // pause/reset any previously-live cell
    strip.querySelectorAll('.csvd_cell.is-live').forEach(c => {
      if (c === cell) return;
      c.classList.remove('is-live');
      const idx = parseInt(c.dataset.i, 10);
      c.innerHTML = ''; c.appendChild(peekThumb(currentGalleryItems[idx]));
    });
    if (cell.classList.contains('is-live')) return;
    cell.classList.add('is-live');
    cell.innerHTML = ''; cell.appendChild(mediaNode(it, autoplay));
  }
  function syncDotsCap(d) {
    const strip = d.querySelector('.csvd_strip');
    const dots = d.querySelectorAll('.csvd_dot');
    const cap = d.querySelector('.csvd_cap');
    // active = cell whose center is nearest strip center
    const mid = strip.scrollLeft + strip.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    Array.from(strip.children).forEach((c, i) => {
      const cc = c.offsetLeft + c.clientWidth / 2;
      const dist = Math.abs(cc - mid);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    dialogIndex = best;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === best));
    const it = currentGalleryItems[best];
    if (cap) cap.textContent = it ? (it.caption || '') : '';
  }

  function openDialog(index, autoplay) {
    closeDialog();
    dialogIndex = index || 0;
    const d = document.createElement('div'); d.className = 'csvd';
    const x = document.createElement('button'); x.className = 'csvd_x'; x.setAttribute('aria-label', 'Close'); x.type = 'button';
    d.appendChild(x);
    x.addEventListener('click', ev => { ev.stopPropagation(); closeDialog(); });

    if (currentGalleryItems.length > 0) {
      // strip + dots on BOTH breakpoints (desktop cells are narrower, more peek visible)
      const strip = document.createElement('div'); strip.className = 'csvd_strip';
      const cap = document.createElement('div'); cap.className = 'csvd_cap';
      const dots = document.createElement('div'); dots.className = 'csvd_dots';
      d.append(strip, cap, dots);
      document.body.appendChild(d);
      renderMobileStrip(d, dialogIndex, !!autoplay);
      // on scroll settle, re-center-detect and upgrade the new active cell to live (paused)
      let scrollT;
      strip.addEventListener('scroll', () => {
        syncDotsCap(d);
        clearTimeout(scrollT);
        scrollT = setTimeout(() => { upgradeActiveCell(d, dialogIndex, false); }, 140);
      }, { passive: true });
      // tapping a peeking neighbor centers it
      strip.addEventListener('click', ev => {
        const cell = ev.target.closest('.csvd_cell'); if (!cell) return;
        if (cell.classList.contains('is-live')) return; // live tap = play/interact, let it through
        const i = parseInt(cell.dataset.i, 10);
        cell.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      return;
    }

    // DESKTOP: arrows + one item + swipe fallback
    const b = document.createElement('div'); b.className = 'csvd_b';
    const prev = document.createElement('button'); prev.className = 'csvd_nav csvd_prev'; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous'); prev.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>';
    const next = document.createElement('button'); next.className = 'csvd_nav csvd_next'; next.type = 'button'; next.setAttribute('aria-label', 'Next'); next.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
    d.append(prev, b, next);
    if (currentGalleryItems.length < 2) { prev.style.display = 'none'; next.style.display = 'none'; }
    prev.addEventListener('click', ev => { ev.stopPropagation(); stepDialog(-1); });
    next.addEventListener('click', ev => { ev.stopPropagation(); stepDialog(1); });
    document.body.appendChild(d);
    renderDialogItem(!!autoplay);
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
