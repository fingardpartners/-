// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initNavigation();
  initScrollEffects();
  initContactFormSubmission();
  initPaymentForm();
  initAnimations();
  initPageSpecific();
  initLazyLoading();
});

// Navigation Functions - FIXED VERSION
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle - SIMPLIFIED AND FIXED
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log("Hamburger clicked!"); // Debug log
      
      // Toggle classes
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
      
      console.log("Menu active:", navMenu.classList.contains("active")); // Debug log
    });

    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Scroll Effects
function initScrollEffects() {
  // Scroll to top button
  const scrollToTopBtn = document.getElementById("scroll-to-top");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.add("visible");
      } else {
        scrollToTopBtn.classList.remove("visible");
      }
    });

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(".fade-in-up");
  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

// CONTACT FORM HANDLER 
function initContactFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return; // Exit if no contact form on page
    
    // Add elements for displaying messages
    const formSuccess = document.createElement('div');
    formSuccess.id = 'form-success';
    formSuccess.className = 'success-message';
    formSuccess.style.display = 'none';
    formSuccess.innerHTML = '✅ Thank you for your message! We\'ll get back to you soon.';

    const formError = document.createElement('div');
    formError.id = 'form-error';
    formError.className = 'error-message';
    formError.style.display = 'none';
    formError.style.color = 'red';

    // Append these message elements near your form
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.parentNode.insertBefore(formSuccess, submitButton.nextSibling);
        submitButton.parentNode.insertBefore(formError, formSuccess.nextSibling);
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous messages
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        // Basic client-side validation
        if (!validateContactForm()) {
            return;
        }

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                formSuccess.style.display = 'block';
                contactForm.reset();
            } else {
                formError.textContent = `❌ ${result.message || 'Something went wrong. Please try again later.'}`;
                formError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            formError.textContent = '❌ There was a problem connecting to the server. Please try again.';
            formError.style.display = 'block';
        }
    });
}

function validateContactForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    if (!nameInput || !emailInput || !phoneInput || !messageInput) {
        return false;
    }

    let isValid = true;

    // Clear previous errors
    clearError('name-error');
    clearError('email-error');
    clearError('phone-error');
    clearError('message-error');

    if (nameInput.value.trim().length < 2) {
        showError('name-error', 'Full Name must be at least 2 characters.');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        showError('email-error', 'Please enter a valid email address.');
        isValid = false;
    }

    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
        showError('phone-error', 'Please enter a valid phone number (at least 10 digits).');
        isValid = false;
    }

    if (messageInput.value.trim().length < 10) {
        showError('message-error', 'Message must be at least 10 characters.');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = "";
        errorElement.style.display = "none";
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
        element.textContent = "";
        element.style.display = "none";
    });
}

// --- Coupon Configuration ---
const coupons = {
  FINGARD5: { type: "percent", value: 5 },
  FINGARD10: { type: "percent", value: 10 },
  FINGARD15: { type: "percent", value: 15 },
};

let appliedCoupon = null;

// Payment Form Functions
function initPaymentForm() {
  const paymentForm = document.getElementById("payment-form");
  const serviceSelect = document.getElementById("service-type");
  const amountInput = document.getElementById("amount");
  const applyCouponBtn = document.getElementById("applyCouponBtn");
  const couponCodeInput = document.getElementById("couponCode");
  const discountRow = document.querySelector(".summary-row.discount");
  const discountAmountSpan = document.getElementById("discount-amount");

  if (!paymentForm || !serviceSelect || !amountInput) {
    return;
  }

  const servicePricing = {
    "itr-standard": 999,
    "itr-multiple-form-16": 1599,
    "itr-business-income": 2499,
    "itr-capital-gain": 3299,
    "itr-nri": 6499,
    "itr-foreign": 9999,
    "tax-planning-basic": 999,
    "tax-planning-standard": 2999,
    "tax-planning-premium": 6999,
    "first-consultation-call": 99,
    custom: 0,
  };

  serviceSelect.addEventListener("change", function () {
    const selectedService = this.value;
    if (selectedService && selectedService !== "custom") {
      amountInput.value = servicePricing[selectedService];
      amountInput.setAttribute("readonly", true);
    } else if (selectedService === "custom") {
      amountInput.value = "";
      amountInput.removeAttribute("readonly");
      amountInput.focus();
    } else {
        amountInput.value = "";
        amountInput.setAttribute("readonly", true);
    }
    updatePaymentSummary();
  });

  amountInput.addEventListener("input", updatePaymentSummary);

  if (applyCouponBtn && couponCodeInput) {
    applyCouponBtn.addEventListener("click", function () {
      const code = couponCodeInput.value.trim().toUpperCase();
      if (coupons[code]) {
        appliedCoupon = coupons[code];
        alert(`Coupon "${code}" applied!`);
        updatePaymentSummary();
      } else {
        appliedCoupon = null;
        alert("Invalid coupon code");
        updatePaymentSummary();
      }
    });
  }

  paymentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validatePaymentForm()) {
      initializeRazorpay();
    }
  });

  // Auto-fill from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const amountParam = urlParams.get("amount");
  const serviceParam = urlParams.get("service");

  if (serviceParam) {
    const formattedService = serviceParam.toLowerCase().replace(/\s+/g, "-");
    let matchedOption = [...serviceSelect.options].find(
      (opt) => opt.value === formattedService
    );

    if (matchedOption) {
      serviceSelect.value = formattedService;
      if (formattedService !== "custom") {
        amountInput.value = servicePricing[formattedService];
        amountInput.setAttribute("readonly", true);
      } else {
        amountInput.removeAttribute("readonly");
      }
    } else {
      const newOption = new Option(serviceParam, formattedService, true, true);
      serviceSelect.add(newOption);
      serviceSelect.value = formattedService;
      amountInput.setAttribute("readonly", true);
    }
  } else {
      amountInput.setAttribute("readonly", true);
  }

  if (amountParam && serviceSelect.value === "custom") {
      amountInput.value = amountParam;
  } else if (amountParam && serviceSelect.value !== "custom" && !amountInput.value) {
      amountInput.value = amountParam;
  }

  updatePaymentSummary();
}

