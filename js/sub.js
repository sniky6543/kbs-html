/**
 * KBS아카데미 원격평생교육원 - 서브페이지 전용 스크립트 (Vanilla JS)
 * - 공통 기능(Page Loading, Header Ticker, Desk Status, GNB MegaMenu, Floating Widget & Scroll Top)은 main.js에서 처리됩니다.
 * - sub.js는 서브페이지 전용 인터랙션(빠른상담 폼, 탭 전환, 모달 등)만 담당합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuickConsultationForm();
  initCreditTargetTabs();
  initApplyGuideTabs();
  initCourseFilterTabs();
  initCourseSyllabusModal();
});

/* 서브페이지 하단 빠른상담 신청 폼 검증 & 전송 처리 */
function initQuickConsultationForm() {
  const quickForm = document.querySelector('form[name="frmcounsel_bottom"]');
  if (!quickForm) return;

  quickForm.addEventListener('submit', (e) => {
    const gubun = quickForm.querySelector('select[name="gubun"]');
    const name = quickForm.querySelector('input[name="name"]');
    const tel2 = quickForm.querySelector('input[name="hptel2"]');
    const tel3 = quickForm.querySelector('input[name="hptel3"]');
    const chkAgree = quickForm.querySelector('input[name="chkx"]');

    if (gubun && (!gubun.value || gubun.value === '희망과정 선택')) {
      alert('희망하시는 교육과정을 선택해 주세요.');
      gubun.focus();
      e.preventDefault();
      return;
    }

    if (name && !name.value.trim()) {
      alert('이름을 입력해 주세요.');
      name.focus();
      e.preventDefault();
      return;
    }

    if ((tel2 && !tel2.value.trim()) || (tel3 && !tel3.value.trim())) {
      alert('연락처를 정확히 입력해 주세요.');
      if (tel2 && !tel2.value.trim()) tel2.focus();
      else if (tel3) tel3.focus();
      e.preventDefault();
      return;
    }

    if (chkAgree && !chkAgree.checked) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      chkAgree.focus();
      e.preventDefault();
      return;
    }
  });
}

/* 학점인정대상 (sub02_02) 탭 전환 기능 */
function initCreditTargetTabs() {
  const tabBtns = document.querySelectorAll('.credit-target-tab-btn');
  const tabPanes = document.querySelectorAll('.credit-target-tab-pane');
  if (!tabBtns.length || !tabPanes.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* 신청방법안내 (sub02_03) 탭 전환 기능 */
function initApplyGuideTabs() {
  const tabBtns = document.querySelectorAll('.apply-guide-tab-btn');
  const tabPanes = document.querySelectorAll('.apply-guide-tab-pane');
  if (!tabBtns.length || !tabPanes.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* 개설과목안내 (sub04_01) 과목 분류 탭 필터링 */
function initCourseFilterTabs() {
  const tabBtns = document.querySelectorAll('.course-tab-btn');
  const courseRows = document.querySelectorAll('.course-table-row');
  if (!tabBtns.length || !courseRows.length) return;

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const filter = btn.getAttribute('data-filter');

      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      courseRows.forEach((row) => {
        const category = row.getAttribute('data-category') || '';
        if (!filter || filter === 'all' || category.includes(filter)) {
          row.style.display = 'flex';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* 개설과목안내 (sub04_01) 강의계획서 모달 팝업 */
function initCourseSyllabusModal() {
  const modalOverlay = document.getElementById('course-modal-overlay');
  if (!modalOverlay) return;

  const planButtons = document.querySelectorAll('.btn-plan-view');
  const closeButtons = modalOverlay.querySelectorAll('.course-modal-close-btn, .btn-modal-cancel');
  const modalTabBtns = modalOverlay.querySelectorAll('.course-modal-tab-btn');
  const modalPanes = modalOverlay.querySelectorAll('.course-modal-pane');

  const titleEl = document.getElementById('modal-course-title');
  const profEl = document.getElementById('modal-course-prof');
  const creditsEl = document.getElementById('modal-course-credits');
  const gubunEl = document.getElementById('modal-course-gubun');

  // 모달 열기
  planButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = btn.closest('.course-table-row');
      if (!row) return;

      const title = row.getAttribute('data-title') || '';
      const prof = row.getAttribute('data-prof') || '';
      const credits = row.getAttribute('data-credits') || '3학점';
      const gubun = row.getAttribute('data-gubun') || '';

      if (titleEl) titleEl.textContent = title;
      if (profEl) profEl.textContent = prof;
      if (creditsEl) creditsEl.textContent = credits;
      if (gubunEl) gubunEl.textContent = gubun;

      // 탭을 첫 번째 탭(강의계획서)으로 초기화
      modalTabBtns.forEach((b, idx) => {
        b.classList.toggle('active', idx === 0);
      });
      modalPanes.forEach((p, idx) => {
        p.classList.toggle('active', idx === 0);
      });

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // 모달 닫기
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  // 배경 클릭 시 닫기
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC 키 누를 시 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // 모달 내 탭 전환 (강의계획서 vs 강의목차)
  modalTabBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-modal-tab');

      modalTabBtns.forEach((b) => b.classList.remove('active'));
      modalPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}