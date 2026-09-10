/**
 * KBS아카데미 원격평생교육원 - 메인 인터랙션 스크립트 (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initHeaderTicker();
  initDeskStatus();
  initGnbMegaMenu();
  initHeroSlider();
  initCountdownTimer();
  initStatsCountUp();
  initCourseTabs();
  initFloatingAndScrollTop();
  initUserQuickCard();
});

/* 1. 페이지 로딩 오버레이 (1초 후 사라짐) */
function initLoading() {
  const loadingEl = document.getElementById('page-loading');
  if (loadingEl) {
    setTimeout(() => {
      loadingEl.style.opacity = '0';
      loadingEl.style.pointerEvents = 'none';
      setTimeout(() => {
        if (loadingEl.parentNode) {
          loadingEl.parentNode.removeChild(loadingEl);
        }
      }, 500);
    }, 1000); // 1초(1000ms) 뒤 페이드아웃
  }
}

/* 2. 헤더 상단 롤링 배너 티커 */
function initHeaderTicker() {
  const tickerTrack = document.getElementById('header-ticker');
  if (!tickerTrack) return;

  const totalItems = 3;
  const itemHeight = 34;
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalItems;
    tickerTrack.style.transform = `translateY(-${currentIndex * itemHeight}px)`;
  }, 3200);
}

/* 3. 상단 상담 데스크 실시간 상태 계산 */
function initDeskStatus() {
  const dotEl = document.getElementById('desk-dot');
  const labelEl = document.getElementById('desk-label');
  const noteEl = document.getElementById('desk-note');

  if (!dotEl || !labelEl || !noteEl) return;

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0: 일요일, 6: 토요일
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeVal = hours * 60 + minutes;

    const startWork = 9 * 60 + 30;  // 09:30
    const endWork = 18 * 60 + 30;   // 18:30
    const startLunch = 12 * 60 + 30; // 12:30
    const endLunch = 13 * 60 + 30;   // 13:30

    if (day === 0 || day === 6) {
      // 주말
      dotEl.style.background = '#98A2B3';
      dotEl.style.animation = 'none';
      labelEl.textContent = '상담 대기 (주말 휴무)';
      noteEl.textContent = '온라인 상담신청 시 월요일 순차 연락';
    } else if (timeVal >= startLunch && timeVal < endLunch) {
      // 점심시간
      dotEl.style.background = '#F79009';
      dotEl.style.animation = 'omPulse 2s ease-in-out infinite';
      labelEl.textContent = '점심시간 안내';
      noteEl.textContent = '13:30부터 상담 가능 · 온라인 접수 가능';
    } else if (timeVal >= startWork && timeVal < endWork) {
      // 업무 시간
      dotEl.style.background = '#12B76A';
      dotEl.style.animation = 'omPulse 2s ease-in-out infinite';
      labelEl.textContent = '지금 상담 가능';
      noteEl.textContent = '평일 09:30~18:30 · 점심 12:30~13:30';
    } else {
      // 업무 외 시간
      dotEl.style.background = '#98A2B3';
      dotEl.style.animation = 'none';
      labelEl.textContent = '업무시간 종료';
      noteEl.textContent = '내일 오전 09:30부터 순차 상담';
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}

/* 4. GNB 메가메뉴 인터랙션 */
function initGnbMegaMenu() {
  const gnbNav = document.querySelector('.main-nav');
  const gnbItems = document.querySelectorAll('.gnb-item');
  const megaMenu = document.getElementById('gnb-megamenu');
  const megaCols = document.querySelectorAll('.megamenu-col');

  if (!gnbNav || !megaMenu) return;

  let closeTimer = null;

  gnbItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      if (closeTimer) clearTimeout(closeTimer);

      megaCols.forEach(col => col.classList.remove('highlight'));

      if (megaCols[index]) {
        megaCols[index].classList.add('highlight');
      }

      megaMenu.classList.add('active');
    });

    item.addEventListener('mouseleave', () => {
      closeTimer = setTimeout(() => {
        megaCols.forEach(col => col.classList.remove('highlight'));
        megaMenu.classList.remove('active');
      }, 150);
    });
  });

  megaMenu.addEventListener('mouseenter', () => {
    if (closeTimer) clearTimeout(closeTimer);
  });

  megaMenu.addEventListener('mouseleave', () => {
    closeTimer = setTimeout(() => {
      megaCols.forEach(col => col.classList.remove('highlight'));
      megaMenu.classList.remove('active');
    }, 150);
  });
}

