(() => {

  const STYLES = 'color:#444444;margin:0 0 10px 0;padding:0;font-size:10pt;font-family:Open Sans,sans-serif;font-weight:400';  
  const SHOWDOWN_SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js';
  const OPTIONS = {
    noHeaderId: true,
    tables: false,
    simpleLineBreaks: true,
    encodeEmails: false,
  };

  const loadScriptAsync = (uri) => new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = uri;
    el.async = true;
    el.onload = () => resolve();
    document.head.appendChild(el);
  });

  let converter;

  const markdownToEmail = (markdown) => 
    (converter ? Promise.resolve() : loadScriptAsync(SHOWDOWN_SCRIPT).then(() => {
      converter = new window.showdown.Converter(OPTIONS);
    }))
    .then(() => {
      return converter.makeHtml(markdown)
      .replace(/<(p|li)>/g, (_, tag) => `<${tag} style="${STYLES}">`)            
      .replace(/<pre>\s*<code>(.*?)<\/code>\s*<\/pre>/gs, (_, text) => {
        const paragraphs = text
        .trim()
        .split(/\n{2,}/)
        .map((t) => `<p style="${STYLES}">${t.replace(/\n/g, '<br/>')}</p>`)
        .join('');
        
        return `<ul>${paragraphs}</ul>`
      })
      .replace(/<(\/?)h[1-6]>/g, (_, closer) => {
        return !closer ?
          `<p style="${STYLES};text-align:justify"><strong>` :
          `</strong></p>`;
      })
      // .replace('\n', '');
    });

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = markdownToEmail;
  else
    window.markdownToEmail = markdownToEmail;

})();
