/**
 * Ramesh Madaan | Growth Strategist & Sales Transformation Consultant
 * Client-side dynamic interactivity, counters, diagnostics, and forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // 2. Sticky Glass Header with Scroll Shrink
  const header = document.getElementById('main-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      if (window.lucide) window.lucide.createIcons();
    });

    // Close menu when clicking navigation links inside mobile menu
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 4. Animated Growth Metric Counters (Intersection Observer)
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (counterElements.length > 0) {
    const animateCounter = (el) => {
      const target = parseFloat(el.getAttribute('data-counter-target')) || 0;
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const duration = parseInt(el.getAttribute('data-counter-duration') || '1800', 10);
      const isDecimal = target % 1 !== 0;
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic curve: 1 - pow(1 - progress, 3)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeOut * target;

        if (isDecimal) {
          el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
        } else {
          el.textContent = `${prefix}${Math.floor(currentVal).toLocaleString()}${suffix}`;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // 5. Interactive "Growth Assessment" Mini-Widget
  initGrowthAssessment();

  // 6. Smooth FAQ Accordion
  initAccordion();

  // 7. High-Converting Contact Form & Modal
  initContactForm();

  // 8. Auto-populate parameters if routed from assessment
  checkUrlParamsForContact();
});

/**
 * Interactive Growth Assessment Tool
 */
function initGrowthAssessment() {
  const assessmentContainer = document.getElementById('growth-assessment-widget');
  if (!assessmentContainer) return;

  const revSelect = document.getElementById('assess-revenue');
  const bottleneckSelect = document.getElementById('assess-bottleneck');
  const marketScopeSelect = document.getElementById('assess-market');
  const calculateBtn = document.getElementById('assess-submit-btn');
  const resultCard = document.getElementById('assessment-result');
  const resultGap = document.getElementById('result-gap-val');
  const resultTitle = document.getElementById('result-strategy-title');
  const resultDesc = document.getElementById('result-strategy-desc');
  const resultAction1 = document.getElementById('result-action-1');
  const resultAction2 = document.getElementById('result-action-2');
  const resultAction3 = document.getElementById('result-action-3');
  const applyToFormBtn = document.getElementById('apply-assessment-to-form');

  if (!calculateBtn) return;

  calculateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const revenue = revSelect ? revSelect.value : '10-50';
    const bottleneck = bottleneckSelect ? bottleneckSelect.value : 'sales-team';
    const market = marketScopeSelect ? marketScopeSelect.value : 'regional';

    let gapPercentage = 38;
    let strategyTitle = 'Sales Transformation & Incentive Engine';
    let strategyDesc = 'Your organization shows clear enterprise market potential, but execution velocity is constrained by unstructured pipeline management and misaligned incentives.';
    let action1 = 'Restructure direct sales KPIs and performance-linked compensation models.';
    let action2 = 'Institute weekly pipeline governance cadences with clear closing milestones.';
    let action3 = 'Deploy CRM adoption playbooks to eliminate CRM friction for field executives.';

    if (bottleneck === 'distribution') {
      gapPercentage = 46;
      strategyTitle = 'Go-To-Market & Channel Scaling Blueprint';
      strategyDesc = 'Distributor inertia and fragmented regional coverage are preventing multi-territory scale. Ramesh Madaan’s proven channel framework unlocks immediate dealer expansion.';
      action1 = 'Conduct dealer margin benchmarking & tier-one distributor onboarding.';
      action2 = 'Implement geographic expansion roadmaps from regional strongholds to PAN-India.';
      action3 = 'Establish dealer loyalty protocols and secondary sales visibility.';
    } else if (bottleneck === 'founder-dependent') {
      gapPercentage = 52;
      strategyTitle = 'Enterprise Capability Coaching & Founder Decoupling';
      strategyDesc = 'High reliance on leadership for closing high-ticket deals caps business valuation. We build an institutionalized sales hierarchy that closes independently.';
      action1 = 'Document consultative sales playbooks codifying founder negotiation methodologies.';
      action2 = 'Recruit or mentor a battle-tested Head of Sales to lead daily execution.';
      action3 = 'Transition top client accounts to senior relationship managers systematically.';
    } else if (revenue === '50-200' || revenue === '200+') {
      gapPercentage = 32;
      strategyTitle = 'Industrial Scale & Multi-Territory Dominance';
      strategyDesc = 'Operating at mid-market scale requires institutional discipline to capture the No.1 position in contested regional sectors, mirroring Ramesh’s 29% market share turnarounds.';
      action1 = 'Cross-functional alignment between manufacturing capacity and commercial channels.';
      action2 = 'Key Account Management (KAM) architecture for enterprise and OEM contracts.';
      action3 = 'Executive coaching for second-tier leadership to sustain double-digit CAGR.';
    }

    if (resultGap) resultGap.textContent = `${gapPercentage}%`;
    if (resultTitle) resultTitle.textContent = strategyTitle;
    if (resultDesc) resultDesc.textContent = strategyDesc;
    if (resultAction1) resultAction1.textContent = action1;
    if (resultAction2) resultAction2.textContent = action2;
    if (resultAction3) resultAction3.textContent = action3;

    // Show result smoothly
    if (resultCard) {
      resultCard.classList.remove('hidden');
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (applyToFormBtn) {
      applyToFormBtn.onclick = () => {
        const contactSection = document.getElementById('contact-form-section') || document.getElementById('contact');
        if (contactSection) {
          // Pre-fill fields on the same page if present
          const revInput = document.getElementById('contact-revenue');
          const chalInput = document.getElementById('contact-challenge');
          if (revInput) revInput.value = revenue;
          if (chalInput) chalInput.value = `Assessment Diagnostics: ${strategyTitle} (Performance Gap: ${gapPercentage}%). Focus: ${bottleneck}`;
          contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Redirect to contact.html with query params
          window.location.href = `contact.html?revenue=${encodeURIComponent(revenue)}&bottleneck=${encodeURIComponent(bottleneck)}&gap=${gapPercentage}&strategy=${encodeURIComponent(strategyTitle)}`;
        }
      };
    }

    if (window.lucide) window.lucide.createIcons();
  });
}

