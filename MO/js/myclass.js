/**
 * KBS아카데미 원격평생교육원 - 나의 강의실, 강의실 내부, 1:1 학습상담, 강의계획서 및 강의수강 스크립트 (myclass.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMyclassRoom();
  initLectureRoom();
  initConsultRoom();
  initPlanRoom();
  initUnitRoom();
});

/* ==========================================================================
   1. 나의 강의실 메인 인터랙션 (main.html)
   ========================================================================== */
function initMyclassRoom() {
  const overlay = document.getElementById('sideMenuMyclassOverlay');
  const btnOpen = document.getElementById('btnOpenMyclassMenu');
  const btnClose = document.getElementById('btnCloseMyclassMenu');
  const container = document.getElementById('sideMenuMyclassContainer');
  const btnNoticeBox = document.getElementById('btnMyclassNoticeBox');

  if (btnOpen && overlay) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeSideMenu() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeSideMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSideMenu();
      }
    });
  }

  if (container) {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  if (btnNoticeBox) {
    btnNoticeBox.addEventListener('click', (e) => {
      e.preventDefault();
      alert('도착한 새로운 알림이 없습니다.');
    });
  }
}

/* ==========================================================================
   2. 강의실 내부 메인 인터랙션 (main_lecture.html)
   ========================================================================== */
function initLectureRoom() {
  const overlay = document.getElementById('sideMenuRoomOverlay');
  const btnOpen = document.getElementById('btnOpenRoomMenu');
  const btnClose = document.getElementById('btnCloseRoomMenu');
  const container = document.getElementById('sideMenuRoomContainer');
  const btnNoticeBox = document.getElementById('btnRoomNoticeBox');

  if (btnOpen && overlay) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeRoomMenu() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeRoomMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeRoomMenu();
      }
    });
  }

  if (container) {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 아코디언 토글
  const accToggleM1 = document.getElementById('btnToggleM1');
  const accPanelM1 = document.getElementById('panelM1');
  const accIconM1 = document.getElementById('iconM1');

  if (accToggleM1 && accPanelM1 && accIconM1) {
    accToggleM1.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM1.classList.toggle('is-collapsed');
      accIconM1.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  const accToggleM2 = document.getElementById('btnToggleM2');
  const accPanelM2 = document.getElementById('panelM2');
  const accIconM2 = document.getElementById('iconM2');

  if (accToggleM2 && accPanelM2 && accIconM2) {
    accToggleM2.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM2.classList.toggle('is-collapsed');
      accIconM2.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  if (btnNoticeBox) {
    btnNoticeBox.addEventListener('click', (e) => {
      e.preventDefault();
      alert('도착한 새로운 알림이 없습니다.');
    });
  }
}

/* ==========================================================================
   3. 1:1 학습상담 인터랙션 (view_list.html)
   ========================================================================== */
function initConsultRoom() {
  const overlay = document.getElementById('sideMenuConsultOverlay');
  const btnOpen = document.getElementById('btnOpenConsultMenu');
  const btnClose = document.getElementById('btnCloseConsultMenu');
  const container = document.getElementById('sideMenuConsultContainer');
  const btnNoticeBox = document.getElementById('btnConsultNoticeBox');

  if (btnOpen && overlay) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeConsultMenu() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeConsultMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeConsultMenu();
      }
    });
  }

  if (container) {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 아코디언 토글
  const accToggleM1 = document.getElementById('btnConsultToggleM1');
  const accPanelM1 = document.getElementById('panelConsultM1');
  const accIconM1 = document.getElementById('iconConsultM1');

  if (accToggleM1 && accPanelM1 && accIconM1) {
    accToggleM1.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM1.classList.toggle('is-collapsed');
      accIconM1.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  const accToggleM2 = document.getElementById('btnConsultToggleM2');
  const accPanelM2 = document.getElementById('panelConsultM2');
  const accIconM2 = document.getElementById('iconConsultM2');

  if (accToggleM2 && accPanelM2 && accIconM2) {
    accToggleM2.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM2.classList.toggle('is-collapsed');
      accIconM2.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  // 글쓰기 폼 열기/닫기 토글
  const btnOpenWrite = document.getElementById('btnOpenConsultWrite');
  const formCard = document.getElementById('formConsultWriteCard');
  const btnSubmitWrite = document.getElementById('btnSubmitConsultWrite');
  const inputTitle = document.getElementById('inputConsultTitle');
  const inputContent = document.getElementById('inputConsultContent');

  if (btnOpenWrite && formCard && btnSubmitWrite) {
    btnOpenWrite.addEventListener('click', (e) => {
      e.preventDefault();
      btnOpenWrite.classList.add('is-hidden');
      formCard.classList.remove('is-hidden');
      btnSubmitWrite.classList.remove('is-hidden');
      if (inputTitle) inputTitle.focus();
    });

    btnSubmitWrite.addEventListener('click', (e) => {
      e.preventDefault();
      const titleVal = inputTitle ? inputTitle.value.trim() : '';
      const contentVal = inputContent ? inputContent.value.trim() : '';

      if (!titleVal) {
        alert('제목을 입력해주세요.');
        if (inputTitle) inputTitle.focus();
        return;
      }
      if (!contentVal) {
        alert('내용을 입력해주세요.');
        if (inputContent) inputContent.focus();
        return;
      }

      alert('1:1 학습상담이 등록되었습니다.');
      if (inputTitle) inputTitle.value = '';
      if (inputContent) inputContent.value = '';

      formCard.classList.add('is-hidden');
      btnSubmitWrite.classList.add('is-hidden');
      btnOpenWrite.classList.remove('is-hidden');
    });
  }

  if (btnNoticeBox) {
    btnNoticeBox.addEventListener('click', (e) => {
      e.preventDefault();
      alert('도착한 새로운 알림이 없습니다.');
    });
  }
}

/* ==========================================================================
   4. 강의계획서 인터랙션 (lecture_plan.html)
   ========================================================================== */
function initPlanRoom() {
  const overlay = document.getElementById('sideMenuPlanOverlay');
  const btnOpen = document.getElementById('btnOpenPlanMenu');
  const btnClose = document.getElementById('btnClosePlanMenu');
  const container = document.getElementById('sideMenuPlanContainer');
  const btnNoticeBox = document.getElementById('btnPlanNoticeBox');

  if (btnOpen && overlay) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closePlanMenu() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closePlanMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closePlanMenu();
      }
    });
  }

  if (container) {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 아코디언 토글
  const accToggleM1 = document.getElementById('btnPlanToggleM1');
  const accPanelM1 = document.getElementById('panelPlanM1');
  const accIconM1 = document.getElementById('iconPlanM1');

  if (accToggleM1 && accPanelM1 && accIconM1) {
    accToggleM1.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM1.classList.toggle('is-collapsed');
      accIconM1.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  const accToggleM2 = document.getElementById('btnPlanToggleM2');
  const accPanelM2 = document.getElementById('panelPlanM2');
  const accIconM2 = document.getElementById('iconPlanM2');

  if (accToggleM2 && accPanelM2 && accIconM2) {
    accToggleM2.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM2.classList.toggle('is-collapsed');
      accIconM2.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  // 주차별 강의내용 토글 (1주차 ~ 15주차)
  const weekButtons = document.querySelectorAll('.mo-plan-btn-toggle');
  weekButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const isHidden = targetEl.classList.toggle('is-hidden');
        btn.textContent = isHidden ? '내용보기' : '내용접기';
      }
    });
  });

  if (btnNoticeBox) {
    btnNoticeBox.addEventListener('click', (e) => {
      e.preventDefault();
      alert('도착한 새로운 알림이 없습니다.');
    });
  }
}

