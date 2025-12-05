export default async function handler(req, res) {
  const { title, description, link } = req.body;

  try {
    const prompt = `
다음 뉴스 기사의 제목과 요약문을 기반으로 핵심 내용을 2~3문장으로 명확하게 요약해줘.

제목: ${title}
요약문: ${description}
원문 링크: ${link}

출력 형식: 깔끔한 문장 형태의 요약문만 제공.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();
    const text = result.choices[0].message.content;

    res.status(200).json({ text });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
