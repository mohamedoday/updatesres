/* =========================================================================
   دار الشام الملكي | DAR AL-SHAM ROYAL — ملف الجافاسكريبت الرئيسي (app.js)
   يتولى إدارة:
   1. بيانات القائمة الملكية ومراحل رحلة التذوق
   2. التصفية والبحث الفوري في الأطباق
   3. سلة التذوق (إضافة، زيادة/إنقاص الكمية، حذف، حساب المجموع، حفظ محلي)
   4. نافذة حجز الطاولة مع التحقق الفوري وتأكيد الحجز
   5. التنقل، التمرير البانورامي، ظهور العناصر، والموسيقى الشرقية عبر Web Audio API
   ========================================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------------------
     ١. بيانات القائمة الملكية (Royal Menu Data)
     ----------------------------------------------------------------------- */
  const ROYAL_MENU_ITEMS = [
    {
      id: "dish-1",
      name: "أوزي السلطان بالزعفران والفستق الحلبي",
      category: "mains",
      price: 145,
      icon: "fa-bowl-rice",
      vegetarian: false,
      tags: ["الأكثر طلباً", "زعفران ملكي"],
      description:
        "لحم ضأن مطهو على نار هادئة لمدة ١٢ ساعة مع أرز بسمتي منقوع بالزعفران والهيل، ومزين بفستق حلب ولوز محمص."
    },
    {
      id: "dish-2",
      name: "متبل الباذنجان المدخن بالرمان والجوز",
      category: "starters",
      price: 44,
      icon: "fa-mortar-pestle",
      vegetarian: true,
      tags: ["نباتي", "مدخن"],
      description:
        "باذنجان مشوي على فحم الزيتون يمزج مع طحينة سمسم فاخرة، دبس رمان طبيعي، وعين جمل محمصة."
    },
    {
      id: "dish-3",
      name: "كباب حلبي ملكي على فحم البلوط",
      category: "grills",
      price: 118,
      icon: "fa-fire-burner",
      vegetarian: false,
      tags: ["مشويات", "فحم طبيعي"],
      description:
        "أسياخ كباب متبلة ببهارات حلبية تقليدية مع فلفل أحمر حلو وبقدونس طازج، تُقدم مع خبز التنور الساخن."
    },
    {
      id: "dish-4",
      name: "شيش طاووق بالليمون والزعتر البري",
      category: "grills",
      price: 94,
      icon: "fa-drumstick-bite",
      vegetarian: false,
      tags: ["طري وعطري"],
      description:
        "قطع دجاج مختارة منقوعة بالليمون المعتق وزيت الزيتون والزعتر البري، مشوية بعناية لتبقى غنية بالعصارة."
    },
    {
      id: "dish-5",
      name: "شوربة الفريك بالكمأة والليمون الطازج",
      category: "starters",
      price: 52,
      icon: "fa-mug-hot",
      vegetarian: true,
      tags: ["نباتي", "دافئة"],
      description:
        "فريك أخضر محمص بعناية يُطهى في مرق عطري غني مع لمسات خفيفة من الكمأة وعصير الليمون الطازج."
    },
    {
      id: "dish-6",
      name: "ريش غنم متبلة بالروزماري والبهار الحلو",
      category: "grills",
      price: 168,
      icon: "fa-bone",
      vegetarian: false,
      tags: ["قطعة مميزة", "نار هادئة"],
      description:
        "ريش ضأن فاخرة متبلة بتوليفة متوازنة من الأعشاب والبهارات الشامية، تُشوى حتى تكتسب قشرة ذهبية شهية."
    },
    {
      id: "dish-7",
      name: "مقلوبة الدار بالباذنجان والقرنبيط واللوز",
      category: "mains",
      price: 112,
      icon: "fa-utensils",
      vegetarian: false,
      tags: ["تراثية"],
      description:
        "طبقات متناغمة من الأرز المتبل، شرائح الباذنجان والقرنبيط، وقطع اللحم الطرية، تُقلب أمام الضيف بحفاوة."
    },
    {
      id: "dish-8",
      name: "فتة حمص ملكية بالسمن البلدي والصنوبر",
      category: "starters",
      price: 48,
      icon: "fa-seedling",
      vegetarian: true,
      tags: ["نباتي", "إفطار ومقبلات"],
      description:
        "حمص مسلوق بحبات كاملة مع لبن مخملي وطحينة وخبز مقرمش، يعلوها صنوبر محمص بالسمن البلدي الأصيل."
    },
    {
      id: "dish-9",
      name: "كنافة نابلسية ملكية بماء الزهر والفستق",
      category: "desserts",
      price: 58,
      icon: "fa-cake-candles",
      vegetarian: true,
      tags: ["نباتي", "حلوى شرقية"],
      description:
        "طبقة جبن مطاطي دافئ تحت قشرة كنافة ذهبية مقرمشة، مع قطر معطر بماء الزهر وفستق أخضر مطحون."
    },
    {
      id: "dish-10",
      name: "مهلبية الورد الدمشقي بالرمان والمستكة",
      category: "desserts",
      price: 42,
      icon: "fa-ice-cream",
      vegetarian: true,
      tags: ["نباتي", "منعشة"],
      description:
        "قوام حريري ناعم بنكهة المستكة وماء الورد الدمشقي، يزينه رمان طازج ولمسة رقيقة من الفستق."
    },
    {
      id: "dish-11",
      name: "شاي ملكي بالنعناع الحصباوي والهيل",
      category: "desserts",
      price: 28,
      icon: "fa-leaf",
      vegetarian: true,
      tags: ["نباتي", "مشروب ساخن"],
      description:
        "شاي أسود فاخر يُحضّر على نار هادئة مع أوراق النعناع الطازج ولمسة خفيفة من الهيل العطري."
    },
    {
      id: "dish-12",
      name: "ليموناضة بالنعناع والورد وماء الزهر",
      category: "desserts",
      price: 34,
      icon: "fa-martini-glass-citrus",
      vegetarian: true,
      tags: ["نباتي", "بارد ومنعش"],
      description:
        "مزيج منعش من الليمون الطازج، أوراق النعناع، ولمسة خفيفة من ماء الزهر لتوازن النكهات بعد الوليمة."
    }
  ];

  /* -----------------------------------------------------------------------
     ٢. بيانات مراحل رحلة التذوق (Tasting Journey Stages)
     ----------------------------------------------------------------------- */
  const TASTING_STAGES = [
    {
      badge: "المحطة الأولى • الترحيب",
      icon: "fa-mug-hot",
      timing: "المدة المقترحة: ١٥ دقيقة",
      title: "قهوة الهيل الملكية وتمور السكري المحشوة",
      description:
        "نستقبلك بكوب من القهوة العربية المحمصة بدرجة متوسطة ومنكهة بالهيل والزعفران، تُقدم مع تمور فاخرة محشوة بقشر البرتقال المسكر واللوز المحمص لتهيئة الحواس.",
      notes: [
        "تقديم نحاسي دافئ يحفظ حرارة القهوة ونكهتها العطرية.",
        "إمكانية إضافة قطرات من ماء الورد الدمشقي حسب الرغبة.",
        "مرافقة مثالية لبدء أمسية هادئة ومريحة."
      ]
    },
    {
      badge: "المحطة الثانية • الافتتاح",
      icon: "fa-mortar-pestle",
      timing: "المدة المقترحة: ٢٠ دقيقة",
      title: "سيمفونية المقبلات الشامية والخبز الساخن",
      description:
        "تشكيلة متوازنة تجمع بين المدخن والحامض والناعم؛ مثل متبل الباذنجان بالرمان، والفتة الكريمية، مع خبز التنور الخارج للتو من الفرن الحجري.",
      notes: [
        "استخدام زيت الزيتون البكر المعصور على البارد.",
        "توازن مدروس بين الحموضة الطبيعية ودسامة الطحينة.",
        "يُقدّم مع تشكيلة خضار ورقية منتقاة بعناية."
      ]
    },
    {
      badge: "المحطة الثالثة • الجمر",
      icon: "fa-fire-burner",
      timing: "المدة المقترحة: ٢٥ دقيقة",
      title: "مشويات الفحم والبهارات الشامية المعتقة",
      description:
        "تبرز هنا حرارة الفحم الطبيعي ونكهة التوابل المحمصة؛ حيث تُشوى الأسياخ والريش بدقة لتحافظ على طراوتها الداخلية وقوامها الشهي.",
      notes: [
        "تتبيل مسبق يمنح اللحم عمقاً دون طغيان التوابل.",
        "شواء مضبوط الحرارة لتفادي جفاف الألياف.",
        "يُرافق بصلصات منزلية محضّرة يومياً."
      ]
    },
    {
      badge: "المحطة الرابعة • الذروة",
      icon: "fa-crown",
      timing: "المدة المقترحة: ٣٠ دقيقة",
      title: "الأطباق السلطانية: أوزي الزعفران وولائم الدار",
      description:
        "قلب المائدة الملكية حيث يلتقي الأرز الطويل الحبة المعطر بالزعفران والهيل مع اللحوم المطهوة ببطء، والمكسرات الذهبية المحمصة يدوياً.",
      notes: [
        "زعفران فاخر يمنح لوناً ذهبياً وعبقاً مميزاً.",
        "طهي بطيء يضمن سهولة التقديم وتكامل النكهات.",
        "مثالي للمشاركة وإضفاء طابع احتفالي على المائدة."
      ]
    },
    {
      badge: "المحطة الخامسة • الختام",
      icon: "fa-cake-candles",
      timing: "المدة المقترحة: ٢٠ دقيقة",
      title: "الختام الحلو: كنافة الفستق وشاي النعناع",
      description:
        "نختتم رحلتك بلمسة حلوة متزنة بين قرمشة الكنافة ودفء الجبن أو برودة المهلبية، يتبعها كوب من الشاي المعطر بالنعناع والهيل.",
      notes: [
        "حلاوة متزنة لا تطغى على نكهات العشاء السابقة.",
        "فستق حلبي أخضر عالي الجودة لمذاق وقوام غني.",
        "ختام شامي أصيل يترك أثراً دافئاً في الذاكرة."
      ]
    }
  ];

  /* -----------------------------------------------------------------------
     ٣. حالة التطبيق (Application State)
     ----------------------------------------------------------------------- */
  const STORAGE_KEY_BAG = "dar_al_sham_royal_bag_v1";

  const state = {
    category: "all",
    searchQuery: "",
    vegetarianOnly: false,
    activeJourneyStage: 0,
    bag: loadBagFromStorage(),
    audioPlaying: false
  };

  /* -----------------------------------------------------------------------
     ٤. مراجع عناصر الواجهة (DOM References)
     ----------------------------------------------------------------------- */
  const dom = {
    preloader: document.getElementById("royalPreloader"),
    preloaderBar: document.getElementById("preloaderBar"),
    scrollProgressBar: document.getElementById("scrollProgressBar"),
    navbar: document.getElementById("royalNavbar"),
    navLinks: Array.from(document.querySelectorAll(".nav-link")),
    sections: Array.from(document.querySelectorAll("section[id]")),

    mobileMenuToggle: document.getElementById("mobileMenuToggle"),
    mobileMenuIcon: document.getElementById("mobileMenuIcon"),
    mobileNavDrawer: document.getElementById("mobileNavDrawer"),
    mobileNavLinks: Array.from(document.querySelectorAll(".mobile-nav-link")),

    ambientSoundBtn: document.getElementById("ambientSoundBtn"),
    ambientSoundIcon: document.getElementById("ambientSoundIcon"),

    heroParallaxBg: document.getElementById("heroParallaxBg"),
    metricValues: Array.from(document.querySelectorAll(".metric-value[data-target]")),
    quickAddHeroBtn: document.querySelector(".quick-add-hero-btn"),

    journeyTabs: Array.from(document.querySelectorAll(".journey-tab")),
    journeyStageBadge: document.getElementById("journeyStageBadge"),
    journeyStageIcon: document.getElementById("journeyStageIcon"),
    journeyStageTiming: document.getElementById("journeyStageTiming"),
    journeyStageTitle: document.getElementById("journeyStageTitle"),
    journeyStageDesc: document.getElementById("journeyStageDesc"),
    journeyStageNotes: document.getElementById("journeyStageNotes"),
    prevJourneyBtn: document.getElementById("prevJourneyBtn"),
    nextJourneyBtn: document.getElementById("nextJourneyBtn"),

    categoryTabs: Array.from(document.querySelectorAll(".category-tab")),
    menuSearchInput: document.getElementById("menuSearchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    vegetarianFilterBtn: document.getElementById("vegetarianFilterBtn"),
    menuResultsCount: document.getElementById("menuResultsCount"),
    resetAllFiltersBtn: document.getElementById("resetAllFiltersBtn"),
    menuGrid: document.getElementById("menuGrid"),
    menuEmptyState: document.getElementById("menuEmptyState"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),

    openBagBtn: document.getElementById("openBagBtn"),
    closeBagBtn: document.getElementById("closeBagBtn"),
    bagBackdrop: document.getElementById("bagBackdrop"),
    tastingBagDrawer: document.getElementById("tastingBagDrawer"),
    bagCountBadge: document.getElementById("bagCountBadge"),
    bagSubtitle: document.getElementById("bagSubtitle"),
    bagItemsList: document.getElementById("bagItemsList"),
    bagEmptyState: document.getElementById("bagEmptyState"),
    bagFooterSummary: document.getElementById("bagFooterSummary"),
    bagSubtotal: document.getElementById("bagSubtotal"),
    bagServiceFee: document.getElementById("bagServiceFee"),
    bagGrandTotal: document.getElementById("bagGrandTotal"),
    confirmOrderBtn: document.getElementById("confirmOrderBtn"),
    clearBagBtn: document.getElementById("clearBagBtn"),
    browseMenuFromBagBtn: document.getElementById("browseMenuFromBagBtn"),

    openReservationNavBtn: document.getElementById("openReservationNavBtn"),
    openReservationMobileBtn: document.getElementById("openReservationMobileBtn"),
    openReservationHeroBtn: document.getElementById("openReservationHeroBtn"),
    openReservationFooterBtn: document.getElementById("openReservationFooterBtn"),
    reservationModal: document.getElementById("reservationModal"),
    closeReservationModalBtn: document.getElementById("closeReservationModalBtn"),
    reservationForm: document.getElementById("reservationForm"),
    reservationSuccessState: document.getElementById("reservationSuccessState"),
    reservationSummaryBox: document.getElementById("reservationSummaryBox"),
    newReservationBtn: document.getElementById("newReservationBtn"),
    doneReservationBtn: document.getElementById("doneReservationBtn"),

    guestName: document.getElementById("guestName"),
    guestPhone: document.getElementById("guestPhone"),
    resDate: document.getElementById("resDate"),
    resTime: document.getElementById("resTime"),
    resGuests: document.getElementById("resGuests"),
    resNotes: document.getElementById("resNotes"),
    guestNameError: document.getElementById("guestNameError"),
    guestPhoneError: document.getElementById("guestPhoneError"),
    resDateError: document.getElementById("resDateError"),

    toastContainer: document.getElementById("toastContainer"),
    currentYear: document.getElementById("currentYear")
  };

  /* -----------------------------------------------------------------------
     ٥. دوال التخزين المساعدة وتنسيق العملة والإشعارات
     ----------------------------------------------------------------------- */
  function loadBagFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BAG);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("تعذر قراءة سلة التذوق من التخزين المحلي:", err);
      return [];
    }
  }

  function saveBagToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_BAG, JSON.stringify(state.bag));
    } catch (err) {
      console.warn("تعذر حفظ سلة التذوق في التخزين المحلي:", err);
    }
  }

  function formatSAR(amount) {
    return `${Number(amount).toFixed(2)} ر.س`;
  }

  function showToast(message, iconClass = "fa-sparkles") {
    if (!dom.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "royal-toast";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<i class="fa-solid ${iconClass}"></i><span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      toast.style.transition = "opacity 0.28s ease, transform 0.28s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /* -----------------------------------------------------------------------
     ٦. شاشة التمهيد وشريط التقدم والتنقل العلوي
     ----------------------------------------------------------------------- */
  function initPreloader() {
    if (!dom.preloader) return;
    if (dom.preloaderBar) {
      requestAnimationFrame(() => {
        dom.preloaderBar.style.width = "85%";
      });
    }

    const hideLoader = () => {
      if (dom.preloaderBar) dom.preloaderBar.style.width = "100%";
      setTimeout(() => {
        dom.preloader.classList.add("is-hidden");
      }, 260);
    };

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
      setTimeout(hideLoader, 1800);
    }
  }

  function updateScrollProgressAndNavbar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

    if (dom.scrollProgressBar) {
      dom.scrollProgressBar.style.width = `${progress}%`;
    }

    if (dom.navbar) {
      dom.navbar.classList.toggle("scrolled", scrollTop > 36);
    }

    updateActiveNavLink(scrollTop);
  }

  function updateActiveNavLink(scrollTop) {
    if (!dom.sections.length || !dom.navLinks.length) return;
    const offset = 160;
    let currentId = dom.sections[0].id;

    for (const section of dom.sections) {
      if (scrollTop + offset >= section.offsetTop) {
        currentId = section.id;
      }
    }

    dom.navLinks.forEach((link) => {
      const target = link.getAttribute("data-nav");
      link.classList.toggle("active", target === currentId);
    });
  }

  function initMobileDrawer() {
    if (!dom.mobileMenuToggle || !dom.mobileNavDrawer) return;

    const toggleDrawer = (forceClose = false) => {
      const isOpen = forceClose
        ? false
        : !dom.mobileNavDrawer.classList.contains("is-open");

      dom.mobileNavDrawer.classList.toggle("is-open", isOpen);
      dom.mobileNavDrawer.setAttribute("aria-hidden", String(!isOpen));
      dom.mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));

      if (dom.mobileMenuIcon) {
        dom.mobileMenuIcon.className = isOpen
          ? "fa-solid fa-xmark"
          : "fa-solid fa-bars-staggered";
      }
    };

    dom.mobileMenuToggle.addEventListener("click", () => toggleDrawer());
    dom.mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => toggleDrawer(true));
    });
  }

  /* -----------------------------------------------------------------------
     ٧. تأثير العمق البانورامي (Parallax) وعداد الإحصائيات وظهور العناصر
     ----------------------------------------------------------------------- */
  function initHeroParallax() {
    if (!dom.heroParallaxBg) return;
    window.addEventListener(
      "mousemove",
      (e) => {
        if (window.innerWidth < 900) return;
        const normX = (e.clientX / window.innerWidth - 0.5) * -22;
        const normY = (e.clientY / window.innerHeight - 0.5) * -18;
        dom.heroParallaxBg.style.transform = `translate3d(${normX}px, ${normY}px, 0)`;
      },
      { passive: true }
    );
  }

  function initScrollReveals() {
    const revealEls = Array.from(document.querySelectorAll(".reveal-up"));
    if (!revealEls.length) return;

    if (!("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  function initMetricsCounter() {
    if (!dom.metricValues.length) return;

    const animateValue = (el) => {
      const target = Number(el.getAttribute("data-target"));
      if (!Number.isFinite(target)) return;
      const duration = 1200;
      const startTime = performance.now();

      const step = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(eased * target));
        if (t < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      dom.metricValues.forEach(animateValue);
      return;
    }

    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateValue(entry.target);
            metricsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    dom.metricValues.forEach((el) => metricsObserver.observe(el));
  }

  /* -----------------------------------------------------------------------
     ٨. رحلة التذوق التفاعلية (Tasting Journey Controller)
     ----------------------------------------------------------------------- */
  function renderJourneyStage(index) {
    const total = TASTING_STAGES.length;
    const safeIndex = ((index % total) + total) % total;
    state.activeJourneyStage = safeIndex;

    const stage = TASTING_STAGES[safeIndex];

    dom.journeyTabs.forEach((tab, idx) => {
      const active = idx === safeIndex;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    if (dom.journeyStageBadge) dom.journeyStageBadge.textContent = stage.badge;
    if (dom.journeyStageTiming) dom.journeyStageTiming.textContent = stage.timing;
    if (dom.journeyStageTitle) dom.journeyStageTitle.textContent = stage.title;
    if (dom.journeyStageDesc) dom.journeyStageDesc.textContent = stage.description;

    if (dom.journeyStageIcon) {
      dom.journeyStageIcon.className = `fa-solid ${stage.icon}`;
    }

    if (dom.journeyStageNotes) {
      dom.journeyStageNotes.innerHTML = stage.notes
        .map((note) => `<li>${note}</li>`)
        .join("");
    }
  }

  function initJourneyControls() {
    dom.journeyTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const idx = Number(tab.getAttribute("data-stage"));
        renderJourneyStage(idx);
      });
    });

    if (dom.prevJourneyBtn) {
      dom.prevJourneyBtn.addEventListener("click", () => {
        renderJourneyStage(state.activeJourneyStage - 1);
      });
    }

    if (dom.nextJourneyBtn) {
      dom.nextJourneyBtn.addEventListener("click", () => {
        renderJourneyStage(state.activeJourneyStage + 1);
      });
    }

    renderJourneyStage(0);
  }

  /* -----------------------------------------------------------------------
     ٩. القائمة الملكية والتصفية والبحث الفوري (Menu Filtering & Rendering)
     ----------------------------------------------------------------------- */
  function getFilteredMenuItems() {
    const q = state.searchQuery.trim().toLowerCase();

    return ROYAL_MENU_ITEMS.filter((item) => {
      const matchesCategory =
        state.category === "all" || item.category === state.category;

      const matchesVeg = !state.vegetarianOnly || Boolean(item.vegetarian);

      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesVeg && matchesSearch;
    });
  }

  function renderMenu() {
    if (!dom.menuGrid) return;

    const items = getFilteredMenuItems();
    const hasCustomFilter =
      state.category !== "all" ||
      state.vegetarianOnly ||
      state.searchQuery.trim().length > 0;

    if (dom.resetAllFiltersBtn) {
      dom.resetAllFiltersBtn.classList.toggle("hidden", !hasCustomFilter);
    }

    if (dom.clearSearchBtn) {
      dom.clearSearchBtn.classList.toggle(
        "hidden",
        state.searchQuery.trim().length === 0
      );
    }

    if (dom.menuResultsCount) {
      dom.menuResultsCount.textContent =
        items.length === ROYAL_MENU_ITEMS.length
          ? `عرض جميع الأطباق الملكية (${items.length} أطباق)`
          : `تم العثور على ${items.length} طبق مطابق`;
    }

    if (items.length === 0) {
      dom.menuGrid.innerHTML = "";
      if (dom.menuEmptyState) dom.menuEmptyState.classList.remove("hidden");
      return;
    }

    if (dom.menuEmptyState) dom.menuEmptyState.classList.add("hidden");

    dom.menuGrid.innerHTML = items
      .map((item) => {
        const tagsHtml = item.tags
          .map((t) => {
            const isVegTag = t.includes("نباتي");
            return `<span class="dish-tag ${isVegTag ? "veg" : ""}">${t}</span>`;
          })
          .join("");

        return `
          <article class="dish-card" data-dish-id="${item.id}">
            <div>
              <div class="dish-top-row">
                <div class="dish-icon-badge">
                  <i class="fa-solid ${item.icon}"></i>
                </div>
                <div class="dish-tags">${tagsHtml}</div>
              </div>
              <h3 class="dish-name">${item.name}</h3>
              <p class="dish-desc">${item.description}</p>
            </div>

            <div class="dish-footer">
              <span class="dish-price">${formatSAR(item.price)}</span>
              <button type="button" class="add-dish-btn" data-add-id="${item.id}">
                <i class="fa-solid fa-plus"></i>
                <span>أضف للسلة</span>
              </button>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function resetMenuFilters() {
    state.category = "all";
    state.searchQuery = "";
    state.vegetarianOnly = false;

    if (dom.menuSearchInput) dom.menuSearchInput.value = "";
    if (dom.vegetarianFilterBtn) {
      dom.vegetarianFilterBtn.classList.remove("active");
      dom.vegetarianFilterBtn.setAttribute("aria-pressed", "false");
    }

    dom.categoryTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-category") === "all");
    });

    renderMenu();
  }

  function initMenuControls() {
    dom.categoryTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const selected = tab.getAttribute("data-category") || "all";
        state.category = selected;

        dom.categoryTabs.forEach((t) =>
          t.classList.toggle("active", t === tab)
        );
        renderMenu();
      });
    });

    if (dom.menuSearchInput) {
      dom.menuSearchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value || "";
        renderMenu();
      });
    }

    if (dom.clearSearchBtn) {
      dom.clearSearchBtn.addEventListener("click", () => {
        state.searchQuery = "";
        if (dom.menuSearchInput) dom.menuSearchInput.value = "";
        renderMenu();
      });
    }

    if (dom.vegetarianFilterBtn) {
      dom.vegetarianFilterBtn.addEventListener("click", () => {
        state.vegetarianOnly = !state.vegetarianOnly;
        dom.vegetarianFilterBtn.classList.toggle("active", state.vegetarianOnly);
        dom.vegetarianFilterBtn.setAttribute(
          "aria-pressed",
          String(state.vegetarianOnly)
        );
        renderMenu();
      });
    }

    if (dom.resetAllFiltersBtn) {
      dom.resetAllFiltersBtn.addEventListener("click", resetMenuFilters);
    }

    if (dom.emptyResetBtn) {
      dom.emptyResetBtn.addEventListener("click", resetMenuFilters);
    }

    if (dom.menuGrid) {
      dom.menuGrid.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-add-id]");
        if (!btn) return;
        const dishId = btn.getAttribute("data-add-id");
        addDishToBag(dishId);
      });
    }

    if (dom.quickAddHeroBtn) {
      dom.quickAddHeroBtn.addEventListener("click", () => {
        const dishId = dom.quickAddHeroBtn.getAttribute("data-dish-id") || "dish-1";
        addDishToBag(dishId);
      });
    }

    renderMenu();
  }

  /* -----------------------------------------------------------------------
     ١٠. إدارة سلة التذوق والطلبات (Tasting Bag Management)
     ----------------------------------------------------------------------- */
  function addDishToBag(dishId) {
    const dish = ROYAL_MENU_ITEMS.find((d) => d.id === dishId);
    if (!dish) return;

    const existing = state.bag.find((entry) => entry.id === dish.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.bag.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        qty: 1
      });
    }

    saveBagToStorage();
    renderBag();
    bumpBadge();
    showToast(`تمت إضافة "${dish.name}" إلى سلة التذوق`, "fa-bag-shopping");
  }

  function updateBagItemQty(dishId, delta) {
    const idx = state.bag.findIndex((entry) => entry.id === dishId);
    if (idx === -1) return;

    state.bag[idx].qty += delta;
    if (state.bag[idx].qty <= 0) {
      state.bag.splice(idx, 1);
    }

    saveBagToStorage();
    renderBag();
  }

  function removeBagItem(dishId) {
    state.bag = state.bag.filter((entry) => entry.id !== dishId);
    saveBagToStorage();
    renderBag();
  }

  function clearBag() {
    state.bag = [];
    saveBagToStorage();
    renderBag();
    showToast("تم تفريغ سلة التذوق", "fa-trash-can");
  }

  function bumpBadge() {
    if (!dom.bagCountBadge) return;
    dom.bagCountBadge.classList.remove("bump");
    void dom.bagCountBadge.offsetWidth;
    dom.bagCountBadge.classList.add("bump");
    setTimeout(() => dom.bagCountBadge.classList.remove("bump"), 250);
  }

  function renderBag() {
    const totalCount = state.bag.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.bag.reduce((sum, item) => sum + item.price * item.qty, 0);
    const serviceFee = subtotal * 0.1;
    const grandTotal = subtotal + serviceFee;

    if (dom.bagCountBadge) {
      dom.bagCountBadge.textContent = String(totalCount);
    }

    if (dom.bagSubtitle) {
      dom.bagSubtitle.textContent =
        totalCount > 0
          ? `لديك ${totalCount} ${totalCount === 1 ? "عنصر" : "عناصر"} في السلة`
          : "أطباقك المختارة بعناية";
    }

    const isEmpty = state.bag.length === 0;
    if (dom.bagEmptyState) dom.bagEmptyState.classList.toggle("hidden", !isEmpty);
    if (dom.bagFooterSummary) dom.bagFooterSummary.classList.toggle("hidden", isEmpty);
    if (dom.bagItemsList) dom.bagItemsList.classList.toggle("hidden", isEmpty);

    if (!isEmpty && dom.bagItemsList) {
      dom.bagItemsList.innerHTML = state.bag
        .map(
          (item) => `
            <div class="bag-item-card" data-bag-id="${item.id}">
              <div>
                <p class="bag-item-name">${item.name}</p>
                <span class="bag-item-unit">${formatSAR(item.price * item.qty)}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="qty-controls">
                  <button type="button" class="qty-btn" data-qty-action="dec" data-id="${item.id}" aria-label="إنقاص الكمية">−</button>
                  <span class="qty-value">${item.qty}</span>
                  <button type="button" class="qty-btn" data-qty-action="inc" data-id="${item.id}" aria-label="زيادة الكمية">+</button>
                </div>
                <button type="button" class="remove-item-btn" data-remove-id="${item.id}" aria-label="حذف الطبق">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          `
        )
        .join("");
    }

    if (dom.bagSubtotal) dom.bagSubtotal.textContent = formatSAR(subtotal);
    if (dom.bagServiceFee) dom.bagServiceFee.textContent = formatSAR(serviceFee);
    if (dom.bagGrandTotal) dom.bagGrandTotal.textContent = formatSAR(grandTotal);
  }

  function openBagDrawer() {
    if (!dom.tastingBagDrawer || !dom.bagBackdrop) return;
    dom.tastingBagDrawer.classList.add("is-open");
    dom.tastingBagDrawer.setAttribute("aria-hidden", "false");
    dom.bagBackdrop.classList.remove("hidden");
    document.body.classList.add("drawer-open");
  }

  function closeBagDrawer() {
    if (!dom.tastingBagDrawer || !dom.bagBackdrop) return;
    dom.tastingBagDrawer.classList.remove("is-open");
    dom.tastingBagDrawer.setAttribute("aria-hidden", "true");
    dom.bagBackdrop.classList.add("hidden");
    document.body.classList.remove("drawer-open");
  }

  function initBagControls() {
    if (dom.openBagBtn) dom.openBagBtn.addEventListener("click", openBagDrawer);
    if (dom.closeBagBtn) dom.closeBagBtn.addEventListener("click", closeBagDrawer);
    if (dom.bagBackdrop) dom.bagBackdrop.addEventListener("click", closeBagDrawer);

    if (dom.browseMenuFromBagBtn) {
      dom.browseMenuFromBagBtn.addEventListener("click", () => {
        closeBagDrawer();
        const menuEl = document.getElementById("menu");
        if (menuEl) menuEl.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (dom.bagItemsList) {
      dom.bagItemsList.addEventListener("click", (e) => {
        const qtyBtn = e.target.closest("[data-qty-action]");
        if (qtyBtn) {
          const id = qtyBtn.getAttribute("data-id");
          const action = qtyBtn.getAttribute("data-qty-action");
          updateBagItemQty(id, action === "inc" ? 1 : -1);
          return;
        }

        const removeBtn = e.target.closest("[data-remove-id]");
        if (removeBtn) {
          const id = removeBtn.getAttribute("data-remove-id");
          removeBagItem(id);
        }
      });
    }

    if (dom.clearBagBtn) {
      dom.clearBagBtn.addEventListener("click", clearBag);
    }

    if (dom.confirmOrderBtn) {
      dom.confirmOrderBtn.addEventListener("click", () => {
        if (state.bag.length === 0) return;
        const orderRef = `SH-${Math.floor(100000 + Math.random() * 900000)}`;
        state.bag = [];
        saveBagToStorage();
        renderBag();
        closeBagDrawer();
        showToast(
          `تم استلام طلبك الملكي بنجاح • رقم المرجع: ${orderRef}`,
          "fa-crown"
        );
      });
    }

    renderBag();
  }

  /* -----------------------------------------------------------------------
     ١١. نافذة حجز الطاولة والتحقق الفوري (Reservation Modal & Validation)
     ----------------------------------------------------------------------- */
  function setMinReservationDate() {
    if (!dom.resDate) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const minStr = `${yyyy}-${mm}-${dd}`;
    dom.resDate.min = minStr;
    if (!dom.resDate.value) dom.resDate.value = minStr;
  }

  function openReservationModal() {
    if (!dom.reservationModal) return;
    setMinReservationDate();
    dom.reservationModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    setTimeout(() => {
      if (dom.guestName) dom.guestName.focus();
    }, 60);
  }

  function closeReservationModal() {
    if (!dom.reservationModal) return;
    dom.reservationModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  function clearFormErrors() {
    if (dom.guestNameError) dom.guestNameError.textContent = "";
    if (dom.guestPhoneError) dom.guestPhoneError.textContent = "";
    if (dom.resDateError) dom.resDateError.textContent = "";
  }

  function validateReservationForm() {
    clearFormErrors();
    let valid = true;

    const nameVal = dom.guestName ? dom.guestName.value.trim() : "";
    const phoneVal = dom.guestPhone ? dom.guestPhone.value.trim() : "";
    const dateVal = dom.resDate ? dom.resDate.value : "";

    if (nameVal.length < 3) {
      if (dom.guestNameError) {
        dom.guestNameError.textContent = "يرجى إدخال الاسم الكامل (٣ أحرف على الأقل).";
      }
      valid = false;
    }

    const digitsOnly = phoneVal.replace(/[^\d+]/g, "");
    if (digitsOnly.length < 8) {
      if (dom.guestPhoneError) {
        dom.guestPhoneError.textContent = "يرجى إدخال رقم جوال صحيح للتواصل.";
      }
      valid = false;
    }

    if (!dateVal) {
      if (dom.resDateError) {
        dom.resDateError.textContent = "يرجى اختيار تاريخ الحجز المناسب.";
      }
      valid = false;
    }

    return valid;
  }

  function initReservationControls() {
    setMinReservationDate();

    [
      dom.openReservationNavBtn,
      dom.openReservationMobileBtn,
      dom.openReservationHeroBtn,
      dom.openReservationFooterBtn
    ].forEach((btn) => {
      if (btn) btn.addEventListener("click", openReservationModal);
    });

    if (dom.closeReservationModalBtn) {
      dom.closeReservationModalBtn.addEventListener("click", closeReservationModal);
    }

    if (dom.doneReservationBtn) {
      dom.doneReservationBtn.addEventListener("click", closeReservationModal);
    }

    if (dom.newReservationBtn) {
      dom.newReservationBtn.addEventListener("click", () => {
        if (dom.reservationSuccessState) dom.reservationSuccessState.classList.add("hidden");
        if (dom.reservationForm) {
          dom.reservationForm.reset();
          dom.reservationForm.classList.remove("hidden");
        }
        setMinReservationDate();
        clearFormErrors();
      });
    }

    if (dom.reservationModal) {
      dom.reservationModal.addEventListener("click", (e) => {
        if (e.target === dom.reservationModal) {
          closeReservationModal();
        }
      });
    }

    if (dom.reservationForm) {
      dom.reservationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateReservationForm()) return;

        const checkedSeating = document.querySelector(
          'input[name="seatingArea"]:checked'
        );
        const seatingText = checkedSeating
          ? checkedSeating.value
          : "قاعة الياسمين والذهب";

        const timeLabel =
          dom.resTime && dom.resTime.selectedOptions[0]
            ? dom.resTime.selectedOptions[0].textContent
            : dom.resTime?.value || "";

        const guestsLabel =
          dom.resGuests && dom.resGuests.selectedOptions[0]
            ? dom.resGuests.selectedOptions[0].textContent
            : dom.resGuests?.value || "";

        const bookingCode = `ROYAL-${Math.floor(1000 + Math.random() * 9000)}`;
        const notesVal = dom.resNotes ? dom.resNotes.value.trim() : "";

        if (dom.reservationSummaryBox) {
          dom.reservationSummaryBox.innerHTML = `
            <div><strong>رمز الحجز:</strong> <span style="color: var(--gold-200);">${bookingCode}</span></div>
            <div><strong>اسم الضيف:</strong> ${dom.guestName.value.trim()}</div>
            <div><strong>رقم الجوال:</strong> <span dir="ltr">${dom.guestPhone.value.trim()}</span></div>
            <div><strong>التاريخ والوقت:</strong> ${dom.resDate.value} • ${timeLabel}</div>
            <div><strong>عدد الضيوف:</strong> ${guestsLabel}</div>
            <div><strong>الجلسة:</strong> ${seatingText}</div>
            ${notesVal ? `<div><strong>ملاحظات:</strong> ${notesVal}</div>` : ""}
          `;
        }

        dom.reservationForm.classList.add("hidden");
        if (dom.reservationSuccessState) {
          dom.reservationSuccessState.classList.remove("hidden");
        }

        showToast(`تم تأكيد حجزك • رمز الحجز: ${bookingCode}`, "fa-calendar-check");
      });
    }
  }

  /* -----------------------------------------------------------------------
     ١٢. الموسيقى الشرقية الهادئة عبر Web Audio API (Ambient Soundscape)
     لا تحتاج إلى أي ملفات صوتية خارجية وتعمل عند تفاعل المستخدم
     ----------------------------------------------------------------------- */
  const ambientAudio = {
    ctx: null,
    masterGain: null,
    timerId: null,
    step: 0,

    // نغمات مقام الحجاز / الشرقي الهادئ بترددات لطيفة
    notes: [220.0, 233.08, 277.18, 293.66, 329.63, 293.66, 277.18, 220.0],

    start() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.065, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      this.playPluck();
      this.timerId = setInterval(() => this.playPluck(), 1450);
      return true;
    },

    playPluck() {
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const freq = this.notes[this.step % this.notes.length];
      this.step += 1;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now);

      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(0.25, now + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.4);
    },

    stop() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      if (this.ctx && this.ctx.state === "running") {
        this.ctx.suspend();
      }
    }
  };

  function initAmbientSoundButton() {
    if (!dom.ambientSoundBtn) return;

    dom.ambientSoundBtn.addEventListener("click", () => {
      if (!state.audioPlaying) {
        const ok = ambientAudio.start();
        if (ok) {
          state.audioPlaying = true;
          dom.ambientSoundBtn.classList.add("is-playing");
          dom.ambientSoundBtn.setAttribute("aria-pressed", "true");
          if (dom.ambientSoundIcon) {
            dom.ambientSoundIcon.className = "fa-solid fa-volume-high";
          }
          showToast("تم تشغيل الأجواء الصوتية الشرقية الهادئة", "fa-music");
        } else {
          showToast("المتصفح لا يدعم التشغيل الصوتي المباشر", "fa-circle-info");
        }
      } else {
        ambientAudio.stop();
        state.audioPlaying = false;
        dom.ambientSoundBtn.classList.remove("is-playing");
        dom.ambientSoundBtn.setAttribute("aria-pressed", "false");
        if (dom.ambientSoundIcon) {
          dom.ambientSoundIcon.className = "fa-solid fa-volume-xmark";
        }
        showToast("تم إيقاف الأجواء الصوتية", "fa-volume-xmark");
      }
    });
  }

  /* -----------------------------------------------------------------------
     ١٣. اختصارات لوحة المفاتيح وتهيئة السنة
     ----------------------------------------------------------------------- */
  function initGlobalShortcuts() {
    if (dom.currentYear) {
      dom.currentYear.textContent = String(new Date().getFullYear());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeReservationModal();
        closeBagDrawer();
      }
    });

    window.addEventListener("scroll", updateScrollProgressAndNavbar, {
      passive: true
    });
  }

  /* -----------------------------------------------------------------------
     ١٤. نقطة التشغيل الرئيسية (Bootstrap)
     ----------------------------------------------------------------------- */
  function bootstrap() {
    initPreloader();
    initMobileDrawer();
    initHeroParallax();
    initScrollReveals();
    initMetricsCounter();
    initJourneyControls();
    initMenuControls();
    initBagControls();
    initReservationControls();
    initAmbientSoundButton();
    initGlobalShortcuts();
    updateScrollProgressAndNavbar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();