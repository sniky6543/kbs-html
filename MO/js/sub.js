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
  initNoticeDetail();
  initQnaWrite();
  initFreePlan();
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
  const consultModal = document.getElementById('consultModal') || document.getElementById('modalQuickConsult');
  if (!consultModal) return;

  if (consultModal.dataset.initialized === 'true') return;
  consultModal.dataset.initialized = 'true';

  const closeButtons = document.querySelectorAll('#btnCloseConsult, #btnCloseQuickConsult, .mo-consult-btn-close');
  const openConsultButtons = document.querySelectorAll('.btn-open-consult, .mo-btn-float-consult');
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

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeConsult();
    });
  });

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

/* ==========================================================================
   7. 공지사항 상세 (view.html) 인터랙션 로직
   ========================================================================== */
function initNoticeDetail() {
  const commentForm = document.querySelector('.mo-view-comment-form');
  const commentInput = document.querySelector('.mo-view-comment-input');
  const commentList = document.querySelector('.mo-view-comment-list');
  const commentCountEl = document.querySelector('.mo-view-comment-count-highlight');
  const attachBox = document.querySelector('.mo-view-attach-box');

  // 댓글 등록 처리
  if (commentForm && commentInput && commentList) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const commentText = commentInput.value.trim();
      if (!commentText) {
        alert('댓글을 입력해 주세요.');
        commentInput.focus();
        return;
      }

      // 오늘 날짜 포맷 (YYYY-MM-DD)
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      // 신규 댓글 엘리먼트 생성
      const newComment = document.createElement('div');
      newComment.className = 'mo-view-comment-item';
      newComment.innerHTML = `
        <div class="mo-view-comment-author-row">
          <div class="mo-view-comment-author">학습자**</div>
          <div class="mo-view-comment-date">${dateStr}</div>
        </div>
        <div class="mo-view-comment-txt">${commentText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      `;

      commentList.appendChild(newComment);
      commentInput.value = '';

      // 댓글 카운트 증가
      if (commentCountEl) {
        const currentCount = parseInt(commentCountEl.textContent, 10) || 0;
        commentCountEl.textContent = String(currentCount + 1);
      }

      alert('댓글이 등록되었습니다.');
    });
  }

  // 첨부파일 다운로드 시뮬레이션
  if (attachBox) {
    attachBox.addEventListener('click', (e) => {
      const filename = attachBox.querySelector('.mo-view-attach-filename')?.textContent || '첨부파일';
      console.log(`[Download] File download initiated: ${filename}`);
    });
  }

  // 뒤로가기 버튼 처리 (히스토리가 있는 경우 history.back() 지원)
  const btnBack = document.querySelector('.mo-btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      if (window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
        e.preventDefault();
        window.history.back();
      }
    });
  }
}

/* ==========================================================================
   8. 질문과답변 작성 (write.html) 인터랙션 로직
   ========================================================================== */
