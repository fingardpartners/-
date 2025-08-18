// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initNavigation();
  initScrollEffects();
  initContactFormSubmission(); // Ensure this is called
  initPaymentForm(); // This will handle payment form logic including Razorpay
  initAnimations();
  initPageSpecific(); // Ensure page-specific logic runs
  initLazyLoading(); // Initialize lazy loading
});

// Navigation Functions (No changes needed here based on the problem description)
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

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");

      // Animate hamburger
      const spans = hamburger.querySelectorAll("span");
      spans.forEach((span, index) => {
        if (navMenu.classList.contains("active")) {
          if (index === 0)
            span.style.transform = "rotate(45deg) translate(5px, 5px)";
          if (index === 1) span.style.opacity = "0";
          if (index === 2)
            span.style.transform = "rotate(-45deg) translate(7px, -6px)";
        } else {
          span.style.transform = "none";
          span.style.opacity = "1";
        }
      });
    });

    // Close mobile menu when clicking on a link
    navMenu.addEventListener("click", function (e) {
      if (e.target.classList.contains("nav-link")) {
        navMenu.classList.remove("active");

        // Reset hamburger animation
        const spans = hamburger.querySelectorAll("span");
        spans.forEach((span) => {
          span.style.transform = "none";
          span.style.opacity = "1";
        });
      }
    });
  }

  // Smooth scrolling for anchor links (if any)
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

// Scroll Effects (No changes needed here)
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
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".service-card, .value-card, .expertise-card, .service-detail-card, .feature-item"
  );
  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

// CONTACT FORM HANDLER 
function initContactFormSubmission() {
    const contactForm = document.getElementById('contact-form');
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
    formError.style.color = 'red'; // Ensure error message is red

    // Append these message elements near your form, e.g., after the button
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.parentNode.insertBefore(formSuccess, submitButton.nextSibling);
            submitButton.parentNode.insertBefore(formError, formSuccess.nextSibling);
        }


        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            // Clear previous messages
            formSuccess.style.display = 'none';
            formError.style.display = 'none';

            // Basic client-side validation (optional, but good practice)
            if (!validateContactForm()) { // You'll need to define this function
                return;
            }

            const formData = new FormData(contactForm);
            // Google Apps Script expects form data as key-value pairs, not JSON directly
            // So, we'll send it as URL-encoded form data or directly as FormData
            // For simplicity with Apps Script, sending as FormData is often easiest.

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData // Send as FormData directly
                });

                // Google Apps Script returns JSON, so parse it
                const result = await response.json();

                if (result.success) {
                    formSuccess.style.display = 'block';
                    contactForm.reset(); // Clear the form fields
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
}

// Add a client-side validation function (similar to your payment form validation)
function validateContactForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

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

// Ensure showError and clearError functions are defined (they are in your script.js)
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
  FINGARD5: { type: "percent", value: 5 }, // 5% discount
  FINGARD10: { type: "percent", value: 10 }, // 10% discount
  FINGARD15: { type: "percent", value: 15 }, // 15% discount
};

let appliedCoupon = null; // Global variable to store the applied coupon

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
    // Exit if payment form elements are not found on the page
    return;
  }

  const servicePricing = {
    // ITR Filing
    "itr-standard": 999,
    "itr-multiple-form-16": 1599,
    "itr-business-income": 2499,
    "itr-capital-gain": 3299,
    "itr-nri": 6499,
    "itr-foreign": 9999,

    // Tax Planning
    "tax-planning-basic": 999,
    "tax-planning-standard": 2999,
    "tax-planning-premium": 6999,

    // Tax Consultation
    "first-consultation-call": 99,

    // Custom
    custom: 0,
  };

  // Event listeners for form fields
  serviceSelect.addEventListener("change", function () {
    const selectedService = this.value;
    if (selectedService && selectedService !== "custom") {
      amountInput.value = servicePricing[selectedService];
      amountInput.setAttribute("readonly", true); // Make amount read-only
    } else if (selectedService === "custom") {
      amountInput.value = ""; // Clear for custom input
      amountInput.removeAttribute("readonly"); // Make amount editable
      amountInput.focus();
    } else {
        amountInput.value = ""; // Clear if no service selected
        amountInput.setAttribute("readonly", true); // Keep read-only
    }
    updatePaymentSummary(); // Always update summary on service change
  });

  amountInput.addEventListener("input", updatePaymentSummary); // Update summary on amount input

  // Apply coupon button event listener
  if (applyCouponBtn && couponCodeInput) {
    applyCouponBtn.addEventListener("click", function () {
      const code = couponCodeInput.value.trim().toUpperCase();
      if (coupons[code]) {
        appliedCoupon = coupons[code];
        alert(`Coupon "${code}" applied!`);
        updatePaymentSummary(); // Update summary after applying coupon
      } else {
        appliedCoupon = null; // Clear applied coupon if invalid
        alert("Invalid coupon code");
        updatePaymentSummary(); // Update summary to remove any previous discount
      }
    });
  }

  // Form submission handler
  paymentForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission
    if (validatePaymentForm()) {
      initializeRazorpay(); // Only proceed if form is valid
    }
  });

  // Auto-fill Payment from URL parameters
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
      // Add new option dynamically if it doesn't exist
      const newOption = new Option(serviceParam, formattedService, true, true);
      serviceSelect.add(newOption);
      serviceSelect.value = formattedService;
      amountInput.setAttribute("readonly", true); // Default to readonly for dynamically added
    }
  } else {
      amountInput.setAttribute("readonly", true); // Ensure it's readonly if no service param
  }

  if (amountParam && serviceSelect.value === "custom") { // Only pre-fill amount if custom is selected
      amountInput.value = amountParam;
  } else if (amountParam && serviceSelect.value !== "custom" && !amountInput.value) {
      // If service is pre-selected but amount isn't set by servicePricing, use param
      amountInput.value = amountParam;
  }


  // Initial update of payment summary when the page loads with or without URL params
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

  // Apply coupon discount
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountValue = (baseAmount * appliedCoupon.value) / 100;
      discountedAmount = baseAmount - discountValue;
    } else if (appliedCoupon.type === "flat") {
      discountValue = appliedCoupon.value;
      discountedAmount = baseAmount - discountValue;
    }
    if (discountedAmount < 0) discountedAmount = 0; // Ensure amount doesn't go negative

    discountAmountSpan.textContent = `₹${discountValue.toLocaleString("en-IN")}`;
    discountRow.style.display = "flex"; // Show discount row
  } else {
    discountRow.style.display = "none"; // Hide discount row if no coupon
    discountAmountSpan.textContent = `₹0`;
  }

  serviceAmountElement.textContent = `₹${baseAmount.toLocaleString("en-IN")}`;
  totalAmountElement.textContent = `₹${discountedAmount.toLocaleString("en-IN")}`;
}

