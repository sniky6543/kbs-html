/**
 * KBS아카데미 원격평생교육원 - 모바일 메인 스크립트 (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initHeroSlider();
  initBadgeTicker();
  initStatsCountUp();
  initSideMenu();
  initConsultModal();
});

/* ==========================================================================
   1. D-Day 마감 카운트다운 타이머 (1초 간격 갱신)
   ========================================================================== */
function initCountdownTimer() {
  const elN0 = document.getElementById('ddayN0');
  const elN1 = document.getElementById('ddayN1');
  const elH0 = document.getElementById('ddayH0');
  const elH1 = document.getElementById('ddayH1');
  const elM0 = document.getElementById('ddayM0');
  const elM1 = document.getElementById('ddayM1');
  const elS0 = document.getElementById('ddayS0');
  const elS1 = document.getElementById('ddayS1');

  if (!elN0 && !elH0 && !elM0 && !elS0) return;

  // 개강 마감 타겟 시간: 현재 기준 7일 3시간 뒤 (샘플 D-day)
  const ddayTarget = new Date(Date.now() + 7 * 86400000 + 3 * 3600000);

  function updateTimer() {
    const now = Date.now();
    const diff = Math.max(0, ddayTarget - now);

    const ddayNstr = String(Math.ceil(diff / 86400000)).padStart(2, '0');
    const ddayH = String(Math.floor(diff / 3600000) % 24).padStart(2, '0');
    const ddayM = String(Math.floor(diff / 60000) % 60).padStart(2, '0');
    const ddayS = String(Math.floor(diff / 1000) % 60).padStart(2, '0');

    if (elN0) elN0.textContent = ddayNstr[0];
    if (elN1) elN1.textContent = ddayNstr[1];
    if (elH0) elH0.textContent = ddayH[0];
    if (elH1) elH1.textContent = ddayH[1];
    if (elM0) elM0.textContent = ddayM[0];
    if (elM1) elM1.textContent = ddayM[1];
    if (elS0) elS0.textContent = ddayS[0];
    if (elS1) elS1.textContent = ddayS[1];
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================
   2. 롤링 히어로 배너 슬라이더 (실시간 터치/스와이프 & 4초 자동 롤링)
   ========================================== */
function initHeroSlider() {
  const heroWrapper = document.querySelector('.mo-hero-wrapper');
  const heroTrack = document.getElementById('heroTrack');
  if (!heroTrack) return;
  const heroIndexLabel = document.getElementById('heroIndexLabel');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');

  const heroTabs = [
    document.getElementById('heroTab0'),
    document.getElementById('heroTab1'),
    document.getElementById('heroTab2'),
    document.getElementById('heroTab3'),
    document.getElementById('heroTab4')
  ];

  const heroDots = [
    document.getElementById('heroDot0'),
    document.getElementById('heroDot1'),
    document.getElementById('heroDot2'),
    document.getElementById('heroDot3'),
    document.getElementById('heroDot4')
  ];

  let currentIndex = 0;
  let heroTimer = null;
  const totalSlides = 5;

  function setHeroIndex(idx, animated = true) {
    currentIndex = (idx + totalSlides) % totalSlides;
    if (heroTrack) {
      if (animated) {
        heroTrack.style.transition = 'transform .45s cubic-bezier(.4, 0, .2, 1)';
      } else {
        heroTrack.style.transition = 'none';
      }
      heroTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (heroIndexLabel) {
      heroIndexLabel.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    // 탭 활성화 상태 변경
    const tabScroll = document.querySelector('.mo-hero-tab-scroll');
    heroTabs.forEach((tab, i) => {
      if (tab) {
        if (i === currentIndex) {
          tab.classList.add('active');
          if (tabScroll) {
            const targetLeft = tab.offsetLeft - (tabScroll.clientWidth - tab.clientWidth) / 2;
            tabScroll.scrollTo({ left: targetLeft, behavior: 'smooth' });
          }
        } else {
          tab.classList.remove('active');
        }
      }
    });

    // 닷 인디케이터 상태 변경
    heroDots.forEach((dot, i) => {
      if (dot) {
        if (i === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      }
    });
  }

  function startAutoPlay() {
    stopAutoPlay();
    heroTimer = setInterval(() => {
      setHeroIndex(currentIndex + 1);
    }, 4000);
  }

  function stopAutoPlay() {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
  }

  // 화살표 버튼 이벤트
  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setHeroIndex(currentIndex - 1);
      startAutoPlay();
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setHeroIndex(currentIndex + 1);
      startAutoPlay();
    });
  }

  // 탭 클릭 이벤트
  heroTabs.forEach((tab, idx) => {
    if (tab) {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroIndex(idx);
        startAutoPlay();
      });
    }
  });

  // 닷 클릭 이벤트
  heroDots.forEach((dot, idx) => {
    if (dot) {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        setHeroIndex(idx);
        startAutoPlay();
      });
    }
  });

  // ==========================================
  // 실시간 터치 & 마우스 드래그 스와이프 엔진
  // ==========================================
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let diffX = 0;
  let isHorizontalSwipe = null;
  let startTime = 0;

  function onDragStart(clientX, clientY) {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    currentX = clientX;
    diffX = 0;
    isHorizontalSwipe = null;
    startTime = Date.now();
    stopAutoPlay();

    if (heroTrack) {
      heroTrack.style.transition = 'none';
    }
    if (heroWrapper) {
      heroWrapper.classList.add('is-dragging');
    }
  }

  function onDragMove(clientX, clientY, e) {
    if (!isDragging) return;
    currentX = clientX;
    diffX = currentX - startX;
    const diffY = clientY - startY;

    // 가로 스와이프인지 세로 스크롤인지 초기 판별
    if (isHorizontalSwipe === null) {
      if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
        isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe) {
      if (e && e.cancelable) {
        e.preventDefault();
      }
      if (heroTrack) {
        heroTrack.style.transform = `translateX(calc(-${currentIndex * 100}% + ${diffX}px))`;
      }
    }
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    if (heroWrapper) {
      heroWrapper.classList.remove('is-dragging');
    }

    const elapsed = Date.now() - startTime;
    const threshold = 40; // 최소 이동 픽셀
    const isFlick = elapsed < 300 && Math.abs(diffX) > 25; // 빠른 제스처 감지

    if (isHorizontalSwipe && (Math.abs(diffX) > threshold || isFlick)) {
      if (diffX < 0) {
        // 오른쪽에서 왼쪽으로 스와이프 -> 다음 슬라이드
        setHeroIndex(currentIndex + 1);
      } else {
        // 왼쪽에서 오른쪽으로 스와이프 -> 이전 슬라이드
        setHeroIndex(currentIndex - 1);
      }
    } else {
      // 원래 슬라이드로 복귀
      setHeroIndex(currentIndex);
    }

    startAutoPlay();
  }

  if (heroTrack) {
    // 터치 이벤트
    heroTrack.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroTrack.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    heroTrack.addEventListener('touchend', () => {
      onDragEnd();
    }, { passive: true });

    heroTrack.addEventListener('touchcancel', () => {
      onDragEnd();
    }, { passive: true });

    // 데스크톱 마우스 드래그 이벤트 (호환성 지원)
    heroTrack.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // 좌클릭만
        onDragStart(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        onDragMove(e.clientX, e.clientY, e);
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        onDragEnd();
      }
    });
  }

  // 초기 시작
  setHeroIndex(0, false);
  startAutoPlay();
}

