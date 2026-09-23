export async function sendMessage({
  apiUrl,
  idInstance,
  apiTokenInstance,
  chatId,
  message,
}) {
  const url =
    `${apiUrl}/waInstance${idInstance}` +
    `/sendMessage/${apiTokenInstance}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId,
      message,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.description ||
        "Failed to send message"
    );
  }

  return data;
}

export async function receiveNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
}) {
  const url =
    `${apiUrl}/waInstance${idInstance}` +
    `/receiveNotification/${apiTokenInstance}?receiveTimeout=60`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Receive notification failed: ${response.status}`
    );
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

export async function deleteNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
  receiptId,
}) {
  const url =
    `${apiUrl}/waInstance${idInstance}` +
    `/deleteNotification/${apiTokenInstance}/${receiptId}`;

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Delete notification failed: ${response.status}`
    );
  }

  return await response.json();
}