/* ==========================================================================
   5. 강의수강 인터랙션 (lecture_unit.html)
   ========================================================================== */
function initUnitRoom() {
  const overlay = document.getElementById('sideMenuUnitOverlay');
  const btnOpen = document.getElementById('btnOpenUnitMenu');
  const btnClose = document.getElementById('btnCloseUnitMenu');
  const container = document.getElementById('sideMenuUnitContainer');
  const btnNoticeBox = document.getElementById('btnUnitNoticeBox');

  if (btnOpen && overlay) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeUnitMenu() {
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeUnitMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeUnitMenu();
      }
    });
  }

  if (container) {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // 아코디언 토글
  const accToggleM1 = document.getElementById('btnUnitToggleM1');
  const accPanelM1 = document.getElementById('panelUnitM1');
  const accIconM1 = document.getElementById('iconUnitM1');

  if (accToggleM1 && accPanelM1 && accIconM1) {
    accToggleM1.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM1.classList.toggle('is-collapsed');
      accIconM1.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  const accToggleM2 = document.getElementById('btnUnitToggleM2');
  const accPanelM2 = document.getElementById('panelUnitM2');
  const accIconM2 = document.getElementById('iconUnitM2');

  if (accToggleM2 && accPanelM2 && accIconM2) {
    accToggleM2.addEventListener('click', (e) => {
      e.preventDefault();
      const isCollapsed = accPanelM2.classList.toggle('is-collapsed');
      accIconM2.textContent = isCollapsed ? 'expand_more' : 'expand_less';
    });
  }

  // 강의 학습하기 / 복습하기 클릭 인터랙션
  const studyButtons = document.querySelectorAll('.mo-unit-btn-study');
  studyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.mo-unit-card');
      const title = card ? card.querySelector('.mo-unit-title')?.textContent.trim() : '강의';
      alert(`[${title}]\n강의 학습을 시작합니다.`);
    });
  });

  const reviewButtons = document.querySelectorAll('.mo-unit-btn-review');
  reviewButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.mo-unit-card');
      const title = card ? card.querySelector('.mo-unit-title')?.textContent.trim() : '강의';
      alert(`[${title}]\n강의 복습을 시작합니다.`);
    });
  });

  if (btnNoticeBox) {
    btnNoticeBox.addEventListener('click', (e) => {
      e.preventDefault();
      alert('도착한 새로운 알림이 없습니다.');
    });
  }
}