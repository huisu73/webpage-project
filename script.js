async function getNews(keyword) {
  try {
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword })
    });

    const data = await res.json();
    renderNews(data.items);

  } catch (e) {
    document.getElementById("errorMsg").textContent = "오류 발생: " + e.message;
  }
}

async function summarize(title, description, link) {
  const res = await fetch("/api/summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, link })
  });

  return await res.json();
}

async function renderNews(items) {
  const container = document.getElementById("resultCard");
  container.innerHTML = "";

  for (const item of items) {
    const cleanTitle = item.title.replace(/<[^>]+>/g, "");
    const cleanDesc = item.description.replace(/<[^>]+>/g, "");

    const summary = await summarize(cleanTitle, cleanDesc, item.link);

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-title">${cleanTitle}</div>
      <div class="card-summary">${summary.text}</div>
      <a href="${item.link}" target="_blank" class="card-link">원문 보기</a>
    `;

    container.appendChild(card);
  }
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = searchInput.value.trim();
  if (keyword) getNews(keyword);
});

