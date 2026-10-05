function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return [...root.querySelectorAll(sel)]; }

function storageKey(prefix, key){ return `${prefix}::${key}`; }

function initAutosave(prefix){
  const fields = qsa("[data-save]");
  for(const el of fields){
    const key = el.getAttribute("data-save");
    const saved = localStorage.getItem(storageKey(prefix, key));
    if(saved !== null){
      if(el.type === "checkbox") el.checked = saved === "1";
      else el.value = saved;
    }

    const handler = () => {
      if(el.type === "checkbox"){
        localStorage.setItem(storageKey(prefix, key), el.checked ? "1" : "0");
      } else {
        localStorage.setItem(storageKey(prefix, key), el.value);
      }
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  }
}

function initEditor(prefix){
  const template = qs("#starter");
  const editor = qs("#editor");
  const iframe = qs("#preview");

  if(!template || !editor || !iframe) return;

  const original = template.innerHTML.trim();
  const savedCode = localStorage.getItem(storageKey(prefix, "code"));

  editor.value = savedCode ?? original;

  const run = () => {
    iframe.srcdoc = editor.value;
    localStorage.setItem(storageKey(prefix, "code"), editor.value);
  };

  qs("#btnRun")?.addEventListener("click", run);

  qs("#btnReset")?.addEventListener("click", () => {
    editor.value = original;
    localStorage.removeItem(storageKey(prefix, "code"));
    run();
  });

  qs("#btnCopy")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(editor.value);
    const btn = qs("#btnCopy");
    const old = btn.textContent;
    btn.textContent = "Tersalin";
    setTimeout(() => btn.textContent = old, 900);
  });

  // run on load
  run();
}

function initResetAnswers(prefix){
  qs("#btnResetAnswers")?.addEventListener("click", () => {
    // hapus semua key milik prefix ini
    const keysToRemove = [];
    for(let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if(k && k.startsWith(prefix + "::")) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const prefix = document.body.getAttribute("data-page") || "lks";
  initEditor(prefix);
  initAutosave(prefix);
  initResetAnswers(prefix);
});