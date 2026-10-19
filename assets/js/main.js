/**
 * AJI LEKSONO - MAIN CONTROLLER JAVASCRIPT
 * Handles: Theme Toggle, WhatsApp QR Code Generator, Typewriter, Modals, Portfolio Filters
 */

(function () {
  'use strict';

  // --- 1. THEME SWITCHER (DARK / LIGHT) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  function initTheme() {
    const savedTheme = localStorage.getItem('aji_theme') || 'dark';
    setTheme(savedTheme, false);
  }

  function setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('aji_theme', theme);
    }

    if (theme === 'light') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }

    // Notify Three.js scene to re-adjust colors
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- 2. NAVBAR SCROLL & MOBILE TOGGLE ---
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close on click link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 3. HERO TYPING EFFECT ---
  const typingElement = document.getElementById('typing-text');
  const roles = [
    'Software Engineer & Full-Stack Developer',
    'ASN Pemprov Jatim — RS Paru Manguharjo',
    'Arsitek Sistem Informasi Layanan Kesehatan',
    'Pelopor Transformasi Digital BerAKHLAK'
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    if (!typingElement) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new text
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // --- 4. WHATSAPP QR CODE GENERATION & FLOATING WIDGET ---
  const waNumber = '6285157979956';
  const defaultMessage = encodeURIComponent(
    'Halo Mas Aji Leksono, saya tertarik berdiskusi mengenai sistem informasi dan kolaborasi digital teknologi pelayanan kesehatan.'
  );
  const waUrl = `https://wa.me/${waNumber}?text=${defaultMessage}`;

  function generateQRCodes() {
    const qrContainer = document.getElementById('qrcode-container');
    const qrModalContainer = document.getElementById('modal-qrcode-container');
    const qrFloatingContainer = document.getElementById('wa-floating-qrcode');

    if (typeof QRCode !== 'undefined') {
      if (qrFloatingContainer && qrFloatingContainer.childNodes.length === 0) {
        new QRCode(qrFloatingContainer, {
          text: waUrl,
          width: 175,
          height: 175,
          colorDark: '#0f172a',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }

      if (qrContainer && qrContainer.childNodes.length === 0) {
        new QRCode(qrContainer, {
          text: waUrl,
          width: 200,
          height: 200,
          colorDark: '#0b0f19',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }

      if (qrModalContainer && qrModalContainer.childNodes.length === 0) {
        new QRCode(qrModalContainer, {
          text: waUrl,
          width: 220,
          height: 220,
          colorDark: '#0b0f19',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    } else {
      // Fallback: render QR code via online generator API
      const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=175x175&data=${encodeURIComponent(waUrl)}`;
      if (qrFloatingContainer) {
        qrFloatingContainer.innerHTML = `<img src="${fallbackUrl}" alt="WhatsApp QR Code" style="width:175px; height:175px; border-radius:6px; display:block; margin:0 auto;" />`;
      }
      if (qrContainer) {
        qrContainer.innerHTML = `<img src="${fallbackUrl}" alt="WhatsApp QR Code" style="width:200px; height:200px; border-radius:8px;" />`;
      }
      if (qrModalContainer) {
        qrModalContainer.innerHTML = `<img src="${fallbackUrl}" alt="WhatsApp QR Code" style="width:220px; height:220px; border-radius:8px;" />`;
      }
    }
  }

  // Toggle Floating WhatsApp Widget
  window.toggleWaFloatingWidget = function (forceState) {
    const card = document.getElementById('wa-floating-card');
    if (!card) return;

    if (typeof forceState === 'boolean') {
      if (forceState) {
        card.classList.remove('hidden');
        highlightFloatingWaCard(card);
      } else {
        card.classList.add('hidden');
      }
    } else {
      card.classList.toggle('hidden');
      if (!card.classList.contains('hidden')) {
        highlightFloatingWaCard(card);
      }
    }
  };

  function highlightFloatingWaCard(card) {
    card.classList.remove('highlight-pulse');
    void card.offsetWidth; // Trigger reflow
    card.classList.add('highlight-pulse');
  }

  // Copy Phone Number Function
  window.copyWaNumber = function (btnElement) {
    const rawNumber = '0851-5797-9956';
    navigator.clipboard.writeText('085157979956').then(() => {
      const originalText = btnElement.innerHTML;
      btnElement.innerHTML = `✓ Tersalin!`;
      btnElement.style.background = '#10b981';
      btnElement.style.color = '#ffffff';

      setTimeout(() => {
        btnElement.innerHTML = originalText;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 2500);
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
      prompt('Salin nomor telepon WhatsApp:', rawNumber);
    });
  };

  // --- 5. PORTFOLIO FILTER TABS ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 6. PORTFOLIO DETAILS MODAL DATA & CONTROLLER ---
  const portfolioData = {
    nutricare: {
      title: 'NutriCare — RS Paru Manguharjo',
      domain: 'https://nutricare.rsparumanguharjo.com/',
      category: 'Asuhan Gizi & Nutrisi Klinis Digital',
      image: 'assets/images/nutricare-preview.jpg',
      description: 'Platform inovasi asuhan nutrisi dan konsultasi gizi terpadu yang dirancang khusus untuk memodernisasi pelayanan gizi rawat jalan dan rawat inap di RS Paru Manguharjo Provinsi Jawa Timur.',
      features: [
        'Booking Konsultasi Gizi Online & Penjadwalan Ahli Dietetik Terpadu',
        'Kalkulator Klinis Nutrisi: BMI, Kebutuhan Kalori Basal (BMR), & Asupan Makronutrien',
        'Rekam Asuhan Gizi Terstandar (PAGT / Nutrition Care Process)',
        'Portal Kelas & Edukasi Gizi Klinis untuk Pasien Tuberkulosis & Paru Kronis',
        'Dashboard Analitik Kunjungan Konsultasi & Pemantauan Pola Nutrisi Pasien'
      ],
      tech: ['PHP Fullstack', 'MySQL Database', 'Tailwind / Modern CSS', 'RESTful API Architecture', 'Responsive Mobile Ready'],
      impact: 'Meningkatkan kepatuhan diet terapi pasien paru secara signifikan dan memangkas waktu tunggu penjadwalan konsultasi ahli gizi.'
    },
    efarm: {
      title: 'EFarm — RS Paru Manguharjo',
      domain: 'https://efarm.rsparumanguharjo.com/',
      category: 'Sistem Informasi Farmasi & E-Resep Terpadu',
      image: 'assets/images/efarm-preview.jpg',
      description: 'Solusi transformasi digital untuk manajemen perbekalan farmasi, telaah resep elektronik, pemantauan ketersediaan obat, serta optimalisasi antrean dispensing obat rumah sakit pemerintah.',
      features: [
        'Digitalisasi Resep Dokter (E-Prescription) dengan Validasi Dosis Otomatis',
        'Telaah Farmasi Terpadu (Kajian Administratif, Farmasetik, & Klinis Obat)',
        'Pemantauan Stok Obat & Bahan Medis Habis Pakai (BMHP) Real-Time',
        'Antrean Elektronik Dispensing Obat dengan Layar Display Farmasi',
        'Pelaporan Penggunaan Obat Narkotika, Psikotropika, & Obat Generik Terotomasi'
      ],
      tech: ['PHP Architecture', 'MySQL Relational DB', 'Ajax Realtime Polling', 'FPDF / PDF Generator', 'Barcode Scanner Integration'],
      impact: 'Mencegah potensi medication error hingga 99%, menjamin transparansi ketersediaan obat publik, dan mempercepat dispensing resep.'
    },
    labocare: {
      title: 'LaboCare — RS Paru Manguharjo',
      domain: 'https://labocare.rsparumanguharjo.com/',
      category: 'Sistem Informasi Laboratorium Medis & Cek Hasil Online',
      image: 'assets/images/labocare-preview.jpg',
      description: 'Sistem informasi laboratorium mutakhir yang mengintegrasikan alur pemeriksaan patologi klinik, pelacakan spesimen darah dan dahak, hingga penerbitan hasil lab digital terverifikasi barcode.',
      features: [
        'Pendaftaran & Barcoding Unik Spesimen Tabung Laboratorium',
        'Tracking Alur Kerja Analisis Spesimen (Pra-analitik, Analitik, Pasca-analitik)',
        'Pemeriksaan & Validasi Hasil Bertingkat oleh Analis dan Dokter Sp.PK',
        'Fitur Cek Hasil Lab Mandiri Online bagi Pasien via Kode Verifikasi QR Aman',
        'Integrasi Notifikasi WhatsApp untuk Pasien saat Hasil Lab Siap Diunduh'
      ],
      tech: ['PHP Enterprise', 'MySQL Indexed DB', 'Chart.js Hematology Visuals', 'QR Code Security Token', 'WhatsApp Notification Gateway'],
      impact: 'Pasien tidak perlu mengantre lama untuk mengambil lembar hasil fisik, data hasil lab tersimpan aman, akurat, dan terarsip digital.'
    },
    radiolovegy: {
      title: 'Radiolovegy — RS Paru Manguharjo',
      domain: 'https://radiolovegy.rsparumanguharjo.com/',
      category: 'Sistem Radiologi & PACS Integrasi Citra Diagnostik Medis',
      image: 'assets/images/radiolovegy-preview.jpg',
      description: 'Inovasi manajemen radiologi terpadu untuk pelayanan rontgen thorax, CT-scan, dan modalitas imaging lainnya dengan ekspertise digital dokter spesialis radiologi.',
      features: [
        'Penjadwalan & Registrasi Pemeriksaan Radiologi Rawat Jalan / Inap / IGD',
        'Integrasi Viewer Citra Medis Digital DICOM / PACS Viewer',
        'Pembuatan Lembar Ekspertise Radiologis Terstandar oleh Dokter Sp.Rad',
        'Tanda Tangan Digital Tersertifikasi & Verifikasi Hasil dengan Barcode',
        'Arsip Digital Riwayat Pencitraan Paru Pasien Komparatif dari Waktu ke Waktu'
      ],
      tech: ['PHP Framework', 'MySQL High Availability', 'Medical Image Viewer Wrapper', 'Secure API Endpoints', 'Paperless Expertise PDF'],
      impact: 'Akselerasi kecepatan diagnosis klinis dokter spesialis paru dalam membaca citra rontgen secara real-time dan terintegrasi.'
    },
    rehabcare: {
      title: 'RehabCare — RS Paru Manguharjo',
      domain: 'https://rehabcare.rsparumanguharjo.com/',
      category: 'Sistem Rehabilitasi Medik & Fisioterapi Paru Digital',
      image: 'assets/images/rehabcare-preview.jpg',
      description: 'Platform digital manajemen pelayanan kedokteran fisik dan rehabilitasi (KFR) serta fisioterapi paru terpadu untuk mengawal proses pemulihan pernapasan dan motorik pasien.',
      features: [
        'Reservasi & Kalender Interaktif Sesi Fisioterapi Pasien Paru',
        'Pencatatan Evaluasi Kapasitas Vital Paru, Saturasi Oksigen, & Uji Jalan 6 Menit',
        'Monitoring Program Latihan Batuk Efektif & Senam Pernapasan Pasien',
        'Catatan Perkembangan Pasien Terintegrasi Dokter Sp.KFR & Tim Fisioterapis',
        'Pengingat Jadwal Sesi Terapi Otomatis ke Pasien via Kanal Digital'
      ],
      tech: ['PHP Modern Structure', 'MySQL Relational Schema', 'Interactive Calendar Scheduler', 'Progress Charting UI', 'Mobile Responsive Layout'],
      impact: 'Mendisiplinkan kepatuhan kehadiran sesi fisioterapi pasien respirasi kronis dan mempermudah dokter memantau kemajuan fungsi paru.'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const waModal = document.getElementById('wa-modal');

  window.openProjectModal = function (projectId) {
    const data = portfolioData[projectId];
    if (!data || !projectModal) return;

    document.getElementById('modal-project-title').textContent = data.title;
    document.getElementById('modal-project-category').textContent = data.category;
    document.getElementById('modal-project-img').src = data.image;
    document.getElementById('modal-project-img').alt = data.title;
    document.getElementById('modal-project-desc').textContent = data.description;
    document.getElementById('modal-project-impact').textContent = data.impact;

    const liveBtn = document.getElementById('modal-live-link');
    if (liveBtn) {
      liveBtn.href = data.domain;
    }

    const featuresList = document.getElementById('modal-project-features');
    if (featuresList) {
      featuresList.innerHTML = data.features.map(f => `
        <li style="display:flex; align-items:flex-start; gap:0.6rem; margin-bottom:0.6rem; font-size:0.92rem; color:var(--text-secondary);">
          <svg style="color:var(--accent-emerald); flex-shrink:0; margin-top:3px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${f}</span>
        </li>
      `).join('');
    }

    const techWrap = document.getElementById('modal-project-tech');
    if (techWrap) {
      techWrap.innerHTML = data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('');
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    if (projectModal) projectModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  window.openWaModal = function () {
    if (!waModal) return;
    waModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    generateQRCodes();
  };

  window.closeWaModal = function () {
    if (waModal) waModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close modals on clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
    if (e.target === waModal) closeWaModal();
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeWaModal();
    }
  });

  // --- 8. SCROLL REVEAL & ANIMATION ENGINE ---
  function initScrollReveal() {
    // Auto-stagger delay for grids & item collections
    const staggerGroups = [
      { selector: '.stats-grid', itemSelector: '.stat-card' },
      { selector: '.about-highlights', itemSelector: '.highlight-box' },
      { selector: '.values-container', itemSelector: '.value-card' },
      { selector: '.skills-grid', itemSelector: '.skill-category-card' },
      { selector: '.portfolio-grid', itemSelector: '.portfolio-card' },
      { selector: '.footer-top-grid', itemSelector: '.footer-col, .footer-brand' }
    ];

    staggerGroups.forEach(group => {
      const container = document.querySelector(group.selector);
      if (container) {
        const items = container.querySelectorAll(group.itemSelector);
        items.forEach((item, index) => {
          if (!item.classList.contains('reveal')) {
            item.classList.add('reveal', 'reveal-fade-up', 'reveal-shimmer');
          }
          item.style.transitionDelay = `${(index % 6) * 0.12}s`;
        });
      }
    });

    const revealElements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Trigger number counter if stat card
          const statNumber = entry.target.querySelector('.stat-number');
          if (statNumber && !statNumber.dataset.counted) {
            animateStatCounter(statNumber);
          }

          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Number Counter Animation on scroll
  function animateStatCounter(element) {
    element.dataset.counted = 'true';
    const text = element.textContent.trim();
    
    if (text.includes('5+')) {
      runCounter(element, 0, 5, '+', 1100);
    } else if (text.includes('100%')) {
      runCounter(element, 0, 100, '%', 1300);
    } else if (text.includes('24/7')) {
      runCounter(element, 0, 24, '/7', 1100);
    }
  }

  function runCounter(element, start, end, suffix, duration) {
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      element.textContent = currentVal + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end + suffix;
      }
    }
    window.requestAnimationFrame(step);
  }

  // --- 9. INTERACTIVE 3D MOUSE PARALLAX TILT ---
  function init3DCardTilt() {
    const tiltCards = document.querySelectorAll('.portfolio-card, .portrait-card, .skill-category-card, .stat-card');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- 10. INITIALIZATION ON DOM LOADED ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    typeEffect();
    generateQRCodes();
    initScrollReveal();
    init3DCardTilt();
  });

})();
