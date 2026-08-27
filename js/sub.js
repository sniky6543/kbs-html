/**
 * KBS아카데미 원격평생교육원 - 서브페이지 전용 스크립트 (Vanilla JS)
 * - 공통 기능(Page Loading, Header Ticker, Desk Status, GNB MegaMenu, Floating Widget & Scroll Top)은 main.js에서 처리됩니다.
 * - sub.js는 서브페이지 전용 인터랙션(빠른상담 폼 등)만 담당합니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuickConsultationForm();
  initCreditTargetTabs();
  initApplyGuideTabs();
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


