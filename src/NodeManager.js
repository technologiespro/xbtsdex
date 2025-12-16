/**
 * @file Менеджер для работы с нодами BitShares.
 * @copyright 2025-2025, @Techno
 */

/**
 * Проверяет доступность и измеряет пинг для одной ноды.
 * @param {string} url - Адрес WebSocket ноды.
 * @param {number} timeout - Таймаут для проверки в миллисекундах.
 * @returns {Promise<{url: string, ping: number | null}>} - Объект с результатом проверки.
 */
function checkNode(url, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let ws;

    try {
      ws = new WebSocket(url);
    } catch (e) {
      // Ошибка может возникнуть, если URL некорректен
      console.warn(`[NodeManager] Ошибка создания WebSocket для ${url}:`, e);
      resolve({ url, ping: null });
      return;
    }

    const timer = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        resolve({ url, ping: null });
      }
    }, timeout);

    ws.onopen = () => {
      clearTimeout(timer);
      const ping = Date.now() - startTime;
      ws.close();
      resolve({ url, ping });
    };

    ws.onerror = () => {
      clearTimeout(timer);
      ws.close();
      resolve({ url, ping: null });
    };
  });
}

/**
 * Проверяет список нод, сортирует их по пингу и возвращает полный результат.
 * @param {Array<{url: string, location: string, isPersonal?: boolean}>} nodes - Массив объектов нод.
 * @returns {Promise<Array<{url: string, location: string, ping: number | null, isPersonal?: boolean}>>}
 */
async function checkNodes(nodes) {
  console.log(`[NodeManager] Начинаю проверку ${nodes.length} нод.`);
  const results = await Promise.all(
    nodes.map(node => checkNode(node.url))
  );

  const checkedNodes = nodes.map(node => {
    const result = results.find(r => r.url === node.url);
    return {
      ...node,
      ping: result ? result.ping : null,
    };
  });
  
  // Сортировка: рабочие ноды с наименьшим пингом в начале, потом нерабочие.
  checkedNodes.sort((a, b) => {
    if (a.ping === null && b.ping === null) return 0;
    if (a.ping === null) return 1;
    if (b.ping === null) return -1;
    return a.ping - b.ping;
  });

  console.log('[NodeManager] Проверка нод завершена.');
  return checkedNodes;
}

export { checkNodes, checkNode };