function updatePaymentSummary() {
  const amountInput = document.getElementById("amount");
  const serviceAmountElement = document.getElementById("service-amount");
  const totalAmountElement = document.getElementById("total-amount");
  const discountRow = document.querySelector(".summary-row.discount");
  const discountAmountSpan = document.getElementById("discount-amount");

  if (!amountInput || !serviceAmountElement || !totalAmountElement || !discountRow || !discountAmountSpan) {
    return;
  }

  let baseAmount = parseFloat(amountInput.value) || 0;
  let discountedAmount = baseAmount;
  let discountValue = 0;

  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountValue = (baseAmount * appliedCoupon.value) / 100;
      discountedAmount = baseAmount - discountValue;
    } else if (appliedCoupon.type === "flat") {
      discountValue = appliedCoupon.value;
      discountedAmount = baseAmount - discountValue;
    }
    if (discountedAmount < 0) discountedAmount = 0;

    discountAmountSpan.textContent = `₹${discountValue.toLocaleString("en-IN")}`;
    discountRow.style.display = "flex";
  } else {
    discountRow.style.display = "none";
    discountAmountSpan.textContent = `₹0`;
  }

  serviceAmountElement.textContent = `₹${baseAmount.toLocaleString("en-IN")}`;
  totalAmountElement.textContent = `₹${discountedAmount.toLocaleString("en-IN")}`;
}

function validatePaymentForm() {
  const clientName = document.getElementById("client-name").value.trim();
  const clientEmail = document.getElementById("client-email").value.trim();
  const clientPhone = document.getElementById("client-phone").value.trim();
  const serviceType = document.getElementById("service-type").value;
  const amount = parseFloat(document.getElementById("amount").value);

  if (clientName.length < 2) {
    alert("Client Name must be at least 2 characters.");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientEmail)) {
    alert("Please enter a valid email address.");
    return false;
  }

  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(clientPhone)) {
    alert("Please enter a valid phone number (at least 10 digits).");
    return false;
  }

  if (!serviceType || serviceType === "") {
    alert("Please select a service type.");
    return false;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Amount must be a positive number.");
    return false;
  }

  return true;
}

function initializeRazorpay() {
  const form = document.getElementById("payment-form");
  const formData = new FormData(form);

  let amount = parseFloat(formData.get("amount"));

  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      amount -= (amount * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      amount -= appliedCoupon.value;
    }
    if (amount < 0) amount = 0;
  }

  const totalAmountInPaise = Math.round(amount * 100);

  const options = {
    key: "rzp_live_jLAMsymMHO7Wgh",
    amount: totalAmountInPaise,
    currency: "INR",
    name: "Fingard Partners",
    description: `Payment for ${formData.get("service-type") || "Services"}`,
    image: "https://i.postimg.cc/507Zf8yt/logo.png",
    handler: handlePaymentSuccess,
    prefill: {
      name: formData.get("client-name"),
      email: formData.get("client-email"),
      contact: formData.get("client-phone"),
    },
    notes: {
      service_type: formData.get("service-type"),
      description: formData.get("description"),
      coupon_code: document.getElementById("couponCode").value.trim() || "N/A",
      original_amount: parseFloat(formData.get("amount")),
      discount_applied: appliedCoupon ? `${appliedCoupon.type === 'percent' ? appliedCoupon.value + '%' : '₹' + appliedCoupon.value}` : 'N/A',
    },
    theme: {
      color: "#002147",
    },
  };

  const rzp = new Razorpay(options);
  rzp.on("payment.failed", handlePaymentFailure);
  rzp.open();
}

function handlePaymentSuccess(response) {
  alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
  console.log("Payment successful:", response);
  document.getElementById("payment-form").reset();
  appliedCoupon = null;
  updatePaymentSummary();
}

function handlePaymentFailure(response) {
  alert(`Payment failed: ${response.error.description || "Unknown error"}`);
  console.error("Payment failed:", response);
}

function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".service-card, .value-card, .feature-item"
  );

  animatedElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
  });
}

function initPageSpecific() {
  const currentPage = window.location.pathname.split("/").pop();

  switch (currentPage) {
    case "contact.html":
      break;
    case "payment.html":
      break;
    case "services.html":
      break;
    default:
      break;
  }
}

// Handle window resize for responsive features
window.addEventListener("resize", function () {
  const navMenu = document.getElementById("nav-menu");
  const hamburger = document.getElementById("hamburger");

  if (window.innerWidth > 768) {
    if (navMenu) navMenu.classList.remove("active");
    if (hamburger) hamburger.classList.remove("active");
  }
});

function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}