/**
 * FAQ Accordion Handlers
 */
function initAccordion() {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.accordion-item');
      if (!item) return;

      const isOpen = item.classList.contains('active');
      const parent = item.parentElement;

      // Close sibling items in the same container
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(sibling => {
          if (sibling !== item) {
            sibling.classList.remove('active');
            const siblingBtn = sibling.querySelector('.accordion-button');
            if (siblingBtn) siblingBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Contact Form Live Validation and High-Converting Submission Flow
 */
function initContactForm() {
  const form = document.getElementById('growth-consultation-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const companyInput = document.getElementById('contact-company');
  const revenueInput = document.getElementById('contact-revenue');
  const challengeInput = document.getElementById('contact-challenge');
  const messageInput = document.getElementById('contact-message');

  const modal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const modalLaunchMailBtn = document.getElementById('modal-launch-mail');
  const modalCopyBtn = document.getElementById('modal-copy-summary');
  const toast = document.getElementById('toast');

  let currentMailtoUrl = '';
  let inquirySummaryText = '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic live validation
    let isValid = true;

    if (!nameInput.value.trim()) {
      markError(nameInput, 'Full name is required.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      markError(emailInput, 'Please enter a valid business email.');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
      markError(phoneInput, 'Please provide a valid direct phone/WhatsApp number.');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    if (!companyInput.value.trim()) {
      markError(companyInput, 'Company / Organization name is required.');
      isValid = false;
    } else {
      clearError(companyInput);
    }

    if (!isValid) {
      showToast('Please check the highlighted fields above.', true);
      return;
    }

    // Build Email Subject and Formatted Body
    const recipient = 'ramesh.madaan@yahoo.com';
    const subject = `Executive Advisory Request: ${companyInput.value.trim()} - ${nameInput.value.trim()}`;
    
    inquirySummaryText = `EXECUTIVE GROWTH CONSULTATION INQUIRY
--------------------------------------------------
Principal: Ramesh Madaan | Growth Strategist & Sales Transformation Consultant
Inquiry Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}

CLIENT CONTACT DETAILS:
• Name: ${nameInput.value.trim()}
• Company: ${companyInput.value.trim()}
• Business Email: ${emailInput.value.trim()}
• Phone / WhatsApp: ${phoneInput.value.trim()}
• Current Revenue Scale: ${revenueInput ? revenueInput.value : 'Unspecified'}
• Primary Growth Challenge: ${challengeInput ? challengeInput.value : 'General Growth Advisory'}

STRATEGIC CONTEXT & OBJECTIVES:
${messageInput ? messageInput.value.trim() || 'Requesting a 30-minute diagnostic session to review sales structure and market expansion.' : 'N/A'}
--------------------------------------------------`;

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(inquirySummaryText);
    currentMailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

    // Populate modal details
    const modalClientName = document.getElementById('modal-client-name');
    if (modalClientName) {
      modalClientName.textContent = nameInput.value.trim();
    }

    // Open Success Modal
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    // Show Toast
    showToast('Inquiry drafted! Launching your email client...');

    // Attempt to open mailto after slight pause for smooth UX
    setTimeout(() => {
      try {
        window.location.href = currentMailtoUrl;
      } catch (err) {
        console.warn('Mailto launch deferred to modal click', err);
      }
    }, 600);
  });

  // Modal actions
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      form.reset();
    });
  }

  if (modalLaunchMailBtn) {
    modalLaunchMailBtn.addEventListener('click', () => {
      if (currentMailtoUrl) {
        window.location.href = currentMailtoUrl;
      }
    });
  }

  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(inquirySummaryText);
        modalCopyBtn.innerHTML = `<i data-lucide="check" class="w-4 h-4 mr-2"></i> Copied to Clipboard!`;
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => {
          modalCopyBtn.innerHTML = `<i data-lucide="copy" class="w-4 h-4 mr-2"></i> Copy Inquiry Summary`;
          if (window.lucide) window.lucide.createIcons();
        }, 3000);
        showToast('Summary copied! You can paste directly into WhatsApp or email.');
      } catch (err) {
        showToast('Could not copy automatically. Please select text manually.', true);
      }
    });
  }

  // Clear errors on input
  [nameInput, emailInput, phoneInput, companyInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });
}

