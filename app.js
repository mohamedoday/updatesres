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
     ١. بيانات القائمة العراقية الملكية (Iraqi Royal Menu Data)
     ----------------------------------------------------------------------- */
  const ROYAL_MENU_ITEMS = [
    {
      id: "dish-1",
      name: "مسكوف دجلة الملكي على أخشاب الصفصاف",
      category: "grills",
      price: 165,
      icon: "fa-fish",
      vegetarian: false,
      tags: ["الأكثر طلباً", "خشب الصفصاف"],
      description:
        "سمك قطّان طازج مشقوق ومشوي ببطء على جمر أخشاب الصفصاف العطرية مع تتبيلة تمر الهند والكركم والملح الخشن، يُقدم مع حامض وبصل مشوي."
    },
    {
      id: "dish-2",
      name: "قوزي الضيافة بالزعفران واللوز والكشمش",
      category: "mains",
      price: 178,
      icon: "fa-crown",
      vegetarian: false,
      tags: ["وليمة الديوان", "زعفران وهيل"],
      description:
        "لحم ضأن مطهو ببطء حتى يذوب في الفم فوق أرز بسمتي معطر بالهيل والزعفران، مع لوز محمص وكشمش ذهبي ومرق غني."
    },
    {
      id: "dish-3",
      name: "تبسي بغداد بالباذنجان والبطاطا والطماطم",
      category: "mains",
      price: 96,
      icon: "fa-utensils",
      vegetarian: false,
      tags: ["تراث بغدادي", "فرن ملكي"],
      description:
        "طبقات متناغمة من الباذنجان والبطاطا والطماطم والبصل مع قطع اللحم الطرية وصلصة طماطم متبلة بالثوم والبهارات العراقية، يُقدم مع رز أبيض."
    },
    {
      id: "dish-4",
      name: "كبة الموصل المقرمشة بالبرغل واللحم والصنوبر",
      category: "starters",
      price: 56,
      icon: "fa-circle-dot",
      vegetarian: false,
      tags: ["أصالة الموصل", "مقرمشة"],
      description:
        "أقراص كبة موصلية رقيقة محضّرة من البرغل الناعم واللحم المتبل بحشوة اللحم المفروم والصنوبر المحمص والبقدونس."
    },
    {
      id: "dish-5",
      name: "دولمة عراقية ملكية بدبس الرمان والحامض",
      category: "mains",
      price: 128,
      icon: "fa-leaf",
      vegetarian: false,
      tags: ["تراثية", "حامض حلو"],
      description:
        "تشكيلة ورق عنب، سلق، بصل، باذنجان، وفلفل محشوة بأرز متبل بالأعشاب واللحم، مطهوة ببطء مع دبس الرمان وعصير الليمون."
    },
    {
      id: "dish-6",
      name: "تكة لحم عراقي على الفحم مع الطماطم والبصل",
      category: "grills",
      price: 124,
      icon: "fa-fire-burner",
      vegetarian: false,
      tags: ["مشويات", "فحم طبيعي"],
      description:
        "مكعبات لحم عراقي طرية متبلة بتوليفة متوازنة ومشوية على الفحم مع طماطم وبصل مشوي وخبز حار."
    },
    {
      id: "dish-7",
      name: "باذنجان مقلي ومقبلات الديوان بالطرشي والعمبة",
      category: "starters",
      price: 42,
      icon: "fa-mortar-pestle",
      vegetarian: true,
      tags: ["نباتي", "نكهات عراقية"],
      description:
        "مقبلات عراقية غنية تشمل متبل الباذنجان، عمبة بصرية أصيلة، طرشي منزلي، وسلطة طازجة بالليمون وزيت الزيتون."
    },
    {
      id: "dish-8",
      name: "شوربة عدس بالكمون والليمون الطازج",
      category: "starters",
      price: 38,
      icon: "fa-mug-hot",
      vegetarian: true,
      tags: ["نباتي", "دافئة"],
      description:
        "شوربة عدس ذهبية مخملية منكهة بالكمون العراقي والليمون الطازج، تُقدم مع قطع خبز محمصة."
    },
    {
      id: "dish-9",
      name: "كاهي وكيمر عرب أصيل بالهيل والقطر",
      category: "desserts",
      price: 54,
      icon: "fa-cake-candles",
      vegetarian: true,
      tags: ["نباتي", "إرث عراقي"],
      description:
        "رقائق كاهي ذهبية مقرمشة تُقدم مع كيمر كثيف طازج ولمسة قطر معطر بالهيل لختام ملكي أصيل."
    },
    {
      id: "dish-10",
      name: "كليجة عراقية بالتمر والجوز والهيل",
      category: "desserts",
      price: 46,
      icon: "fa-cookie-bite",
      vegetarian: true,
      tags: ["نباتي", "مخبوزات الديوان"],
      description:
        "كليجة هشة معطرة بالهيل ومحشوة بعجينة التمر الفاخرة أو الجوز المطحون، مثالية مع فنجان الشاي."
    },
    {
      id: "dish-11",
      name: "شاي عراقي بالهيل ونومي بصرة الأصيل",
      category: "desserts",
      price: 26,
      icon: "fa-mug-saucer",
      vegetarian: true,
      tags: ["نباتي", "مشروب ساخن"],
      description:
        "شاي أسود غني يُحضّر على نار هادئة مع حبات الهيل العطري وشرائح نومي بصرة المجفف لانتعاش لا يضاهى."
    },
    {
      id: "dish-12",
      name: "شربت زبيب ونومي بصرة بارد ومنعش",
      category: "desserts",
      price: 34,
      icon: "fa-martini-glass-citrus",
      vegetarian: true,
      tags: ["نباتي", "بارد ومنعش"],
      description:
        "مشروب تقليدي منعش محضّر من الزبيب الطبيعي ونفحات نومي بصرة وماء الورد المبرد."
    }
  ];

  /* -----------------------------------------------------------------------
     ٢. بيانات مراحل رحلة التذوق العراقية (Iraqi Tasting Journey Stages)
     ----------------------------------------------------------------------- */
  const TASTING_STAGES = [
    {
      badge: "المحطة الأولى • الترحيب",
      icon: "fa-mug-saucer",
      timing: "المدة المقترحة: ١٥ دقيقة",
      title: "قهوة الهيل الملكية وشاي النومي بصرة",
      description:
        "نستقبلك في الديوان بفناجين القهوة العربية المعطرة بالهيل وشاي نومي بصرة الأصيل، مصحوبة بتمور عراقية فاخرة محشوة بالجوز المحمص لتهيئة الحواس.",
      notes: [
        "تحميص وتبهير يومي يمنح الهيل عبقه الواضح والمتوازن.",
        "نومي بصرة طبيعي يمنح الشاي حموضة عطرية منعشة.",
        "تقديم أنيق يعكس كرم الضيافة العراقية الأصيلة."
      ]
    },
    {
      badge: "المحطة الثانية • الافتتاح",
      icon: "fa-circle-dot",
      timing: "المدة المقترحة: ٢٠ دقيقة",
      title: "كبة الموصل المقرمشة ومقبلات الرافدين",
      description:
        "نبدأ المائدة بكبة الموصل الذهبية المقرمشة مع متبل الباذنجان، والعمبة والطرشي العراقي، مع خبز حار يفتح الشهية بتوازن بديع.",
      notes: [
        "قشرة كبة رقيقة ومقرمشة مع حشوة غنية بالصنوبر واللحم.",
        "نكهات متوازنة بين الحموضة والتوابل الدافئة.",
        "إعداد طازج يضمن القوام المثالي عند التقديم."
      ]
    },
    {
      badge: "المحطة الثالثة • الجمر",
      icon: "fa-fish",
      timing: "المدة المقترحة: ٣٠ دقيقة",
      title: "مسكوف دجلة المشوي على أخشاب الصفصاف",
      description:
        "أيقونة المائدة العراقية؛ سمك قطّان طازج مشقوق ومشوي ببطء على جمر أخشاب الصفصاف مع لمسة تمر الهند والملح الخشن والنكهة المدخنة الآسرة.",
      notes: [
        "شواء بطيء يحافظ على طراوة اللحم وعصارته الطبيعية.",
        "رائحة أخشاب الصفصاف تضيف طابعاً رافدينياً أصيلاً.",
        "يُقدم مع الحامض الطازج والخبز العراقي الدافئ."
      ]
    },
    {
      badge: "المحطة الرابعة • الذروة",
      icon: "fa-crown",
      timing: "المدة المقترحة: ٣٠ دقيقة",
      title: "قوزي الضيافة، تبسي بغداد، والدولمة الملكية",
      description:
        "ذروة الوليمة العراقية حيث يلتقي قوزي الضيافة بالزعفران واللوز مع تبسي بغداد والدولمة المطهوة بدبس الرمان في تناغم غني يليق بالديوان.",
      notes: [
        "أرز بسمتي طويل الحبة معطر بالهيل والزعفران.",
        "دبس رمان طبيعي يمنح الدولمة عمقاً ولمعاناً شهياً.",
        "حصص وافية تناسب الولائم والمجالس العائلية."
      ]
    },
    {
      badge: "المحطة الخامسة • الختام",
      icon: "fa-cake-candles",
      timing: "المدة المقترحة: ٢٠ دقيقة",
      title: "كاهي وكيمر، كليجة الهيل، وشاي نومي بصرة",
      description:
        "نختتم أمسيتك برقائق الكاهي المقرمشة مع الكيمر الطازج وكليجة التمر والهيل، يتبعها كوب شاي عراقي دافئ يترك أثراً لا يُنسى.",
      notes: [
        "تناغم مثالي بين قرمشة الكاهي ونعومة الكيمر.",
        "كليجة معطرة بالهيل الطبيعي المحمص.",
        "ختام عراقي أصيل يليق بضيوف ديوان الرافدين."
      ]
    }
  ];

  /* -----------------------------------------------------------------------
     ٣. حالة التطبيق (Application State)
     ----------------------------------------------------------------------- */
  const STORAGE_KEY_BAG = "diwan_al_rafidain_b7r_bag_v1";

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
    iraqiFlagCanvas: document.getElementById("iraqiFlagCanvas"),

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
     ٧. تأثير العمق البانورامي (Parallax)، علم العراق السينمائي، وعداد الإحصائيات
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

  /**
   * محاكاة رفرفة علم العراق سينمائياً على Canvas بدقة عالية:
   * - ثلاثة أشرطة أفقية متساوية: أحمر في الأعلى، أبيض في الوسط، أسود في الأسفل.
   * - عبارة "الله أكبر" بالخط الكوفي الأخضر في منتصف الشريط الأبيض.
   * - موجات سينمائية متعددة الطبقات مع إضاءة وظلال متحركة تعطي عمق القماش.
   */
  function initCinematicIraqiFlag() {
    const canvas = dom.iraqiFlagCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // رسم نص "الله أكبر" بخط كوفي هندسي واضح ودقيق على الشريط الأبيض
    function drawKuficAllahuAkbar(targetCtx, width, height, stripeH) {
      const centerX = width * 0.52;
      const centerY = stripeH * 1.5;

      targetCtx.save();
      targetCtx.translate(centerX, centerY);
      targetCtx.fillStyle = "#007a3d";
      targetCtx.strokeStyle = "#005a2c";
      targetCtx.lineWidth = 0.6;

      // كلمة "الله" (يمين المركز الهندسي)
      const allahX = 24;
      const baseY = 7;

      // ألف أولى في "الله"
      targetCtx.fillRect(allahX + 12, baseY - 17, 3.2, 17);
      // لام أولى ولام ثانية وهاء كوفية مترابطة
      targetCtx.fillRect(allahX + 6, baseY - 17, 3.2, 17);
      targetCtx.fillRect(allahX, baseY - 17, 3.2, 17);
      targetCtx.fillRect(allahX - 7, baseY - 3, 19, 3.2);
      // حلقة الهاء الكوفية
      targetCtx.strokeRect(allahX - 11, baseY - 10, 5.5, 7);
      // شدة ذهبية خفيفة فوق الهاء
      targetCtx.fillStyle = "#c8962e";
      targetCtx.fillRect(allahX - 10.5, baseY - 14.5, 4.5, 1.6);

      // كلمة "أكبر" (يسار المركز الهندسي)
      targetCtx.fillStyle = "#007a3d";
      const akbarX = -24;
      // ألف في "أكبر"
      targetCtx.fillRect(akbarX + 12, baseY - 17, 3.2, 17);
      // همزة كوفية فوق الألف
      targetCtx.fillRect(akbarX + 10.5, baseY - 21, 5.5, 2.2);
      // كاف كوفية هندسية
      targetCtx.fillRect(akbarX + 2, baseY - 14, 3.2, 14);
      targetCtx.fillRect(akbarX - 4, baseY - 3, 19, 3.2);
      // باء وراء كوفية متصلة
      targetCtx.fillRect(akbarX - 14, baseY - 3, 12, 3.2);
      targetCtx.fillRect(akbarX - 14, baseY - 8, 3.2, 6);
      // نقطة الباء باللون الأخضر
      targetCtx.fillRect(akbarX - 14, baseY + 1.5, 3.2, 2.5);

      targetCtx.restore();
    }

    // إنشاء لوحة قماشية أوف-سكرين للعلم ثم تقطيعها إلى شرائح عمودية لرفرفة واقعية
    const offscreen = document.createElement("canvas");
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const octx = offscreen.getContext("2d");

    const w = offscreen.width;
    const h = offscreen.height;
    const stripeH = h / 3;

    // الشريط الأحمر العلوي
    octx.fillStyle = "#ce1126";
    octx.fillRect(0, 0, w, stripeH);

    // الشريط الأبيض الأوسط
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, stripeH, w, stripeH);

    // الشريط الأسود السفلي
    octx.fillStyle = "#000000";
    octx.fillRect(0, stripeH * 2, w, stripeH);

    // رسم عبارة "الله أكبر" بالخط الكوفي
    drawKuficAllahuAkbar(octx, w, h, stripeH);

    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let startTime = performance.now();

    function renderWaveFrame(now) {
      const elapsed = (now - startTime) * 0.001;
      const phase = prefersReducedMotion ? 0.6 : elapsed * 3.4;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // تقسيم عرض العلم إلى شرائح رأسية رفيعة لمحاكاة تموج النسيج بدقة
      const sliceWidth = 2;
      const marginTop = 8;
      const usableH = canvas.height - marginTop * 2;

      for (let x = 0; x < canvas.width; x += sliceWidth) {
        // تزداد سعة الموجة كلما ابتعدنا عن السارية نحو طرف العلم
        const hoistRatio = x / canvas.width;
        const amplitude = (1.2 + Math.pow(hoistRatio, 1.25) * 6.5) * (prefersReducedMotion ? 0.35 : 1);

        const primaryWave = Math.sin(x * 0.048 - phase);
        const secondaryWave = Math.sin(x * 0.095 - phase * 1.35 + 0.8) * 0.35;
        const waveFactor = primaryWave + secondaryWave;

        const yOffset = marginTop + waveFactor * amplitude * 0.55;
        const heightScale = usableH / h;

        ctx.drawImage(
          offscreen,
          x,
          0,
          sliceWidth,
          h,
          x,
          yOffset,
          sliceWidth,
          h * heightScale
        );

        // تظليل وإضاءة سينمائية حسب ميل الموجة لإبراز طيات القماش
        const derivative = Math.cos(x * 0.048 - phase);
        if (derivative > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${(derivative * 0.16 * hoistRatio).toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${(Math.abs(derivative) * 0.24 * hoistRatio).toFixed(3)})`;
        }
        ctx.fillRect(x, yOffset, sliceWidth, h * heightScale);
      }

      if (!prefersReducedMotion) {
        requestAnimationFrame(renderWaveFrame);
      }
    }

    requestAnimationFrame(renderWaveFrame);
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
    initCinematicIraqiFlag();
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
