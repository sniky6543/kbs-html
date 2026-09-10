/**
 * KBS아카데미 원격평생교육원 - 서브페이지 전용 스크립트 (Vanilla JS)
 * 
 * [역할 분담 및 아키텍처 원칙]
 * 1. main.js 담당 공통 기능:
 *    - 페이지 로딩 오버레이 (initLoading)
 *    - 상단 티커 롤링 배너 (initHeaderTicker)
 *    - 상담데스크 실시간 운영 상태 (initDeskStatus)
 *    - GNB 메가메뉴 드롭다운 (initGnbMegaMenu)
 *    - 플로팅 위젯 탑버튼 스크롤 (initFloatingAndScrollTop)
 *    - 로그아웃/사용자 카드 (initUserQuickCard)
 * 
 * 2. sub.js 담당 서브페이지 전용 기능:
 *    - 하단 빠른상담 신청 폼 유효성 검사 (initQuickConsultationForm)
 *    - 서브페이지 공통 모달 (initCommonSubModals: 실명인증 모달 등)
 *    - 학점은행제 서브탭 (sub02_02 학점인정대상, sub02_03 신청방법안내)
 *    - 개설과목안내 (sub04_01 과목필터 탭 및 강의계획서 모달)
 *    - 수강료결제 (sub04_04 단계별 본인인증/결제방식 전환)
 *    - 수강신청 (sub04_05 학기탭, 과목선택, 계획서 동의모달, 스티키바)
 *    - 환불신청 (sub04_06 과목체크 및 환불금액 계산)
 *    - 공지사항 (sub05_01 검색/필터, 페이지네이션, 행 클릭)
 *    - 자주하는질문 (sub05_02 검색/필터, 페이지네이션, 행 클릭)
 *    - 질문과답변 (sub05_04 필터탭, 페이지네이션, 문의하기)
 *    - 장학생 수강후기 (sub05_05 검색/필터, 페이지네이션, 행 클릭)
 *    - 교수진 칼럼 (sub05_06 페이지네이션, 행 클릭)
 *    - 무료학습설계 (sub05_07 칩선택, 폼검증, 신청처리)
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuickConsultationForm();
  initCommonSubModals();
  initCreditTargetTabs();
  initApplyGuideTabs();
  initCourseFilterTabs();
  initCourseSyllabusModal();
  initPaymentPageInteractions();
  initEnrollmentPageInteractions();
  initRefundPageInteractions();
  initNoticePageInteractions();
  initFaqPageInteractions();
  initQnaPageInteractions();
  initReviewPageInteractions();
  initColumnPageInteractions();
  initStudyPlanFormInteractions();
  initLoginPageInteractions();
  initFindPageInteractions();
  initJoinPageInteractions();
  initMemberEditInteractions();
  initMemberEditOkInteractions();
});

/* ==========================================================================
   0. 서브페이지 공통 모달 (실명인증 등)
   ========================================================================== */
function initCommonSubModals() {
  const modalOverlay = document.getElementById('verify-modal');
  const btnClose = document.getElementById('btn-close-verify-modal');

  if (!modalOverlay) return;

  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.preventDefault();
      modalOverlay.classList.remove('active');
    });
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  window.openVerifyModal = function() {
    modalOverlay.classList.add('active');
  };
}

/* ==========================================================================
   1. 하단 빠른상담 신청 폼 검증 & 전송 처리
   ========================================================================== */
function initQuickConsultationForm() {
  const quickForm = document.querySelector('form[name="frmcounsel_bottom"]');
  if (!quickForm) return;

  quickForm.addEventListener('submit', (e) => {
    const gubun = quickForm.querySelector('select[name="gubun"], select.bottom-form-select-course');
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

/* ==========================================================================
   2. 학점인정대상 (sub02_02) 탭 전환 기능
   ========================================================================== */
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

/* ==========================================================================
   3. 신청방법안내 (sub02_03) 탭 전환 기능
   ========================================================================== */
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

/* ==========================================================================
   4. 개설과목안내 (sub04_01) 과목 분류 탭 필터링
   ========================================================================== */
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

/* ==========================================================================
   5. 개설과목안내 (sub04_01) 강의계획서 모달 팝업
   ========================================================================== */
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

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

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

/* ==========================================================================
   6. 수강료결제 (sub04_04) 본인인증 & 결제 단계별 인터랙션
   ========================================================================== */
function initPaymentPageInteractions() {
  const btnGoVerify = document.getElementById('btn-go-verify');
  const chkAgree = document.getElementById('chk-ssn-agree');
  const inputName = document.getElementById('cname');
  const inputJid1 = document.getElementById('jid1');
  const inputJid2 = document.getElementById('jid2');

  const secSsn = document.getElementById('sec-ssn-stage');
  const secVerify = document.getElementById('sec-verify-stage');
  const secPay = document.getElementById('sec-pay-stage');

  const stepBar2 = document.getElementById('step-bar-2');
  const stepBar3 = document.getElementById('step-bar-3');

  const btnVerifyPhone = document.querySelector('.btn-verify-phone');
  const btnVerifyRealname = document.querySelector('.btn-verify-realname');
  const btnSubmitPay = document.getElementById('btn-submit-pay');

  const payMethodRadios = document.querySelectorAll('input[name="payMethod"]');
  const payGuideCard = document.getElementById('pay-guide-card');
  const payGuideBank = document.getElementById('pay-guide-bank');

  // 1단계: 개인정보 추가수집 검증 및 본인인증 영역 노출
  if (btnGoVerify) {
    btnGoVerify.addEventListener('click', (e) => {
      e.preventDefault();
      if (chkAgree && !chkAgree.checked) {
        alert('고유식별정보 추가수집에 동의해 주세요.');
        chkAgree.focus();
        return;
      }
      if (inputName && !inputName.value.trim()) {
        alert('성명을 입력해 주세요.');
        inputName.focus();
        return;
      }
      if ((inputJid1 && inputJid1.value.trim().length < 6) || (inputJid2 && inputJid2.value.trim().length < 7)) {
        alert('주민등록번호를 정확히 입력해 주세요.');
        if (inputJid1 && inputJid1.value.trim().length < 6) inputJid1.focus();
        else if (inputJid2) inputJid2.focus();
        return;
      }

      if (secSsn) secSsn.style.display = 'none';
      if (secVerify) {
        secVerify.style.display = 'flex';
        secVerify.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // 2단계: 본인인증 완료 시 결제방식 영역 노출 및 Step3 전환
  [btnVerifyPhone, btnVerifyRealname].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('본인인증이 완료되었습니다. 결제방식을 선택해 주세요.');
      if (secVerify) secVerify.style.display = 'none';
      if (secPay) {
        secPay.style.display = 'flex';
        secPay.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (stepBar2) stepBar2.classList.remove('active');
      if (stepBar3) stepBar3.classList.add('active');
    });
  });

  // 결제방식 라디오 전환 (신용카드 vs 가상계좌 안내문구)
  if (payMethodRadios.length) {
    payMethodRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.value === 'card') {
          if (payGuideCard) payGuideCard.style.display = 'flex';
          if (payGuideBank) payGuideBank.style.display = 'none';
        } else {
          if (payGuideCard) payGuideCard.style.display = 'none';
          if (payGuideBank) payGuideBank.style.display = 'flex';
        }
      });
    });
  }

  // 3단계: 결제하기 버튼 클릭
  if (btnSubmitPay) {
    btnSubmitPay.addEventListener('click', (e) => {
      e.preventDefault();
      alert('결제 기능은 결제대행사 연동 후 활성화됩니다.');
    });
  }
}

/* ==========================================================================
   7. 수강신청 (sub04_05) 학기 탭 / 과목 필터 / 과목 선택 & 강의계획서 확인 동의 / 스티키 바
   ========================================================================== */