/* ==========================================================================
   3. 인증 배지 세로 롤링 티커 (반응형 동적 높이 계산 및 리사이즈 지원)
   ========================================================================== */
function initBadgeTicker() {
  const badgeTrack = document.getElementById('badgeTrack');
  const badgeBox = document.querySelector('.mo-badge-ticker-box');
  if (!badgeTrack || !badgeBox) return;

  let badgeIndex = 0;
  const slides = badgeTrack.children;
  const totalBadges = slides.length > 1 ? slides.length - 1 : 1;

  function getSlideHeight() {
    return badgeBox.offsetHeight || (slides[0] ? slides[0].offsetHeight : 32);
  }

  setInterval(() => {
    badgeIndex++;
    const h = getSlideHeight();
    badgeTrack.style.transition = 'transform .5s cubic-bezier(.5, 0, .2, 1)';
    badgeTrack.style.transform = `translateY(-${badgeIndex * h}px)`;

    if (badgeIndex >= totalBadges) {
      setTimeout(() => {
        badgeTrack.style.transition = 'none';
        badgeTrack.style.transform = 'translateY(0)';
        badgeIndex = 0;
      }, 500);
    }
  }, 3200);

  // 반응형 화면 크기 변경 시 오차 없이 위치 실시간 보정
  window.addEventListener('resize', () => {
    if (badgeIndex > 0) {
      const h = getSlideHeight();
      badgeTrack.style.transition = 'none';
      badgeTrack.style.transform = `translateY(-${badgeIndex * h}px)`;
    }
  });
}

/* ==========================================================================
   4. 숫자로 보는 KBS아카데미 카운트업 애니메이션 (IntersectionObserver)
   ========================================================================== */
