export const sendWithAuth = async (url: string, data: any) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    keepalive: true, // ✅ 언로드 시에도 작동
  });
};