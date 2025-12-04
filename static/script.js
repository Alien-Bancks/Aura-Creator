document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");
  const imagePreview = document.getElementById("imagePreview");
  const uploadPlaceholder = document.getElementById("uploadPlaceholder");
  const generateBtn = document.getElementById("generateBtn");
  const platformSelect = document.getElementById("platformSelect");
  const taskSelect = document.getElementById("taskSelect");
  const promptContainer = document.getElementById("promptContainer");

  const loadingState = document.getElementById("loadingState");
  const emptyState = document.getElementById("emptyState");
  const premiumLock = document.getElementById("premiumLock");
  const visualContainer = document.getElementById("visualContainer");
  const rawTextArea = document.getElementById("rawTextArea");

  const btnVisual = document.getElementById("btnVisual");
  const btnText = document.getElementById("btnText");
  const btnCopy = document.getElementById("btnCopy");

  let currentFile = null;
  let currentImgUrl = null;
  let lastGeneratedText = "";

  const tasks = {
    instagram: [
      { val: "legenda", text: "Legenda Viral" },
      { val: "hashtags", text: "Hashtags" },
      { val: "analise_visual", text: "Auditoria Feed" },
    ],
    youtube: [
      { val: "titulo", text: "Títulos Clickbait" },
      { val: "ideias", text: "Ideias de Vídeo" },
    ],
    linkedin: [
      { val: "post", text: "Post Profissional" },
      { val: "artigo", text: "Estrutura Artigo" },
    ],
    twitter: [
      { val: "tweet", text: "Tweet" },
      { val: "thread", text: "Thread" },
    ],
    tiktok: [{ val: "roteiro", text: "Roteiro Viral" }],
    pinterest: [{ val: "titulo", text: "Títulos Pin" }],
    gerar_imagem: [{ val: "dalle", text: "🎨 Criar Arte (DALL-E)" }],
  };

  function updateTasks() {
    const p = platformSelect.value;
    const list = tasks[p] || tasks["instagram"];

    // Salvando a tarefa atual antes de limpar
    const previousTask = taskSelect.value;

    taskSelect.innerHTML = "";
    list.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.val;
      opt.textContent = t.text;
      taskSelect.appendChild(opt);
    });

    if (list.some((t) => t.val === previousTask)) {
      taskSelect.value = previousTask;
    }

    if (p === "gerar_imagem") {
      dropZone.classList.add("hidden");
      promptContainer.classList.remove("hidden");
    } else {
      dropZone.classList.remove("hidden");
      promptContainer.classList.add("hidden");
    }
  }

  platformSelect.addEventListener("change", updateTasks);
  updateTasks();

  dropZone.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    currentFile = file;
    currentImgUrl = URL.createObjectURL(file);

    mostrarPreviewImagem(currentImgUrl);
  });

  function mostrarPreviewImagem(url) {
    imagePreview.src = url;
    imagePreview.style.display = "block";
    uploadPlaceholder.style.display = "none";
    dropZone.classList.add("has-image");
  }

  generateBtn.addEventListener("click", async () => {
    const p = platformSelect.value;

    if (p !== "gerar_imagem" && !currentFile) {
      alert("Selecione uma imagem!");
      return;
    }

    emptyState.classList.add("hidden");
    premiumLock.classList.add("hidden");
    loadingState.classList.remove("hidden");
    visualContainer.classList.remove("hidden");
    document
      .querySelectorAll(".mockup-wrapper, .yt-grid, .generic-result")
      .forEach((e) => e.classList.add("hidden"));

    const fd = new FormData();
    fd.append("platform", p);
    fd.append("task", taskSelect.value);

    if (p !== "gerar_imagem") {
      fd.append("file", currentFile);
    } else {
      fd.append("file", new Blob([""], { type: "text/plain" }), "prompt.txt");
    }

    try {
      const res = await fetch("/aura/criar", { method: "POST", body: fd });
      const data = await res.json();

      if (data.erro) throw new Error(data.erro);

      const txt = data.resultado;

      exibirResultado(p, taskSelect.value, txt, currentImgUrl);
      setTimeout(loadHistory, 1000); // Recarrega histórico
    } catch (e) {
      alert("Erro: " + e.message);
    } finally {
      loadingState.classList.add("hidden");
    }
  });

  function exibirResultado(platform, task, text, imgUrl) {
    lastGeneratedText = text;

    loadingState.classList.add("hidden");
    emptyState.classList.add("hidden");
    premiumLock.classList.add("hidden");
    visualContainer.classList.remove("hidden");
    document
      .querySelectorAll(".mockup-wrapper, .yt-grid, .generic-result")
      .forEach((e) => e.classList.add("hidden"));

    if (text.includes("Recurso Premium")) {
      premiumLock.classList.remove("hidden");
      return;
    }

    const formatted = typeof marked !== "undefined" ? marked.parse(text) : text;
    rawTextArea.value = text;

    if (platform === "instagram") {
      document.getElementById("instaResultImg").src = imgUrl;
      document.getElementById("instaCaption").innerHTML = formatted;
      document.getElementById("instaMockup").classList.remove("hidden");
    } else if (platform === "youtube") {
      if (task === "titulo") {
        const grid = document.getElementById("youtubeGrid");
        grid.innerHTML = "";

        let titles = text
          .split("\n")
          .filter((l) => l.trim().length > 5)
          .map((l) =>
            l
              .replace(/^\d+[\.\)]\s*/, "")
              .replace(/["*]/g, "")
              .trim()
          );
        if (titles.length === 0) titles = ["Ideia de Vídeo"];

        titles.slice(0, 5).forEach((title) => {
          grid.innerHTML += `
                        <div class="yt-card-small">
                            <div class="yt-thumb-wrapper">
                                <img src="${imgUrl}">
                                <span class="yt-time">12:34</span>
                            </div>
                            <div class="yt-details">
                                <div class="yt-avatar-small"></div>
                                <div class="yt-meta-text">
                                    <h4>${title}</h4>
                                    <p>Aura Creator • 25 mil visualizações</p>
                                </div>
                            </div>
                        </div>`;
        });
        grid.classList.remove("hidden");
      } else {
        document.getElementById("genericResult").innerHTML = formatted;
        document.getElementById("genericResult").classList.remove("hidden");
      }
    } else if (platform === "linkedin") {
      document.getElementById("linkedinResultImg").src = imgUrl;
      document.getElementById("linkedinCaption").innerHTML = formatted;
      document.getElementById("linkedinMockup").classList.remove("hidden");
    } else if (platform === "twitter") {
      document.getElementById("twitterResultImg").src = imgUrl;
      document.getElementById("twitterCaption").innerHTML = formatted;
      document.getElementById("twitterMockup").classList.remove("hidden");
    } else {
      document.getElementById("genericResult").innerHTML = formatted;
      document.getElementById("genericResult").classList.remove("hidden");
    }
  }

  async function loadHistory() {
    const grid = document.getElementById("historyGrid");
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      grid.innerHTML = "";

      if (data.length === 0) {
        grid.innerHTML =
          '<p style="color:#666; padding:20px;">Nenhum histórico ainda.</p>';
        return;
      }

      data.forEach((item) => {
        const div = document.createElement("div");
        div.className = "history-card";

        let cleanPath = item.image_path
          .replace("uploads/", "")
          .replace("uploads\\", "");
        let webPath = `/uploads/${cleanPath}`;

        let imgHTML =
          item.platform === "gerar_imagem"
            ? '<div style="height:120px;background:#333;color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;">TXT</div>'
            : `<img src="${webPath}" class="history-thumb">`;

        div.innerHTML = `
                    ${imgHTML}
                    <div class="history-meta">
                        <span class="badge" style="background:var(--primary);">${item.platform}</span>
                        <br><small style="color:#aaa;">${item.task_type}</small>
                    </div>`;

        div.onclick = () => {
          document.querySelector('[data-target="create-section"]').click();

          platformSelect.value = item.platform;
          updateTasks();
          taskSelect.value = item.task_type;

          if (item.platform !== "gerar_imagem") {
            currentImgUrl = webPath;
            mostrarPreviewImagem(webPath);

            currentFile = null;
          }

          exibirResultado(
            item.platform,
            item.task_type,
            item.result_text,
            webPath
          );
        };

        grid.appendChild(div);
      });
    } catch (e) {
      console.error("Erro histórico:", e);
    }
  }

  document.querySelectorAll(".menu-item[data-target]").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".menu-item")
        .forEach((i) => i.classList.remove("active"));
      document
        .querySelectorAll(".page-section")
        .forEach((s) => s.classList.remove("active-section"));
      item.classList.add("active");
      document
        .getElementById(item.dataset.target)
        .classList.add("active-section");

      if (item.dataset.target === "history-section") loadHistory();
    });
  });

  btnVisual.onclick = () => {
    visualContainer.classList.remove("hidden");
    rawTextArea.classList.add("hidden");
    btnVisual.classList.add("active");
    btnText.classList.remove("active");
  };
  btnText.onclick = () => {
    visualContainer.classList.add("hidden");
    rawTextArea.classList.remove("hidden");
    btnText.classList.add("active");
    btnVisual.classList.remove("active");
  };
  btnCopy.onclick = () => {
    navigator.clipboard.writeText(lastGeneratedText);
    alert("Copiado!");
  };
});
