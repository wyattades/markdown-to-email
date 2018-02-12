(() => {
  
  const styles = 'color:#444444;margin:0 0 10px 0;padding:0;font-size:10pt;font-family:Open Sans,sans-serif;font-weight:400';

  // There can be no '\n' in the following string
  const $link = (label, url) => `<a href="${url}" target="_blank">${label}</a>`;
    
  const $title = str => `\
<p style="${styles}text-align:justify">\
<strong>${str}</strong>\
</p>`;

  const ender = (str, end) => {
    let hasEnd = false;
    if (str.endsWith(end)) {
      str = str.substr(0, str.length - end.length);
      hasEnd = true;
    }
    return [ str, hasEnd ];
  };

  const addBreaks = (str) => {
    return str.split('\n').map(s => {
      const [ _str, shouldBold ] = ender(s, '+');
      return shouldBold ? `<strong>${_str}</strong>` : _str;
    }).join('<br/>');
  };

  const $list = (strs, notList) => {

    if (strs.length === 0) {
      console.log('Must provide atleast one string');
      return '';
    }

    if (notList) {
      return `\
<p style="${styles}">\
${addBreaks(strs[0])}\
</p>`;
    }

    const items = [];

    for (let str of strs) {
      items.push(`\
<li style="${styles}">\
${addBreaks(str)}\
</li>`);
    }

    return `\
<ul>\
${items.join('')}\
</ul>`;
  };

  const markupToEmail = (markup) => new Promise((resolve, reject) => {

    markup = markup.trim();
    if (markup.length === 0) return resolve('');

    const sections = markup
      .replace(/\r/g, '')
      .replace(/<(\/?)b>/g, (match, closer) => `<${closer}strong>`)
      .replace(/\[(.*?)\]\{(.*?)\}/g, (match, label, url) => {
        if (label.trim().length === 0) label = url;
        return $link(label, url);
      })
      .split('\n\n\n');

    const pieces = [];

    for (let section of sections) {
      const lines = section.split('\n\n');

      const [ str, notList ] = ender(lines[0], '-');
      lines[0] = str;

      pieces.push($title(lines[0]));
      pieces.push($list(lines.slice(1), notList));
    }

    const result = pieces.join('');

    resolve(result);
    
  });

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = markupToEmail;
  else
    window.markupToEmail = markupToEmail;

})();
