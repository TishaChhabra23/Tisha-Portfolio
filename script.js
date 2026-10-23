"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
  });
}

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer) modalContainer.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    if (modalImg) {
      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    }
    if (modalTitle) {
      modalTitle.innerHTML = this.querySelector(
        "[data-testimonials-title]"
      ).innerHTML;
    }
    if (modalText) {
      modalText.innerHTML = this.querySelector(
        "[data-testimonials-text]"
      ).innerHTML;
    }
    testimonialsModalFunc();
  });
}

// add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () {
    elementToggleFunc(this);
  });
}

// filter function for certificates (queries items dynamically so JSON loaded items are always matched)
const filterFunc = function (selectedValue) {
  const filterItems = document.querySelectorAll("[data-filter-item]");
  for (let i = 0; i < filterItems.length; i++) {
    const category = (filterItems[i].dataset.category || "").toLowerCase();
    if (selectedValue === "all" || selectedValue === category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables (keep existing)
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field (keep existing validation)
if (form && formInputs && formBtn) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }

  // form submission handler
  form.addEventListener("submit", function (e) {
    // Show loading state
    const originalContent = formBtn.innerHTML;
    formBtn.innerHTML =
      '<ion-icon name="hourglass-outline"></ion-icon><span>Sending...</span>';
    formBtn.disabled = true;

    // Let the form submit naturally to Formspree
    // After 2 seconds, show success message
    setTimeout(() => {
      formBtn.innerHTML =
        '<ion-icon name="checkmark-circle"></ion-icon><span>Message Sent!</span>';

      // Reset form and button after 3 seconds
      setTimeout(() => {
        form.reset();
        formBtn.innerHTML = originalContent;
        formBtn.disabled = false;
      }, 3000);
    }, 2000);
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

// ==========================================
// DYNAMIC DATA LOADERS (JSON FETCHING)
// ==========================================

// 1. Load Resume (Education, Experience, Skills)
const loadResume = async function () {
  try {
    const res = await fetch("./resume.json?t=" + Date.now());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    // Render Education
    const educationList = document.querySelector("[data-education-list]");
    if (educationList && data.education) {
      educationList.innerHTML = data.education
        .map(
          (edu) => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${edu.title}</h4>
          <span>${edu.duration}</span>
          <p class="timeline-text">${edu.description}</p>
        </li>
      `
        )
        .join("");
    }

    // Helper function to render rich timeline items (supports badges, highlights, links, etc.)
    const renderTimelineItem = (item) => {
      let extra = "";
      if (item.subheading) {
        extra += `<p class="timeline-text"><i><b>${item.subheading}</b></i></p>`;
      }
      if (item.paperTitle) {
        extra += `<p class="timeline-text" style="color: #fff; font-size: 14px; margin-top: 4px;"><i><b>"${item.paperTitle}"</b></i></p>`;
      }
      if (item.authors) {
        extra += `<p class="timeline-text" style="margin-top: 4px;"><small style="color: var(--light-gray-70)"><b>Authors:</b> ${item.authors}${item.affiliation ? ` (${item.affiliation})` : ""}</small></p>`;
      }
      if (item.conference) {
        extra += `<p class="timeline-text"><small style="color: var(--light-gray-70)"><b>Published in:</b> ${item.conference}${item.paperId ? ` — ${item.paperId}` : ""}</small></p>`;
      }
      if (item.badges && Array.isArray(item.badges)) {
        extra += `<div class="timeline-badges">` +
          item.badges.map((b) => `<span class="timeline-badge">${b}</span>`).join("") +
          `</div>`;
      }
      if (item.description) {
        extra += `<p class="timeline-text">${item.description}</p>`;
      }
      if (item.highlights && Array.isArray(item.highlights)) {
        extra += `<ul class="timeline-highlights">` +
          item.highlights
            .map(
              (h) => `<li><span class="highlight-bullet">▹</span><span>${h}</span></li>`
            )
            .join("") +
          `</ul>`;
      }
      if (item.projects && Array.isArray(item.projects)) {
        extra += item.projects
          .map(
            (proj, idx) => `
          ${idx > 0 ? "<br>" : ""}
          <p class="timeline-text"><i><b>${proj.name}</b></i></p>
          <p class="timeline-text">${proj.description}</p>
        `
          )
          .join("");
      }
      if (item.links && Array.isArray(item.links)) {
        extra += `<div class="timeline-action-links">` +
          item.links
            .map(
              (l) => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="timeline-link-btn">
              <ion-icon name="${l.icon || 'link-outline'}"></ion-icon>
              <span>${l.label}</span>
            </a>
          `
            )
            .join("") +
          `</div>`;
      }

      return `
      <li class="timeline-item">
        <h4 class="h4 timeline-item-title">${item.title}</h4>
        <span>${item.duration}</span>
        ${extra}
      </li>
    `;
    };

    // Render Publications & Research
    const publicationsList = document.querySelector("[data-publications-list]");
    if (publicationsList && data.publications) {
      publicationsList.innerHTML = data.publications
        .map(renderTimelineItem)
        .join("");
    }

    // Render Experience
    const experienceList = document.querySelector("[data-experience-list]");
    if (experienceList && data.experience) {
      experienceList.innerHTML = data.experience
        .map(renderTimelineItem)
        .join("");
    }

    // Render Skills
    const skillsList = document.querySelector("[data-skills-list]");
    if (skillsList && data.skills) {
      skillsList.innerHTML = data.skills
        .map(
          (skill) => `
        <li class="skills-item">
          <div class="title-wrapper">
            <h5 class="h5">${skill.name}</h5>
            <data value="${skill.value}">${skill.value}%</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill" style="width: ${skill.value}%"></div>
          </div>
        </li>
      `
        )
        .join("");
    }

    // Update Resume Download button if provided
    const resumeBtn = document.querySelector("[data-resume-download]");
    if (resumeBtn && data.resumePdf) {
      resumeBtn.setAttribute("href", data.resumePdf);
    }
    console.log("Resume data loaded successfully");
  } catch (error) {
    console.error("Failed to load resume data:", error);
  }
};

// 2. Load Certificates
const loadCertificates = async function () {
  try {
    const res = await fetch("./certificates.json?t=" + Date.now());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const certificates = await res.json();

    const certList = document.querySelector("[data-certificates-list]");
    if (certList && Array.isArray(certificates)) {
      certList.innerHTML = certificates
        .map(
          (cert) => `
        <li class="project-item active" data-filter-item data-category="${(
          cert.category || ""
        ).toLowerCase()}">
          <a href="${cert.link}" target="_blank" rel="noopener noreferrer">
            <figure class="project-img">
              <div class="project-item-icon-box">
                <ion-icon name="eye-outline"></ion-icon>
              </div>
              <img src="${cert.image}" alt="${cert.title}" loading="lazy" />
            </figure>
            <h3 class="project-title">${cert.title}</h3>
            <p class="project-category">${cert.displayCategory || cert.category}</p>
          </a>
        </li>
      `
        )
        .join("");

      // Apply currently selected filter (e.g. "all")
      const activeFilterBtn = document.querySelector("[data-filter-btn].active");
      const currentCategory = activeFilterBtn
        ? activeFilterBtn.innerText.toLowerCase()
        : "all";
      filterFunc(currentCategory);
    }
    console.log("Certificates data loaded successfully");
  } catch (error) {
    console.error("Failed to load certificates data:", error);
  }
};

// 3. Load Projects
const loadProjects = async function () {
  try {
    const res = await fetch("./projects.json?t=" + Date.now());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const projects = await res.json();

    const projectsList = document.querySelector("[data-projects-list]");
    if (projectsList && Array.isArray(projects)) {
      projectsList.innerHTML = projects
        .map((proj) => {
          const tagsHtml =
            proj.tags && Array.isArray(proj.tags)
              ? `<div class="project-tags">` +
                proj.tags
                  .map((tag) => `<span class="project-tag">${tag}</span>`)
                  .join("") +
                `</div>`
              : "";

          return `
        <li class="blog-post-item">
          <a href="${proj.link}" target="_blank" rel="noopener noreferrer">
            <figure class="blog-banner-box">
              <img src="${proj.image}" alt="${proj.title}" loading="lazy" />
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">${proj.category}</p>
                <span class="dot"></span>
                <time datetime="${proj.datetime || ""}">${proj.date}</time>
              </div>
              <h3 class="h3 blog-item-title">${proj.title}</h3>
              <p class="blog-text">${proj.description}</p>
              <div class="project-card-footer">
                ${tagsHtml}
                <div class="project-action-link">
                  <span>View on GitHub</span>
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </div>
              </div>
            </div>
          </a>
        </li>
      `;
        })
        .join("");
    }
    console.log("Projects data loaded successfully");
  } catch (error) {
    console.error("Failed to load projects data:", error);
  }
};

// Initialize all dynamic data loaders
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    loadResume();
    loadCertificates();
    loadProjects();
  });
} else {
  loadResume();
  loadCertificates();
  loadProjects();
}
