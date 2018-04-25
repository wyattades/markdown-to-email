(() => {

  const lastMarkup = localStorage.getItem('last-markup-value');
  
  const $output = document.getElementById('html-output');
  const $preview = document.getElementById('html-preview');
  const $links = {};
  document.querySelectorAll('#menu>a[data-hashid]').forEach(($link) => {
    $links[$link.dataset.hashid] = $link;
  });

  const editor = ace.edit('editor', {
    selectionStyle: 'text',
  });

  const EditSession = ace.require('ace/edit_session').EditSession;
  
  const sessions = {};

  for (const hashid in $links) {
    const session = new EditSession('', 'ace/mode/markdown');
    session.setOption('indentedSoftWrap', false);
    session.setUseWrapMode(true);
    session.setUndoManager(new ace.UndoManager());

    sessions[hashid] = session;
    
    if (hashid === 'session') {
      lastMarkup && session.setValue(lastMarkup);
    } else {
      fetch(`examples/${hashid}.txt`)
      .then(res => res.text())
      .then(text => session.setValue(text))
      .catch(console.error);
    }
  }

  // Get valid link hash id
  let hash = window.location.hash;
  if (hash && hash.startsWith('#')) hash = hash.substring(1);
  let active = hash;
  if (!(hash in $links)) active = 'session';
  
  const onChange = () => {
    const markup = editor.session.getValue();

    if (active === 'session')
      localStorage.setItem('last-markup-value', markup);

    window.markupToEmail(markup)
    .then(html => {
      $preview.innerHTML = html;
      $output.classList.remove('error');
      $output.value = html;
    })
    .catch(err => {
      console.error(err);
      $output.classList.add('error');
      $output.value = 'Error: ' + err;
    });
  };

  const setActive = (hashid) => {

    const newHash = hashid ? `#${hashid}` : '';
    if (window.history.replaceState)
      window.history.replaceState(null, null, newHash);
    else
      window.location.hash = newHash;

    $links[active].classList.remove('active');
    $links[hashid].classList.add('active');
    active = hashid;
    editor.setSession(sessions[hashid]);
    onChange();
  };

  setActive(active);
  for (const hashid in $links) $links[hashid].onclick = () => setActive(hashid);

  let timerId = null;

  editor.on('change', () => {
    clearTimeout(timerId);
    timerId = setTimeout(onChange, 500);
  });

})();
