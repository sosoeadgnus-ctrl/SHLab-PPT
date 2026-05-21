(function () {
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const progress = document.getElementById("progress");
  const counter = document.getElementById("counter");
  const blackout = document.getElementById("blackout");
  const notesPanel = document.getElementById("speakerNotes");
  const total = slides.length;
  let current = readHash();
  let notesVisible = false;

  function readHash() {
    const raw = window.location.hash.replace("#", "");
    const parsed = Number.parseInt(raw, 10);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= total) {
      return parsed - 1;
    }
    return 0;
  }

  function goTo(index, updateHash = true) {
    current = Math.max(0, Math.min(total - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
      slide.setAttribute("aria-hidden", i === current ? "false" : "true");
    });
    counter.textContent = `${current + 1} / ${total}`;
    progress.style.width = `${((current + 1) / total) * 100}%`;
    document.title = `${String(current + 1).padStart(2, "0")} · ${slides[current].dataset.title || "SHLab"}`;
    updateNotes();
    if (updateHash) {
      history.replaceState(null, "", `#${current + 1}`);
    }
  }

  function next() {
    goTo(current + 1);
  }

  function previous() {
    goTo(current - 1);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function toggleBlackout(forceOff) {
    const shouldShow = forceOff ? false : !blackout.classList.contains("active");
    blackout.classList.toggle("active", shouldShow);
    blackout.setAttribute("aria-hidden", shouldShow ? "false" : "true");
  }

  function toggleNotes() {
    notesVisible = !notesVisible;
    updateNotes();
  }

  function updateNotes() {
    const notes = slides[current].querySelector(".notes")?.textContent?.trim() || "";
    notesPanel.textContent = notes;
    notesPanel.classList.toggle("active", notesVisible && Boolean(notes));
  }

  function scaleDeck() {
    const padding = 24;
    const scale = Math.min(
      (window.innerWidth - padding) / 1366,
      (window.innerHeight - padding) / 768
    );
    deck.style.transform = `translate(-50%, -50%) scale(${Math.max(0.1, scale)})`;
  }

  window.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "ArrowRight" || key === "PageDown" || key === " ") {
      event.preventDefault();
      next();
    } else if (key === "ArrowLeft" || key === "PageUp") {
      event.preventDefault();
      previous();
    } else if (key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (key === "End") {
      event.preventDefault();
      goTo(total - 1);
    } else if (key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    } else if (key.toLowerCase() === "b") {
      event.preventDefault();
      toggleBlackout();
    } else if (key === "Escape") {
      toggleBlackout(true);
    } else if (key.toLowerCase() === "n") {
      event.preventDefault();
      toggleNotes();
    }
  });

  window.addEventListener("hashchange", () => {
    goTo(readHash(), false);
  });

  window.addEventListener("resize", scaleDeck);

  scaleDeck();
  goTo(current, !window.location.hash);
})();
