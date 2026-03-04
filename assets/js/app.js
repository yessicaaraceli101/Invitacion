/**
 * CONFIGURACIÓN RÁPIDA
 * 1) Cambia la fecha del evento (ISO) y el número de WhatsApp
 */
const CONFIG = {
  eventISO: "2026-12-15T20:00:00-03:00",   // Fecha/hora del evento (Paraguay -03:00)
  whatsappNumber: "595981000000",          // Cambia a tu número: ejemplo 59598xxxxxxx (sin +)
  eventTitle: "María & Juan • Boda",
  eventLocation: "Salón Los Cedros, Carapeguá",
  googleMapsLink: "https://www.google.com/maps?q=Sal%C3%B3n%20Los%20Cedros%20Carapegu%C3%A1",
};

// Set maps link
const mapsBtn = document.getElementById("mapsBtn");
if (mapsBtn) mapsBtn.href = CONFIG.googleMapsLink;

// Countdown
const target = new Date(CONFIG.eventISO).getTime();

function pad(n){ return String(n).padStart(2, "0"); }

function tick(){
  const now = Date.now();
  let diff = target - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  const d = document.getElementById("cdDays");
  const h = document.getElementById("cdHours");
  const m = document.getElementById("cdMins");
  const s = document.getElementById("cdSecs");

  if (d) d.textContent = pad(days);
  if (h) h.textContent = pad(hours);
  if (m) m.textContent = pad(mins);
  if (s) s.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

// Gallery modal
const imgModal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
if (imgModal) {
  imgModal.addEventListener("show.bs.modal", (e) => {
    const btn = e.relatedTarget;
    const src = btn?.getAttribute("data-img");
    if (src && modalImg) modalImg.src = src;
  });
}

// RSVP form -> WhatsApp
const form = document.getElementById("rsvpForm");
const copyBtn = document.getElementById("copyBtn");

function buildMessage(data){
  const lines = [
    `Hola! Confirmo asistencia para: *${CONFIG.eventTitle}*`,
    `Nombre: ${data.nombre}`,
    `Asistencia: ${data.asistencia}`,
    `Cantidad: ${data.cantidad || "1"}`,
    data.obs ? `Obs: ${data.obs}` : null,
    `Lugar: ${CONFIG.eventLocation}`,
  ].filter(Boolean);

  return lines.join("\n");
}

function openWhatsApp(message){
  const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function getFormData(){
  const fd = new FormData(form);
  return {
    nombre: (fd.get("nombre") || "").toString().trim(),
    asistencia: (fd.get("asistencia") || "").toString().trim(),
    cantidad: (fd.get("cantidad") || "1").toString().trim(),
    obs: (fd.get("obs") || "").toString().trim(),
  };
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Bootstrap validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = getFormData();
    const msg = buildMessage(data);
    openWhatsApp(msg);
  });
}

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    if (!form) return;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const msg = buildMessage(getFormData());
    try {
      await navigator.clipboard.writeText(msg);
      copyBtn.innerHTML = '<i class="bi bi-check2 me-2"></i> Mensaje copiado';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="bi bi-copy me-2"></i> Copiar mensaje';
      }, 1600);
    } catch {
      alert("No se pudo copiar. Intenta desde otro navegador.");
    }
  });
}
