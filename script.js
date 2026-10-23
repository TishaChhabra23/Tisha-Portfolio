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

  // Helper for strict word boundary pattern matching
  function hasWord(text, word) {
    if (!text || !word) return false;
    const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const reg = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}(?=[^a-zA-Z0-9_#+]|$)`, "i");
    return reg.test(text);
  }

  // Presets mapping with 6 distinct domain archetypes
  const presets = {
    aiml: "Looking for an AI / Machine Learning Engineer with strong Python proficiency, experience in Deep Learning (CNNs, PyTorch or TensorFlow), Computer Vision, model benchmarking, and Explainable AI (Grad-CAM). Must understand data preprocessing and neural network architecture design.",
    fullstack: "Seeking a Full-Stack Software Developer proficient in React, modern JavaScript/TypeScript, Python backend (FastAPI/Node.js), REST APIs, database architecture (MongoDB, MySQL), and engineering responsive web interfaces.",
    frontend: "Hiring a Frontend Engineer proficient in React 18/19, TypeScript, modern CSS3 styling, responsive UI/UX design, micro-interactions, component state management, and modern build tooling (Vite).",
    backend: "Hiring a Backend & API Developer to engineer robust RESTful APIs with Python (FastAPI) and Node.js, data schemas (MySQL/MongoDB), microservices, backend data pipelines, and database optimization.",
    datascience: "Seeking a Data Scientist or Analytics Engineer experienced in exploratory data analysis, statistical modeling with Pandas and NumPy, predictive modeling (LightGBM/XGBoost), SHAP explainability, and sensor/environmental data analytics.",
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

  // Keyword dictionary for direct competency display
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
        "Cross-referencing projects & credentials...",
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

  // Processing function with dynamic role track classification, tailored pitch & project scoring
  function processCandidateFit(input) {
    const rawInput = input.trim();
    const lowerInput = rawInput.toLowerCase();

    // 1. Comprehensive Keyword Matching with Word Boundaries
    const matchedKeywords = new Set();
    for (let key in keywordDict) {
      if (hasWord(lowerInput, key)) {
        matchedKeywords.add(keywordDict[key]);
      }
    }
    const matchesArray = Array.from(matchedKeywords);

    // 2. Identify Role Track & Target Domain with Strict Word Boundaries
    const trackKeywords = {
      aiml: [
        "ai", "artificial intelligence", "machine learning", "ml", "deep learning", "dl",
        "cnn", "cnns", "convolutional neural network", "convolutional neural networks",
        "computer vision", "cv", "image classification", "object detection",
        "tensorflow", "pytorch", "keras", "transfer learning", "grad-cam", "gradcam",
        "explainable ai", "xai", "transformers", "distilbert", "hugging face", "huggingface",
        "llm", "llms", "large language model", "generative ai", "genai", "gemini",
        "rag", "faiss", "vector database"
      ],
      research: [
        "research", "researcher", "paper", "papers", "publication", "publications",
        "ieee", "iconica", "conference", "journal", "peer-reviewed", "doi",
        "benchmark", "empirical", "novel", "academic", "phd", "macro-auc", "specificity"
      ],
      fullstack: [
        "fullstack", "full-stack", "full stack", "web developer", "web development",
        "mern", "mean", "frontend and backend", "end-to-end web"
      ],
      frontend: [
        "frontend", "front-end", "front end", "ui", "ux", "ui/ux", "user interface",
        "react", "reactjs", "react.js", "nextjs", "next.js", "vue", "angular",
        "html", "html5", "css", "css3", "tailwind", "tailwindcss", "responsive",
        "web design", "vite", "typescript", "javascript", "figma"
      ],
      backend: [
        "backend", "back-end", "back end", "api", "apis", "rest", "restful", "rest api",
        "fastapi", "flask", "django", "node", "nodejs", "node.js", "express", "expressjs",
        "sql", "mysql", "postgresql", "postgres", "mongodb", "mongo", "nosql",
        "database", "databases", "microservices", "orm", "crud"
      ],
      datascience: [
        "data science", "data scientist", "data analysis", "data analyst", "analytics",
        "pandas", "numpy", "scikit-learn", "sklearn", "lightgbm", "xgboost",
        "shap", "gis", "data visualization", "matplotlib", "seaborn", "statistics",
        "predictive modeling", "forecasting"
      ],
      mobile: [
        "mobile", "android", "ios", "kotlin", "flutter", "react native", "swift",
        "mobile app", "mobile developer", "sqlite", "room database", "android studio"
      ],
      cloud_devops: [
        "cloud", "aws", "azure", "gcp", "docker", "kubernetes", "k8s", "devops",
        "ci/cd", "ci cd", "linux", "bash", "server", "virtualization", "infrastructure",
        "networking", "sysadmin"
      ],
      general_swe: [
        "software engineer", "software developer", "sde", "swe", "algorithms", "dsa",
        "data structures", "oop", "object oriented", "c++", "cpp", "c", "java"
      ]
    };

    const trackScores = {
      aiml: 0,
      research: 0,
      fullstack: 0,
      frontend: 0,
      backend: 0,
      datascience: 0,
      mobile: 0,
      cloud_devops: 0,
      general_swe: 0
    };

    for (let track in trackKeywords) {
      trackKeywords[track].forEach((word) => {
        if (hasWord(lowerInput, word)) {
          trackScores[track] += 2;
        }
      });
    }

    // Composite boost: If both frontend and backend have substantial hits, boost fullstack
    if (trackScores.frontend >= 4 && trackScores.backend >= 4) {
      trackScores.fullstack += 6;
    }

    // Determine primary track
    let primaryTrack = "general_swe";
    let highestScore = 0;
    for (let track in trackScores) {
      if (trackScores[track] > highestScore) {
        highestScore = trackScores[track];
        primaryTrack = track;
      }
    }

    // 3. Smart Dynamic Role Title Detection (Specific patterns + universal extractor)
    const titlePatterns = [
      { pattern: /ai\s*\/\s*ml\s*(engineer|developer|specialist|intern)/i, title: "AI / ML Engineer" },
      { pattern: /machine\s*learning\s*(engineer|developer|specialist|intern)/i, title: "Machine Learning Engineer" },
      { pattern: /deep\s*learning\s*(engineer|specialist|researcher)/i, title: "Deep Learning Engineer" },
      { pattern: /computer\s*vision\s*(engineer|specialist|researcher)/i, title: "Computer Vision Engineer" },
      { pattern: /ai\s*(researcher|research\s*engineer|scientist)/i, title: "AI Research Engineer" },
      { pattern: /research\s*(engineer|associate|scientist)/i, title: "Computer Science Research Engineer" },
      { pattern: /data\s*scientist/i, title: "Data Scientist" },
      { pattern: /data\s*analyst/i, title: "Data Analyst & Analytics Engineer" },
      { pattern: /data\s*engineer/i, title: "Data Engineer" },
      { pattern: /full[\s-]stack\s*(engineer|developer|software\s*engineer)/i, title: "Full-Stack Software Developer" },
      { pattern: /react\s*(developer|engineer|frontend\s*developer)/i, title: "React & Frontend Developer" },
      { pattern: /front[\s-]end\s*(developer|engineer|software\s*engineer)/i, title: "Frontend & UI Developer" },
      { pattern: /back[\s-]end\s*(developer|engineer|software\s*engineer)/i, title: "Backend & API Engineer" },
      { pattern: /python\s*(developer|engineer|backend\s*developer)/i, title: "Python Backend Developer" },
      { pattern: /cloud\s*(engineer|specialist|architect)/i, title: "Cloud & Systems Engineer" },
      { pattern: /devops\s*(engineer|specialist)/i, title: "DevOps & Cloud Engineer" },
      { pattern: /mobile\s*(developer|engineer|app\s*developer)/i, title: "Mobile Application Developer" },
      { pattern: /android\s*(developer|engineer)/i, title: "Android Application Developer" },
      { pattern: /ios\s*(developer|engineer)/i, title: "iOS Application Developer" },
      { pattern: /flutter\s*(developer|engineer)/i, title: "Flutter Application Developer" },
      { pattern: /qa\s*(engineer|analyst|tester)/i, title: "QA & Test Automation Engineer" },
      { pattern: /software\s*development\s*engineer|sde/i, title: "Software Development Engineer (SDE)" },
      { pattern: /software\s*engineer/i, title: "Software Engineer" },
      { pattern: /software\s*developer/i, title: "Software Developer" },
      { pattern: /java\s*(developer|engineer)/i, title: "Java & Software Developer" }
    ];

    let detectedRoleTitle = "";
    for (let item of titlePatterns) {
      if (item.pattern.test(rawInput)) {
        detectedRoleTitle = item.title;
        break;
      }
    }

    // Universal title extractor for any role (e.g. "Looking for a Ruby on Rails Developer", "Hiring a Rust Engineer", "Salesforce Consultant")
    if (!detectedRoleTitle) {
      const genericTitleMatch = rawInput.match(
        /(?:looking\s+for\s+(?:an?\s+)?|hiring\s+(?:an?\s+)?|seeking\s+(?:an?\s+)?|position\s*:\s*|role\s*:\s*|job\s*title\s*:\s*|need\s+(?:an?\s+)?|want\s+(?:an?\s+)?)([a-zA-Z0-9#+.\s\/-]{3,35}?(?:developer|engineer|specialist|architect|programmer|consultant|analyst|administrator|intern|lead|manager))/i
      );
      if (genericTitleMatch && genericTitleMatch[1]) {
        const rawTitle = genericTitleMatch[1].trim();
        detectedRoleTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      }
    }

    if (!detectedRoleTitle) {
      const defaultTitles = {
        aiml: "AI & Machine Learning Engineer",
        research: "AI & Computer Science Research Engineer",
        fullstack: "Full-Stack Software Developer",
        frontend: "Frontend & UI Developer",
        backend: "Backend & API Engineer",
        datascience: "Data Scientist & Analytics Engineer",
        mobile: "Mobile Application Developer",
        cloud_devops: "Cloud & Systems Engineer",
        general_swe: "Software Development Engineer (SDE)"
      };
      detectedRoleTitle = defaultTitles[primaryTrack] || "Software Engineering Candidate";
    }

    // 4. Comprehensive Tech Catalog (Captures 65+ modern & adjacent technologies)
    const expandedTechCatalog = [
      { key: "ruby", label: "Ruby" },
      { key: "rails", label: "Ruby on Rails" },
      { key: "ruby on rails", label: "Ruby on Rails" },
      { key: "rust", label: "Rust" },
      { key: "golang", label: "Go / GoLang" },
      { key: "go", label: "GoLang" },
      { key: "php", label: "PHP" },
      { key: "laravel", label: "Laravel" },
      { key: "c#", label: "C#" },
      { key: "csharp", label: "C#" },
      { key: ".net", label: ".NET Core" },
      { key: "asp.net", label: "ASP.NET" },
      { key: "blazor", label: "Blazor" },
      { key: "swift", label: "Swift" },
      { key: "swiftui", label: "SwiftUI" },
      { key: "kotlin", label: "Kotlin" },
      { key: "flutter", label: "Flutter" },
      { key: "dart", label: "Dart" },
      { key: "scala", label: "Scala" },
      { key: "elixir", label: "Elixir" },
      { key: "haskell", label: "Haskell" },
      { key: "solidity", label: "Solidity" },
      { key: "web3", label: "Web3" },
      { key: "salesforce", label: "Salesforce" },
      { key: "apex", label: "Apex" },
      { key: "sap", label: "SAP" },
      { key: "cobol", label: "COBOL" },
      { key: "mainframe", label: "Mainframe" },
      { key: "r", label: "R Programming" },
      { key: "julia", label: "Julia" },
      { key: "perl", label: "Perl" },
      { key: "aws", label: "AWS Cloud" },
      { key: "azure", label: "Microsoft Azure" },
      { key: "gcp", label: "Google Cloud Platform" },
      { key: "docker", label: "Docker" },
      { key: "kubernetes", label: "Kubernetes" },
      { key: "k8s", label: "Kubernetes" },
      { key: "terraform", label: "Terraform" },
      { key: "ansible", label: "Ansible" },
      { key: "jenkins", label: "Jenkins" },
      { key: "ci/cd", label: "CI/CD Pipelines" },
      { key: "graphql", label: "GraphQL" },
      { key: "grpc", label: "gRPC" },
      { key: "kafka", label: "Apache Kafka" },
      { key: "rabbitmq", label: "RabbitMQ" },
      { key: "redis", label: "Redis" },
      { key: "postgresql", label: "PostgreSQL" },
      { key: "postgres", label: "PostgreSQL" },
      { key: "sqlite", label: "SQLite" },
      { key: "oracle", label: "Oracle DB" },
      { key: "cassandra", label: "Cassandra" },
      { key: "elasticsearch", label: "Elasticsearch" },
      { key: "snowflake", label: "Snowflake" },
      { key: "spark", label: "Apache Spark" },
      { key: "hadoop", label: "Hadoop" },
      { key: "tableau", label: "Tableau" },
      { key: "powerbi", label: "Power BI" },
      { key: "spring", label: "Spring Boot" },
      { key: "spring boot", label: "Spring Boot" },
      { key: "angular", label: "Angular" },
      { key: "vue", label: "Vue.js" },
      { key: "svelte", label: "Svelte" },
      { key: "unity", label: "Unity" },
      { key: "unreal", label: "Unreal Engine" },
      { key: "figma", label: "Figma" }
    ];

    const detectedGrowthTools = [];
    expandedTechCatalog.forEach((t) => {
      if (hasWord(lowerInput, t.key) && !detectedGrowthTools.includes(t.label)) {
        detectedGrowthTools.push(t.label);
      }
    });

    // 5. Positive Fit Scoring (Always encouraging & confident: 84% - 98%)
    let matchScorePercentage = 85;
    const matchCount = matchesArray.length;

    if (matchCount > 0) {
      if (primaryTrack === "aiml") {
        matchScorePercentage = matchCount >= 5 ? 98 : (matchCount >= 3 ? 94 : 90);
      } else if (primaryTrack === "research") {
        matchScorePercentage = matchCount >= 4 ? 98 : (matchCount >= 2 ? 93 : 89);
      } else if (primaryTrack === "fullstack") {
        matchScorePercentage = matchCount >= 4 ? 96 : (matchCount >= 2 ? 92 : 88);
      } else if (primaryTrack === "backend") {
        matchScorePercentage = matchCount >= 4 ? 95 : (matchCount >= 2 ? 91 : 86);
      } else if (primaryTrack === "frontend") {
        matchScorePercentage = matchCount >= 3 ? 94 : 88;
      } else if (primaryTrack === "datascience") {
        matchScorePercentage = matchCount >= 3 ? 93 : 87;
      } else if (primaryTrack === "mobile") {
        matchScorePercentage = matchCount >= 2 ? 88 : 84;
      } else if (primaryTrack === "cloud_devops") {
        matchScorePercentage = matchCount >= 2 ? 88 : 84;
      } else {
        matchScorePercentage = matchCount >= 4 ? 90 : (matchCount >= 2 ? 86 : 84);
      }
    } else {
      // Unlisted / novel stack: High-velocity ramp-up score! Always positive and encouraging
      matchScorePercentage = detectedGrowthTools.length >= 3 ? 84 : 86;
    }

    // 6. Role-Tailored Executive Pitch & Domain Bullet Points
    let pitchHeadline = "";
    let pitchBody = "";
    let domainBulletPoints = [];

    if (matchesArray.length === 0) {
      // Positive adaptive pitch for novel / unlisted stacks
      const techDisplay = detectedGrowthTools.length > 0 ? detectedGrowthTools.join(", ") : "your specified technology stack";
      pitchHeadline = `High-velocity technical adaptability, versatile engineering foundations, and rapid onboarding.`;
      pitchBody = `For this role, Tisha represents a high-potential, rapidly adaptable software engineer with a rigorous Computer Science foundation. Currently pursuing a Master of Computer Applications (MCA) at CHRIST (Deemed to be University), she has proven versatility spanning low-level systems programming in C, enterprise Object-Oriented design in Java, asynchronous API development in Python (FastAPI), modern frontend engineering in React 19 / TypeScript, and cloud database management. Rather than being constrained to a single tech stack, her deep grasp of Data Structures, Algorithms, and Software Architecture enables her to achieve production-grade velocity on ${techDisplay} with minimal ramp-up time.`;
      domainBulletPoints = [
        "Proven multi-language versatility across C, Java, Python, JavaScript, and TypeScript.",
        "Solid theoretical grounding in Data Structures, Algorithms, and Object-Oriented System Architecture.",
        "Disciplined learner capable of mastering new frameworks, APIs, and domain tools within days."
      ];
    } else if (primaryTrack === "aiml") {
      pitchHeadline = `High-impact technical alignment for AI, Machine Learning, and Deep Learning engineering.`;
      pitchBody = `For AI and Machine Learning engineering, Tisha offers verified, high-level competency in deep learning architectures, convolutional neural networks, and model explainability. As first author of peer-reviewed research published by IEEE (ICONICA 2026), she trained and benchmarked advanced CNN backbones (EfficientNetV2, DenseNet121, ResNet50V2), achieving 98.92% accuracy, 0.9999 Macro-AUC, zero false negatives on healthy scans, and Grad-CAM visual explainability. Furthermore, her repository portfolio demonstrates practical deployment with transformer models (DistilBERT), Google Gemini APIs, and gradient boosting (LightGBM/SHAP).`;
      domainBulletPoints = [
        "First-author peer-reviewed IEEE research in deep learning CNN benchmark & Grad-CAM XAI.",
        "Production ML pipeline engineering with TensorFlow/Keras, PyTorch, and Scikit-Learn.",
        "Practical integration of Hugging Face NLP transformers and Google Gemini LLM APIs."
      ];
    } else if (primaryTrack === "research") {
      pitchHeadline = `Peer-reviewed scientific rigor, empirical benchmarking, and academic presentation track record.`;
      pitchBody = `For research and R&D roles, Tisha stands out as a published first author with the IEEE International Conference on Next-Gen Intelligent Computing and Applications (ICONICA 2026). She formulated novel classification heads combining global average pooling with max pooling, categorical label smoothing, and 8-fold test-time augmentation, demonstrating disciplined methodology from dataset curation to paper writing and conference defense.`;
      domainBulletPoints = [
        "First-author peer-reviewed paper indexed in IEEE Xplore with registered DOI (10.1109/ICONICA70605.2026.11736701).",
        "Formal conference presentation and defense of deep learning methodology.",
        "Deep understanding of convolutional backbones, loss functions, and spatial heatmaps (Grad-CAM)."
      ];
    } else if (primaryTrack === "fullstack") {
      pitchHeadline = `Seamless end-to-end full-stack architecture bridging modern UI with robust backends.`;
      pitchBody = `Tisha demonstrates comprehensive full-stack execution, bridging responsive frontend architectures with high-throughput API services and database persistence. She has built complete production web applications using React 18/19, TypeScript, and modern CSS on the frontend, integrated with FastAPI and Node.js/Express server backends backed by MongoDB Atlas and MySQL database systems.`;
      domainBulletPoints = [
        "Frontend mastery in React 18/19, TypeScript, Vite, responsive CSS, and state management.",
        "Backend API design using FastAPI and Node.js/Express with schema modeling and JWT auth.",
        "Database persistence design across MongoDB Atlas and relational MySQL."
      ];
    } else if (primaryTrack === "frontend") {
      pitchHeadline = `User-centric modern frontend engineering with state-of-the-art visual craftsmanship.`;
      pitchBody = `For frontend engineering, Tisha creates elegant, accessible, and performant user interfaces. Her work features modern component architecture in React 18/19 and TypeScript, dynamic styling with CSS3 and Tailwind CSS, and cutting-edge Apple-style liquid glassmorphism. She prioritizes responsive layout engineering, sub-pixel visual fidelity, and clean component state management.`;
      domainBulletPoints = [
        "Component architecture in React, TypeScript, and Vite with clean modular structure.",
        "Advanced CSS3 styling, glassmorphic refraction, and smooth micro-interactions.",
        "Responsive cross-device layouts with high visual polish and fast load times."
      ];
    } else if (primaryTrack === "backend") {
      pitchHeadline = `Robust API engineering, schema design, and high-performance server logic.`;
      pitchBody = `For backend development, Tisha focuses on designing modular, scalable server architectures, clean RESTful endpoints, and structured data persistence. She has hands-on experience developing asynchronous backend services with FastAPI and Node.js, engineering data access layers with MongoDB Atlas and MySQL, and integrating secure authentication and third-party microservices.`;
      domainBulletPoints = [
        "RESTful API architecture design using Python (FastAPI) and Node.js/Express.",
        "Relational & NoSQL database management, querying, and schema optimization (MySQL, MongoDB).",
        "Clean software design, modular service routing, and cloud/local database connectivity."
      ];
    } else if (primaryTrack === "datascience") {
      pitchHeadline = `Rigorous data analytics, feature modeling, and quantitative validation pipelines.`;
      pitchBody = `Tisha pairs data analysis with predictive machine learning modeling. Her portfolio includes predictive modeling with LightGBM/XGBoost on 70,000+ environmental sensor records, SHAP Explainable AI attribution, and extensive statistical evaluation across high-dimensional medical MRI and tabular datasets using Pandas, NumPy, and Scikit-Learn.`;
      domainBulletPoints = [
        "Statistical data modeling with Python, Pandas, NumPy, and Scikit-Learn.",
        "Feature engineering and gradient boosting with LightGBM, XGBoost, and SHAP explainability.",
        "Rigorous metric benchmarking including ROC-AUC, sensitivity, specificity, and loss curves."
      ];
    } else if (primaryTrack === "mobile") {
      pitchHeadline = `Native mobile application development grounded in responsive UI and local persistence.`;
      pitchBody = `Tisha brings hands-on mobile app development experience building Android applications using Android Studio, Java/Kotlin, and SQLite/Room Database for local persistence. Her projects incorporate clean mobile UI flows, responsive layout adaptations, and seamless local data management.`;
      domainBulletPoints = [
        "Hands-on Android application development using Java/Kotlin and Android Studio.",
        "Local database management with SQLite and Room Database architecture.",
        "Adaptive UI design principles ensuring smooth usability across mobile screen densities."
      ];
    } else if (primaryTrack === "cloud_devops") {
      pitchHeadline = `Certified cloud infrastructure foundations and structured systems integration.`;
      pitchBody = `Tisha completed a certified Cloud Computing internship with the National Institute of Electronics and IT (NIELIT), focusing on virtualization, cloud service models, and infrastructure management. Combined with Linux shell proficiency and Git version control, she brings disciplined deployment practices to modern development teams.`;
      domainBulletPoints = [
        "NIELIT-certified training in cloud infrastructure, virtualization, and deployment models.",
        "Proficiency with Linux environments, Git/GitHub version control, and cloud-hosted databases (MongoDB Atlas).",
        "Agile technical adaptability to rapidly master containerization (Docker) and major cloud providers (AWS/GCP)."
      ];
    } else {
      pitchHeadline = `Strong software engineering foundations, object-oriented design, and rapid technical adaptability.`;
      pitchBody = `Currently pursuing an MCA at CHRIST (Deemed to be University) with a specialization in software engineering, Tisha possesses a solid theoretical and practical foundation in Object-Oriented Programming, Data Structures & Algorithms, and modern application development. Her verified project delivery across multiple programming languages (Python, Java, C, JavaScript) demonstrates disciplined engineering and rapid technical adaptability.`;
      domainBulletPoints = [
        "Solid theoretical grounding in Data Structures, Algorithms, and Software Engineering principles.",
        "Multi-language versatility across Python, Java, C, and modern JavaScript/TypeScript.",
        "Proven ability to rapidly learn, architect, and deliver robust software systems."
      ];
    }

    // 7. Dynamic Project Prioritization & Scoring
    const scoredProjects = (window.globalProjects || []).map((proj) => {
      let pScore = 0;
      const text = (
        proj.title + " " +
        proj.category + " " +
        proj.description + " " +
        (proj.tags || []).join(" ")
      ).toLowerCase();

      // Check direct keyword hits against project content
      for (let key in keywordDict) {
        if (hasWord(lowerInput, key) && text.includes(key.toLowerCase())) {
          pScore += 5;
        }
      }

      // Track-specific project boosts
      if (primaryTrack === "aiml") {
        if (proj.title.includes("Brain Tumor")) pScore += 24;
        if (proj.title.includes("Fake News")) pScore += 16;
        if (proj.title.includes("Career Mentor")) pScore += 12;
        if (proj.title.includes("LandfillPlume")) pScore += 10;
        if (proj.title.includes("Study Portal")) pScore += 6;
      } else if (primaryTrack === "research") {
        if (proj.title.includes("Brain Tumor")) pScore += 30;
        if (proj.title.includes("LandfillPlume")) pScore += 16;
        if (proj.title.includes("Fake News")) pScore += 12;
        if (proj.title.includes("Study Portal")) pScore += 6;
      } else if (primaryTrack === "fullstack") {
        if (proj.title.includes("Career Mentor")) pScore += 26;
        if (proj.title.includes("Study Portal")) pScore += 22;
        if (proj.title.includes("Fake News")) pScore += 12;
        if (proj.title.includes("Brain Tumor")) pScore += 4;
      } else if (primaryTrack === "frontend") {
        if (proj.title.includes("Career Mentor")) pScore += 28;
        if (proj.title.includes("Study Portal")) pScore += 24;
        if (proj.title.includes("Fake News")) pScore += 8;
        if (proj.title.includes("Brain Tumor")) pScore += 2;
      } else if (primaryTrack === "backend") {
        if (proj.title.includes("Study Portal")) pScore += 26;
        if (proj.title.includes("Fake News")) pScore += 24;
        if (proj.title.includes("Career Mentor")) pScore += 20;
        if (proj.title.includes("LandfillPlume")) pScore += 6;
      } else if (primaryTrack === "datascience") {
        if (proj.title.includes("LandfillPlume")) pScore += 28;
        if (proj.title.includes("Fake News")) pScore += 18;
        if (proj.title.includes("Brain Tumor")) pScore += 16;
        if (proj.title.includes("Career Mentor")) pScore += 6;
      } else if (primaryTrack === "mobile") {
        if (proj.title.includes("Career Mentor")) pScore += 20;
        if (proj.title.includes("Study Portal")) pScore += 18;
        if (proj.title.includes("Fake News")) pScore += 10;
      } else if (primaryTrack === "cloud_devops") {
        if (proj.title.includes("Study Portal")) pScore += 22;
        if (proj.title.includes("Career Mentor")) pScore += 20;
        if (proj.title.includes("LandfillPlume")) pScore += 14;
      } else {
        // High complexity systems engineering projects
        if (proj.title.includes("Career Mentor")) pScore += 18;
        if (proj.title.includes("Study Portal")) pScore += 16;
        if (proj.title.includes("Brain Tumor")) pScore += 14;
      }

      return { ...proj, relevanceScore: pScore };
    });

    scoredProjects.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topProjects = scoredProjects.slice(0, 3);

    // 8. Context-Sensitive Research Spotlight (STRICT word boundary checking)
    const isResearchRelevant = (
      primaryTrack === "aiml" ||
      primaryTrack === "research" ||
      hasWord(lowerInput, "research") ||
      hasWord(lowerInput, "paper") ||
      hasWord(lowerInput, "publication") ||
      hasWord(lowerInput, "ieee") ||
      hasWord(lowerInput, "iconica") ||
      hasWord(lowerInput, "cnn") ||
      hasWord(lowerInput, "cnns") ||
      hasWord(lowerInput, "deep learning") ||
      hasWord(lowerInput, "computer vision") ||
      hasWord(lowerInput, "grad-cam") ||
      hasWord(lowerInput, "medical imaging")
    );

    let matchedPublication = null;
    if (
      isResearchRelevant &&
      window.globalResume &&
      window.globalResume.publications &&
      window.globalResume.publications.length > 0
    ) {
      matchedPublication = window.globalResume.publications[0];
    }

    // 9. Dynamic Certificates Matching
    const matchedCerts = [];
    if (window.globalCertificates && Array.isArray(window.globalCertificates)) {
      window.globalCertificates.forEach((cert) => {
        const certText = (
          cert.title + " " +
          (cert.category || "") + " " +
          (cert.displayCategory || "")
        ).toLowerCase();

        let certScore = 0;
        matchesArray.forEach((kw) => {
          if (certText.includes(kw.toLowerCase())) certScore += 3;
        });

        if (primaryTrack === "aiml" || primaryTrack === "research") {
          if (certText.includes("ieee") || certText.includes("iconica")) certScore += 12;
        }
        if (primaryTrack === "cloud_devops") {
          if (certText.includes("cloud") || certText.includes("nielit") || certText.includes("network")) certScore += 15;
        }
        if (primaryTrack === "backend" || hasWord(lowerInput, "sql") || hasWord(lowerInput, "mongo") || hasWord(lowerInput, "java")) {
          if (certText.includes("mongodb") || certText.includes("java") || certText.includes("sql")) certScore += 10;
        }
        if (hasWord(lowerInput, "network") || hasWord(lowerInput, "blockchain")) {
          if (certText.includes("network") || certText.includes("blockchain")) certScore += 10;
        }

        if (certScore > 0) {
          matchedCerts.push({ ...cert, certScore });
        }
      });

      matchedCerts.sort((a, b) => b.certScore - a.certScore);
    }

    // Growth box HTML (Always shown if adjacent tools or unlisted skills are provided)
    let growthHTML = "";
    if (detectedGrowthTools.length > 0) {
      growthHTML = `
        <div class="fit-growth-box">
          <div class="growth-header">
            <ion-icon name="trending-up-outline"></ion-icon>
            <span>Accelerated Ramp-Up & Technology Translation</span>
          </div>
          <p>
            Your requirements emphasize <strong>${detectedGrowthTools.join(", ")}</strong>. While Tisha's primary production code focuses on Python, React 19, FastAPI, Node.js, and Deep Learning, her solid computer science foundation (algorithms, system architecture, relational database design) enables accelerated ramp-up to achieve production velocity on these technologies with minimal onboarding friction.
          </p>
        </div>
      `;
    } else if (matchesArray.length === 0) {
      const customWords = rawInput.split(/[\s,;/]+/).filter(w => w.length > 2 && !["and", "the", "with", "for", "looking", "hiring", "seeking", "need", "developer", "engineer", "must", "have"].includes(w.toLowerCase()));
      const customSample = customWords.slice(0, 4).join(", ");
      growthHTML = `
        <div class="fit-growth-box">
          <div class="growth-header">
            <ion-icon name="trending-up-outline"></ion-icon>
            <span>High-Velocity Ramp-Up & Adaptability</span>
          </div>
          <p>
            Your description highlights specialized technologies${customSample ? ` including <strong>${customSample}</strong>` : ""}. Tisha's strong Computer Science pedigree—currently pursuing an MCA at CHRIST (Deemed to be University)—equips her with deep foundational mastery in Object-Oriented Design, Data Structures & Algorithms, and distributed system architectures to rapidly attain production velocity on this tech stack.
          </p>
        </div>
      `;
    }

    // Skills HTML (Direct matches OR Transferable core competencies)
    let skillsHTML = "";
    if (matchesArray.length > 0) {
      skillsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="checkmark-done-circle-outline"></ion-icon>
            <span>Directly Matched Competencies (${matchesArray.length})</span>
          </h4>
          <div class="matched-skills-list">
            ${matchesArray.map((kw) => `<span class="matched-skill-chip">${kw}</span>`).join("")}
          </div>
        </div>
      `;
    } else {
      const transferableSkills = [
        "Object-Oriented Programming (OOP)",
        "Data Structures & Algorithms (DSA)",
        "System Architecture & Modular Design",
        "Relational & NoSQL Schema Design",
        "RESTful API Architecture",
        "Git & GitHub Version Control",
        "Rapid Framework & Language Adoption",
        "Agile Full-Lifecycle Delivery"
      ];
      skillsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="flash-outline"></ion-icon>
            <span>Transferable Core Engineering Strengths (${transferableSkills.length})</span>
          </h4>
          <div class="matched-skills-list">
            ${transferableSkills.map((kw) => `<span class="matched-skill-chip transferable">${kw}</span>`).join("")}
          </div>
        </div>
      `;
    }

    // Research Paper Spotlight HTML (Context-Sensitive)
    let researchHTML = "";
    if (matchedPublication) {
      researchHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="ribbon-outline"></ion-icon>
            <span>Published IEEE Research Distinction (Relevant to ${detectedRoleTitle})</span>
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

    // Projects HTML (Ranked specifically for this role!)
    let projectsHTML = "";
    if (topProjects.length > 0) {
      projectsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="code-slash-outline"></ion-icon>
            <span>Prioritized Projects for ${detectedRoleTitle}</span>
          </h4>
          <div class="matched-projects-grid">
            ${topProjects
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

    // Certificates HTML (Ranked specifically for this role or Foundational Credentials)
    let certsHTML = "";
    if (matchedCerts.length > 0) {
      certsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="medal-outline"></ion-icon>
            <span>Aligned Credentials & Certifications</span>
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
    } else if (window.globalCertificates && window.globalCertificates.length > 0) {
      const fallbackCerts = window.globalCertificates.slice(0, 3);
      certsHTML = `
        <div class="fit-section">
          <h4 class="fit-section-title">
            <ion-icon name="medal-outline"></ion-icon>
            <span>Foundational Academic & Engineering Credentials</span>
          </h4>
          <div class="matched-certs-grid">
            ${fallbackCerts.map((cert) => `
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
            <span>${matchScorePercentage}% Role Alignment • ${detectedRoleTitle}</span>
          </div>
          <h3 class="h3 modal-title">Role Fit Assessment</h3>
        </div>

        <div class="fit-pitch">
          <span class="fit-role-tag">${detectedRoleTitle}</span>
          <h4 class="fit-pitch-headline">${pitchHeadline}</h4>
          <p>${pitchBody}</p>

          <ul class="fit-pitch-bullets">
            ${domainBulletPoints.map(bp => `<li><ion-icon name="checkmark-circle"></ion-icon><span>${bp}</span></li>`).join("")}
          </ul>

          ${growthHTML}
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