function initEnrollmentPageInteractions() {
  const semTabs = document.querySelectorAll('.apply-sem-tab-item');
  const semTitleEl = document.getElementById('apply-sem-title');
  const semPeriodEl = document.getElementById('apply-sem-period');
  const semApplyEl = document.getElementById('apply-sem-apply');

  const semData = {
    1: { title: '2026년 2학기 4기 (09월 10일 개강)', period: '2026년 09월 10일 ~ 2026년 12월 23일', apply: '2026년 07월 22일 ~ 2026년 09월 09일' },
    2: { title: '사회복지현장실습 2학기 4차 (09월 10일 개강)', period: '2026년 09월 10일 ~ 2026년 12월 23일', apply: '2026년 07월 22일 ~ 2026년 09월 09일' },
    3: { title: '한국어교육실습 2학기 (09월 10일 개강)', period: '2026년 09월 10일 ~ 2026년 12월 23일', apply: '2026년 07월 22일 ~ 2026년 09월 09일' },
    4: { title: '한국어교육실습 1학기 (12월 31일 개강)', period: '2026년 12월 31일 ~ 2027년 04월 14일', apply: '2026년 10월 13일 ~ 2026년 12월 30일' },
    5: { title: '건강가정사 2학기 2차 (10월 05일 개강)', period: '2026년 10월 05일 ~ 2027년 01월 18일', apply: '2026년 08월 07일 ~ 2026년 10월 04일' },
  };

  if (semTabs.length) {
    semTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const semId = tab.getAttribute('data-sem-id') || '1';
        semTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        if (semData[semId]) {
          if (semTitleEl) semTitleEl.textContent = semData[semId].title;
          if (semPeriodEl) semPeriodEl.textContent = semData[semId].period;
          if (semApplyEl) semApplyEl.textContent = semData[semId].apply;
        }
      });
    });
  }

  const filterBtns = document.querySelectorAll('.apply-course-filter-btn');
  const courseRows = document.querySelectorAll('.apply-course-table tbody tr');

  if (filterBtns.length && courseRows.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        courseRows.forEach((row) => {
          if (filter === 'all') {
            row.style.display = '';
          } else {
            const rowGubun = row.getAttribute('data-gubun') || '';
            if (rowGubun.includes(filter)) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          }
        });
      });
    });
  }

  const pickButtons = document.querySelectorAll('.btn-apply-pick');
  const previewButtons = document.querySelectorAll('.btn-apply-preview');
  const countEl = document.getElementById('apply-picked-count');
  const creditEl = document.getElementById('apply-picked-credits');
  const submitBtn = document.getElementById('btn-apply-submit');

  const modal = document.getElementById('apply-syllabus-modal');
  const modalCourseName = document.getElementById('apply-modal-course-name');
  const modalProf = document.getElementById('apply-modal-prof');
  const modalProfName = document.getElementById('apply-modal-prof-name');
  const modalGubun = document.getElementById('apply-modal-gubun');
  const modalBtnAgree = document.getElementById('btn-apply-modal-agree');
  const modalBtnCancel = document.getElementById('btn-apply-modal-cancel');
  const modalBtnClose = document.getElementById('btn-apply-modal-close');
  const modalTabBtns = modal ? modal.querySelectorAll('.apply-modal-tab-btn') : [];
  const modalPanes = modal ? modal.querySelectorAll('.apply-modal-tab-pane') : [];

  let pendingTargetBtn = null;

  function updateStickyBar() {
    let pickedCount = 0;
    let pickedCredits = 0;

    pickButtons.forEach((btn) => {
      if (btn.classList.contains('picked')) {
        pickedCount++;
        const credit = parseInt(btn.getAttribute('data-credit') || '3', 10);
        pickedCredits += credit;
      }
    });

    if (countEl) countEl.textContent = pickedCount;
    if (creditEl) creditEl.textContent = pickedCredits;
  }

  function openAgreeModal(btn) {
    pendingTargetBtn = btn;
    const title = btn.getAttribute('data-title') || '과목명';
    const prof = btn.getAttribute('data-prof') || '3학점';
    const gubun = btn.getAttribute('data-gubun') || '전공';

    if (modalCourseName) modalCourseName.textContent = title;
    if (modalProf) modalProf.textContent = prof;
    if (modalProfName) modalProfName.textContent = prof;
    if (modalGubun) modalGubun.textContent = gubun;

    if (modalTabBtns.length) {
      modalTabBtns.forEach((b) => b.classList.remove('active'));
      modalPanes.forEach((p) => p.classList.remove('active'));
      const firstTab = modal.querySelector('.apply-modal-tab-btn[data-tab="syllabus"]');
      const firstPane = document.getElementById('modal-tab-syllabus');
      if (firstTab) firstTab.classList.add('active');
      if (firstPane) firstPane.classList.add('active');
    }

    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAgreeModal() {
    pendingTargetBtn = null;
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalTabBtns.length) {
    modalTabBtns.forEach((tabBtn) => {
      tabBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabKey = tabBtn.getAttribute('data-tab');
        modalTabBtns.forEach((b) => b.classList.remove('active'));
        modalPanes.forEach((p) => p.classList.remove('active'));

        tabBtn.classList.add('active');
        const targetPane = document.getElementById(`modal-tab-${tabKey}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  if (pickButtons.length) {
    pickButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tr = btn.closest('tr');

        if (btn.classList.contains('picked')) {
          btn.classList.remove('picked');
          btn.textContent = '과목선택';
          if (tr) tr.classList.remove('picked-row');
          updateStickyBar();
        } else {
          openAgreeModal(btn);
        }
      });
    });
  }

  if (previewButtons.length) {
    previewButtons.forEach((pBtn) => {
      pBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const tr = pBtn.closest('tr');
        const pickBtn = tr ? tr.querySelector('.btn-apply-pick') : null;
        if (pickBtn) {
          openAgreeModal(pickBtn);
        }
      });
    });
  }

  if (modalBtnAgree) {
    modalBtnAgree.addEventListener('click', (e) => {
      e.preventDefault();
      if (pendingTargetBtn) {
        pendingTargetBtn.classList.add('picked');
        pendingTargetBtn.textContent = '선택취소';
        const tr = pendingTargetBtn.closest('tr');
        if (tr) tr.classList.add('picked-row');
        updateStickyBar();
      }
      closeAgreeModal();
    });
  }

  if (modalBtnCancel) {
    modalBtnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      closeAgreeModal();
    });
  }

  if (modalBtnClose) {
    modalBtnClose.addEventListener('click', (e) => {
      e.preventDefault();
      closeAgreeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAgreeModal();
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      let pickedCount = 0;
      pickButtons.forEach((btn) => {
        if (btn.classList.contains('picked')) pickedCount++;
      });

      if (pickedCount === 0) {
        alert('수강신청할 과목을 먼저 선택해 주세요.');
        return;
      }

      location.href = '/kbs-html/sub04_04.html';
    });
  }
}

/* ==========================================================================
   8. 환불신청 (sub04_06) 과목 선택 & 환불 신청서 유효성 검사
   ========================================================================== */
function initRefundPageInteractions() {
  const refundCheckboxes = document.querySelectorAll('.refund-item-chk');
  const refundTotalEl = document.getElementById('refund-total-amount');
  const submitBtn = document.getElementById('btn-submit-refund');

  function updateRefundTotal() {
    let total = 0;
    refundCheckboxes.forEach((chk) => {
      if (chk.checked) {
        const amount = parseInt(chk.getAttribute('data-amount') || '1500', 10);
        total += amount;
      }
    });

    if (refundTotalEl) {
      refundTotalEl.textContent = total > 0 ? total.toLocaleString() + '원' : '0원';
    }
  }

  if (refundCheckboxes.length) {
    refundCheckboxes.forEach((chk) => {
      chk.addEventListener('change', () => {
        const row = chk.closest('.refund-table-row') || chk.closest('tr');
        if (row) {
          row.style.backgroundColor = chk.checked ? '#F2F6FB' : '#FFFFFF';
        }
        updateRefundTotal();
      });
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      let hasChecked = false;
      refundCheckboxes.forEach((chk) => {
        if (chk.checked) hasChecked = true;
      });

      if (!hasChecked) {
        alert('환불할 과목을 선택해 주세요.');
        return;
      }

      alert('환불 신청 기능은 결제대행사 연동 후 활성화됩니다.');
    });
  }
}

/* ==========================================================================
   9. 학습지원센터 공지사항 (sub05_01) 전용 인터랙션
   ========================================================================== */
function initNoticePageInteractions() {
  initNoticeSearchAndFilter();
  initNoticePagination();
  initNoticeRowInteractions();
}

function initNoticeSearchAndFilter() {
  const searchSelect = document.querySelector('.notice-search-select');
  const searchInput = document.querySelector('.notice-search-input');
  const btnSearch = document.querySelector('.notice-btn-search');
  const btnReset = document.querySelector('.notice-btn-reset');
  const tableBody = document.querySelector('.notice-table tbody');

  if (!searchInput || !btnSearch || !tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll('tr:not(.notice-empty-row)'));

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const filterType = searchSelect ? searchSelect.value : '제목';
    let matchCount = 0;

    const existingEmpty = tableBody.querySelector('.notice-empty-row');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    if (!query) {
      rows.forEach(row => {
        row.style.display = '';
      });
      return;
    }

    rows.forEach(row => {
      let textToSearch = '';
      if (filterType === '제목') {
        const titleEl = row.querySelector('.col-title');
        textToSearch = titleEl ? titleEl.textContent : '';
      } else if (filterType === '아이디' || filterType === '이름' || filterType === '작성자') {
        const authorEl = row.querySelector('.col-author');
        textToSearch = authorEl ? authorEl.textContent : '';
      } else {
        textToSearch = row.textContent;
      }

      if (textToSearch.toLowerCase().includes(query)) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (matchCount === 0) {
      const emptyTr = document.createElement('tr');
      emptyTr.className = 'notice-empty-row';
      emptyTr.innerHTML = '<td colspan="5" style="text-align:center; padding:48px 16px; color:#8A90A0; font-size:14px;">검색된 공지사항이 없습니다.</td>';
      tableBody.appendChild(emptyTr);
    }
  }

  btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      if (searchSelect) searchSelect.selectedIndex = 0;

      const existingEmpty = tableBody.querySelector('.notice-empty-row');
      if (existingEmpty) existingEmpty.remove();

      rows.forEach(row => {
        row.style.display = '';
      });
    });
  }
}

function initNoticePagination() {
  const pageBtns = document.querySelectorAll('.notice-page-btn');
  if (!pageBtns.length) return;

  pageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.textContent.trim();

      const pageNum = parseInt(text, 10);
      if (!isNaN(pageNum)) {
        pageBtns.forEach(b => {
          if (!isNaN(parseInt(b.textContent.trim(), 10))) {
            b.classList.remove('active');
          }
        });
        btn.classList.add('active');

        const tableWrap = document.querySelector('.notice-table-wrap');
        if (tableWrap) {
          tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (text === '처음' || btn.querySelector('.msi')?.textContent === 'chevron_left') {
        const firstNumBtn = Array.from(pageBtns).find(b => parseInt(b.textContent.trim(), 10) === 1);
        if (firstNumBtn) firstNumBtn.click();
      } else if (text === '마지막') {
        const numBtns = Array.from(pageBtns).filter(b => !isNaN(parseInt(b.textContent.trim(), 10)));
        if (numBtns.length) {
          numBtns[numBtns.length - 1].click();
        }
      }
    });
  });
}

function initNoticeRowInteractions() {
  const titleLinks = document.querySelectorAll('.notice-table .col-title a');
  titleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        const titleText = link.textContent.trim();
        console.log(`[공지사항 클릭] ${titleText}`);
      }
    });
  });
}

/* ==========================================================================
   10. 학습지원센터 자주하는질문 (sub05_02) 전용 인터랙션
   ========================================================================== */
function initFaqPageInteractions() {
  initFaqSearchAndFilter();
  initFaqPagination();
  initFaqRowInteractions();
}

function initFaqSearchAndFilter() {
  const searchSelect = document.querySelector('.faq-search-select');
  const searchInput = document.querySelector('.faq-search-input');
  const btnSearch = document.querySelector('.faq-btn-search');
  const btnReset = document.querySelector('.faq-btn-reset');
  const tableBody = document.querySelector('.faq-table tbody');

  if (!searchInput || !btnSearch || !tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll('tr:not(.faq-empty-row)'));

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const filterType = searchSelect ? searchSelect.value : '제목';
    let matchCount = 0;

    const existingEmpty = tableBody.querySelector('.faq-empty-row');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    if (!query) {
      rows.forEach(row => {
        row.style.display = '';
      });
      return;
    }

    rows.forEach(row => {
      let textToSearch = '';
      if (filterType === '제목') {
        const titleEl = row.querySelector('.col-title');
        textToSearch = titleEl ? titleEl.textContent : '';
      } else if (filterType === '아이디' || filterType === '이름' || filterType === '작성자') {
        const authorEl = row.querySelector('.col-author');
        textToSearch = authorEl ? authorEl.textContent : '';
      } else {
        textToSearch = row.textContent;
      }

      if (textToSearch.toLowerCase().includes(query)) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (matchCount === 0) {
      const emptyTr = document.createElement('tr');
      emptyTr.className = 'faq-empty-row';
      emptyTr.innerHTML = '<td colspan="5" style="text-align:center; padding:48px 16px; color:#8A90A0; font-size:14px;">검색된 질문이 없습니다.</td>';
      tableBody.appendChild(emptyTr);
    }
  }

  btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      if (searchSelect) searchSelect.selectedIndex = 0;

      const existingEmpty = tableBody.querySelector('.faq-empty-row');
      if (existingEmpty) existingEmpty.remove();

      rows.forEach(row => {
        row.style.display = '';
      });
    });
  }
}

function initFaqPagination() {
  const pageBtns = document.querySelectorAll('.faq-page-btn');
  if (!pageBtns.length) return;

  pageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.textContent.trim();

      const pageNum = parseInt(text, 10);
      if (!isNaN(pageNum)) {
        pageBtns.forEach(b => {
          if (!isNaN(parseInt(b.textContent.trim(), 10))) {
            b.classList.remove('active');
          }
        });
        btn.classList.add('active');

        const tableWrap = document.querySelector('.faq-table-wrap');
        if (tableWrap) {
          tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (text === '처음' || text === '이전') {
        const firstNumBtn = Array.from(pageBtns).find(b => parseInt(b.textContent.trim(), 10) === 1);
        if (firstNumBtn) firstNumBtn.click();
      } else if (text === '끝' || text === '다음') {
        const numBtns = Array.from(pageBtns).filter(b => !isNaN(parseInt(b.textContent.trim(), 10)));
        if (numBtns.length) {
          numBtns[numBtns.length - 1].click();
        }
      }
    });
  });
}

function initFaqRowInteractions() {
  const titleLinks = document.querySelectorAll('.faq-table .col-title a');
  titleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        const titleText = link.textContent.trim();
        console.log(`[자주하는질문 클릭] ${titleText}`);
      }
    });
  });
}

/* ==========================================================================
   11. 학습지원센터 질문과답변 (sub05_04) 전용 인터랙션
   ========================================================================== */
function initQnaPageInteractions() {
  initQnaFilterTabs();
  initQnaPagination();
  initQnaRowInteractions();
  initQnaWriteButton();
}

function initQnaFilterTabs() {
  const filterBtns = document.querySelectorAll('.qna-filter-btn');
  const tableBody = document.querySelector('.qna-table tbody');
  if (!filterBtns.length || !tableBody) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterText = btn.textContent.trim();
      const existingEmpty = tableBody.querySelector('.qna-empty-row');
      if (existingEmpty) existingEmpty.remove();

      const rows = Array.from(tableBody.querySelectorAll('tr:not(.qna-empty-row)'));

      if (filterText.includes('내가 작성한 글')) {
        // 로그인 및 내가 쓴 글 필터 데모 (예: 내가 작성한 글이 없을 때 안내)
        rows.forEach(r => r.style.display = 'none');
        const emptyTr = document.createElement('tr');
        emptyTr.className = 'qna-empty-row';
        emptyTr.innerHTML = '<td colspan="5" style="text-align:center; padding:48px 16px; color:#8A90A0; font-size:14px;">작성하신 질문 내역이 없습니다.</td>';
        tableBody.appendChild(emptyTr);
      } else {
        rows.forEach(r => r.style.display = '');
      }
    });
  });
}

function initQnaPagination() {
  const pageBtns = document.querySelectorAll('.qna-page-btn');
  if (!pageBtns.length) return;

  pageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        return;
      }

      e.preventDefault();
      const text = btn.textContent.trim();

      const pageNum = parseInt(text, 10);
      if (!isNaN(pageNum)) {
        pageBtns.forEach(b => {
          if (!isNaN(parseInt(b.textContent.trim(), 10))) {
            b.classList.remove('active');
          }
        });
        btn.classList.add('active');

        const tableWrap = document.querySelector('.qna-table-wrap');
        if (tableWrap) {
          tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (text === '처음' || text === '이전') {
        const firstNumBtn = Array.from(pageBtns).find(b => parseInt(b.textContent.trim(), 10) === 1);
        if (firstNumBtn) firstNumBtn.click();
      } else if (text === '끝' || text === '다음') {
        const numBtns = Array.from(pageBtns).filter(b => !isNaN(parseInt(b.textContent.trim(), 10)));
        if (numBtns.length) {
          numBtns[numBtns.length - 1].click();
        }
      }
    });
  });
}

function initQnaRowInteractions() {
  const titleLinks = document.querySelectorAll('.qna-table .col-title a');
  titleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        alert('본인이 작성한 비밀글만 확인 가능합니다.');
      }
    });
  });
}

function initQnaWriteButton() {
  const btnWrite = document.querySelector('.qna-btn-write');
  if (!btnWrite) return;

  btnWrite.addEventListener('click', (e) => {
    const href = btnWrite.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)') {
      e.preventDefault();
      alert('문의하기는 로그인 후 이용 가능합니다.');
    }
  });
}

/* ==========================================================================
   12. 학습지원센터 장학생 수강후기 (sub05_05) 전용 인터랙션
   ========================================================================== */
function initReviewPageInteractions() {
  initReviewSearchAndFilter();
  initReviewPagination();
  initReviewRowInteractions();
}

function initReviewSearchAndFilter() {
  const searchSelect = document.querySelector('.review-search-select');
  const searchInput = document.querySelector('.review-search-input');
  const btnSearch = document.querySelector('.review-btn-search');
  const btnReset = document.querySelector('.review-btn-reset');
  const tableBody = document.querySelector('.review-table tbody');

  if (!searchInput || !btnSearch || !tableBody) return;

  const rows = Array.from(tableBody.querySelectorAll('tr:not(.review-empty-row)'));

  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const filterType = searchSelect ? searchSelect.value : '제목';
    let matchCount = 0;

    const existingEmpty = tableBody.querySelector('.review-empty-row');
    if (existingEmpty) {
      existingEmpty.remove();
    }

    if (!query) {
      rows.forEach(row => {
        row.style.display = '';
      });
      return;
    }

    rows.forEach(row => {
      let textToSearch = '';
      if (filterType === '제목') {
        const titleEl = row.querySelector('.col-title');
        textToSearch = titleEl ? titleEl.textContent : '';
      } else if (filterType === '아이디' || filterType === '이름' || filterType === '작성자') {
        const authorEl = row.querySelector('.col-author');
        textToSearch = authorEl ? authorEl.textContent : '';
      } else {
        textToSearch = row.textContent;
      }

      if (textToSearch.toLowerCase().includes(query)) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (matchCount === 0) {
      const emptyTr = document.createElement('tr');
      emptyTr.className = 'review-empty-row';
      emptyTr.innerHTML = '<td colspan="5" style="text-align:center; padding:48px 16px; color:#8A90A0; font-size:14px;">검색된 수강후기가 없습니다.</td>';
      tableBody.appendChild(emptyTr);
    }
  }

  btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  if (btnReset) {
    btnReset.addEventListener('click', (e) => {
      e.preventDefault();
      searchInput.value = '';
      if (searchSelect) searchSelect.selectedIndex = 0;

      const existingEmpty = tableBody.querySelector('.review-empty-row');
      if (existingEmpty) existingEmpty.remove();

      rows.forEach(row => {
        row.style.display = '';
      });
    });
  }
}

function initReviewPagination() {
  const pageBtns = document.querySelectorAll('.review-page-btn');
  if (!pageBtns.length) return;

  pageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        return;
      }

      e.preventDefault();
      const text = btn.textContent.trim();

      const pageNum = parseInt(text, 10);
      if (!isNaN(pageNum)) {
        pageBtns.forEach(b => {
          if (!isNaN(parseInt(b.textContent.trim(), 10))) {
            b.classList.remove('active');
          }
        });
        btn.classList.add('active');

        const tableWrap = document.querySelector('.review-table-wrap');
        if (tableWrap) {
          tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (text === '처음' || text === '이전') {
        const firstNumBtn = Array.from(pageBtns).find(b => parseInt(b.textContent.trim(), 10) === 1);
        if (firstNumBtn) firstNumBtn.click();
      } else if (text === '끝' || text === '다음') {
        const numBtns = Array.from(pageBtns).filter(b => !isNaN(parseInt(b.textContent.trim(), 10)));
        if (numBtns.length) {
          numBtns[numBtns.length - 1].click();
        }
      }
    });
  });
}

function initReviewRowInteractions() {
  const titleLinks = document.querySelectorAll('.review-table .col-title a');
  titleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        const titleText = link.textContent.trim();
        console.log(`[장학생 수강후기 클릭] ${titleText}`);
      }
    });
  });
}

/* ==========================================================================
   13. 학습지원센터 교수진 칼럼 (sub05_06) 전용 인터랙션
   ========================================================================== */
function initColumnPageInteractions() {
  initColumnPagination();
  initColumnRowInteractions();
}

function initColumnPagination() {
  const pageBtns = document.querySelectorAll('.column-page-btn');
  if (!pageBtns.length) return;

  pageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        return;
      }

      e.preventDefault();
      const text = btn.textContent.trim();

      const pageNum = parseInt(text, 10);
      if (!isNaN(pageNum)) {
        pageBtns.forEach(b => {
          if (!isNaN(parseInt(b.textContent.trim(), 10))) {
            b.classList.remove('active');
          }
        });
        btn.classList.add('active');

        const tableWrap = document.querySelector('.column-table-wrap');
        if (tableWrap) {
          tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (text === '처음' || text === '이전') {
        const firstNumBtn = Array.from(pageBtns).find(b => parseInt(b.textContent.trim(), 10) === 1);
        if (firstNumBtn) firstNumBtn.click();
      } else if (text === '끝' || text === '다음') {
        const numBtns = Array.from(pageBtns).filter(b => !isNaN(parseInt(b.textContent.trim(), 10)));
        if (numBtns.length) {
          numBtns[numBtns.length - 1].click();
        }
      }
    });
  });
}

function initColumnRowInteractions() {
  const titleLinks = document.querySelectorAll('.column-table .col-title a');
  titleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        const titleText = link.textContent.trim();
        console.log(`[교수진 칼럼 클릭] ${titleText}`);
      }
    });
  });
}

/* ==========================================================================
   14. 학습지원센터 무료학습설계 (sub05_07) 전용 인터랙션
   ========================================================================== */
function initStudyPlanFormInteractions() {
  initPlanChipSelections();
  initPlanFormSubmission();
}

function initPlanChipSelections() {
  const chipLabels = document.querySelectorAll('.plan-chip-label');
  chipLabels.forEach(label => {
    const input = label.querySelector('.plan-chip-input');
    if (!input) return;

    input.addEventListener('change', () => {
      if (input.checked) {
        label.classList.add('active');
      } else {
        label.classList.remove('active');
      }
    });
  });
}

function initPlanFormSubmission() {
  const form = document.querySelector('.plan-form-card') ? document.querySelector('.plan-form-card').closest('form') : null;
  const btnSubmit = document.querySelector('.plan-btn-submit');
  const agreeLink = document.querySelector('.plan-agree-link');

  if (agreeLink) {
    agreeLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('[개인정보 수집 및 이용 동의 안내]\n\n1. 수집항목: 이름, 이메일, 연락처, 희망과정\n2. 이용목적: 무료학습설계 상담 및 교육과정 안내\n3. 보유기간: 상담 완료 후 1년간 보관 후 파기');
    });
  }

  if (!btnSubmit) return;

  btnSubmit.addEventListener('click', (e) => {
    const nameInput = document.querySelector('input[name="name"]') || document.querySelector('.plan-input-text[placeholder*="이름"]');
    const tel2 = document.querySelector('input[name="hptel2"]') || document.querySelectorAll('.plan-input-tel')[0];
    const tel3 = document.querySelector('input[name="hptel3"]') || document.querySelectorAll('.plan-input-tel')[1];
    const agreeCheckbox = document.querySelector('.plan-agree-checkbox') || document.querySelector('input[name="chkx"]');

    if (nameInput && !nameInput.value.trim()) {
      e.preventDefault();
      alert('이름을 입력해 주세요.');
      nameInput.focus();
      return;
    }

    if (tel2 && !tel2.value.trim()) {
      e.preventDefault();
      alert('연락처를 정확히 입력해 주세요.');
      tel2.focus();
      return;
    }

    if (tel3 && !tel3.value.trim()) {
      e.preventDefault();
      alert('연락처를 정확히 입력해 주세요.');
      tel3.focus();
      return;
    }

    if (agreeCheckbox && !agreeCheckbox.checked) {
      e.preventDefault();
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      agreeCheckbox.focus();
      return;
    }

    if (!form) {
      e.preventDefault();
      alert('무료학습설계 신청이 성공적으로 접수되었습니다.\n담당자가 빠른 시간 내에 연락드리겠습니다.');
    }
  });
}

/* ==========================================================================
   15. 통합로그인 (login.html) 전용 인터랙션
   ========================================================================== */
function initLoginPageInteractions() {
  initIdLoginForm();
  initCertLoginForm();
  restoreSavedLoginId();
}

/**
 * 15-1. 아이디 로그인 폼 처리 및 유효성 검사
 */
function initIdLoginForm() {
  const idForm = document.getElementById('form-id-login');
  const userIdInput = document.getElementById('user-id');
  const userPwInput = document.getElementById('user-pw');
  const saveIdCheckbox = document.getElementById('save-id');

  if (!idForm) return;

  idForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = userIdInput ? userIdInput.value.trim() : '';
    const userPw = userPwInput ? userPwInput.value.trim() : '';

    if (!userId) {
      alert('아이디를 입력해 주세요.');
      if (userIdInput) userIdInput.focus();
      return;
    }

    if (!userPw) {
      alert('비밀번호를 입력해 주세요.');
      if (userPwInput) userPwInput.focus();
      return;
    }

    // 아이디 저장 처리
    if (saveIdCheckbox && saveIdCheckbox.checked) {
      try {
        localStorage.setItem('kbs_saved_user_id', userId);
      } catch (err) {
        console.warn('localStorage 저장 실패:', err);
      }
    } else {
      try {
        localStorage.removeItem('kbs_saved_user_id');
      } catch (err) {
        console.warn('localStorage 삭제 실패:', err);
      }
    }

    // 로그인 실행
    console.log('[아이디 로그인 시도]', { userId });
    alert(`[로그인 처리]\n아이디: ${userId}\n로그인이 성공적으로 요청되었습니다.`);
  });
}

/**
 * 15-2. 공동인증서 로그인 폼 처리 및 유효성 검사
 */
function initCertLoginForm() {
  const certForm = document.getElementById('form-cert-login');
  const certUserIdInput = document.getElementById('cert-user-id');
  const saveCertIdCheckbox = document.getElementById('save-cert-id');

  if (!certForm) return;

  certForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const certUserId = certUserIdInput ? certUserIdInput.value.trim() : '';

    if (!certUserId) {
      alert('홈페이지 가입아이디를 입력해 주세요.');
      if (certUserIdInput) certUserIdInput.focus();
      return;
    }

    // 아이디 저장 처리
    if (saveCertIdCheckbox && saveCertIdCheckbox.checked) {
      try {
        localStorage.setItem('kbs_saved_user_id', certUserId);
      } catch (err) {
        console.warn('localStorage 저장 실패:', err);
      }
    } else {
      try {
        localStorage.removeItem('kbs_saved_user_id');
      } catch (err) {
        console.warn('localStorage 삭제 실패:', err);
      }
    }

    // 공동인증서 로그인 모듈 호출
    console.log('[공동인증서 로그인 시도]', { certUserId });
    alert(`[공동인증서 본인확인]\n가입아이디: ${certUserId}\n공동인증서 프로그램(VestCert) 인증 창을 호출합니다.`);
  });
}

/**
 * 15-3. 저장된 아이디 복원 (localStorage)
 */
function restoreSavedLoginId() {
  try {
    const savedId = localStorage.getItem('kbs_saved_user_id');
    if (savedId) {
      const userIdInput = document.getElementById('user-id');
      const certUserIdInput = document.getElementById('cert-user-id');
      const saveIdCheckbox = document.getElementById('save-id');
      const saveCertIdCheckbox = document.getElementById('save-cert-id');

      if (userIdInput) userIdInput.value = savedId;
      if (certUserIdInput) certUserIdInput.value = savedId;
      if (saveIdCheckbox) saveIdCheckbox.checked = true;
      if (saveCertIdCheckbox) saveCertIdCheckbox.checked = true;
    }
  } catch (err) {
    console.warn('localStorage 조회 실패:', err);
  }
}

/* ==========================================================================
   16. 아이디·비밀번호 찾기 (find.html) 전용 인터랙션
   ========================================================================== */
function initFindPageInteractions() {
  const findContainer = document.querySelector('.find-page-container');
  if (!findContainer) return;

  // 상태 변수
  let state = {
    mode: 'id', // 'id' | 'pw'
    step: 'method', // 'method' | 'result'
    method: 'phone', // 'phone' | 'email'
    emailCodeSent: false,
    pwIdConfirmed: false,
    pwId: '',
    timerInterval: null,
    timerSeconds: 180
  };

  // URL 파라미터 체크 (?mode=pw 등)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'pw') {
    state.mode = 'pw';
  }

  // DOM 요소 참조
  const titleEl = document.getElementById('find-page-title');
  const stepCrumbEl = document.getElementById('find-step-crumb2');
  const tabIdBtn = document.getElementById('tab-find-id');
  const tabPwBtn = document.getElementById('tab-find-pw');

  const cardMethod = document.getElementById('find-card-method');
  const cardResult = document.getElementById('find-card-result');

  // 비밀번호 아이디 확인 영역
  const pwIdBox = document.getElementById('find-pw-id-box');
  const pwIdConfirmedBox = document.getElementById('find-pw-id-confirmed-box');
  const pwIdValSpan = document.getElementById('find-pw-id-val');
  const pwIdInput = document.getElementById('input-pw-id');
  const btnConfirmPwId = document.getElementById('btn-confirm-pw-id');

  // 인증 방식 영역
  const methodHeader = document.getElementById('find-method-header');
  const methodBody = document.getElementById('find-method-body');
  const radioPhone = document.getElementById('radio-method-phone');
  const radioEmail = document.getElementById('radio-method-email');

  // 휴대폰 인증 버튼
  const btnPhoneCert = document.getElementById('btn-phone-cert');

  // 이메일 인증 영역
  const emailAuthArea = document.getElementById('find-email-auth-area');
  const emailInput = document.getElementById('input-find-email');
  const btnSendCode = document.getElementById('btn-send-email-code');
  const emailCodeRow = document.getElementById('find-email-code-row');
  const emailTimerEl = document.getElementById('find-email-timer');
  const emailNoticeEl = document.getElementById('find-email-notice');
  const emailCodeInput = document.getElementById('input-email-code');
  const btnEmailConfirm = document.getElementById('btn-confirm-email-cert');

  // 결과 카드 영역
  const resultIdSection = document.getElementById('find-result-id-section');
  const resultPwSection = document.getElementById('find-result-pw-section');
  const btnSwitchPw = document.getElementById('btn-result-switch-pw');
  const formResetPw = document.getElementById('form-reset-pw');
  const newPwInput = document.getElementById('input-new-pw');
  const newPwConfirmInput = document.getElementById('input-new-pw-confirm');

  // 렌더링 함수
  function render() {
    const isId = state.mode === 'id';
    const isPw = !isId;

    // 1. 헤더 타이틀 & 탭 상태
    if (titleEl) {
      titleEl.textContent = isId ? '아이디 찾기' : '비밀번호 찾기';
    }
    if (stepCrumbEl) {
      stepCrumbEl.textContent = isId ? '02. 아이디 확인' : '02. 비밀번호 재설정';
    }

    if (tabIdBtn && tabPwBtn) {
      tabIdBtn.classList.toggle('active', isId);
      tabPwBtn.classList.toggle('active', isPw);
    }

    // 2. 단계별 카드 표시 (method vs result)
    if (cardMethod && cardResult) {
      cardMethod.style.display = (state.step === 'method') ? 'flex' : 'none';
      cardResult.style.display = (state.step === 'result') ? 'flex' : 'none';
    }

    // 3. Method 카드 세부 제어
    if (state.step === 'method') {
      // 비밀번호 찾기 시 아이디 확인 영역
      if (pwIdBox && pwIdConfirmedBox) {
        if (isPw) {
          if (state.pwIdConfirmed) {
            pwIdBox.style.display = 'none';
            pwIdConfirmedBox.style.display = 'block';
            if (pwIdValSpan) pwIdValSpan.textContent = state.pwId;
          } else {
            pwIdBox.style.display = 'flex';
            pwIdConfirmedBox.style.display = 'none';
          }
        } else {
          pwIdBox.style.display = 'none';
          pwIdConfirmedBox.style.display = 'none';
        }
      }

      // 본인인증 방식 노출 여부 (아이디 찾기이거나 비밀번호 찾기에서 아이디가 확인된 경우)
      const showMethod = isId || state.pwIdConfirmed;
      if (methodHeader && methodBody) {
        methodHeader.style.display = showMethod ? 'block' : 'none';
        methodBody.style.display = showMethod ? 'flex' : 'none';

        if (showMethod) {
          methodHeader.textContent = isId ? '아이디 찾는 방법을 선택해 주세요.' : '비밀번호 찾는 방법을 선택해 주세요.';
        }
      }

      // 라디오 버튼 상태
      if (radioPhone && radioEmail) {
        radioPhone.checked = (state.method === 'phone');
        radioEmail.checked = (state.method === 'email');
      }

      // 휴대폰 버튼 노출 여부
      if (btnPhoneCert) {
        btnPhoneCert.style.display = (state.method === 'phone') ? 'inline-flex' : 'none';
      }

      // 이메일 영역 노출 여부
      if (emailAuthArea) {
        emailAuthArea.style.display = (state.method === 'email') ? 'flex' : 'none';
      }

      if (emailCodeRow && emailNoticeEl) {
        emailCodeRow.style.display = state.emailCodeSent ? 'flex' : 'none';
        emailNoticeEl.style.display = state.emailCodeSent ? 'block' : 'none';
      }
    }

    // 4. Result 카드 세부 제어
    if (state.step === 'result') {
      if (resultIdSection && resultPwSection) {
        resultIdSection.style.display = isId ? 'block' : 'none';
        resultPwSection.style.display = isPw ? 'block' : 'none';
      }
    }
  }

  // 모드 변경 (아이디 / 비밀번호)
  function setMode(m) {
    state.mode = m;
    state.step = 'method';
    state.method = 'phone';
    state.emailCodeSent = false;
    state.pwIdConfirmed = false;
    state.pwId = '';
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
    render();
  }

  // 탭 클릭 이벤트
  if (tabIdBtn) {
    tabIdBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setMode('id');
    });
  }

  if (tabPwBtn) {
    tabPwBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setMode('pw');
    });
  }

  // 비밀번호 찾기 대상 아이디 확인 버튼
  if (btnConfirmPwId) {
    btnConfirmPwId.addEventListener('click', (e) => {
      e.preventDefault();
      const val = pwIdInput ? pwIdInput.value.trim() : '';
      if (!val) {
        alert('아이디를 입력해 주세요.');
        if (pwIdInput) pwIdInput.focus();
        return;
      }
      state.pwId = val;
      state.pwIdConfirmed = true;
      render();
    });
  }

  // 인증 방식 라디오 전환
  if (radioPhone) {
    radioPhone.addEventListener('change', () => {
      if (radioPhone.checked) {
        state.method = 'phone';
        render();
      }
    });
  }

  if (radioEmail) {
    radioEmail.addEventListener('change', () => {
      if (radioEmail.checked) {
        state.method = 'email';
        render();
      }
    });
  }

  // 휴대폰 인증 버튼 클릭 -> 결과 화면 이동
  if (btnPhoneCert) {
    btnPhoneCert.addEventListener('click', (e) => {
      e.preventDefault();
      alert('휴대폰 본인인증(PASS / 문자) 창을 호출합니다.\n(본인인증 완료 시 결과 화면으로 이동합니다.)');
      state.step = 'result';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 이메일 인증번호 받기 타이머 시작
  function startEmailTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerSeconds = 180; // 3분

    function updateTimer() {
      const min = Math.floor(state.timerSeconds / 60);
      const sec = state.timerSeconds % 60;
      const formatted = `0${min}:${sec < 10 ? '0' : ''}${sec}`;
      if (emailTimerEl) emailTimerEl.textContent = formatted;

      if (state.timerSeconds <= 0) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
        alert('인증번호 유효시간이 만료되었습니다. 인증번호를 다시 요청해 주세요.');
      } else {
        state.timerSeconds--;
      }
    }

    updateTimer();
    state.timerInterval = setInterval(updateTimer, 1000);
  }

  if (btnSendCode) {
    btnSendCode.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      if (!email || !email.includes('@')) {
        alert('올바른 이메일 주소를 입력해 주세요.');
        if (emailInput) emailInput.focus();
        return;
      }

      state.emailCodeSent = true;
      render();
      startEmailTimer();
      alert(`[${email}] 주소로 인증번호가 발송되었습니다.\n3분 이내에 인증번호 6자리를 입력해 주세요.`);
      if (emailCodeInput) emailCodeInput.focus();
    });
  }

  // 이메일 인증번호 확인 클릭 -> 결과 화면 이동
  if (btnEmailConfirm) {
    btnEmailConfirm.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      const code = emailCodeInput ? emailCodeInput.value.trim() : '';

      if (!email) {
        alert('이메일 주소를 입력해 주세요.');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!state.emailCodeSent) {
        alert('먼저 [인증번호 받기]를 진행해 주세요.');
        return;
      }

      if (!code) {
        alert('인증번호 6자리를 입력해 주세요.');
        if (emailCodeInput) emailCodeInput.focus();
        return;
      }

      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }

      alert('이메일 인증이 정상적으로 완료되었습니다.');
      state.step = 'result';
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 아이디 결과 화면에서 '비밀번호 찾기' 클릭
  if (btnSwitchPw) {
    btnSwitchPw.addEventListener('click', (e) => {
      e.preventDefault();
      setMode('pw');
    });
  }

  // 비밀번호 재설정 폼 서브밋
  if (formResetPw) {
    formResetPw.addEventListener('submit', (e) => {
      e.preventDefault();
      const p1 = newPwInput ? newPwInput.value.trim() : '';
      const p2 = newPwConfirmInput ? newPwConfirmInput.value.trim() : '';

      if (!p1) {
        alert('새로 사용할 비밀번호를 입력해 주세요.');
        if (newPwInput) newPwInput.focus();
        return;
      }

      if (p1.length < 8 || p1.length > 16) {
        alert('비밀번호는 8자~16자 길이로 설정해 주세요.');
        if (newPwInput) newPwInput.focus();
        return;
      }

      if (!p2) {
        alert('비밀번호 확인을 입력해 주세요.');
        if (newPwConfirmInput) newPwConfirmInput.focus();
        return;
      }

      if (p1 !== p2) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        if (newPwConfirmInput) newPwConfirmInput.focus();
        return;
      }

      alert('비밀번호가 성공적으로 변경되었습니다.\n새로운 비밀번호로 로그인해 주세요.');
      window.location.href = 'login.html';
    });
  }

  // 최초 렌더링
  render();
}

/* ==========================================================================
   17. 회원가입 (join.html) 전용 인터랙션
   ========================================================================== */
function initJoinPageInteractions() {
  const joinContainer = document.querySelector('.join-page-container');
  if (!joinContainer) return;

  // 상태 관리
  let state = {
    step: 1, // 1 | 2 | 3
    agree1: false,
    agree2: false,
    idChecked: false,
    phoneChecked: false,
    emailChecked: false
  };

  // DOM 요소 참조
  const stepItems = document.querySelectorAll('.join-step-item');
  const stepLines = document.querySelectorAll('.join-step-line');

  const cardStep1 = document.getElementById('join-step-1');
  const cardStep2 = document.getElementById('join-step-2');
  const cardStep3 = document.getElementById('join-step-3');

  const chkAgree1 = document.getElementById('chk-agree-terms');
  const chkAgree2 = document.getElementById('chk-agree-privacy');
  const btnStep1Next = document.getElementById('btn-step1-next');

  // Step 2 폼 요소
  const formJoin = document.getElementById('form-join');
  const btnPrevStep = document.getElementById('btn-join-prev');

  const inputName = document.getElementById('input-join-name');
  const inputId = document.getElementById('input-join-id');
  const btnCheckId = document.getElementById('btn-check-id');

  const inputPw = document.getElementById('input-join-pw');
  const inputPwConfirm = document.getElementById('input-join-pw-confirm');

  const selectPhone1 = document.getElementById('select-phone1');
  const inputPhone2 = document.getElementById('input-phone2');
  const inputPhone3 = document.getElementById('input-phone3');
  const btnCheckPhone = document.getElementById('btn-check-phone');

  const inputEmail = document.getElementById('input-join-email');
  const btnCheckEmail = document.getElementById('btn-check-email');

  const inputZip = document.getElementById('input-zipcode');
  const inputAddr1 = document.getElementById('input-addr1');
  const inputAddr2 = document.getElementById('input-addr2');
  const btnSearchAddr = document.getElementById('btn-search-addr');

  const inputSchool = document.getElementById('input-join-school');
  const selectGradYear = document.getElementById('select-grad-year');

  // 렌더링 함수
  function render() {
    // 1. 단계 표시기 갱신
    stepItems.forEach((item, idx) => {
      const stepNum = idx + 1;
      const circle = item.querySelector('.join-step-circle');
      const label = item.querySelector('.join-step-label');

      if (circle) circle.classList.toggle('active', state.step >= stepNum);
      if (label) label.classList.toggle('active', state.step >= stepNum);
    });

    stepLines.forEach((line, idx) => {
      line.classList.toggle('active', state.step > idx + 1);
    });

    // 2. 카드 뷰 전환
    if (cardStep1) cardStep1.style.display = (state.step === 1) ? 'flex' : 'none';
    if (cardStep2) cardStep2.style.display = (state.step === 2) ? 'flex' : 'none';
    if (cardStep3) cardStep3.style.display = (state.step === 3) ? 'flex' : 'none';

    // 3. 약관동의 버튼 상태
    const canNext1 = state.agree1 && state.agree2;
    if (btnStep1Next) {
      btnStep1Next.classList.toggle('active', canNext1);
    }
  }

  // 약관 체크박스 리스너
  if (chkAgree1) {
    chkAgree1.addEventListener('change', () => {
      state.agree1 = chkAgree1.checked;
      render();
    });
  }

  if (chkAgree2) {
    chkAgree2.addEventListener('change', () => {
      state.agree2 = chkAgree2.checked;
      render();
    });
  }

  // 1단계 -> 2단계 이동
  if (btnStep1Next) {
    btnStep1Next.addEventListener('click', (e) => {
      e.preventDefault();
      if (!state.agree1 || !state.agree2) {
        alert('필수 이용약관 및 개인정보처리방침에 모두 동의해 주세요.');
        return;
      }
      state.step = 2;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2단계 -> 1단계 이전 버튼
  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', (e) => {
      e.preventDefault();
      state.step = 1;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 아이디 중복확인
  if (btnCheckId) {
    btnCheckId.addEventListener('click', (e) => {
      e.preventDefault();
      const idVal = inputId ? inputId.value.trim() : '';
      if (!idVal) {
        alert('아이디를 입력해 주세요.');
        if (inputId) inputId.focus();
        return;
      }
      if (idVal.length < 6 || idVal.length > 12) {
        alert('아이디는 6~12자의 영문/숫자 조합으로 입력해 주세요.');
        if (inputId) inputId.focus();
        return;
      }
      state.idChecked = true;
      alert(`[${idVal}] 은(는) 사용 가능한 아이디입니다.`);
    });
  }

  // 휴대폰 중복확인
  if (btnCheckPhone) {
    btnCheckPhone.addEventListener('click', (e) => {
      e.preventDefault();
      const p2 = inputPhone2 ? inputPhone2.value.trim() : '';
      const p3 = inputPhone3 ? inputPhone3.value.trim() : '';
      if (!p2 || !p3) {
        alert('휴대폰 번호를 정확히 입력해 주세요.');
        if (inputPhone2 && !p2) inputPhone2.focus();
        else if (inputPhone3) inputPhone3.focus();
        return;
      }
      state.phoneChecked = true;
      alert('가입 가능한 휴대폰 번호입니다.');
    });
  }

  // 이메일 중복확인
  if (btnCheckEmail) {
    btnCheckEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const em = inputEmail ? inputEmail.value.trim() : '';
      if (!em || !em.includes('@')) {
        alert('올바른 이메일 주소를 입력해 주세요.');
        if (inputEmail) inputEmail.focus();
        return;
      }
      state.emailChecked = true;
      alert(`[${em}] 은(는) 사용 가능한 이메일입니다.`);
    });
  }

  // 주소검색 (다음 우편번호 API 모의 처리 또는 연동)
  if (btnSearchAddr) {
    btnSearchAddr.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.daum && window.daum.Postcode) {
        new daum.Postcode({
          oncomplete: function(data) {
            if (inputZip) inputZip.value = data.zonecode;
            if (inputAddr1) inputAddr1.value = data.address;
            if (inputAddr2) inputAddr2.focus();
          }
        }).open();
      } else {
        const sampleZip = '47007';
        const sampleAddr = '부산광역시 사상구 가야대로 348';
        if (inputZip) inputZip.value = sampleZip;
        if (inputAddr1) inputAddr1.value = sampleAddr;
        if (inputAddr2) {
          inputAddr2.value = 'KL빌딩 5층';
          inputAddr2.focus();
        }
        alert(`우편번호 검색이 적용되었습니다.\n[${sampleZip}] ${sampleAddr}`);
      }
    });
  }

  // 2단계 폼 제출 -> 유효성 검사 -> 3단계 완료 화면
  if (formJoin) {
    formJoin.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = inputName ? inputName.value.trim() : '';
      const idVal = inputId ? inputId.value.trim() : '';
      const pw = inputPw ? inputPw.value.trim() : '';
      const pwConfirm = inputPwConfirm ? inputPwConfirm.value.trim() : '';
      const p2 = inputPhone2 ? inputPhone2.value.trim() : '';
      const p3 = inputPhone3 ? inputPhone3.value.trim() : '';
      const em = inputEmail ? inputEmail.value.trim() : '';
      const zip = inputZip ? inputZip.value.trim() : '';
      const addr2 = inputAddr2 ? inputAddr2.value.trim() : '';
      const school = inputSchool ? inputSchool.value.trim() : '';
      const gradYear = selectGradYear ? selectGradYear.value : '';

      if (!name) {
        alert('이름을 입력해 주세요.');
        if (inputName) inputName.focus();
        return;
      }

      if (!idVal) {
        alert('아이디를 입력해 주세요.');
        if (inputId) inputId.focus();
        return;
      }

      if (idVal.length < 6 || idVal.length > 12) {
        alert('아이디는 6~12자로 설정해 주세요.');
        if (inputId) inputId.focus();
        return;
      }

      if (!pw) {
        alert('비밀번호를 입력해 주세요.');
        if (inputPw) inputPw.focus();
        return;
      }

      if (pw.length < 8 || pw.length > 16) {
        alert('비밀번호는 8~16자 길이로 설정해 주세요.');
        if (inputPw) inputPw.focus();
        return;
      }

      if (!pwConfirm) {
        alert('비밀번호 확인을 입력해 주세요.');
        if (inputPwConfirm) inputPwConfirm.focus();
        return;
      }

      if (pw !== pwConfirm) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        if (inputPwConfirm) inputPwConfirm.focus();
        return;
      }

      if (!p2 || !p3) {
        alert('휴대폰 번호를 입력해 주세요.');
        if (inputPhone2 && !p2) inputPhone2.focus();
        else if (inputPhone3) inputPhone3.focus();
        return;
      }

      if (!em || !em.includes('@')) {
        alert('이메일 주소를 올바르게 입력해 주세요.');
        if (inputEmail) inputEmail.focus();
        return;
      }

      if (!zip) {
        alert('주소검색을 통해 주소를 입력해 주세요.');
        if (btnSearchAddr) btnSearchAddr.focus();
        return;
      }

      if (!addr2) {
        alert('상세주소를 입력해 주세요.');
        if (inputAddr2) inputAddr2.focus();
        return;
      }

      if (!school) {
        alert('졸업고교명을 입력해 주세요.');
        if (inputSchool) inputSchool.focus();
        return;
      }

      if (!gradYear || gradYear === '선택하세요') {
        alert('졸업연도를 선택해 주세요.');
        if (selectGradYear) selectGradYear.focus();
        return;
      }

      // 회원가입 완료 처리
      state.step = 3;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 초기 렌더링
  render();
}

/* ==========================================================================
   18. 내정보수정 (members_edit.html) 인터랙션 로직
   - 폼 입력 검증 및 저장 처리
   - 우편번호 검색 연동
   - 회원탈퇴 신청 모달 오픈/닫기/확인
   ========================================================================== */
function initMemberEditInteractions() {
  const formEdit = document.getElementById('form-member-edit');
  if (!formEdit) return;

  const inputNewPw = document.getElementById('input-new-pw');
  const inputNewPwConfirm = document.getElementById('input-new-pw-confirm');
  const selectPhone1 = document.getElementById('select-phone1');
  const inputPhone2 = document.getElementById('input-phone2');
  const inputPhone3 = document.getElementById('input-phone3');
  const inputEmail = document.getElementById('input-email');
  const inputZip1 = document.getElementById('input-zip1');
  const inputZip2 = document.getElementById('input-zip2');
  const inputAddr1 = document.getElementById('input-addr1');
  const inputAddr2 = document.getElementById('input-addr2');
  const btnSearchZip = document.getElementById('btn-search-zip');
  const inputSchool = document.getElementById('input-school');
  const selectGradYear = document.getElementById('select-grad-year');
  const btnCancel = document.getElementById('btn-member-cancel');

  // 탈퇴 모달 관련 요소
  const modalDrop = document.getElementById('member-drop-modal');
  const btnDropOpen = document.getElementById('btn-drop-modal-open');
  const btnDropCancel = document.getElementById('btn-drop-modal-cancel');
  const btnDropConfirm = document.getElementById('btn-drop-modal-confirm');

  // 1. 우편번호 검색
  if (btnSearchZip) {
    btnSearchZip.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.daum && window.daum.Postcode) {
        new daum.Postcode({
          oncomplete: function(data) {
            if (inputZip1) inputZip1.value = data.zonecode.substring(0, 3);
            if (inputZip2) inputZip2.value = data.zonecode.substring(3);
            if (inputAddr1) inputAddr1.value = data.address;
            if (inputAddr2) inputAddr2.focus();
          }
        }).open();
      } else {
        const sampleZip = '03147';
        const sampleAddr = '경기 고양시 일산동구 461';
        if (inputZip1) inputZip1.value = '031';
        if (inputZip2) inputZip2.value = '47';
        if (inputAddr1) inputAddr1.value = sampleAddr;
        if (inputAddr2) {
          inputAddr2.value = 'B627';
          inputAddr2.focus();
        }
        alert(`우편번호 검색이 적용되었습니다.\n[${sampleZip}] ${sampleAddr}`);
      }
    });
  }

  // 2. 폼 저장 및 유효성 검사
  formEdit.addEventListener('submit', (e) => {
    e.preventDefault();

    const pw = inputNewPw ? inputNewPw.value.trim() : '';
    const pwConfirm = inputNewPwConfirm ? inputNewPwConfirm.value.trim() : '';
    const p2 = inputPhone2 ? inputPhone2.value.trim() : '';
    const p3 = inputPhone3 ? inputPhone3.value.trim() : '';
    const em = inputEmail ? inputEmail.value.trim() : '';
    const school = inputSchool ? inputSchool.value.trim() : '';
    const gradYear = selectGradYear ? selectGradYear.value : '';

    // 신규 비밀번호 변경 시도시 일치 여부 체크
    if (pw || pwConfirm) {
      if (pw.length < 8 || pw.length > 16) {
        alert('신규 비밀번호는 8~16자로 설정해 주세요.');
        if (inputNewPw) inputNewPw.focus();
        return;
      }
      if (pw !== pwConfirm) {
        alert('신규 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        if (inputNewPwConfirm) inputNewPwConfirm.focus();
        return;
      }
    }

    if (!p2 || !p3) {
      alert('휴대폰 번호를 입력해 주세요.');
      if (inputPhone2 && !p2) inputPhone2.focus();
      else if (inputPhone3) inputPhone3.focus();
      return;
    }

    if (!em || !em.includes('@')) {
      alert('올바른 이메일 주소를 입력해 주세요.');
      if (inputEmail) inputEmail.focus();
      return;
    }

    if (!school) {
      alert('졸업고교명을 입력해 주세요.');
      if (inputSchool) inputSchool.focus();
      return;
    }

    if (!gradYear || gradYear === '선택하세요') {
      alert('졸업연도를 선택해 주세요.');
      if (selectGradYear) selectGradYear.focus();
      return;
    }

    alert('회원정보가 성공적으로 수정되었습니다.');
  });

  // 3. 취소 버튼
  if (btnCancel) {
    btnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('정보수정을 취소하고 이전 페이지로 돌아가시겠습니까?')) {
        location.href = 'https://www.lcyber.co.kr/';
      }
    });
  }

  // 4. 회원탈퇴 모달 제어
  if (btnDropOpen && modalDrop) {
    btnDropOpen.addEventListener('click', (e) => {
      e.preventDefault();
      modalDrop.classList.add('active');
    });
  }

  if (btnDropCancel && modalDrop) {
    btnDropCancel.addEventListener('click', (e) => {
      e.preventDefault();
      modalDrop.classList.remove('active');
    });
  }

  if (modalDrop) {
    modalDrop.addEventListener('click', (e) => {
      if (e.target === modalDrop) {
        modalDrop.classList.remove('active');
      }
    });
  }

  if (btnDropConfirm && modalDrop) {
    btnDropConfirm.addEventListener('click', (e) => {
      e.preventDefault();
      alert('회원탈퇴 신청이 정상적으로 접수되었습니다.\n그동안 KBS아카데미 원격평생교육원을 이용해 주셔서 감사합니다.');
      modalDrop.classList.remove('active');
      location.href = 'login.html';
    });
  }

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalDrop && modalDrop.classList.contains('active')) {
      modalDrop.classList.remove('active');
    }
  });
}

/* ==========================================================================
   19. 내정보수정 완료 (members_edit_ok.html) 전용 인터랙션
   ========================================================================== */
function initMemberEditOkInteractions() {
  const okContainer = document.querySelector('.member-ok-container');
  if (!okContainer) return;

  // URL 쿼리 파라미터가 있을 경우 아이디 동적 표기 지원 (?id=...)
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  const userIdEl = document.getElementById('member-ok-user-id');
  if (userId && userIdEl) {
    userIdEl.textContent = userId;
  }
}

/* ==========================================================================
   20. 아이디·비밀번호 찾기 (find.html) 전용 인터랙션
   - origin/회원/아이디 비밀번호찾기.dc.html 기준 100% 동일한 작동 로직
   ========================================================================== */
function initFindPageInteractions() {
  const pageSection = document.querySelector('.find-page-section');
  if (!pageSection) return;

  // URL 파라미터 ?mode=pw 지원
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get('mode') === 'pw' ? 'pw' : 'id';

  // 상태 관리
  let state = {
    mode: initialMode, // 'id' | 'pw'
    step: 'method',    // 'method' | 'result'
    method: 'phone',   // 'phone' | 'email'
    emailCodeSent: false,
    pwIdConfirmed: false,
    pwId: '',
  };

  let timerInterval = null;

  // DOM 요소 참조
  const titleEl = document.getElementById('find-page-title');
  const crumb2El = document.getElementById('find-step-crumb2');
  const tabId = document.getElementById('tab-find-id');
  const tabPw = document.getElementById('tab-find-pw');

  const step1Card = document.getElementById('find-step-1');
  const step2IdCard = document.getElementById('find-step-2-id');
  const step2PwCard = document.getElementById('find-step-2-pw');

  const pwIdSection = document.getElementById('find-pw-id-section');
  const pwIdConfirmedSection = document.getElementById('find-pw-id-confirmed-section');
  const pwIdInput = document.getElementById('find-pw-input-id');
  const btnConfirmPwId = document.getElementById('btn-confirm-pw-id');
  const pwConfirmedIdText = document.getElementById('find-pw-confirmed-id-text');

  const methodBlock = document.getElementById('find-method-block');
  const methodHeader = document.getElementById('find-method-header');
  const radioPhone = document.getElementById('radio-method-phone');
  const radioEmail = document.getElementById('radio-method-email');

  const phoneActionWrap = document.getElementById('phone-action-wrap');
  const btnPhoneVerify = document.getElementById('btn-phone-verify');

  const emailActionWrap = document.getElementById('email-action-wrap');
  const inputEmail = document.getElementById('input-find-email');
  const btnSendEmailCode = document.getElementById('btn-send-email-code');
  const emailCodeSentSection = document.getElementById('email-code-sent-section');
  const inputEmailCode = document.getElementById('input-email-code');
  const emailTimerEl = document.getElementById('find-email-timer');
  const btnEmailVerify = document.getElementById('btn-email-verify');

  const btnGoPwFromResult = document.getElementById('btn-go-pw-from-result');
  const resetPwUserName = document.getElementById('find-reset-pw-user-name');
  const formResetPw = document.getElementById('form-reset-pw');
  const inputResetNewPw = document.getElementById('input-reset-new-pw');
  const inputResetNewPwConfirm = document.getElementById('input-reset-new-pw-confirm');

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startEmailTimer() {
    clearTimer();
    let timeLeft = 180; // 3분

    function updateDisplay() {
      const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const sec = String(timeLeft % 60).padStart(2, '0');
      if (emailTimerEl) emailTimerEl.textContent = `${min}:${sec}`;
    }

    updateDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearTimer();
        if (emailTimerEl) emailTimerEl.textContent = '00:00';
        alert('인증번호 유효시간이 만료되었습니다. [인증번호 받기]를 다시 눌러주세요.');
      } else {
        updateDisplay();
      }
    }, 1000);
  }

  function renderUI() {
    const isId = state.mode === 'id';

    // 1. 헤더 및 브레드크럼 타이틀
    if (titleEl) titleEl.textContent = isId ? '아이디 찾기' : '비밀번호 찾기';
    if (crumb2El) crumb2El.textContent = isId ? '02. 아이디 확인' : '02. 비밀번호 재설정';

    // 2. 탭 활성화 상태
    if (tabId) tabId.classList.toggle('active', isId);
    if (tabPw) tabPw.classList.toggle('active', !isId);

    // 3. 단계별 카드 표시
    if (state.step === 'method') {
      if (step1Card) step1Card.classList.remove('is-hidden');
      if (step2IdCard) step2IdCard.classList.add('is-hidden');
      if (step2PwCard) step2PwCard.classList.add('is-hidden');

      // 비밀번호 찾기 모드인 경우
      if (!isId) {
        if (!state.pwIdConfirmed) {
          if (pwIdSection) pwIdSection.classList.remove('is-hidden');
          if (pwIdConfirmedSection) pwIdConfirmedSection.classList.add('is-hidden');
          if (methodBlock) methodBlock.classList.add('is-hidden');
        } else {
          if (pwIdSection) pwIdSection.classList.add('is-hidden');
          if (pwIdConfirmedSection) pwIdConfirmedSection.classList.remove('is-hidden');
          if (pwConfirmedIdText) pwConfirmedIdText.textContent = state.pwId;
          if (methodBlock) methodBlock.classList.remove('is-hidden');
        }
      } else {
        // 아이디 찾기 모드인 경우
        if (pwIdSection) pwIdSection.classList.add('is-hidden');
        if (pwIdConfirmedSection) pwIdConfirmedSection.classList.add('is-hidden');
        if (methodBlock) methodBlock.classList.remove('is-hidden');
      }

      // 인증방법 선택 헤더 문구
      if (methodHeader) {
        methodHeader.textContent = isId ? '아이디 찾는 방법을 선택해 주세요.' : '비밀번호 찾는 방법을 선택해 주세요.';
      }

      // 라디오 상태 및 액션 폼
      const isPhone = state.method === 'phone';
      if (radioPhone) radioPhone.checked = isPhone;
      if (radioEmail) radioEmail.checked = !isPhone;

      if (phoneActionWrap) phoneActionWrap.classList.toggle('is-hidden', !isPhone);
      if (emailActionWrap) emailActionWrap.classList.toggle('is-hidden', isPhone);
      if (emailCodeSentSection) emailCodeSentSection.classList.toggle('is-hidden', !state.emailCodeSent);

    } else if (state.step === 'result') {
      if (step1Card) step1Card.classList.add('is-hidden');

      if (isId) {
        if (step2IdCard) step2IdCard.classList.remove('is-hidden');
        if (step2PwCard) step2PwCard.classList.add('is-hidden');
      } else {
        if (step2IdCard) step2IdCard.classList.add('is-hidden');
        if (step2PwCard) step2PwCard.classList.remove('is-hidden');
        if (resetPwUserName) {
          resetPwUserName.textContent = state.pwId ? `${state.pwId}님` : '홍길동님';
        }
      }
    }
  }

  function setMode(m) {
    clearTimer();
    state = {
      mode: m,
      step: 'method',
      method: 'phone',
      emailCodeSent: false,
      pwIdConfirmed: false,
      pwId: '',
    };
    if (pwIdInput) pwIdInput.value = '';
    if (inputEmail) inputEmail.value = '';
    if (inputEmailCode) inputEmailCode.value = '';
    if (inputResetNewPw) inputResetNewPw.value = '';
    if (inputResetNewPwConfirm) inputResetNewPwConfirm.value = '';
    renderUI();
  }

  // 탭 클릭 이벤트
  if (tabId) {
    tabId.addEventListener('click', (e) => {
      e.preventDefault();
      setMode('id');
    });
  }

  if (tabPw) {
    tabPw.addEventListener('click', (e) => {
      e.preventDefault();
      setMode('pw');
    });
  }

  // 비밀번호 찾기 시 아이디 확인 버튼
  if (btnConfirmPwId) {
    btnConfirmPwId.addEventListener('click', (e) => {
      e.preventDefault();
      const val = pwIdInput ? pwIdInput.value.trim() : '';
      if (!val) {
        alert('아이디를 입력해주세요.');
        if (pwIdInput) pwIdInput.focus();
        return;
      }
      state.pwId = val;
      state.pwIdConfirmed = true;
      renderUI();
    });
  }

  if (pwIdInput) {
    pwIdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btnConfirmPwId) btnConfirmPwId.click();
      }
    });
  }

  // 인증 방식 라디오 변경 이벤트
  if (radioPhone) {
    radioPhone.addEventListener('change', () => {
      if (radioPhone.checked) {
        state.method = 'phone';
        state.emailCodeSent = false;
        clearTimer();
        renderUI();
      }
    });
  }

  if (radioEmail) {
    radioEmail.addEventListener('change', () => {
      if (radioEmail.checked) {
        state.method = 'email';
        state.emailCodeSent = false;
        clearTimer();
        renderUI();
      }
    });
  }

  // 휴대폰 본인인증 버튼
  if (btnPhoneVerify) {
    btnPhoneVerify.addEventListener('click', (e) => {
      e.preventDefault();
      alert('휴대폰 본인인증이 완료되었습니다.');
      state.step = 'result';
      renderUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 이메일 인증번호 받기 버튼
  if (btnSendEmailCode) {
    btnSendEmailCode.addEventListener('click', (e) => {
      e.preventDefault();
      const em = inputEmail ? inputEmail.value.trim() : '';
      if (!em || !em.includes('@')) {
        alert('올바른 이메일 주소를 입력해주세요.');
        if (inputEmail) inputEmail.focus();
        return;
      }
      state.emailCodeSent = true;
      startEmailTimer();
      renderUI();
      alert('입력하신 이메일로 인증번호가 발송되었습니다. 인증번호를 입력해 주세요.');
    });
  }

  // 이메일 인증 완료 확인 버튼
  if (btnEmailVerify) {
    btnEmailVerify.addEventListener('click', (e) => {
      e.preventDefault();
      if (!state.emailCodeSent) {
        alert('먼저 [인증번호 받기]를 진행해 주세요.');
        return;
      }
      const code = inputEmailCode ? inputEmailCode.value.trim() : '';
      if (!code) {
        alert('인증번호 6자리를 입력해주세요.');
        if (inputEmailCode) inputEmailCode.focus();
        return;
      }
      clearTimer();
      alert('이메일 인증이 완료되었습니다.');
      state.step = 'result';
      renderUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 아이디 찾기 완료 후 비밀번호 찾기로 전환
  if (btnGoPwFromResult) {
    btnGoPwFromResult.addEventListener('click', (e) => {
      e.preventDefault();
      setMode('pw');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 비밀번호 재설정 폼 제출
  if (formResetPw) {
    formResetPw.addEventListener('submit', (e) => {
      e.preventDefault();
      const p1 = inputResetNewPw ? inputResetNewPw.value.trim() : '';
      const p2 = inputResetNewPwConfirm ? inputResetNewPwConfirm.value.trim() : '';

      if (p1.length < 8 || p1.length > 16) {
        alert('비밀번호는 8~16자로 설정해 주세요.');
        if (inputResetNewPw) inputResetNewPw.focus();
        return;
      }

      if (p1 !== p2) {
        alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
        if (inputResetNewPwConfirm) inputResetNewPwConfirm.focus();
        return;
      }

      alert('비밀번호가 성공적으로 변경되었습니다.\n변경된 비밀번호로 로그인해 주세요.');
      location.href = 'login.html';
    });
  }

  // 초기 렌더링
  renderUI();
}