// Define validatePaymentForm function (was missing)
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

  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/; // Allows for various phone number formats, min 10 digits
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

  // Re-apply coupon discount to the amount used for Razorpay
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      amount -= (amount * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === "flat") {
      amount -= appliedCoupon.value;
    }
    if (amount < 0) amount = 0;
  }

  // Total amount for Razorpay (convert to paise)
  const totalAmountInPaise = Math.round(amount * 100); // Use Math.round to avoid floating point issues

  const options = {
    key: "rzp_live_jLAMsymMHO7Wgh", // Your actual Razorpay Live Key
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

  // Log payment details for debugging/server-side processing
  console.log("Payment successful:", response);

  // Reset form and update summary
  document.getElementById("payment-form").reset();
  appliedCoupon = null; // Clear applied coupon after successful payment
  updatePaymentSummary();

  // You might want to redirect to a success page here
  // window.location.href = 'payment-success.html';
}

function handlePaymentFailure(response) {
  alert(`Payment failed: ${response.error.description || "Unknown error"}`);
  console.error("Payment failed:", response);
}

// Animation Functions (No changes needed here)
function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".service-card, .value-card, .feature-item"
  );

  animatedElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
  });
}

// Utility Functions (No changes needed here)
// (showError, clearError, clearErrors are already defined above)

// Initialize page-specific functionality (Consolidated into main DOMContentLoaded)
function initPageSpecific() {
  const currentPage = window.location.pathname.split("/").pop();

  switch (currentPage) {
    case "contact.html":
      // Contact page specific initialization (if any)
      break;
    case "payment.html":
      // Payment page specific initialization already handled by initPaymentForm
      break;
    case "services.html":
      // Services page specific initialization (if any)
      break;
    default:
      // Home page or other pages
      break;
  }
}

// Handle window resize for responsive features (No changes needed here)
window.addEventListener("resize", function () {
  const navMenu = document.getElementById("nav-menu");
  const hamburger = document.getElementById("hamburger");

  if (window.innerWidth > 768) {
    if (navMenu) navMenu.classList.remove("active");
    if (hamburger) {
      const spans = hamburger.querySelectorAll("span");
      spans.forEach((span) => {
        span.style.transform = "none";
        span.style.opacity = "1";
      });
    }
  }
});

// Performance optimization - Lazy loading for images (No changes needed here)
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
// Existing script.js content (if any)
// For example, your hamburger menu toggle or scroll-to-top button logic

// --- New code for scroll animations ---

document.addEventListener('DOMContentLoaded', () => {
    const faders = document.querySelectorAll('.fade-in-up');

    const appearOptions = {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Adjust when element is 50px from bottom of viewport
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('animated');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Existing Scroll to Top Button Logic (if you have it) ---
    const scrollToTopButton = document.getElementById('scroll-to-top');

    if (scrollToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopButton.classList.add('visible');
            } else {
                scrollToTopButton.classList.remove('visible');
            }
        });

        scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Existing Hamburger Menu Logic (if you have it) ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active'); // Optional: add active class to hamburger for animation
        });
    }

    // --- Navbar scroll effect (if you have it) ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Add 'scrolled' class after 50px scroll
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
