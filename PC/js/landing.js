/**
 * ============================================================================
 * KBS 아카데미 원격평생교육원 - 사회복지사 2급 랜딩페이지 인터랙션 스크립트 (landing.js)
 * 퍼블리셔 30년차 기준: 바닐라 JS, 제로 디펜던시, 메모리 누수 방지, 철저한 예외 처리
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. 헤더 인증 배너 회전 슬라이더 (Badge Slider)
  // --------------------------------------------------------------------------
  function initHeaderBadgeSlider() {
    const track = document.getElementById('headerBadgeTrack');
    if (!track) return;

    let currentIndex = 0;
    const totalItems = 3;
    const itemHeight = 34;

    setInterval(function () {
      currentIndex = (currentIndex + 1) % totalItems;
      track.style.transition = 'transform 0.5s cubic-bezier(0.5, 0, 0.2, 1)';
      track.style.transform = 'translateY(-' + currentIndex * itemHeight + 'px)';
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 2. D-Day 카운트다운 타이머 (D-Day Countdown Timer)
  // --------------------------------------------------------------------------
  function initDDayCountdown() {
    // 7일 뒤 또는 지정 개강일 카운트다운
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    targetDate.setHours(23, 59, 59, 999);

    const ddayN0 = document.getElementById('ddayN0');
    const ddayN1 = document.getElementById('ddayN1');
    const ddayH0 = document.getElementById('ddayH0');
    const ddayH1 = document.getElementById('ddayH1');
    const ddayM0 = document.getElementById('ddayM0');
    const ddayM1 = document.getElementById('ddayM1');
    const ddayS0 = document.getElementById('ddayS0');
    const ddayS1 = document.getElementById('ddayS1');

    if (!ddayN0) return;

    function updateTimer() {
      const now = new Date();
      const diff = Math.max(0, targetDate - now);

      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const dStr = String(days).padStart(2, '0');
      const hStr = String(hours).padStart(2, '0');
      const mStr = String(minutes).padStart(2, '0');
      const sStr = String(seconds).padStart(2, '0');

      if (ddayN0) ddayN0.textContent = dStr[0];
      if (ddayN1) ddayN1.textContent = dStr[1];
      if (ddayH0) ddayH0.textContent = hStr[0];
      if (ddayH1) ddayH1.textContent = hStr[1];
      if (ddayM0) ddayM0.textContent = mStr[0];
      if (ddayM1) ddayM1.textContent = mStr[1];
      if (ddayS0) ddayS0.textContent = sStr[0];
      if (ddayS1) ddayS1.textContent = sStr[1];
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // --------------------------------------------------------------------------
  // 3. 혜택 캐러셀 트랙 (Benefits Carousel)
  // --------------------------------------------------------------------------
  function initBenefitCarousel() {
    const track = document.getElementById('benefitTrack');
    const prevBtn = document.getElementById('benefitPrevBtn');
    const nextBtn = document.getElementById('benefitNextBtn');
    if (!track) return;

    const step = 208;
    let isPaused = false;
    let resumeTimer = null;

    function scrollNext() {
      if (isPaused) return;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = 0;
        void track.offsetWidth;
        track.style.scrollBehavior = 'smooth';
        track.scrollBy({ left: step, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    }

    const autoPlay = setInterval(scrollNext, 1600);

    function pauseAndResume() {
      isPaused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        isPaused = false;
      }, 4000);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        pauseAndResume();
        track.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        pauseAndResume();
        track.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    track.addEventListener('mouseenter', function () { isPaused = true; });
    track.addEventListener('mouseleave', function () { isPaused = false; });
  }

  // --------------------------------------------------------------------------
  // 4. 학곰이 취득시기 자가진단 계산기 (Hakgomi Diagnosis Calculator)
  // --------------------------------------------------------------------------
  function initDiagnosisCalculator() {
    const tabBtns = document.querySelectorAll('.landing-diag-tab-btn');
    const resultCard = document.getElementById('diagResultCard');
    const coursesEl = document.getElementById('diagCoursesVal');
    const periodEl = document.getElementById('diagPeriodVal');
    const todayLabelEl = document.getElementById('todayDateLabel');

    if (!tabBtns.length || !resultCard) return;

    // 오늘 날짜 표시
    const now = new Date();
    if (todayLabelEl) {
      todayLabelEl.textContent = now.getFullYear() + '년 ' + (now.getMonth() + 1) + '월 ' + now.getDate() + '일';
    }

    function calcAcquire(level, today) {
      if (!today) today = new Date();
      const CFG = {
        weeks: 15,
        program: {
          hs: { terms: 4, courses: '27과목 + 학위과정' },
          college: { terms: 3, courses: '17과목' },
          univ: { terms: 3, courses: '17과목' }
        },
        certMonths: [1, 4, 7, 10],
        degreeMonths: [2, 8]
      };
      if (level === 'enrolled') {
        return { courses: '학점 확인 후 안내', period: '학습설계 후 안내' };
      }
      const prog = CFG.program[level];
      if (!prog) return { courses: '17과목', period: '약 1년 4개월' };

      const addDays = function(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
      const addWeeks = function(d, w) { return addDays(d, w * 7); };
      const monthsDiff = function(from, to) {
        let m = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
        if (to.getDate() - from.getDate() >= 15) m += 1;
        return Math.max(m, 1);
      };
      const getTerm = function(endDate) {
        const y = endDate.getFullYear(), mo = endDate.getMonth() + 1;
        if (mo >= 3 && mo <= 8) return { year: y, term: 1 };
        if (mo >= 9) return { year: y, term: 2 };
        return { year: y - 1, term: 2 };
      };
      const addTerm = function(t, n) {
        const total = t.year * 2 + (t.term - 1) + n;
        return { year: Math.floor(total / 2), term: (total % 2) + 1 };
      };
      const earliestEnd = function(t) {
        return t.term === 1 ? new Date(t.year, 2, 1) : new Date(t.year, 8, 1);
      };
      const nextMonthIn = function(base, months) {
        for (let i = 0; i < 60; i++) {
          const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
          if (months.indexOf(d.getMonth() + 1) !== -1 && d > base) return d;
        }
      };
      const currentTerm = function(t) { return getTerm(addWeeks(t, CFG.weeks)); };

      const start = currentTerm(today);
      let lastEnd;
      for (let i = 0; i < prog.terms; i++) {
        const s = addTerm(start, i);
        lastEnd = i === 0 ? addWeeks(today, CFG.weeks) : earliestEnd(s);
      }
      const acquireDate = level === 'hs' ? nextMonthIn(lastEnd, CFG.degreeMonths) : nextMonthIn(lastEnd, CFG.certMonths);
      const months = monthsDiff(today, acquireDate);
      const periodLabel = months < 12 ? ('약 ' + months + '개월') : (months % 12 === 0 ? ('약 ' + Math.floor(months / 12) + '년') : ('약 ' + Math.floor(months / 12) + '년 ' + (months % 12) + '개월'));

      return { courses: prog.courses, period: periodLabel };
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        tabBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const edu = btn.getAttribute('data-edu');
        const res = calcAcquire(edu, new Date());

        resultCard.style.display = 'flex';
        if (coursesEl) coursesEl.textContent = res.courses;
        if (periodEl) periodEl.textContent = res.period;
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. 스크롤 통계 카운터 애니메이션 (Stat Counters with IntersectionObserver)
  // --------------------------------------------------------------------------
  function initStatCounters() {
    const counterElements = document.querySelectorAll('.statCounter');
    if (!counterElements.length) return;

    function animateCounter(el) {
      const target = parseFloat(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isInt = Number.isInteger(target);
      const duration = 1200;
      const startTime = performance.now();

      function step(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = target * easeOut;

        if (isInt) {
          el.textContent = Math.round(currentVal).toLocaleString('ko-KR') + suffix;
        } else {
          el.textContent = currentVal.toFixed(1) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      counterElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      counterElements.forEach(function (el) {
        animateCounter(el);
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. 취업분야 9대 카테고리 아코디언 (Career Fields Accordion)
  // --------------------------------------------------------------------------
  function initCareerAccordions() {
    const toggles = document.querySelectorAll('.landing-career-cat-toggle');
    if (!toggles.length) return;

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const card = toggle.closest('.landing-career-cat-card');
        const panel = card.querySelector('.landing-career-cat-panel');
        const icon = toggle.querySelector('.msi');

        if (!panel) return;

        const isOpen = panel.classList.contains('open');

        // 다른 아코디언 닫기
        document.querySelectorAll('.landing-career-cat-panel.open').forEach(function (p) {
          if (p !== panel) {
            p.classList.remove('open');
            const otherToggle = p.closest('.landing-career-cat-card').querySelector('.landing-career-cat-toggle');
            const otherIcon = otherToggle.querySelector('.msi');
            if (otherIcon) otherIcon.textContent = 'expand_more';
          }
        });

        if (isOpen) {
          panel.classList.remove('open');
          if (icon) icon.textContent = 'expand_more';
        } else {
          panel.classList.add('open');
          if (icon) icon.textContent = 'expand_less';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. 사회복지사 연봉 계산기 (Salary Calculator)
  // --------------------------------------------------------------------------
  function initSalaryCalculator() {
    const wageTable = {
      1: [null, 3169000, 2703000, 2550000, 2518000],
      2: [null, 3239000, 2784000, 2577000, 2545000],
      3: [null, 3312000, 2872000, 2604000, 2572000],
      4: [null, 3390000, 2969000, 2631000, 2597000],
      5: [null, 3470000, 3068000, 2712000, 2618000],
      6: [null, 3563000, 3167000, 2812000, 2638000],
      7: [null, 3663000, 3266000, 2912000, 2659000],
      8: [null, 3763000, 3365000, 3004000, 2743000],
      9: [null, 3863000, 3475000, 3102000, 2842000],
      10: [null, 3963000, 3575000, 3202000, 2929000],
      11: [null, 4063000, 3675000, 3298000, 3008000],
      12: [null, 4163000, 3730000, 3359000, 3069000],
      13: [null, 4263000, 3785000, 3426000, 3148000],
      14: [null, 4363000, 3850000, 3494000, 3228000],
      15: [null, 4444000, 3915000, 3566000, 3281000],
      16: [4912000, 4524000, 4006000, 3637000, 3354000],
      17: [4969000, 4602000, 4073000, 3708000, 3401000],
      18: [5022000, 4672000, 4147000, 3776000, 3472000],
      19: [5096000, 4738000, 4212000, 3841000, 3530000],
      20: [5173000, 4802000, 4278000, 3902000, 3590000],
      21: [5271000, 4862000, 4339000, 3966000, 3644000],
      22: [5336000, 4923000, 4399000, 4020000, 3699000],
      23: [5395000, 4985000, 4454000, 4073000, 3748000],
      24: [5451000, 5046000, 4513000, 4122000, 3796000],
      25: [5506000, 5107000, 4568000, 4176000, 3843000],
      26: [5577000, 5170000, 4620000, 4223000, 3889000],
      27: [5622000, 5233000, 4681000, 4270000, 3935000],
      28: [5661000, 5296000, 4744000, 4317000, 3979000],
      29: [5729000, 5360000, 4807000, 4364000, 4023000],
      30: [5788000, 5424000, 4867000, 4411000, 4063000],
      31: [null, 5484000, 4917000, 4461000, 4113000]
    };

    let selectedRole = 0; // 0: 사회복지사, 1: 대리, 2: 과장, 3: 부장, 4: 시설장
    let years = 1;

    const roleBtns = document.querySelectorAll('.landing-role-btn');
    const directorNotice = document.getElementById('directorNotice');
    const yearsSlider = document.getElementById('salaryYearsSlider');
    const yearsLabel = document.getElementById('salaryYearsLabel');

    const ckMeal = document.getElementById('ckMeal');
    const ckHoliday = document.getElementById('ckHoliday');
    const ckSpouse = document.getElementById('ckSpouse');
    const ckKids = document.getElementById('ckKids');
    const selKidsCount = document.getElementById('selKidsCount');
    const ckDirector = document.getElementById('ckDirector');
    const inpOvertime = document.getElementById('inpOvertime');

    const yearlyDisplay = document.getElementById('salaryYearlyDisplay');
    const monthlyDisplay = document.getElementById('salaryMonthlyDisplay');
    const baseMonthlyDisplay = document.getElementById('salaryBaseMonthlyDisplay');

    const holidayAmtLabel = document.getElementById('salaryHolidayAmtLabel');
    const kidsAmtLabel = document.getElementById('salaryKidsAmtLabel');
    const otAmtLabel = document.getElementById('salaryOtAmtLabel');

    const rowMeal = document.getElementById('rowMeal');
    const rowHoliday = document.getElementById('rowHoliday');
    const rowSpouse = document.getElementById('rowSpouse');
    const rowKids = document.getElementById('rowKids');
    const rowDirector = document.getElementById('rowDirector');
    const rowOvertime = document.getElementById('rowOvertime');

    if (!roleBtns.length || !yearsSlider) return;

    function calculate() {
      const roleIdx = 4 - selectedRole; // 4: 사회복지사, 3: 대리, 2: 과장, 1: 부장, 0: 시설장
      const minHo = selectedRole === 4 ? 16 : 1;
      const currentHo = Math.min(Math.max(years, minHo), 31);

      if (directorNotice) {
        if (selectedRole === 4) directorNotice.classList.add('show');
        else directorNotice.classList.remove('show');
      }

      const baseMonthly = (wageTable[currentHo] && wageTable[currentHo][roleIdx]) || wageTable[minHo][roleIdx] || 2518000;
      let monthly = baseMonthly;

      // 정액급식비 14만원
      const hasMeal = ckMeal && ckMeal.checked;
      if (hasMeal) monthly += 140000;

      // 명절휴가비 120% (연간)
      const hasHoliday = ckHoliday && ckHoliday.checked;
      const holidayYearly = Math.round(baseMonthly * 1.2);
      if (hasHoliday) monthly += Math.round(holidayYearly / 12);

      // 배우자수당 4만원
      const hasSpouse = ckSpouse && ckSpouse.checked;
      if (hasSpouse) monthly += 40000;

      // 자녀수당
      const hasKids = ckKids && ckKids.checked;
      const kidsCount = selKidsCount ? parseInt(selKidsCount.value, 10) : 0;
      let kidsAmt = 0;
      if (kidsCount >= 1) kidsAmt += 50000;
      if (kidsCount >= 2) kidsAmt += 80000;
      if (kidsCount >= 3) kidsAmt += (kidsCount - 2) * 120000;
      if (hasKids) monthly += kidsAmt;

      // 시설장수당 22만원
      const hasDirector = ckDirector && ckDirector.checked;
      if (hasDirector) monthly += 220000;

      // 시간외근무수당
      const otHours = inpOvertime ? Math.max(0, Math.min(15, parseInt(inpOvertime.value, 10) || 0)) : 0;
      const tongsang = baseMonthly + (hasMeal ? 140000 : 0) + Math.round(holidayYearly / 12);
      const otAmt = otHours ? Math.round((tongsang / 209) * 1.5 * otHours) : 0;
      monthly += otAmt;

      // 총 연봉
      const totalYearly = (baseMonthly * 12) +
        (hasMeal ? 140000 * 12 : 0) +
        (hasHoliday ? holidayYearly : 0) +
        (hasSpouse ? 40000 * 12 : 0) +
        (hasKids ? kidsAmt * 12 : 0) +
        (hasDirector ? 220000 * 12 : 0) +
        (otAmt * 12);

      // DOM 업데이트
      if (yearlyDisplay) {
        yearlyDisplay.textContent = Math.round(totalYearly / 10000).toLocaleString() + '만원';
      }
      if (monthlyDisplay) {
        monthlyDisplay.textContent = '월 지급 ' + Math.round(monthly / 10000).toLocaleString() + '만원';
      }
      if (baseMonthlyDisplay) {
        baseMonthlyDisplay.textContent = '월 ' + Math.round(baseMonthly / 10000) + '만원';
      }

      if (holidayAmtLabel) {
        holidayAmtLabel.textContent = '+' + Math.round(holidayYearly / 10000) + '만원';
      }
      if (kidsAmtLabel) {
        kidsAmtLabel.textContent = kidsAmt > 0 ? '+' + Math.round(kidsAmt * 12 / 10000) + '만원' : '0원';
      }
      if (otAmtLabel) {
        otAmtLabel.textContent = '+' + Math.round(otAmt / 10000) + '만원';
      }

      // 내역 행 표시/숨김
      if (rowMeal) rowMeal.style.display = hasMeal ? 'flex' : 'none';
      if (rowHoliday) rowHoliday.style.display = hasHoliday ? 'flex' : 'none';
      if (rowSpouse) rowSpouse.style.display = hasSpouse ? 'flex' : 'none';
      if (rowKids) rowKids.style.display = hasKids ? 'flex' : 'none';
      if (rowDirector) rowDirector.style.display = hasDirector ? 'flex' : 'none';
      if (rowOvertime) rowOvertime.style.display = otHours > 0 ? 'flex' : 'none';
    }

    // 직책 버튼 이벤트
    roleBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        roleBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedRole = parseInt(btn.getAttribute('data-role'), 10);
        calculate();
      });
    });

    // 연차 슬라이더
    yearsSlider.addEventListener('input', function () {
      years = parseInt(this.value, 10);
      if (yearsLabel) yearsLabel.textContent = years + '년 차';
      calculate();
    });

    // 수당 체크박스
    [ckMeal, ckHoliday, ckSpouse, ckKids, ckDirector].forEach(function (chk) {
      if (chk) chk.addEventListener('change', calculate);
    });

    if (selKidsCount) selKidsCount.addEventListener('change', calculate);
    if (inpOvertime) inpOvertime.addEventListener('input', calculate);

    calculate();
  }

  // --------------------------------------------------------------------------
  // 8. 자주하는 질문 아코디언 (FAQ Accordion)
  // --------------------------------------------------------------------------
  function initFaqAccordion() {
    const faqToggles = document.querySelectorAll('.landing-faq-toggle');
    if (!faqToggles.length) return;

    faqToggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        const item = toggle.closest('.landing-faq-item');
        const answer = item.querySelector('.landing-faq-answer');
        const icon = toggle.querySelector('.msi');

        if (!answer) return;

        const isOpen = answer.classList.contains('open');

        // 다른 FAQ 닫기
        document.querySelectorAll('.landing-faq-answer.open').forEach(function (a) {
          if (a !== answer) {
            a.classList.remove('open');
            const otherIcon = a.closest('.landing-faq-item').querySelector('.landing-faq-toggle .msi');
            if (otherIcon) otherIcon.textContent = 'expand_more';
          }
        });

        if (isOpen) {
          answer.classList.remove('open');
          if (icon) icon.textContent = 'expand_more';
        } else {
          answer.classList.add('open');
          if (icon) icon.textContent = 'expand_less';
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. 상담 신청 폼 유효성 검사 및 전송 (Consultation Form Handler)
  // --------------------------------------------------------------------------
  function initConsultationForms() {
    const mainForm = document.getElementById('mainConsultForm');
    const stickyForm = document.getElementById('stickyConsultForm');

    function handleFormSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const nameInput = form.querySelector('input[name="name"]');
      const hp2 = form.querySelector('input[name="hptel2"]');
      const hp3 = form.querySelector('input[name="hptel3"]');
      const chkAgree = form.querySelector('input[type="checkbox"][name="chkx"]') || form.querySelector('input[type="checkbox"]');

      if (nameInput && !nameInput.value.trim()) {
        alert('이름을 입력해주세요.');
        nameInput.focus();
        return;
      }

      if (hp2 && !hp2.value.trim()) {
        alert('휴대폰 번호 앞자리를 입력해주세요.');
        hp2.focus();
        return;
      }

      if (hp3 && !hp3.value.trim()) {
        alert('휴대폰 번호 뒷자리를 입력해주세요.');
        hp3.focus();
        return;
      }

      if (chkAgree && !chkAgree.checked) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        chkAgree.focus();
        return;
      }

      alert('상담 신청이 완료되었습니다.\n전문 학습설계 매니저가 빠른 시간 내에 연락드리겠습니다.');
      form.reset();
    }

    if (mainForm) mainForm.addEventListener('submit', handleFormSubmit);
    if (stickyForm) stickyForm.addEventListener('submit', handleFormSubmit);
  }

  // --------------------------------------------------------------------------
  // 10. 맨 위로 스크롤 버튼 (Scroll to Top)
  // --------------------------------------------------------------------------
  function initScrollTop() {
    const btn = document.getElementById('btn-scroll-top');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 초기화 실행 (DOM Ready)
  // --------------------------------------------------------------------------
  function initAll() {
    initHeaderBadgeSlider();
    initDDayCountdown();
    initBenefitCarousel();
    initDiagnosisCalculator();
    initStatCounters();
    initCareerAccordions();
    initSalaryCalculator();
    initFaqAccordion();
    initConsultationForms();
    initScrollTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();
