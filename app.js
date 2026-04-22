// Hub launcher: fetches tools.json and renders tiles.
const grid = document.getElementById("grid");
const empty = document.getElementById("empty");
const refreshBtn = document.getElementById("refresh");

async function loadTools() {
  grid.innerHTML = "";
  try {
    const res = await fetch(`./tools.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { tools } = await res.json();
    if (!tools?.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    for (const tool of tools) grid.appendChild(renderTile(tool));
  } catch (err) {
    empty.hidden = false;
    empty.textContent = `Failed to load tools: ${err.message}`;
  }
}

function renderTile({ name, description, path, emoji }) {
  const a = document.createElement("a");
  a.className = "tile";
  a.href = path;
  a.innerHTML = `
    <div class="emoji">${emoji ?? "🧩"}</div>
    <div>
      <div class="name"></div>
      <div class="desc"></div>
    </div>
  `;
  a.querySelector(".name").textContent = name;
  a.querySelector(".desc").textContent = description ?? "";
  return a;
}

refreshBtn.addEventListener("click", loadTools);

// Register service worker for offline + install prompt.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("SW registration failed:", err);
    });
  });
}

loadTools();
