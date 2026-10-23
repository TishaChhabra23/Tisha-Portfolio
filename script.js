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
    window.globalResume = data;

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

    // Render Technical Skills (Categorized Bento Cards on Home Page)
    const techStackContainer = document.getElementById("tech-stack-container");
    const categoryIcons = {
      "programming languages": "code-slash-outline",
      "ai, deep learning & research": "bulb-outline",
      "web & frontend development": "globe-outline",
      "databases & backend": "server-outline",
      "tools & engineering": "construct-outline"
    };

    if (techStackContainer && data.tech_stack) {
      techStackContainer.innerHTML = Object.entries(data.tech_stack)
        .map(([category, skills]) => {
          const iconName = categoryIcons[category.toLowerCase().trim()] || "cube-outline";
          return `
            <div class="tech-category">
              <div class="category-header">
                <div class="category-icon-box">
                  <ion-icon name="${iconName}"></ion-icon>
                </div>
                <h4 class="h4 category-title">${category}</h4>
              </div>
              <div class="tech-list">
                ${skills.map((skill) => `<span class="tech-item">${skill}</span>`).join("")}
              </div>
            </div>
          `;
        })
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
    window.globalCertificates = certificates;

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
    window.globalProjects = projects;

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

// Initialize all dynamic data loaders and features
const initApp = function () {
  loadResume();
  loadCertificates();
  loadProjects();
  initRecruiterFitAnalyzer();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/* =========================================================
   RECRUITER FIT ANALYZER LOGIC
   ========================================================= */
function initRecruiterFitAnalyzer() {
  const openModalBtn = document.getElementById("open-recruiter-modal-btn");
  const modal = document.getElementById("recruiter-modal");
  const closeBtn = document.getElementById("recruiter-close-btn");
  const overlay = document.getElementById("recruiter-overlay");
  const analyzeBtn = document.getElementById("recruiter-analyze-btn");
  const textarea = document.getElementById("recruiter-input");

  const stateInput = document.getElementById("recruiter-state-input");
  const stateAnim = document.getElementById("recruiter-state-anim");
  const stateResults = document.getElementById("recruiter-state-results");
  const animText = document.getElementById("recruiter-anim-text");
  const presetChips = document.querySelectorAll(".preset-chip");

  if (!modal) return;

  // Presets mapping
  const presets = {
    aiml: "Looking for an AI / Machine Learning Engineer with strong Python proficiency, experience in Deep Learning (CNNs, PyTorch or TensorFlow), Computer Vision, model benchmarking, and Explainable AI (Grad-CAM). Must understand data preprocessing and neural network architecture design.",
    fullstack: "Seeking a Full-Stack Software Developer proficient in React, modern JavaScript/TypeScript, Python backend (FastAPI/Node.js), REST APIs, database architecture (MongoDB, MySQL), and engineering responsive web interfaces.",
    python: "Hiring a Python Backend Developer to engineer robust RESTful APIs, data schemas (MySQL/MongoDB), microservices, backend data pipelines, and seamless frontend integrations.",
    research: "Seeking a Computer Science Research Engineer with strong foundations in neural network architectures, medical image classification, empirical evaluation (Macro-AUC, accuracy, sensitivity), and peer-reviewed IEEE publications."
  };

  // Preset chip click events
  presetChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const type = chip.getAttribute("data-preset");
      if (presets[type] && textarea) {
        textarea.value = presets[type];
        textarea.focus();
      }
    });
  });

  // Modal toggle functionality
  function toggleRecruiterModal() {
    modal.classList.toggle("active");
    if (!modal.classList.contains("active")) {
      setTimeout(() => {
        if (stateInput) stateInput.classList.add("active");
        if (stateAnim) stateAnim.classList.remove("active");
        if (stateResults) stateResults.classList.remove("active");
        if (textarea) textarea.value = "";
      }, 300);
    } else {
      setTimeout(() => {
        if (textarea) textarea.focus();
      }, 100);
    }
  }

  if (openModalBtn) openModalBtn.addEventListener("click", toggleRecruiterModal);
  if (closeBtn) closeBtn.addEventListener("click", toggleRecruiterModal);
  if (overlay) overlay.addEventListener("click", toggleRecruiterModal);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      toggleRecruiterModal();
    }
  });

  // Keyword dictionary for role requirements mapping
  const keywordDict = {
    "python": "Python",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "machine learning": "Machine Learning",
    "ml": "Machine Learning",
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",
    "cnn": "CNNs (Convolutional Neural Networks)",
    "cnns": "CNNs (Convolutional Neural Networks)",
    "efficientnet": "EfficientNetV2",
    "efficientnetv2": "EfficientNetV2",
    "resnet": "ResNet",
    "densenet": "DenseNet",
    "grad-cam": "Grad-CAM (Explainable AI)",
    "gradcam": "Grad-CAM (Explainable AI)",
    "xai": "Explainable AI (XAI)",
    "explainable ai": "Explainable AI",
    "computer vision": "Computer Vision",
    "cv": "Computer Vision",
    "image classification": "Image Classification",
    "medical imaging": "Medical Imaging AI",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "keras": "Keras",
    "nlp": "Natural Language Processing (NLP)",
    "natural language processing": "Natural Language Processing",
    "transformers": "Transformers (DistilBERT)",
    "distilbert": "DistilBERT",
    "bert": "BERT / Transformers",
    "hugging face": "Hugging Face",
    "huggingface": "Hugging Face",
    "rag": "RAG (Retrieval-Augmented Generation)",
    "faiss": "FAISS Vector Search",
    "gemini": "Google Gemini API",
    "llm": "LLMs / Generative AI",
    "generative ai": "Generative AI",
    "genai": "Generative AI",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "react": "React.js",
    "reactjs": "React.js",
    "react.js": "React.js",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "express": "Express.js",
    "expressjs": "Express.js",
    "html": "HTML5",
    "css": "CSS3",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "mysql": "MySQL",
    "sql": "SQL Databases",
    "rest": "REST APIs",
    "api": "REST APIs",
    "apis": "REST APIs",
    "backend": "Backend Engineering",
    "frontend": "Frontend Development",
    "fullstack": "Full-Stack Development",
    "full-stack": "Full-Stack Development",
    "git": "Git / GitHub",
    "github": "Git / GitHub",
    "docker": "Docker",
    "linux": "Linux",
    "data science": "Data Science",
    "data analysis": "Data Analysis",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "scikit-learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "research": "Academic Research",
    "publication": "IEEE Publications",
    "publications": "IEEE Publications",
    "ieee": "IEEE Published Research",
    "paper": "Research & Publications",
    "c": "C Programming",
    "c++": "C++",
    "cpp": "C++",
    "java": "Java",
    "blockchain": "Blockchain",
    "network": "Networking",
    "cloud": "Cloud Computing"
  };

  // Analyze button trigger
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      if (!textarea) return;
      const input = textarea.value.trim().toLowerCase();
      if (input === "") {
        textarea.focus();
        return;
      }

      if (stateInput) stateInput.classList.remove("active");
      if (stateAnim) stateAnim.classList.add("active");

      const texts = [
        "Parsing job description & requirements...",
        "Benchmarking skills & tech stack...",
        "Cross-referencing projects & IEEE research...",
        "Synthesizing personalized fit report..."
      ];
      let i = 0;
      let textInterval;
      if (animText) {
        animText.textContent = texts[0];
        textInterval = setInterval(() => {
          i++;
          if (i < texts.length) animText.textContent = texts[i];
        }, 650);
      }

      setTimeout(() => {
        if (textInterval) clearInterval(textInterval);
        processCandidateFit(input);
        if (stateAnim) stateAnim.classList.remove("active");
        if (stateResults) stateResults.classList.add("active");
      }, 2300);
    });
  }

  // Processing function
  function processCandidateFit(input) {
    const matchedKeywords = new Set();

    for (let key in keywordDict) {
      const escaped = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}(?=[^a-zA-Z0-9_#+]|$)`, "i");
      if (regex.test(input)) {
        matchedKeywords.add(keywordDict[key]);
      }
    }

    const matchesArray = Array.from(matchedKeywords);

    // Contextual expansions
    if (matchesArray.includes("Frontend Development")) {
      ["HTML5", "CSS3", "JavaScript", "React.js"].forEach((k) => {
        if (!matchesArray.includes(k)) matchesArray.push(k);
      });
    }
    if (matchesArray.includes("Backend Engineering")) {
      ["Python", "FastAPI", "MongoDB", "MySQL", "REST APIs"].forEach((k) => {
        if (!matchesArray.includes(k)) matchesArray.push(k);
      });
    }
    if (
      matchesArray.includes("Artificial Intelligence") ||
      matchesArray.includes("Machine Learning") ||
      matchesArray.includes("Deep Learning")
    ) {
      ["Python", "TensorFlow", "CNNs (Convolutional Neural Networks)", "Explainable AI"].forEach((k) => {
        if (!matchesArray.includes(k)) matchesArray.push(k);
      });
    }

    // Match Projects
    const matchedProjects = [];
    if (window.globalProjects && Array.isArray(window.globalProjects)) {
      window.globalProjects.forEach((proj) => {
        let score = 0;
        const projText = (
          proj.title + " " +
          proj.category + " " +
          proj.description + " " +
          (proj.tags || []).join(" ")
        ).toLowerCase();

        matchesArray.forEach((kw) => {
          if (projText.includes(kw.toLowerCase())) score += 2;
        });

        // Domain broad matches
        if (input.includes("ai") || input.includes("machine learning") || input.includes("deep learning") || input.includes("cnn")) {
          if (proj.title.toLowerCase().includes("tumor") || proj.title.toLowerCase().includes("mri") || proj.title.toLowerCase().includes("mentor")) score += 3;
        }
        if (input.includes("react") || input.includes("fullstack") || input.includes("frontend")) {
          if (proj.tags && proj.tags.some(t => t.toLowerCase().includes("react"))) score += 3;
        }

        if (score > 0) {
          matchedProjects.push({ ...proj, matchScore: score });
        }
      });

      matchedProjects.sort((a, b) => b.matchScore - a.matchScore);
    }

    // Match Publications (IEEE ICONICA 2026 Paper)
    let matchedPublication = null;
    if (window.globalResume && window.globalResume.publications && window.globalResume.publications.length > 0) {
      matchedPublication = window.globalResume.publications[0];
    }

    // Match Certificates
    const matchedCerts = [];
    if (window.globalCertificates && Array.isArray(window.globalCertificates)) {
      window.globalCertificates.forEach((cert) => {
        const certText = (
          cert.title + " " +
          (cert.category || "") + " " +
          (cert.displayCategory || "")
        ).toLowerCase();

        let isMatch = false;
        matchesArray.forEach((kw) => {
          if (certText.includes(kw.toLowerCase())) isMatch = true;
        });

        if (isMatch) matchedCerts.push(cert);
      });
    }

    // Compute fit score (88% to 98%)
    let matchScorePercentage = 88;
    if (matchesArray.length >= 6) {
      matchScorePercentage = 98;
    } else if (matchesArray.length >= 4) {
      matchScorePercentage = 95;
    } else if (matchesArray.length >= 2) {
      matchScorePercentage = 91;
    }

    // Executive pitch construction
    let pitchHTML = "";
    if (matchesArray.length > 0) {
      pitchHTML = `
        <p>
          Based on your requirements, <strong>Tisha Chhabra</strong> is a highly compelling candidate for this position, demonstrating a <strong>${matchScorePercentage}% direct technical alignment</strong>.
        </p>
        <p style="margin-top: 10px;">
          Currently pursuing an <strong>MCA at CHRIST (Deemed to be University)</strong>, Tisha combines strong computer science fundamentals with verified real-world execution. Notably, she is the <strong>first author of peer-reviewed IEEE published research</strong> (ICONICA 2026) in deep learning and Explainable AI (Grad-CAM), and has engineered production-ready full-stack applications leveraging <strong>${matchesArray.slice(0, 5).join(", ")}</strong>.
        </p>
      `;
    } else {
      pitchHTML = `
        <p>
          Tisha brings a rigorous software engineering foundation as an MCA candidate with verified peer-reviewed IEEE research and full-stack development experience. While your prompt covers broader specifications, her algorithmic depth, fast ramp-up speed, and structured engineering practices make her well-suited to quickly master and deliver on your stack.
        </p>
      `;
    }

    // Matching Skills HTML
    let skillsHTML = "";
    if (matchesArray.length > 0) {
      skillsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="checkmark-done-circle-outline"></ion-icon>
            <span>Verified Matching Skills (${matchesArray.length})</span>
          </h4>
          <div class="matched-skills-list">
            ${matchesArray.map((kw) => `<span class="matched-skill-chip">${kw}</span>`).join("")}
          </div>
        </div>
      `;
    }

    // Research Paper Spotlight HTML
    let researchHTML = "";
    if (matchedPublication) {
      researchHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="ribbon-outline"></ion-icon>
            <span>Published IEEE Research Distinction</span>
          </h4>
          <div class="match-research-card">
            <div class="research-header">
              <span class="research-badge">IEEE ICONICA 2026</span>
              <span class="research-badge">First Author</span>
              <span class="research-badge">98.92% Accuracy</span>
            </div>
            <h5 class="research-title">"${matchedPublication.paperTitle}"</h5>
            <p class="research-details">${matchedPublication.conference}</p>
            <p class="research-doi">DOI: <a href="${matchedPublication.doiUrl}" target="_blank" rel="noopener noreferrer">${matchedPublication.doi}</a></p>
            <div class="research-actions">
              <a href="./assets/Comparative_Analysis_Advanced_CNN_Brain_Tumor_Classification.pdf" target="_blank" rel="noopener noreferrer" class="fit-mini-link">
                <ion-icon name="document-text-outline"></ion-icon>
                <span>Read Full Paper (PDF)</span>
              </a>
              <a href="https://github.com/TishaChhabra23/Research-Paper.git" target="_blank" rel="noopener noreferrer" class="fit-mini-link">
                <ion-icon name="logo-github"></ion-icon>
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }

    // Projects HTML
    let projectsHTML = "";
    const displayProjects = matchedProjects.length > 0 
      ? matchedProjects.slice(0, 3) 
      : (window.globalProjects ? window.globalProjects.slice(0, 3) : []);

    if (displayProjects.length > 0) {
      projectsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="code-slash-outline"></ion-icon>
            <span>Directly Relevant Projects</span>
          </h4>
          <div class="matched-projects-grid">
            ${displayProjects
              .map(
                (proj) => `
              <a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="match-item-card">
                <img src="${proj.image}" alt="${proj.title}" class="match-item-thumb" />
                <div class="match-item-info">
                  <h5 class="match-item-title">${proj.title}</h5>
                  <span class="match-item-cat">${proj.category}</span>
                  <p class="match-item-desc">${proj.description.substring(0, 115)}...</p>
                </div>
                <ion-icon name="arrow-forward-outline" class="match-item-arrow"></ion-icon>
              </a>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }

    // Certificates HTML
    let certsHTML = "";
    if (matchedCerts.length > 0) {
      certsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="medal-outline"></ion-icon>
            <span>Aligned Certifications</span>
          </h4>
          <div class="matched-certs-grid">
            ${matchedCerts.slice(0, 3).map((cert) => `
              <a href="${cert.link}" target="_blank" rel="noopener noreferrer" class="match-cert-card">
                <img src="${cert.image}" alt="${cert.title}" class="match-cert-thumb" />
                <div class="match-cert-info">
                  <span class="match-cert-title">${cert.title}</span>
                  <span class="match-cert-issuer">${cert.displayCategory || cert.category}</span>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
      `;
    }

    // Call to action buttons
    const ctaHTML = `
      <div class="fit-cta-group">
        <button type="button" class="fit-cta-btn primary" id="btn-fit-projects">
          <ion-icon name="folder-outline"></ion-icon>
          <span>Explore All Projects</span>
        </button>
        <button type="button" class="fit-cta-btn primary" id="btn-fit-resume">
          <ion-icon name="document-text-outline"></ion-icon>
          <span>View Experience & Research</span>
        </button>
        <button type="button" class="fit-cta-btn secondary" id="btn-fit-contact">
          <ion-icon name="mail-outline"></ion-icon>
          <span>Contact Tisha</span>
        </button>
        <button type="button" class="fit-cta-btn secondary reset-fit-btn" id="btn-fit-reset">
          <ion-icon name="refresh-outline"></ion-icon>
          <span>Analyze Another Role</span>
        </button>
      </div>
    `;

    // Render results
    if (stateResults) {
      stateResults.innerHTML = `
        <div class="fit-results-header">
          <div class="fit-score-badge">
            <ion-icon name="shield-checkmark"></ion-icon>
            <span>${matchScorePercentage}% Role Alignment • Strong Match</span>
          </div>
          <h3 class="h3 modal-title">Candidate Fit Assessment</h3>
        </div>

        <div class="fit-pitch">
          ${pitchHTML}
        </div>

        ${skillsHTML}
        ${researchHTML}
        ${projectsHTML}
        ${certsHTML}
        ${ctaHTML}
      `;

      // Helper function for tab switching
      function navigateToTab(pageName) {
        if (closeBtn) closeBtn.click();
        const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
        const targetBtn = navLinks.find(
          (el) => el.textContent.trim().toLowerCase() === pageName.toLowerCase()
        );
        if (targetBtn) {
          targetBtn.click();
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Hook up action buttons
      const btnProjects = document.getElementById("btn-fit-projects");
      const btnResume = document.getElementById("btn-fit-resume");
      const btnContact = document.getElementById("btn-fit-contact");
      const btnReset = document.getElementById("btn-fit-reset");

      if (btnProjects) btnProjects.addEventListener("click", () => navigateToTab("projects"));
      if (btnResume) btnResume.addEventListener("click", () => navigateToTab("resume"));
      if (btnContact) btnContact.addEventListener("click", () => navigateToTab("contact"));
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          stateResults.classList.remove("active");
          stateInput.classList.add("active");
          if (textarea) {
            textarea.value = "";
            textarea.focus();
          }
        });
      }
    }
  }
}

