(() => {
  const version = '20260607-3';
  const partUrls = [1, 2, 3, 4].map((part) => `./assistant.bundle.${version}.${String(part).padStart(2, '0')}.txt?v=${version}`);

  Promise.all(partUrls.map((url) => fetch(url).then((response) => {
    if (!response.ok) throw new Error(`Cannot load ${url}`);
    return response.text();
  }))).then((chunks) => {
    const base64 = chunks.join('').replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const code = new TextDecoder('utf-8').decode(bytes);
    (0, eval)(code);
  }).catch((error) => {
    console.error('Mee Heng assistant failed to load', error);
  });
})();
