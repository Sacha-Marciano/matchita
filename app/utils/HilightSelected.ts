const highlightSelectedText = async (
    docUrl: string,
    selectedText: string
  ): Promise<string> => {
    try {
      const res = await fetch(docUrl);
      const html = await res.text();
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
  
      // Get first 3 words from the selected text
      const firstThreeWords = selectedText.trim().split(/\s+/).slice(0, 3).join(" ");
      const regex = new RegExp(firstThreeWords.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");
  
      // Helper to walk all text nodes
      const walk = (node: Node) => {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
        let current: Node | null;
        while ((current = walker.nextNode())) {
          if (
            current.parentElement &&
            !["SCRIPT", "STYLE", "NOSCRIPT"].includes(current.parentElement.tagName)
          ) {
            const text = current.textContent || "";
            if (regex.test(text)) {
              const span = document.createElement("span");
              span.style.backgroundColor = "yellow";
              span.textContent = text;
              current.parentNode?.replaceChild(span, current);
              break; // only highlight the first match
            }
          }
        }
      };
  
      walk(doc.body);
  
      return doc.documentElement.outerHTML;
    } catch (err) {
      console.error("Error highlighting text:", err);
      return "<p>Failed to load or process document.</p>";
    }
  };
  
  export default highlightSelectedText;
  