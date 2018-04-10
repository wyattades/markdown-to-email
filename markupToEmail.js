(() => {
  
  const styles = 'color:#444444;margin:0 0 10px 0;padding:0;font-size:10pt;font-family:Open Sans,sans-serif;font-weight:400';

  // There can be no '\n' in the following string
  const $link = (label, url) => `<a href="${url}" target="_blank">${label}</a>`;
    
  const $title = str => `\
<p style="${styles}text-align:justify">\
<strong>${str}</strong>\
</p>`;

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

  const formatLine = (line) => {
    // Replace bold
    // Replace italics
    return line.trim();
  };


  const markupToEmail = (markup) => new Promise((resolve, reject) => {

    markup = markup.trim();
    if (markup.length === 0) return resolve('');

    const lines = markup.split('\n').map(formatLine);

    let pieces = [];


    let section;
    const sectionsRegex = /[\t ]*(\#|\+|(?:[\n\r]{2,}))[\t ]*([^\n\r]*)[\n\r]{2,}/g;    
    while((section = sectionsRegex.exec(markup)) !== null) {
      console.log(section);
      const type = section[1].length === 1 && section[1];
      const sectionText = section[2].replace(/[\n\r]+/, '<br/>');
      pieces.push(`<p><strong>${type}</strong><br/>${sectionText}</p>`)
    }

    let paragraph = [];
    let prev = 'blank'; // null, para, bullet

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      let current;
      if (line.length === 0) current = 'blank';
      else if (isHeader(line)) current = 'header';
      else if (isBulletHead(line)) current = 'bullethead';
      else current = 'line';

      if (current !== 'blank') line = formatLine(line);

      if (current === 'bullethead') {

      }

      if (current === 'line') {
        if (prev !== null) {
          paragraph.push(line);
        }
      } else {
        if (prev === 'bullet') {
          pieces.push(formatBullet(paragraph));
          paragraph = [];
        } else if (prev === 'para') {
          pieces.push(formatParagraph(paragraph));
          paragraph = [];
        }

        if (current === )
      }

      if (line.length === 0) {
        // blank
        prev = 'blank';
        // if (prev === 'listhead' || prev === 'listel') {
        //   if (list.length > 0) {
        //     pieces.push(formatList(list));
        //     list = [];
        //   }
        // } else if (prev === 'listel') {
          
        // } else if (prev === 'para') {
        //   if (paragraph.length > 0) {
        //     pieces.push(formatParagraph(paragraph));
        //     paragraph = [];
        //   }
        // } else if (prev === 'blank') {
        //   // do nothing
        // }
      } else if (isListElement(line)) {
        isList = true;
        list.push([ line ]);
      } else if (isHeader(line)) {
        list.push(formatHeader(line));
      } else {
        if (prev === 'listhead') {
          
        } else if (prev === 'listel') {
          if (list.length > 0) {
            pieces.push(formatList(list));
            list = [];
          }
        } else if (prev === 'listel') {
          
        } else if (prev === 'para') {
          if (paragraph.length > 0) {
            pieces.push(formatParagraph(paragraph));
            paragraph = [];
          }
        } else if (prev === 'blank') {
          // do nothing
        }
      }
    }

    // const sections = markup
    //   .replace(/\r/g, '')
    //   .replace(/<(\/?)b>/g, (match, closer) => `<${closer}strong>`)
    //   .replace(/\[(.*?)\]\{(.+?)\}/g, (match, label, url) => {
    //     if (label.trim().length === 0) label = url;
    //     return $link(label, url);
    //   })
    //   .split('\n\n\n');

    // const pieces = [];

    // for (let section of sections) {
    //   const lines = section.split('\n\n');

    //   const [ str, notList ] = ender(lines[0], '-');
    //   lines[0] = str;

    //   pieces.push($title(lines[0]));
    //   pieces.push($list(lines.slice(1), notList));
    // }

    const result = pieces.join('');

    resolve(result);
    
  });

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = markupToEmail;
  else
    window.markupToEmail = markupToEmail;

})();