function initQnaWrite() {
  const qnaForm = document.getElementById('formQnaWrite') || document.querySelector('.mo-write-form-sec');
  const captchaBox = document.getElementById('captchaCodeBox');
  const btnRefreshCaptcha = document.getElementById('btnRefreshCaptcha');
  const inputTitle = document.getElementById('qnaTitle');
  const inputContent = document.getElementById('qnaContent');
  const inputCaptcha = document.getElementById('qnaCaptchaInput');
  const modalDone = document.getElementById('modalWriteDone');
  const btnCloseDone = document.getElementById('btnCloseWriteDone');

  if (!qnaForm && !captchaBox) return;

  let currentCaptcha = '8H3K';

  function genCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  }

  function setCaptcha(code) {
    currentCaptcha = code;
    if (captchaBox) {
      captchaBox.textContent = code;
    }
  }

  // 초기 보안문자 생성
  setCaptcha(genCaptcha());

  // 새로고침 버튼 이벤트
  if (btnRefreshCaptcha) {
    btnRefreshCaptcha.addEventListener('click', (e) => {
      e.preventDefault();
      setCaptcha(genCaptcha());
      if (inputCaptcha) inputCaptcha.value = '';
    });
  }

  // 폼 제출 이벤트
  if (qnaForm) {
    qnaForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const titleVal = inputTitle ? inputTitle.value.trim() : '';
      const contentVal = inputContent ? inputContent.value.trim() : '';
      const captchaVal = inputCaptcha ? inputCaptcha.value.trim() : '';

      if (!titleVal) {
        alert('제목을 입력해 주세요.');
        if (inputTitle) inputTitle.focus();
        return;
      }

      if (!contentVal) {
        alert('문의하실 내용을 자세히 적어주세요.');
        if (inputContent) inputContent.focus();
        return;
      }

      if (!captchaVal) {
        alert('보안문자를 입력해 주세요.');
        if (inputCaptcha) inputCaptcha.focus();
        return;
      }

      if (captchaVal.toUpperCase() !== currentCaptcha.toUpperCase()) {
        alert('보안문자가 일치하지 않습니다. 다시 입력해 주세요.');
        setCaptcha(genCaptcha());
        if (inputCaptcha) {
          inputCaptcha.value = '';
          inputCaptcha.focus();
        }
        return;
      }

      // 등록 성공 모달 표시
      if (modalDone) {
        modalDone.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        alert('문의가 성공적으로 등록되었습니다.');
        window.location.href = 'https://www.lcyber.co.kr/bbs/board_list.asp?tb_name=qna';
      }
    });
  }

  // 모달 닫기
  if (modalDone) {
    if (btnCloseDone) {
      btnCloseDone.addEventListener('click', (e) => {
        modalDone.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modalDone.addEventListener('click', (e) => {
      if (e.target === modalDone) {
        modalDone.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   9. 무료학습설계 (m5s7.html) 인터랙션 로직
   ========================================================================== */
function initFreePlan() {
  const planForm = document.getElementById('formFreePlan') || document.querySelector('.mo-plan-form-sec');
  const modalPrivacy = document.getElementById('modalPrivacyPlan');
  const btnOpenPrivacy = document.getElementById('btnOpenPrivacyModal');
  const btnClosePrivacy = document.getElementById('btnClosePrivacyPlan');
  const btnConfirmPrivacy = document.getElementById('btnConfirmPrivacyPlan');
  const chkPrivacy = document.getElementById('planPrivacyChk');
  const modalDone = document.getElementById('modalPlanDone');
  const btnCloseDone = document.getElementById('btnClosePlanDone');

  if (!planForm && !modalPrivacy) return;

  // 개인정보 수집 및 이용 동의 모달 열기
  if (btnOpenPrivacy && modalPrivacy) {
    btnOpenPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      modalPrivacy.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  // 개인정보 모달 닫기 / 확인
  function closePrivacyModal() {
    if (modalPrivacy) {
      modalPrivacy.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnClosePrivacy) {
    btnClosePrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      closePrivacyModal();
    });
  }

  if (btnConfirmPrivacy) {
    btnConfirmPrivacy.addEventListener('click', (e) => {
      e.preventDefault();
      if (chkPrivacy) chkPrivacy.checked = true;
      closePrivacyModal();
    });
  }

  if (modalPrivacy) {
    modalPrivacy.addEventListener('click', (e) => {
      if (e.target === modalPrivacy) {
        closePrivacyModal();
      }
    });
  }

  // 폼 제출 유효성 검사 및 신청 처리
  if (planForm) {
    planForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputName = document.getElementById('planName');
      const inputEmail = document.getElementById('planEmail');
      const inputPhone2 = document.getElementById('planPhone2');
      const inputPhone3 = document.getElementById('planPhone3');

      const nameVal = inputName ? inputName.value.trim() : '';
      const emailVal = inputEmail ? inputEmail.value.trim() : '';
      const phone2Val = inputPhone2 ? inputPhone2.value.trim() : '';
      const phone3Val = inputPhone3 ? inputPhone3.value.trim() : '';

      if (!nameVal) {
        alert('이름을 입력해 주세요.');
        if (inputName) inputName.focus();
        return;
      }

      if (!emailVal) {
        alert('이메일을 입력해 주세요.');
        if (inputEmail) inputEmail.focus();
        return;
      }

      if (!phone2Val || !phone3Val) {
        alert('연락처를 정확히 입력해 주세요.');
        if (inputPhone2 && !phone2Val) inputPhone2.focus();
        else if (inputPhone3) inputPhone3.focus();
        return;
      }

      if (chkPrivacy && !chkPrivacy.checked) {
        alert('개인정보수집 및 이용에 동의해 주세요.');
        chkPrivacy.focus();
        return;
      }

      // 신청 완료 모달 표시
      if (modalDone) {
        modalDone.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        alert('무료학습설계 신청이 성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        planForm.reset();
      }
    });
  }

  // 완료 모달 닫기
  if (modalDone) {
    if (btnCloseDone) {
      btnCloseDone.addEventListener('click', (e) => {
        modalDone.classList.remove('active');
        document.body.style.overflow = '';
        if (planForm) planForm.reset();
      });
    }

    modalDone.addEventListener('click', (e) => {
      if (e.target === modalDone) {
        modalDone.classList.remove('active');
        document.body.style.overflow = '';
        if (planForm) planForm.reset();
      }
    });
  }
}