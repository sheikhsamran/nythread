(function () {
  function activatePanel(root, panel) {
    // Videos in the panel becoming visible must be explicitly (re)started:
    // browsers commonly refuse/halt autoplay on <video> inside a display:none
    // ancestor, so the "autoplay" attribute alone does nothing while hidden.
    root.querySelectorAll('.pit-panel').forEach(function (p) {
      p.querySelectorAll('video').forEach(function (video) {
        if (p === panel) {
          if (video.dataset.userPaused !== 'true') {
            video.play().catch(function () {});
          }
        } else {
          video.pause();
        }
      });
    });

    // Flickity measures cell widths at init time; if it was initialized while
    // its panel was display:none, cells come out zero-width until something
    // forces a recalculation (e.g. a manual window resize). Force it here.
    var carousel = panel.querySelector('.pit-features-carousel');
    if (carousel && carousel.flickityInstance) {
      carousel.flickityInstance.resize();
    }
  }

  function initTabs(root) {
    var tabs = root.querySelectorAll('.pit-tab-btn');
    var panels = root.querySelectorAll('.pit-panel');

    tabs.forEach(function (tab) {
      if (tab.dataset.pitBound === 'true') return;
      tab.dataset.pitBound = 'true';

      tab.addEventListener('click', function () {
        if (tab.classList.contains('active')) return;

        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.remove('active');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        var target = root.querySelector('.pit-panel[data-panel="' + tab.getAttribute('data-tab') + '"]');
        if (target) {
          target.classList.add('active');
          activatePanel(root, target);
        }
      });
    });
  }

  function initVideoToggles(root) {
    root.querySelectorAll('[data-video]').forEach(function (wrapper) {
      var video = wrapper.querySelector('video');
      var toggle = wrapper.querySelector('.pit-video-toggle');
      if (!video || !toggle) return;
      if (toggle.dataset.pitBound === 'true') return;
      toggle.dataset.pitBound = 'true';

      toggle.addEventListener('click', function () {
        if (video.paused) {
          video.dataset.userPaused = 'false';
          video.play().catch(function () {});
        } else {
          video.dataset.userPaused = 'true';
          video.pause();
        }
      });

      video.addEventListener('play', function () {
        toggle.setAttribute('aria-label', 'Pause video');
        renderIcon(toggle, 'pause');
      });

      video.addEventListener('pause', function () {
        toggle.setAttribute('aria-label', 'Play video');
        renderIcon(toggle, 'play');
      });
    });
  }

  function renderIcon(toggle, icon) {
    if (icon === 'pause') {
      toggle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14"></rect><rect x="14" y="5" width="4" height="14"></rect></svg>';
    } else {
      toggle.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>';
    }
  }

  function initCarousel(root) {
    var carousel = root.querySelector('.pit-features-carousel');
    if (!carousel || typeof Flickity === 'undefined') return;
    if (carousel.classList.contains('flickity-enabled')) return;

    var optionsAttr = carousel.getAttribute('data-flickity-pit-carousel');
    var options = {};
    try {
      options = JSON.parse(optionsAttr);
    } catch (e) {}

    carousel.flickityInstance = new Flickity(carousel, options);
  }

  function init(root) {
    initTabs(root);
    initVideoToggles(root);
    initCarousel(root);

    var activePanel = root.querySelector('.pit-panel.active');
    if (activePanel) activatePanel(root, activePanel);
  }

  function initAll() {
    document.querySelectorAll('.pit-section').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var root = event.target.querySelector('.pit-section');
    if (root) init(root);
  });

  // "Learn more" links elsewhere on the page (e.g. the main product Short
  // description block) jump to this section and open the requested tab.
  document.addEventListener('click', function (event) {
    var link = event.target.closest('[data-pit-open]');
    if (!link) return;

    var root = document.querySelector('.pit-section');
    if (!root) return;
    event.preventDefault();

    var tab = root.querySelector('.pit-tab-btn[data-tab="' + link.getAttribute('data-pit-open') + '"]');
    if (tab && !tab.classList.contains('active')) tab.click();

    var header = document.querySelector('.shopify-section-main-header');
    var offset = header && getComputedStyle(header).position.match(/sticky|fixed/) ? header.offsetHeight : 0;
    var top = root.getBoundingClientRect().top + window.pageYOffset - offset - 20;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  // When a merchant selects a block in the theme editor sidebar, jump to the
  // tab that block lives in so it's actually visible in the preview.
  document.addEventListener('shopify:block:select', function (event) {
    var panel = event.target.closest('.pit-panel');
    if (!panel) return;

    var root = panel.closest('.pit-section');
    if (!root) return;

    var tab = root.querySelector('.pit-tab-btn[data-tab="' + panel.getAttribute('data-panel') + '"]');
    if (tab && !tab.classList.contains('active')) tab.click();
  });
})();
