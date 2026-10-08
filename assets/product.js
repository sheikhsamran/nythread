window.Theme = window.Theme || {};
Theme.Product = (() => {
  // let productSlider, productThumbSlider; // already declared globally in theme-scripts.liquid
  let currentVideo = null;

  const getMousePos = (e) => {
    var pos = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - pos.left,
      y: e.clientY - pos.top,
    };
  };

  function pauseMedia(container) {
    container.querySelectorAll('.yv-youtube-video').forEach(video =>
      video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
    );
    container.querySelectorAll('.yv-vimeo-video').forEach(video =>
      video.contentWindow.postMessage('{"method":"pause"}', '*')
    );
    container.querySelectorAll('video').forEach(video => video.pause());
  }

 function initProductSlider(section = document) {
    let sliderMain = section.querySelector('[data-flickity-product-slider]');
    if (!sliderMain) return;

    let optionContainer = sliderMain.getAttribute('data-flickity-product-slider');
    if (!optionContainer) return;

    let options = JSON.parse(optionContainer);

    function destroyIfEnabled() {
      if (sliderMain.classList.contains('flickity-enabled')) {
        productSlider?.destroy();
      }
    }

    if (sliderMain.hasAttribute("data-mobile-only")) {
      if ($(window).width() < 768) {
        if (!sliderMain.classList.contains('flickity-enabled')) {
          productSlider = new Flickity(sliderMain, options);
          setTimeout(() => productSlider.resize(), 300);
        }
      } else {
        destroyIfEnabled();
      }
    } else if (sliderMain.hasAttribute("data-desktop-only")) {
      if ($(window).width() >= 768) {
        if (!sliderMain.classList.contains('flickity-enabled')) {
          productSlider = new Flickity(sliderMain, options);
          setTimeout(() => productSlider.resize(), 300);
        }
      } else {
        destroyIfEnabled();
      }
    } else {
      if (!sliderMain.classList.contains('flickity-enabled')) {
        productSlider = new Flickity(sliderMain, options);
        setTimeout(() => productSlider.resize(), 300);
      }
    }

    if (productSlider) {
      productSlider.on('change', function () {
        pauseMedia(productSlider.element);
      });
    }
  }

  function initProductThumbSlider(section = document) {
    let sliderMain = section.querySelector('[data-flickity-product-thumb-slider]');
    if (!sliderMain) return;

    let optionContainer = sliderMain.getAttribute('data-flickity-product-thumb-slider');
    if (!optionContainer) return;

    let options = JSON.parse(optionContainer);

    function destroyIfEnabled() {
      if (sliderMain.classList.contains('flickity-enabled')) {
        productThumbSlider?.destroy();
      }
    }

    if (sliderMain.hasAttribute("data-mobile-only")) {
      if ($(window).width() < 768) {
        if (!sliderMain.classList.contains('flickity-enabled')) {
          productThumbSlider = new Flickity(sliderMain, options);
          setTimeout(() => productThumbSlider.resize(), 300);
        }
      } else {
        destroyIfEnabled();
      }
    } else if (sliderMain.hasAttribute("data-desktop-only")) {
      if ($(window).width() >= 768) {
        if (!sliderMain.classList.contains('flickity-enabled')) {
          productThumbSlider = new Flickity(sliderMain, options);
          setTimeout(() => productThumbSlider.resize(), 300);
        }
      } else {
        destroyIfEnabled();
      }
    } else {
      if (!sliderMain.classList.contains('flickity-enabled')) {
        productThumbSlider = new Flickity(sliderMain, options);
        setTimeout(() => productThumbSlider.resize(), 300);
      }
    }

    if (productThumbSlider) {
      productThumbSlider.on('change', function () {
        pauseMedia(productThumbSlider.element);
      });
    }
  }

  function findVisibleItems() {
    let mainSliderParent = document.getElementById('yv-product-gallery-slider');
    if (mainSliderParent) {
      let elements = mainSliderParent.getElementsByClassName('gallery-main-item');
      let thumbs = mainSliderParent.getElementsByClassName('gallery-thumbs-item');

      window.addEventListener('scroll', () => {
        Array.from(elements).forEach(item => {
          if (isOnScreen(item)) {
            let relatedThumb = mainSliderParent.querySelector('.gallery-thumbs-item[data-image="' + item.id + '"]');
            if (relatedThumb) {
              Array.from(thumbs).forEach(thumb => thumb.classList.remove('active'));
              relatedThumb.classList.add('active');
            }
          }
        });
      });
    }
    let mainTabsContent =  document.getElementById('yvProductFeatureListwrapper');
    if(mainTabsContent){
      let contentTabs = document.getElementsByClassName('yv-product-feature');	
      window.addEventListener('scroll', function(event){     
        Array.from(contentTabs).forEach(function(item) {
          if (isOnScreen(item)) {
            let headTabs = document.getElementsByClassName('feature-link');
            Array.from(headTabs).forEach(function(head) {
              head.parentNode.classList.remove('active');
            });
            var relatedHead = document.querySelector('.feature-link[href="#'+item.id+'"]');
            if(relatedHead){
              relatedHead.parentNode.classList.add('active');
            }
          }
        });
      });
    }
  }

  function sizeChart() {
    let sizeChartInit = document.querySelectorAll('.sizeChart-label');
    let sizeChartModel = document.getElementById('sizeChartModel');
    if (sizeChartInit && sizeChartModel) {
      let sizeChartClose = sizeChartModel.querySelector('#sizeChartClose');
      sizeChartInit.forEach(label => {
        label.addEventListener("click", e => {
          e.preventDefault();
          // $(sizeChartModel).fadeIn(100);
          document.body.classList.add('sizeChartOpen');
          sizeChartClose.focus();
        });
      });
      sizeChartClose.addEventListener("click", () => {
        document.body.classList.remove('sizeChartOpen');
        // $(sizeChartModel).fadeOut(100);
      });
    }
  }

  function initStickyAddToCart() {
    let stickyBar = document.getElementById('yvProductStickyBar');
    if (!stickyBar) return;

    // The sticky bar also contains a .main-product-form, so pick the one outside it
    let mainProductForm = Array.from(document.querySelectorAll('.main-product-form')).find((form) => !stickyBar.contains(form));
    if (!mainProductForm) return;
    let mainButton = mainProductForm.querySelector('[data-button-wrapper]') || mainProductForm;

    // Mobile only: show the sticky bar whenever the main add to cart button is off screen
    let mobileQuery = window.matchMedia('(max-width: 767px)');
    let mainButtonVisible = true;

    function updateStickyBar() {
      stickyBar.classList.toggle('show', mobileQuery.matches && !mainButtonVisible);
    }

    new IntersectionObserver((entries) => {
      mainButtonVisible = entries[0].isIntersecting;
      updateStickyBar();
    }).observe(mainButton);

    mobileQuery.addEventListener('change', updateStickyBar);
  }

  function onReadyEvent() {
    setTimeout(function () {
      var thumbnails = document.querySelector('.yv-product-gallery-thumbs-container');
      var lastKnownY = window.scrollY;
      var currentTop = 0;
      if (thumbnails) {
        var initialTopOffset = parseInt(window.getComputedStyle(thumbnails).top);
        window.addEventListener('scroll', function (event) {
          var bounds = thumbnails.getBoundingClientRect(),
            maxTop = bounds.top + window.scrollY - thumbnails.offsetTop + initialTopOffset,
            minTop = thumbnails.clientHeight - window.innerHeight;
          if (window.scrollY < lastKnownY) {
            currentTop -= window.scrollY - lastKnownY;
          } else {
            currentTop += lastKnownY - window.scrollY;
          }
          currentTop = Math.min(Math.max(currentTop, -minTop), maxTop, initialTopOffset);
          lastKnownY = window.scrollY;
          thumbnails.style.top = "".concat(currentTop, "px");
        });
      }
    }, 1000);

    // jQuery('body').on('click', '.gallery-thumbs-item', function (e) {
    //   e.preventDefault();
    //   var destination = jQuery(this).attr('data-image');
    //   var top = jQuery('.shopify-section-main-header').height() + 10;
    //   if (jQuery('#' + destination + '.gallery-main-item').length > 0) {
    //     jQuery('html,body').animate({ scrollTop: (jQuery('#' + destination + '.gallery-main-item').offset().top) - top });
    //   }
    // });

    jQuery('body').on('click', '.pdp-view-close', function (e) {
      e.preventDefault();
      jQuery('#yvProductStickyBar').remove();
    });

    jQuery('body').on('click', '.feature-link', function (e) {
      e.preventDefault();
      let destination = jQuery(this).attr('href');
      let top = jQuery('.shopify-section-main-header').height() + 90;
      if (jQuery(destination).length > 0) {
        jQuery('html,body').animate({ scrollTop: (jQuery(destination).offset().top) - top });
      }
    });

    jQuery('body').on('change', '.sticky-bar-product-options', function () {
      let _section = jQuery(this).closest('.shopify-section');
      let option = jQuery(this).attr('data-name');
      let value = jQuery(this).val();
      let mainOption = _section.find('.productOption[name="' + option + '"]');
      if (mainOption.is(':radio')) {
        _section.find('.productOption[name="' + option + '"][value="' + CSS.escape(value) + '"]').attr('checked', true).trigger('click');
      } else {
        mainOption.val(value);
        let sectionId = document.querySelector('#' + _section.attr('id'));
        if (sectionId) {
          let optionSelector = document.querySelector('.productOption[name="' + option + '"]');
          if (optionSelector) {
            optionSelector.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    });

    if (typeof fancySelector !== 'undefined') {
      Fancybox.bind(fancySelector, {
        touch: false,
        thumbs: {
          autoStart: true
        },
        on: {
          load: () => pauseMedia(document),
          done: () => pauseMedia(document)
        },
        Toolbar: {
          display: ["close"]
        }
      });
    }
  }

  function productZoomInit() {
    $('.yv-product-zoom').mouseenter(function (e) {
      $('.yv-product-zoom').removeClass('show');
      if ($(window).width() > 1021) {
        $(this).addClass('show');
      }
    });
    $('.yv-product-zoom').mousemove(function (e) {
      if ($(window).width() > 1021) {
        let t = getMousePos(e);
        this.querySelector('.gallery-cursor').style.translate = `${t.x}px ${t.y}px`;
      }
    });
    $('.yv-product-zoom').mouseleave(function (e) {
      $('.yv-product-zoom').removeClass('show');
    });
  }

  function load3DModel() {
    if (!window.Shopify) return;

    Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: () => {
          if (!window.ShopifyXR || typeof window.ShopifyXR.addModels !== 'function') {
            document.addEventListener('shopify_xr_initialized', () => {
              load3DModel();
            });
            return;
          }

          document.querySelectorAll('[id^="product3DModel-"]').forEach((model) => {
            window.ShopifyXR.addModels(JSON.parse(model.textContent));
          });
          window.ShopifyXR.setupXRElements();
        }

      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: () => {
          document.querySelectorAll('.yv-product-model-item').forEach((model) => {
            let model3D = model.querySelector('model-viewer');
            model.modelViewerUI = new Shopify.ModelViewerUI(model3D);
            model3D.addEventListener('shopify_model_viewer_ui_toggle_play', () => {
              model.querySelectorAll('.close-product-model').forEach(el => el.classList.remove('hidden'));
              if (productSlider) {
                productSlider.options.draggable = false;
                productSlider.updateDraggable();
              }
            });
            model3D.addEventListener('shopify_model_viewer_ui_toggle_pause', () => {
              model.querySelectorAll('.close-product-model').forEach(el => el.classList.add('hidden'));
              if (productSlider) {
                productSlider.options.draggable = true;
                productSlider.updateDraggable();
              }
            });
            model.querySelectorAll('.close-product-model').forEach(el => {
              el.addEventListener('click', () => model.modelViewerUI.pause());
            });
          });
        }
      }
    ]);
  }

  function initStackedGridScrollbar(section = document) {
    const wrappers = section.querySelectorAll('.yv-stacked-grid-wrapper');
    if (!wrappers.length) return;

    const isDesktop = () => window.innerWidth >= 768;

    function setStackedGridOffsetHeights() {
      const header = document.querySelector('header');
      const announcement = document.querySelector('.announcement-bar-section');
      const breadcrumb = document.querySelector('.breadcrumb-section, .breadcrumb');
      document.body.style.setProperty('--stacked-grid-header-height', (header ? header.getBoundingClientRect().height : 0) + 'px');
      document.body.style.setProperty('--stacked-grid-announcement-height', (announcement ? announcement.getBoundingClientRect().height : 0) + 'px');
      document.body.style.setProperty('--stacked-grid-breadcrumb-height', (breadcrumb ? breadcrumb.getBoundingClientRect().height : 0) + 'px');
    }

    wrappers.forEach((wrapper) => {
      if (wrapper.dataset.scrollbarInit === 'true') return;
      wrapper.dataset.scrollbarInit = 'true';

      const scrollArea = wrapper.querySelector('[data-grid-scroll-area]');
      const track = wrapper.querySelector('[data-grid-track]');
      const thumb = wrapper.querySelector('[data-grid-thumb]');
      const upBtn = wrapper.querySelector('[data-grid-scroll-up]');
      const downBtn = wrapper.querySelector('[data-grid-scroll-down]');
      if (!scrollArea || !track || !thumb) return;

      function updateThumb() {
        if (!isDesktop()) return;
        const trackHeight = track.clientHeight;
        const scrollableDistance = scrollArea.scrollHeight - scrollArea.clientHeight;
        const visibleRatio = scrollArea.clientHeight / scrollArea.scrollHeight;
        const thumbHeight = Math.min(trackHeight, Math.max(trackHeight * visibleRatio, 24));
        thumb.style.height = thumbHeight + 'px';
        const maxThumbTop = trackHeight - thumbHeight;
        const scrollRatio = scrollableDistance > 0 ? scrollArea.scrollTop / scrollableDistance : 0;
        thumb.style.top = (maxThumbTop * scrollRatio) + 'px';

        if (upBtn) upBtn.disabled = scrollArea.scrollTop <= 0;
        if (downBtn) downBtn.disabled = scrollableDistance <= 0 || scrollArea.scrollTop >= scrollableDistance - 1;
      }

      function scrollByAmount(direction) {
        scrollArea.scrollBy({ top: direction * Math.round(scrollArea.clientHeight * 0.4), behavior: 'smooth' });
      }

      function scrollToTrackOffset(clientY, smooth) {
        const trackRect = track.getBoundingClientRect();
        const thumbHeight = thumb.offsetHeight;
        let offsetY = clientY - trackRect.top - (thumbHeight / 2);
        offsetY = Math.max(0, Math.min(offsetY, trackRect.height - thumbHeight));
        const ratio = (trackRect.height - thumbHeight) > 0 ? offsetY / (trackRect.height - thumbHeight) : 0;
        const target = ratio * (scrollArea.scrollHeight - scrollArea.clientHeight);
        scrollArea.scrollTo({ top: target, behavior: smooth ? 'smooth' : 'auto' });
      }

      scrollArea.addEventListener('scroll', updateThumb, { passive: true });

      if (upBtn) {
        upBtn.addEventListener('click', () => scrollByAmount(-1));
      }
      if (downBtn) {
        downBtn.addEventListener('click', () => scrollByAmount(1));
      }

      let isDragging = false;
      thumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.body.classList.add('yv-grid-scrollbar-dragging');
        e.preventDefault();
      });
      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        scrollToTrackOffset(e.clientY, false);
      });
      document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.classList.remove('yv-grid-scrollbar-dragging');
      });

      track.addEventListener('click', (e) => {
        if (e.target === thumb) return;
        scrollToTrackOffset(e.clientY, true);
      });

      setStackedGridOffsetHeights();
      updateThumb();

      window.addEventListener('resize', () => {
        setStackedGridOffsetHeights();
        updateThumb();
      });

      if (window.ResizeObserver) {
        new ResizeObserver(updateThumb).observe(scrollArea);
      }

      const mobileTrack = wrapper.querySelector('[data-grid-mobile-track]');
      const pagination = wrapper.querySelector('[data-grid-pagination]');
      const allItems = mobileTrack ? Array.from(mobileTrack.children) : [];

      function isItemVisible(el) {
        return el.style.display !== 'none';
      }

      function updateGridSpanPattern() {
        if (!allItems.length) return;
        let visibleCount = 0;
        allItems.forEach((el) => {
          if (!isItemVisible(el)) {
            el.classList.remove('yv-span-full');
            return;
          }
          visibleCount += 1;
          el.classList.toggle('yv-span-full', visibleCount % 3 === 0);
        });
      }

      let dots = [];

      function buildDots() {
        if (!pagination) return;
        pagination.innerHTML = '';
        const visibleSlides = allItems.filter(isItemVisible);
        dots = visibleSlides.map((slide, index) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'yv-stacked-grid-pagination-dot' + (index === 0 ? ' is-active' : '');
          dot.setAttribute('aria-label', 'Go to image ' + (index + 1));
          dot.addEventListener('click', () => {
            mobileTrack.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
          });
          pagination.appendChild(dot);
          return { dot, slide };
        });
      }

      function updateActiveDot() {
        if (isDesktop() || !mobileTrack || !dots.length) return;
        const trackRect = mobileTrack.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;
        dots.forEach(({ slide }, index) => {
          const slideRect = slide.getBoundingClientRect();
          const slideCenter = slideRect.left + slideRect.width / 2;
          const distance = Math.abs(slideCenter - centerX);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });
        dots.forEach(({ dot }, index) => dot.classList.toggle('is-active', index === closestIndex));
      }

      function syncStackedGridVisibility() {
        updateGridSpanPattern();
        buildDots();
        updateActiveDot();
      }

      function resetGalleryScroll() {
        if (isDesktop()) {
          scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (mobileTrack) {
          mobileTrack.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }

      syncStackedGridVisibility();

      if (mobileTrack) {
        let scrollRAF = null;
        mobileTrack.addEventListener('scroll', () => {
          if (scrollRAF) return;
          scrollRAF = requestAnimationFrame(() => {
            updateActiveDot();
            scrollRAF = null;
          });
        }, { passive: true });
      }

      window.addEventListener('resize', updateActiveDot);

      if (allItems.length && window.MutationObserver) {
        const visibilityObserver = new MutationObserver(() => {
          syncStackedGridVisibility();
          resetGalleryScroll();
        });
        allItems.forEach((el) => {
          visibilityObserver.observe(el, { attributes: true, attributeFilter: ['style'] });
        });
      }
    });
  }

  function onLoad(section = document) {
    initProductSlider(section);
    initProductThumbSlider(section);
if (typeof findVisibleItems === 'function') {
  findVisibleItems();
}
    productZoomInit();
    sizeChart();
    initStickyAddToCart();
    load3DModel();
    initStackedGridScrollbar(section);
    onReadyEvent();
  }

  $(document).ready(function () {
    onLoad(document);
    onReadyEvent();

    function playVideo() {
      currentVideo = $('[data-reel-content] video')[0];
      if (currentVideo) {
        currentVideo.load();
        currentVideo.play();
      }
    }

    function pauseVideo() {
      if (currentVideo) {
        currentVideo.pause();
      }
    }
  });

  return {
    initProductSlider,
    initProductThumbSlider
  };
})();

if (document.querySelector('[data-flickity-product-slider]')) {
  window.addEventListener('resize', function(event) {
    Theme.Product.initProductSlider();
    Theme.Product.initProductThumbSlider();
    if (typeof findVisibleItems === 'function') {
      findVisibleItems();
    }
  });
}


