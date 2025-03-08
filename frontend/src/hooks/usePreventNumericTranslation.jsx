import { useEffect } from 'react';

function usePreventNumericTranslation() {
  useEffect(() => {
    // Regex explanation:
    // - ([$₹£€]?) optionally matches a currency symbol.
    // - (\d{1,3}(?:,\d{3})*|\d+) matches numbers with optional thousand separators.
    // - (?:\.\d+)? optionally matches a decimal part.
    const currencyRegex = /([$₹£€]?(\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)/g;

    // This function will wrap each numeric match inside a text node.
    const wrapNumericMatches = (node) => {
      const originalText = node.textContent;
      const fragments = [];
      let lastIndex = 0;
      let match;

      while ((match = currencyRegex.exec(originalText)) !== null) {
        // Append any text before the match
        if (match.index > lastIndex) {
          fragments.push(document.createTextNode(originalText.slice(lastIndex, match.index)));
        }
        // Create a span to wrap the numeric match
        const span = document.createElement('span');
        span.setAttribute('translate', 'no');
        span.className = 'notranslate';
        span.textContent = match[0];
        fragments.push(span);
        lastIndex = currencyRegex.lastIndex;
      }
      // Append any remaining text after the last match
      if (lastIndex < originalText.length) {
        fragments.push(document.createTextNode(originalText.slice(lastIndex)));
      }

      // Replace the original text node with the new fragments
      if (fragments.length) {
        const parent = node.parentNode;
        fragments.forEach(fragment => parent.insertBefore(fragment, node));
        parent.removeChild(node);
      }
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            // Process only text nodes
            if (node.nodeType === Node.TEXT_NODE) {
              // If the node contains at least one digit or currency symbol,
              // process it for wrapping.
              if (/[$₹£€]?\d/.test(node.textContent)) {
                wrapNumericMatches(node);
              }
            }
          });
        }
      }
    });

    // Start observing the entire body for added nodes.
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}

export default usePreventNumericTranslation;