function initStatsCountUp() {
  const statsCard = document.getElementById('mobStatsCard');
  if (!statsCard) return;

  const targets = [
    { el: document.getElementById('statGrads'), target: 4820 },
    { el: document.getElementById('statDegrees'), target: 2140 },
    { el: document.getElementById('statCourses'), target: 42 },
    { el: document.getElementById('statRate'), target: 96 },
    { el: document.getElementById('statRate2'), target: 99 }
  ];

  let animated = false;

  function runCountUp() {
    if (animated) return;
    animated = true;

    targets.forEach(({ el, target }) => {
      if (!el) return;
      const duration = 1200; // ms
      const startTime = performance.now();

      function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic easeOut
        const currentVal = Math.floor(easeProgress * target);

        el.textContent = currentVal.toLocaleString('ko-KR');

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString('ko-KR');
        }
      }

      requestAnimationFrame(step);
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCountUp();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsCard);
  } else {
    runCountUp();
  }
}

/* ==========================================================================
   5. 사이드 메뉴 드로어 & 아코디언 메뉴
   ========================================================================== */
function initSideMenu() {
  const btnOpenMenu = document.getElementById('btnOpenMenu');
  const sideMenuOverlay = document.getElementById('sideMenuOverlay');
  if (!sideMenuOverlay) return;

  // 중복 초기화 방지
  if (sideMenuOverlay.dataset.initialized === 'true') return;
  sideMenuOverlay.dataset.initialized = 'true';

  function openSideMenu() {
    sideMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSideMenu() {
    sideMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnOpenMenu) {
    btnOpenMenu.addEventListener('click', (e) => {
      e.preventDefault();
      openSideMenu();
    });
  }

  // 닫기 버튼들 (로그인 전/후 다중 버튼 지원)
  const closeButtons = document.querySelectorAll('#btnCloseMenu, .mo-side-btn-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeSideMenu();
    });
  });

  sideMenuOverlay.addEventListener('click', (e) => {
    if (e.target === sideMenuOverlay) {
      closeSideMenu();
    }
  });

  // 아코디언 메뉴 토글 (모든 .mo-side-acc-header 지원)
  const accHeaders = document.querySelectorAll('.mo-side-acc-header');
  accHeaders.forEach((header) => {
    header.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = header.closest('div');
      const panel = parent ? parent.querySelector('.acc-panel') : null;
      const icon = header.querySelector('.mo-side-acc-icon span') || header.querySelector('.mo-side-acc-icon');

      if (!panel) return;

      const isAlreadyActive = panel.classList.contains('active');

      // 다른 모든 아코디언 패널 닫기
      document.querySelectorAll('.acc-panel').forEach(p => {
        p.classList.remove('active');
      });
      document.querySelectorAll('.mo-side-acc-icon span, .mo-side-acc-icon').forEach(ic => {
        if (ic.tagName === 'SPAN' && ic.children.length === 0) {
          ic.textContent = 'expand_more';
        }
      });

      // 현재 패널 토글
      if (!isAlreadyActive) {
        panel.classList.add('active');
        if (icon) icon.textContent = 'expand_less';
      }
    });
  });
}

/* ==========================================================================
   6. 빠른상담신청 플로팅 모달 & 개인정보 약관 보기
   ========================================================================== */
function initConsultModal() {
  const consultModal = document.getElementById('consultModal');
  if (!consultModal) return;

  if (consultModal.dataset.initialized === 'true') return;
  consultModal.dataset.initialized = 'true';

  const btnCloseConsult = document.getElementById('btnCloseConsult');
  const openConsultButtons = document.querySelectorAll('.btn-open-consult');
  const btnTogglePrivacy = document.getElementById('btnTogglePrivacy');
  const privacyInfoBox = document.getElementById('privacyInfoBox');
  const privacyInfoLabel = document.getElementById('privacyInfoLabel');

  function openConsult() {
    consultModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeConsult() {
    consultModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openConsultButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsult();
    });
  });

  if (btnCloseConsult) {
    btnCloseConsult.addEventListener('click', (e) => {
      e.preventDefault();
      closeConsult();
    });
  }

  consultModal.addEventListener('click', (e) => {
    if (e.target === consultModal) {
      closeConsult();
    }
  });

  // 개인정보 보기/닫기 토글
  if (btnTogglePrivacy && privacyInfoBox) {
    btnTogglePrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      const isVisible = privacyInfoBox.classList.contains('active');
      if (isVisible) {
        privacyInfoBox.classList.remove('active');
        if (privacyInfoLabel) privacyInfoLabel.textContent = '보기';
      } else {
        privacyInfoBox.classList.add('active');
        if (privacyInfoLabel) privacyInfoLabel.textContent = '닫기';
      }
    });
  }
}