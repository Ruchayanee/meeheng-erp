(() => {
  const version = '20260607-3';
  const partUrls = [1, 2, 3, 4].map((part) => `./assistant.bundle.${version}.${String(part).padStart(2, '0')}.txt?v=${version}`);
  const activateAppTab = (tabId) => {
    document.querySelectorAll('.tab').forEach((button) => button.classList.toggle('active', button.dataset.tab === tabId));
    document.querySelectorAll('.panel').forEach((panel) => panel.classList.toggle('active', panel.id === tabId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (typeof window.activateTab !== 'function') window.activateTab = activateAppTab;

  Promise.all(partUrls.map((url) => fetch(url).then((response) => {
    if (!response.ok) throw new Error(`Cannot load ${url}`);
    return response.text();
  }))).then((chunks) => {
    const base64 = chunks.join('').replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const code = new TextDecoder('utf-8').decode(bytes);
    (0, eval)(code);
    const assistantTab = document.querySelector('.tab[data-tab="assistant"]');
    if (assistantTab && assistantTab.dataset.assistantTabBound !== 'true') {
      assistantTab.dataset.assistantTabBound = 'true';
      assistantTab.addEventListener('click', () => activateAppTab('assistant'));
    }
  }).catch((error) => {
    console.error('Mee Heng assistant failed to load', error);
  });
})();