function markError(input, message) {
  input.classList.add('border-red-500', 'bg-red-50/30');
  input.classList.remove('border-slate-300');
  let errSpan = input.nextElementSibling;
  if (!errSpan || !errSpan.classList.contains('input-error-msg')) {
    errSpan = document.createElement('p');
    errSpan.className = 'input-error-msg text-xs text-red-600 mt-1';
    input.parentNode.appendChild(errSpan);
  }
  errSpan.textContent = message;
}

function clearError(input) {
  input.classList.remove('border-red-500', 'bg-red-50/30');
  input.classList.add('border-slate-300');
  const errSpan = input.parentNode.querySelector('.input-error-msg');
  if (errSpan) {
    errSpan.remove();
  }
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('bg-slate-900', 'bg-red-800');
  toast.classList.add(isError ? 'bg-red-800' : 'bg-slate-900');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/**
 * Handle URL Search Parameters when navigating to contact.html from index assessment
 */
function checkUrlParamsForContact() {
  const urlParams = new URLSearchParams(window.location.search);
  const revenue = urlParams.get('revenue');
  const bottleneck = urlParams.get('bottleneck');
  const strategy = urlParams.get('strategy');
  const gap = urlParams.get('gap');

  if (revenue || bottleneck || strategy) {
    const revSelect = document.getElementById('contact-revenue');
    const chalInput = document.getElementById('contact-challenge');
    const msgInput = document.getElementById('contact-message');

    if (revSelect && revenue) {
      revSelect.value = revenue;
    }

    if (chalInput && bottleneck) {
      chalInput.value = `Bottleneck: ${bottleneck}`;
    }

    if (msgInput && strategy) {
      msgInput.value = `Assessment Diagnostic Results:\n- Strategy Track: ${strategy}\n- Estimated Sales Gap: ${gap || '35'}%\n\nWe would like to discuss implementing this transformation roadmap for our business.`;
    }
  }
}
