const preview = document.getElementById('preview');
const logsList = document.getElementById('logs');

function log(action){
  const entry = { time: new Date().toLocaleString(), action };
  db.ref('UserLogs').push(entry);
}

function buildInlineHTML(){
  const html = document.getElementById('htmlInput').value || '';
  const css = document.getElementById('cssInput').value || '';
  const js = document.getElementById('jsInput').value || '';
  const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  return full;
}

function setPreview(htmlString){
  preview.srcdoc = htmlString;
}

document.getElementById('saveInline').addEventListener('click', async () => {
  const html = buildInlineHTML();
  await db.ref('Usuarios/data').set({
    renderHtml: html,
    updatedAt: Date.now()
  });
  setPreview(html);
  log('Publish konten baru');
  alert('Konten dipublish!');
});

// Load terakhir
db.ref('Usuarios/data/renderHtml').once('value').then(snap=>{
  const html = snap.val();
  if(html){ setPreview(html); }
});

// Show logs realtime
db.ref('UserLogs').on('child_added', (snap)=>{
  const li = document.createElement('li');
  const v = snap.val();
  li.textContent = `${v.time} — ${v.action}`;
  logsList.appendChild(li);
});
