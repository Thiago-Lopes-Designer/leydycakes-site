// Hero: a grade de pontos brilha seguindo o mouse (só em telas com hover real).
const heroSection = document.querySelector(".hero");
const heroPattern = document.querySelector(".hero-pattern");
if (heroSection && heroPattern && window.matchMedia("(hover: hover)").matches) {
  heroSection.addEventListener("mousemove", event => {
    const rect = heroSection.getBoundingClientRect();
    heroPattern.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    heroPattern.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCounter(el) {
  const target = Number(el.dataset.target);
  if (reduceMotion) {
    el.textContent = target.toLocaleString("pt-BR");
    return;
  }
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString("pt-BR");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("cookie-accept");
const rejectBtn = document.getElementById("cookie-reject");

function loadGoogleAnalytics() {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", window.GA_MEASUREMENT_ID, {
    anonymize_ip: true
  });
}

const consent = localStorage.getItem("leydycakes_cookie_consent");
if (!consent) {
  cookieBanner.classList.add("show");
} else if (consent === "accepted") {
  loadGoogleAnalytics();
}

acceptBtn?.addEventListener("click", () => {
  localStorage.setItem("leydycakes_cookie_consent", "accepted");
  cookieBanner.classList.remove("show");
  loadGoogleAnalytics();
});

rejectBtn?.addEventListener("click", () => {
  localStorage.setItem("leydycakes_cookie_consent", "essential");
  cookieBanner.classList.remove("show");
});

const privacyModal = document.getElementById("privacy-modal");
document.getElementById("privacy-open")?.addEventListener("click", () => privacyModal.showModal());
document.getElementById("privacy-close")?.addEventListener("click", () => privacyModal.close());
privacyModal?.addEventListener("click", (e) => {
  if (e.target === privacyModal) privacyModal.close();
});


// Interações dos cards no celular: toca para levantar + brilho.
const interactiveCards = document.querySelectorAll(".interactive-card");
interactiveCards.forEach(card => {
  card.setAttribute("tabindex", "0");
  card.addEventListener("click", () => {
    if (window.matchMedia("(hover: none)").matches) {
      const wasActive = card.classList.contains("is-active");
      interactiveCards.forEach(item => item.classList.remove("is-active"));
      if (!wasActive) { void card.offsetWidth; card.classList.add("is-active"); }
    }
  });
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.classList.toggle("is-active");
    }
  });
});
document.addEventListener("click", event => {
  if (window.matchMedia("(hover: none)").matches && !event.target.closest(".interactive-card")) {
    interactiveCards.forEach(item => item.classList.remove("is-active"));
  }
});


// Recheios e adicionais: efeito individual no toque em telas sem hover.
const interactiveChips = document.querySelectorAll(".interactive-chip");
interactiveChips.forEach(chip => {
  chip.setAttribute("tabindex", "0");
  chip.addEventListener("click", event => {
    if (window.matchMedia("(hover: none)").matches) {
      event.stopPropagation();
      const wasActive = chip.classList.contains("is-active");
      interactiveChips.forEach(item => item.classList.remove("is-active"));
      if (!wasActive) {
        void chip.offsetWidth;
        chip.classList.add("is-active");
      }
    }
  });
  chip.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const wasActive = chip.classList.contains("is-active");
      interactiveChips.forEach(item => item.classList.remove("is-active"));
      if (!wasActive) chip.classList.add("is-active");
    }
  });
});
document.addEventListener("click", event => {
  if (window.matchMedia("(hover: none)").matches && !event.target.closest(".interactive-chip")) {
    interactiveChips.forEach(item => item.classList.remove("is-active"));
  }
});


// Monte seu pedido: monta o carrinho e gera a mensagem pronta pro WhatsApp.
const WHATSAPP_NUMBER = "5594991275535";
const CART_STORAGE_KEY = "leydycakes_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

document.querySelectorAll(".pill-group").forEach(group => {
  group.addEventListener("click", event => {
    const btn = event.target.closest(".pill");
    if (!btn) return;
    group.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
  });
});

function getSelectedPill(groupId) {
  const btn = document.querySelector(`#${groupId} .pill.active`);
  if (!btn) return null;
  return { value: btn.dataset.value, price: Number(btn.dataset.price || 0) };
}

function renderCart() {
  const list = document.getElementById("cart-list");
  const subtotalEl = document.getElementById("cart-subtotal");
  const waLink = document.getElementById("cart-whatsapp");
  if (!list) return;

  list.innerHTML = "";
  if (cart.length === 0) {
    list.innerHTML = `<li class="cart-empty">Nenhum item adicionado ainda.</li>`;
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${item.label}</span>`;
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "cart-remove";
      removeBtn.setAttribute("aria-label", "Remover item");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });
      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toLocaleString("pt-BR")}`;

  if (waLink) {
    if (cart.length === 0) {
      waLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
    } else {
      const lines = [
        "Olá! Vim pelo site da Leydy Cakes e gostaria de fazer o seguinte pedido:",
        "",
        ...cart.map(item => `• ${item.label}`),
        "",
        `Subtotal dos bolos: R$ ${subtotal.toLocaleString("pt-BR")} (docinhos, cupcakes e adicionais a confirmar).`,
        "",
        "Já estou ciente da antecedência mínima de 2 dias e do sinal de 50%."
      ];
      waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    }
  }
}

document.getElementById("add-bolo")?.addEventListener("click", () => {
  const tamanho = getSelectedPill("pill-tamanho");
  const massa = getSelectedPill("pill-massa");
  const recheioEl = document.getElementById("select-recheio");
  const adicionalEl = document.getElementById("select-adicional");
  const recheio = recheioEl.value;
  const adicional = adicionalEl.value;

  if (!tamanho) { alert("Escolha o tamanho do bolo."); return; }
  if (!massa) { alert("Escolha a massa do bolo."); return; }
  if (!recheio) { alert("Escolha o recheio."); return; }

  let label = `Bolo ${tamanho.value} (R$${tamanho.price}) — Massa ${massa.value} — Recheio ${recheio}`;
  if (adicional) label += ` — Adicional: ${adicional}`;

  cart.push({ type: "bolo", price: tamanho.price, label });
  saveCart();
  renderCart();

  document.querySelectorAll("#pill-tamanho .pill, #pill-massa .pill").forEach(p => p.classList.remove("active"));
  recheioEl.value = "";
  adicionalEl.value = "";
});

document.getElementById("add-docinhos")?.addEventListener("click", () => {
  const qtyEl = document.getElementById("qty-docinhos");
  const qty = Number(qtyEl.value);
  if (!qty || qty < 1) { alert("Informe a quantidade de docinhos."); return; }
  cart.push({ type: "docinhos", price: 0, label: `Docinhos — ${qty} unidades (valor a combinar)` });
  saveCart();
  renderCart();
  qtyEl.value = "";
});

document.getElementById("add-cupcakes")?.addEventListener("click", () => {
  const qtyEl = document.getElementById("qty-cupcakes");
  const qty = Number(qtyEl.value);
  if (!qty || qty < 1) { alert("Informe a quantidade de cupcakes."); return; }
  cart.push({ type: "cupcakes", price: 0, label: `Cupcakes — ${qty} unidades (valor a combinar)` });
  saveCart();
  renderCart();
  qtyEl.value = "";
});

renderCart();
