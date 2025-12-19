/**
 * @file Manager for working with BitShares nodes.
 * @copyright 2025-2025, @Techno
 */

/**
 * Checks availability and measures ping for a single node.
 * @param {string} url - WebSocket node address.
 * @param {number} timeout - Timeout for the check in milliseconds.
 * @returns {Promise<{url: string, ping: number | null}>} - Object with check result.
 */
function checkNode(url, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let ws;

    try {
      ws = new WebSocket(url);
    } catch (e) {
      // Error may occur if URL is invalid
      console.warn(`[NodeManager] Error creating WebSocket for ${url}:`, e);
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
 * Checks a list of nodes, sorts them by ping, and returns the complete result.
 * @param {Array<{url: string, location: string, isPersonal?: boolean}>} nodes - Array of node objects.
 * @returns {Promise<Array<{url: string, location: string, ping: number | null, isPersonal?: boolean}>>}
 */
async function checkNodes(nodes) {
  console.log(`[NodeManager] Starting check of ${nodes.length} nodes.`);
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

  // Sorting: working nodes with lowest ping first, then non-working.
  checkedNodes.sort((a, b) => {
    if (a.ping === null && b.ping === null) return 0;
    if (a.ping === null) return 1;
    if (b.ping === null) return -1;
    return a.ping - b.ping;
  });

  console.log('[NodeManager] Node check completed.');
  return checkedNodes;
}

export { checkNodes, checkNode };
