const header = document.querySelector('.site-header');

// 1. Convert Menu text into hamburger structure
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.innerHTML = `
    <span class="hamburger-box">
      <span class="hamburger-inner"></span>
    </span>
  `;
  navToggle.setAttribute('aria-label', 'Open Menu');
  navToggle.addEventListener('click', () => header.classList.toggle('open'));
}

document.querySelectorAll('.nav-drop>button').forEach(btn => btn.addEventListener('click', e => {
  if (innerWidth < 981) e.currentTarget.parentElement.classList.toggle('open');
}));

const io = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('in');
    io.unobserve(entry.target);
  }
}), { threshold: .12 });
document.querySelectorAll('.reveal,.product-card,.solution-tile').forEach(el => io.observe(el));

// 2. Glassmorphic header scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// 3. Floating Contact Panel Injection (WhatsApp & Email buttons)
const fabContainer = document.createElement('div');
fabContainer.className = 'floating-contact-panel';
fabContainer.innerHTML = `
  <a href="https://wa.me/918454087989" target="_blank" rel="noopener noreferrer" class="fab-btn whatsapp" aria-label="Chat on WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
  </a>
  <a href="mailto:sales.ajind@gmail.com" class="fab-btn email" aria-label="Send Email">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
  </a>
`;
document.body.appendChild(fabContainer);

// 4. Product-specific Enquiry and Form Pre-selection Logic
document.addEventListener('DOMContentLoaded', () => {
  // Auto-rewrite contact links inside individual product pages
  const productTitle = document.querySelector('.product-hero h1')?.textContent.trim();
  if (productTitle && !window.location.pathname.includes('contact.html')) {
    document.querySelectorAll('a[href*="contact.html"]').forEach(link => {
      const originalHref = link.getAttribute('href');
      if (!originalHref.includes('?product=')) {
        link.setAttribute('href', `contact.html?product=${encodeURIComponent(productTitle)}`);
      }
    });
  }

  // Auto-rewrite contact links on product cards on index.html / products.html
  document.querySelectorAll('.product-card').forEach(card => {
    const cardTitle = card.querySelector('h3')?.textContent.trim();
    const contactLink = card.querySelector('a[href*="contact.html"], a');
    if (cardTitle && contactLink) {
      const currentHref = contactLink.getAttribute('href');
      if (currentHref.includes('contact.html') && !currentHref.includes('?product=')) {
        contactLink.setAttribute('href', `contact.html?product=${encodeURIComponent(cardTitle)}`);
      }
    }
  });

  // Handle contact page product selection & light blue indicator badge
  if (window.location.pathname.includes('contact.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedProduct = urlParams.get('product');

    if (selectedProduct) {
      const selectEl = document.querySelector('.contact-form select');
      if (selectEl) {
        let optionExists = false;
        for (let i = 0; i < selectEl.options.length; i++) {
          if (selectEl.options[i].text.toLowerCase().trim() === selectedProduct.toLowerCase().trim()) {
            selectEl.selectedIndex = i;
            optionExists = true;
            break;
          }
        }

        // If not in the pre-defined options list, dynamically add it
        if (!optionExists) {
          const newOpt = document.createElement('option');
          newOpt.text = selectedProduct;
          newOpt.value = selectedProduct;
          newOpt.selected = true;
          selectEl.add(newOpt, selectEl.options[0]);
          selectEl.selectedIndex = 0;
        }

        // Create the blue glowing indicator badge for preselected product
        const labelEl = selectEl.closest('label');
        if (labelEl) {
          const badge = document.createElement('div');
          badge.className = 'selected-product-badge';
          badge.innerHTML = `
            <span class="badge-pulse"></span>
            Enquiry Topic Focus: <strong>${selectedProduct}</strong>
          `;
          labelEl.appendChild(badge);

          // Apply glowing card state to the contact form
          const formEl = selectEl.closest('form');
          if (formEl) {
            formEl.classList.add('product-focused');
          }
        }
      }
    }
  }
});
