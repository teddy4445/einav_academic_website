(async function () {
  try {
    const res = await fetch('/data/jsons/global-seo.json', { cache: 'no-store' });
    const seo = await res.json();

    const title = (seo?.title || 'Einav Peretz Andersson').trim();
    const desc  = (seo?.description || '').trim();
    const kws   = (seo?.keywords || []).join(', ');
    const site  = seo?.site || {};
    const url   = (site.url || window.location.origin).replace(/\/$/, '');
    const fullUrl = url + window.location.pathname;

    // <title>
    if (document.title.trim() === '' || document.title.includes('Einav')) {
      document.title = title;
    }

    // Meta tags
    function setMeta(name, content) {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    setMeta('description', desc);
    setMeta('keywords', kws);
    setMeta('author', site.author || 'Einav Peretz Andersson');

    // Open Graph
    function setOG(property, content) {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }
    setOG('og:type', 'website');
    setOG('og:title', title);
    setOG('og:description', desc);
    setOG('og:url', fullUrl);

    // Twitter Cards
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', desc);

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullUrl);

    // JSON-LD Person schema
    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Dr. Einav Peretz Andersson",
      "description": desc,
      "url": url,
      "knowsAbout": [
        "Digital Transformation",
        "Strategy Making and Implementation",
        "AI and Organizational Decision Making",
        "AI, New Business Models and Socio-Economic Impacts",
        "Sustainable Health",
        "Digital Health",
        "Innovation",
        "Digital Ecosystems",
        "Platforms"
      ]
    };
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify(person);
    document.head.appendChild(ld);
  } catch (e) {
    console.warn('SEO init error', e);
  }
})();