/* 5. 히어로 슬라이더 (5개 슬라이드 완벽 회전 및 탭 연동) */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide-content');
  const slideBgs = document.querySelectorAll('.hero-slide-bg');
  const tabItems = document.querySelectorAll('.hero-tab-item');
  const dots = document.querySelectorAll('.hero-dot');
  const counterEl = document.getElementById('hero-counter');
  const btnPrev = document.getElementById('hero-prev');
  const btnNext = document.getElementById('hero-next');
  const heroContainer = document.querySelector('.hero-slider-container');

  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  let timer = null;

  function showSlide(index) {
    current = (index + total) % total;

    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === current);
    });

    slideBgs.forEach((bg, idx) => {
      bg.classList.toggle('active', idx === current);
    });

    tabItems.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === current);
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === current);
    });

    if (counterEl) {
      counterEl.textContent = `0${current + 1} / 0${total}`;
    }
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => {
      showSlide(current + 1);
    }, 6000);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // 슬라이드 컨텐츠에 마우스가 올라가면 롤링 멈춤, 벗어나면 재개
  slides.forEach((slide) => {
    slide.addEventListener('mouseenter', () => {
      stopAuto();
    });
    slide.addEventListener('mouseleave', () => {
      startAuto();
    });
  });

  // 탭 클릭
  tabItems.forEach((tab, idx) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(idx);
      startAuto();
    });
  });

  // 도트 클릭
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(idx);
      startAuto();
    });
  });

  // 이전/다음 버튼 클릭
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(current - 1);
      startAuto();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      showSlide(current + 1);
      startAuto();
    });
  }

  // 초기 슬라이드 설정 및 자동 회전 시작
  showSlide(0);
  startAuto();
}

/* 6. D-Day 실시간 카운트다운 타이머 */
function initCountdownTimer() {
  const d0 = document.getElementById('dday-d0');
  const d1 = document.getElementById('dday-d1');
  const h0 = document.getElementById('dday-h0');
  const h1 = document.getElementById('dday-h1');
  const m0 = document.getElementById('dday-m0');
  const m1 = document.getElementById('dday-m1');
  const s0 = document.getElementById('dday-s0');
  const s1 = document.getElementById('dday-s1');

  if (!d0 || !d1 || !h0 || !h1 || !m0 || !m1 || !s0 || !s1) return;

  const now = new Date();
  const targetDate = new Date(now.getTime() + (7 * 24 * 60 * 60 + 12 * 60 * 60 + 30 * 60) * 1000);

  function pad(num) {
    return num.toString().padStart(2, '0');
  }

  function updateTimer() {
    const current = new Date();
    const diff = targetDate - current;

    if (diff <= 0) {
      d0.textContent = '0'; d1.textContent = '0';
      h0.textContent = '0'; h1.textContent = '0';
      m0.textContent = '0'; m1.textContent = '0';
      s0.textContent = '0'; s1.textContent = '0';
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / (24 * 3600));
    const hours = Math.floor((totalSec % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const dStr = pad(days);
    const hStr = pad(hours);
    const mStr = pad(minutes);
    const sStr = pad(seconds);

    d0.textContent = dStr[0]; d1.textContent = dStr[1];
    h0.textContent = hStr[0]; h1.textContent = hStr[1];
    m0.textContent = mStr[0]; m1.textContent = mStr[1];
    s0.textContent = sStr[0]; s1.textContent = sStr[1];
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 7. 숫자 카운트업 인터랙션 */
function initStatsCountUp() {
  const statGrads = document.getElementById('stat-grads');
  const statDegrees = document.getElementById('stat-degrees');
  const statCourses = document.getElementById('stat-courses');
  const statRate = document.getElementById('stat-rate');
  const rateNum = document.getElementById('rate-num');
  const statsSection = document.getElementById('stats-section');

  if (!statsSection) return;

  function animateValue(element, start, end, duration, isFormatted = false) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(easeOut * (end - start) + start);

      element.textContent = isFormatted ? val.toLocaleString() : val;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = isFormatted ? end.toLocaleString() : end;
      }
    };
    window.requestAnimationFrame(step);
  }

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateValue(statGrads, 0, 4820, 1600, true);
        animateValue(statDegrees, 0, 2140, 1600, true);
        animateValue(statCourses, 0, 42, 1200, false);
        animateValue(statRate, 0, 96, 1200, false);
        animateValue(rateNum, 0, 99, 1400, false);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

/* 8. 개설과목 카테고리 탭 */
function initCourseTabs() {
  const tabs = document.querySelectorAll('.course-tab-link');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

/* 9. 플로팅 위젯 상시 표시 및 스크롤 상단 이동 */
function initFloatingAndScrollTop() {
  const btnScrollTop = document.getElementById('btn-scroll-top');

  if (btnScrollTop) {
    btnScrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* 10. 로그인 사용자 마이페이지 위젯 및 로그아웃 인터랙션 (main2.html) */
function initUserQuickCard() {
  const logoutBtns = document.querySelectorAll('.btn-header-logout, .floating-logout-link');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (btn.getAttribute('href') === '#' || !btn.getAttribute('href')) {
        e.preventDefault();
        if (confirm('로그아웃 하시겠습니까?')) {
          location.href = 'index.html';
        }
      }
    });
  });
}