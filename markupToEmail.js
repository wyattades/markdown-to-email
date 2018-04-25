(() => {

  // List types
  const INDENTED = 0,
        UNINDENTED = 1,
        BULLETED = 2;
  
  const styles = 'color:#444444;margin:0 0 10px 0;padding:0;font-size:10pt;font-family:Open Sans,sans-serif;font-weight:400';

  const ender = (str, end) => {
    if (str.endsWith(end)) {
      return [ str.substr(0, str.length - end.length), true ];
    }
    return [ str, false ];
  };

  const addBreaks = (str) => {
    return str.split('\n').map(s => {
      const [ _str, shouldBold ] = ender(s, '+');
      return shouldBold ? `<strong>${_str}</strong>` : _str;
    }).join('<br/>');
  };

  // There can be no '\n' in the following string
  const $link = (label, url) => `<a href="${url}" target="_blank">${label}</a>`;
    
  const $title = str => `\
<p style="${styles}text-align:justify">\
<strong>${addBreaks(str)}</strong>\
</p>`;

  const $list = (strs, type) => {

    if (strs.length === 0) {
      console.log('Must provide atleast one string');
      return '';
    }

    const items = [];

    if (type !== BULLETED) {
      for (let str of strs) {
        items.push(`\
<p style="${styles}">\
${addBreaks(str)}\
</p>`);
      }
    } else {
      for (let str of strs) {
        items.push(`\
<li style="${styles}">\
${addBreaks(str)}\
</li>`);
      }
    }

    if (type === UNINDENTED) {
      return items.join('');
    } else {
      return `\
<ul>\
${items.join('')}\
</ul>`;
    }

  };

  const markupToEmail = (markup) => new Promise((resolve, reject) => {

    markup = markup.trim();
    if (markup.length === 0) return resolve('');

    const sections = markup
      .split(/\n/).map((line) => line.trim()).join('\n')
      // .replace(/\r/g, '')
      .replace(/<(\/?)b>/g, (match, closer) => `<${closer}strong>`)
      .replace(/\[(.*?)\]\{(.+?)\}/g, (match, label, url) => {
        if (label.trim().length === 0) label = url;
        return $link(label, url);
      })
      .split('\n\n\n');

    const pieces = [];

    for (let section of sections) {
      const lines = section.split('\n\n');

      let type = BULLETED,
          hasEnder;
      const backup = lines[0];
      [ lines[0], hasEnder ] = ender(lines[0], '-!');
      if (hasEnder) {
        type = INDENTED;
      } else {
        [ lines[0], hasEnder ] = ender(lines[0], '-');
        if (hasEnder) type = UNINDENTED;
      }
      console.log(backup, type);

      pieces.push($title(lines[0]));
      pieces.push($list(lines.slice(1), type));
    }

    const result = pieces.join('');

    resolve(result);
    
  });

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = markupToEmail;
  else
    window.markupToEmail = markupToEmail;

})();
