/**
 * Candidats d'URL profondes dérivés des tokens d'une page.
 * Ce ne sont pas des verdicts verified : un agent doit confirmer le passage.
 */

function phpFunctionUrl(name) {
  const slug = String(name).replace(/_/g, '-');
  return `https://www.php.net/manual/en/function.${slug}.php`;
}

function rfcUrl(n) {
  return `https://www.rfc-editor.org/rfc/rfc${n}`;
}

function candidateSourcesForPage(rel, body) {
  const sources = [];
  const seen = new Set();
  const push = (s) => {
    if (!s.url || seen.has(s.url + s.claim_id)) return;
    seen.add(s.url + s.claim_id);
    sources.push(s);
  };

  if (rel.startsWith('02-php/') || rel.startsWith('03-symfony/') || rel.startsWith('03-easyadmin/')) {
    const fns = body.match(/\b([a-z][a-z0-9_]{2,})\s*\(/g) || [];
    const allow = new Set([
      'array_map',
      'array_filter',
      'password_hash',
      'htmlspecialchars',
      'json_encode',
      'preg_match',
      'str_contains',
      'declare',
    ]);
    for (const raw of fns) {
      const name = raw.replace(/\s*\($/, '');
      if (allow.has(name)) {
        push({
          url: phpFunctionUrl(name),
          section: `Manual: ${name}`,
          excerpt: `Documentation officielle de ${name}()`,
          claim_id: `c-php-${name}`,
          kind: 'candidate',
        });
      }
    }
  }

  const rfcs = body.match(/\bRFC\s*(\d{3,5})\b/gi) || [];
  for (const r of rfcs) {
    const n = r.replace(/\D/g, '');
    push({
      url: rfcUrl(n),
      section: `RFC ${n}`,
      excerpt: `Texte de la RFC ${n} sur rfc-editor.org`,
      claim_id: `c-rfc-${n}`,
      kind: 'candidate',
    });
  }

  if (/Wireshark|tshark|display filter|capture filter/i.test(body)) {
    push({
      url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html',
      section: '6.4. Building Display Filter Expressions',
      excerpt: 'Display filters use a different syntax than capture filters.',
      claim_id: 'c-ws-display-filter',
      kind: 'candidate',
    });
    push({
      url: 'https://www.tcpdump.org/manpages/pcap-filter.7.html',
      section: 'pcap-filter(7)',
      excerpt: 'pcap-filter - packet filter syntax (BPF)',
      claim_id: 'c-bpf',
      kind: 'candidate',
    });
  }

  if (/Ansible/i.test(body) && rel.startsWith('ansible/')) {
    push({
      url: 'https://docs.ansible.com/ansible/latest/reference_appendices/release_and_maintenance.html',
      section: 'Release and maintenance',
      excerpt: 'Ansible community package and ansible-core support matrix',
      claim_id: 'c-ansible-support',
      kind: 'candidate',
    });
  }

  return sources.slice(0, 8);
}

module.exports = { phpFunctionUrl, rfcUrl, candidateSourcesForPage };
