/*
  Size guide: loads a <template data-size-guide-template> into the theme's shared
  side drawer (snippets/side-drawer.liquid), the same drawer Quick View uses, so it
  inherits its width, slide animation, overlay and close behaviour (common.js).
*/
if (!window.sizeGuideInitialized) {
  window.sizeGuideInitialized = true;

  const openSizeGuide = (template, trigger) => {
    const drawer = document.querySelector('[data-side-drawer]');
    if (!drawer) return;
    const title = drawer.querySelector('[data-drawer-title]');
    const body = drawer.querySelector('[data-drawer-body]');

    drawer.setAttribute('class', 'yv_side_drawer_wrapper yv_quickView_product yv_size_guide_drawer');
    drawer.setAttribute('id', 'yv_size_guide');
    if (title) title.textContent = template.dataset.title || '';
    body.classList.remove('searching');
    body.innerHTML = '';
    body.appendChild(template.content.cloneNode(true));

    body.querySelectorAll('[data-src]').forEach((iframe) => {
      iframe.src = iframe.dataset.src;
      iframe.removeAttribute('data-src');
    });

    document.body.classList.add('side_Drawer_open');
    playVideo(body);

    // Hook into common.js focus trap + focus return, as Quick View does.
    if (typeof focusElementsRotation === 'function' && window.jQuery) {
      focusElementsRotation(window.jQuery(drawer));
    }
    window.focusElement = trigger;
    drawer.focus({ preventScroll: true });
  };

  const playVideo = (scope) => {
    const video = scope.querySelector('.size-guide-panel.active .size-guide-media video');
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  };

  // The drawer is closed by common.js (close button, overlay, Esc). Once it has slid
  // out, clear our content so videos/embeds stop.
  let clearTimer;
  new MutationObserver(() => {
    if (document.body.classList.contains('side_Drawer_open')) return;
    const drawer = document.getElementById('yv_size_guide');
    if (!drawer) return;
    drawer.querySelectorAll('video').forEach((video) => video.pause());
    clearTimeout(clearTimer);
    clearTimer = setTimeout(() => {
      if (document.body.classList.contains('side_Drawer_open') || drawer.id !== 'yv_size_guide') return;
      const body = drawer.querySelector('[data-drawer-body]');
      if (body) body.innerHTML = '';
    }, 700);
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Triggers: any element with [data-size-guide-open] (optionally set to a template id)
  // or any link to "#size-guide". Capture phase + stopPropagation so common.js's
  // body "click outside" handler doesn't immediately close the drawer again.
  document.addEventListener(
    'click',
    (e) => {
      const trigger = e.target.closest('[data-size-guide-open], a[href="#size-guide"]');
      if (!trigger) return;
      const id = trigger.dataset.sizeGuideOpen;
      const template = id
        ? document.getElementById(id)
        : document.querySelector('template[data-size-guide-template]');
      if (!template) return;
      e.preventDefault();
      e.stopPropagation();
      openSizeGuide(template, trigger);
    },
    true
  );

  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-size-guide-tab]');
    if (tab) {
      const scope = tab.closest('.size-guide-body');
      const name = tab.dataset.sizeGuideTab;
      scope.querySelectorAll('[data-size-guide-tab]').forEach((el) => {
        const active = el === tab;
        el.classList.toggle('active', active);
        el.setAttribute('aria-selected', active);
      });
      scope.querySelectorAll('[data-size-guide-panel]').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.sizeGuidePanel === name);
      });
      scope.querySelectorAll('.size-guide-media video').forEach((video) => video.pause());
      playVideo(scope);
      return;
    }

    const unitBtn = e.target.closest('[data-size-guide-unit]');
    if (unitBtn) {
      const scope = unitBtn.closest('.size-guide-body');
      const unit = unitBtn.dataset.sizeGuideUnit;
      scope.querySelectorAll('[data-size-guide-unit]').forEach((el) => {
        const active = el === unitBtn;
        el.classList.toggle('active', active);
        el.setAttribute('aria-pressed', active);
      });
      scope.querySelectorAll('[data-size-guide-table]').forEach((table) => {
        table.classList.toggle('active', table.dataset.sizeGuideTable === unit);
      });
    }
  });
}
