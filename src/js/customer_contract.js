function formatCurrency(v){
  return (Number(v)||0).toLocaleString('vi-VN') + ' ₫';
}
function yyyymmddToLocale(dstr){
  if(!dstr) return '';
  const d = new Date(dstr);
  return d.toLocaleDateString('vi-VN');
}
function slugifyName(name){
  // remove diacritics, spaces, non-word
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'').replace(/[^\w]/g,'');
}

const form = document.getElementById('contractForm');
const fullNameEl = document.getElementById('fullName');
const idNumberEl = document.getElementById('idNumber');
const phoneEl = document.getElementById('phone');
const signDateEl = document.getElementById('signDate');
const amountEl = document.getElementById('amount');
const durationEl = document.getElementById('duration');
const termsEl = document.getElementById('terms');
const signatureEl = document.getElementById('signature');

const previewEl = document.getElementById('contractPreview');
const downloadHtmlBtn = document.getElementById('downloadHtml');

(function init(){
  // default today's date
  const today = new Date();
  const iso = today.toISOString().slice(0,10);
  signDateEl.value = iso;

  amountEl.value = 1000000000; 
  // set signature default to name when name input changes
  fullNameEl.addEventListener('input', ()=> {
    if(!signatureEl.dataset.touched){ 
      signatureEl.value = fullNameEl.value;
    }
    renderPreview();
  });
  signatureEl.addEventListener('input', ()=> {
    signatureEl.dataset.touched = '1';
    renderPreview();
  });

  [idNumberEl, phoneEl, signDateEl, amountEl, durationEl, termsEl].forEach(i => i.addEventListener('input', renderPreview));
  renderPreview();
})();

function renderPreview(){
  const name = fullNameEl.value || '—';
  const id = idNumberEl.value || '—';
  const phone = phoneEl.value || '—';
  const date = signDateEl.value ? yyyymmddToLocale(signDateEl.value) : '—';
  const amount = amountEl.value ? formatCurrency(amountEl.value) : '—';
  const durationDays = durationEl.value;
  const durationText = durationDays ? (durationDays>=365 ? Math.round(durationDays/365)+' năm' : durationDays+' ngày') : '—';
  const terms = termsEl.value || '';
  const sig = signatureEl.value || name;

  const html = `
    <div class="title">HỢP ĐỒNG MUA BÁN BẤT ĐỘNG SẢN (MẪU)</div>
    <div class="metadata">
      <div>Người ký: <strong>${escapeHtml(name)}</strong></div>
      <div>Ngày ký: <strong>${escapeHtml(date)}</strong></div>
    </div>

    <div class="section"><strong>Thông tin bên mua</strong>
      <div>Họ tên: ${escapeHtml(name)}</div>
      <div>CCCD/CMTND: ${escapeHtml(id)}</div>
      <div>Điện thoại: ${escapeHtml(phone)}</div>
    </div>

    <div class="section"><strong>Thông tin hợp đồng</strong>
      <div>Giá trị hợp đồng: <strong>${escapeHtml(amount)}</strong></div>
      <div>Thời hạn hợp đồng: <strong>${escapeHtml(durationText)}</strong></div>
    </div>

    <div class="section"><strong>Điều khoản</strong>
      <div class="terms">${escapeHtml(terms).replace(/\n/g,'<br>')}</div>
    </div>

    <div class="sig">
      <div>Người ký (ký bằng tên):</div>
      <div class="name">${escapeHtml(sig)}</div>
    </div>
  `;
  previewEl.innerHTML = html;
}

function escapeHtml(s=''){
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
}

function buildPrintableHtml(payload){
  const css = `
    body{font-family: "Be Vietnam Pro", Inter, Arial, sans-serif;color:#14202b;padding:28px;}
    .container{max-width:800px;margin:0 auto;}
    h1{color:${getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#fa6819'};text-align:center}
    .meta{display:flex;justify-content:space-between;margin-bottom:18px}
    .section{margin-bottom:14px;font-size:14px}
    .section .head{font-weight:700;margin-bottom:6px}
    .terms{background:#fafafa;border:1px solid #eee;padding:12px;border-radius:6px}
    .sig{margin-top:28px;text-align:right}
    .sig .name{font-weight:700}
    @media print{
      body{padding:18px}
    }
  `;
  const html = `
  <!doctype html>
  <html>
  <head><meta charset="utf-8"><title>Hợp đồng</title>
    <style>${css}</style>
  </head>
  <body>
    <div class="container">
      <h1>HỢP ĐỒNG MUA BÁN BẤT ĐỘNG SẢN</h1>
      <div class="meta">
        <div>Người ký: <strong>${escapeHtml(payload.name)}</strong></div>
        <div>Ngày ký: <strong>${escapeHtml(payload.date)}</strong></div>
      </div>

      <div class="section">
        <div class="head">Thông tin bên mua</div>
        <div>Họ tên: ${escapeHtml(payload.name)}</div>
        <div>CCCD/CMTND: ${escapeHtml(payload.id)}</div>
        <div>Điện thoại: ${escapeHtml(payload.phone)}</div>
      </div>

      <div class="section">
        <div class="head">Thông tin hợp đồng</div>
        <div>Giá trị hợp đồng: <strong>${escapeHtml(payload.amount)}</strong></div>
        <div>Thời hạn hợp đồng: <strong>${escapeHtml(payload.durationText)}</strong></div>
      </div>

      <div class="section">
        <div class="head">Điều khoản</div>
        <div class="terms">${escapeHtml(payload.terms).replace(/\n/g,'<br>')}</div>
      </div>

      <div class="sig">
        <div>Người ký (ký bằng tên):</div>
        <div class="name">${escapeHtml(payload.signature)}</div>
      </div>

      <hr style="margin-top:28px;opacity:0.2">
      <div style="font-size:12px;color:#666;margin-top:8px">Tài liệu được sinh tự động bởi hệ thống Real Estate. Vui lòng lưu hoặc in theo nhu cầu.</div>
    </div>
  </body>
  </html>
  `;
  return html;
}

// On submit -> build data, open print window
form.addEventListener('submit', function(ev){
  ev.preventDefault();
  // basic validation
  if(!fullNameEl.value.trim()){ alert('Vui lòng nhập họ tên'); fullNameEl.focus(); return; }
  if(!idNumberEl.value.trim()){ alert('Vui lòng nhập CCCD/CMTND'); idNumberEl.focus(); return; }
  if(!phoneEl.value.trim()){ alert('Vui lòng nhập số điện thoại'); phoneEl.focus(); return; }
  if(!amountEl.value || Number(amountEl.value)<=0){ alert('Vui lòng nhập giá trị hợp đồng hợp lệ'); amountEl.focus(); return; }

  const payload = {
    name: fullNameEl.value.trim(),
    id: idNumberEl.value.trim(),
    phone: phoneEl.value.trim(),
    date: signDateEl.value ? yyyymmddToLocale(signDateEl.value) : yyyymmddToLocale(new Date().toISOString().slice(0,10)),
    amount: formatCurrency(amountEl.value),
    durationText: (Number(durationEl.value)>=365 ? Math.round(Number(durationEl.value)/365)+' năm' : durationEl.value+' ngày'),
    terms: termsEl.value,
    signature: signatureEl.value || fullNameEl.value.trim()
  };

  // build html and open new window
  const html = buildPrintableHtml(payload);
  const w = window.open('', '_blank');
  if(!w){ alert('Trình duyệt chặn cửa sổ bật lên — vui lòng cho phép popups để in/tải PDF.'); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();

  setTimeout(()=> {
    try {
      w.focus();
      w.print();
    } catch(e){
      console.error(e);
      alert('Không thể mở hộp thoại in — vui lòng in/tải bằng trình duyệt của bạn.');
    }
  }, 400);
});

// download HTML (alternative)
downloadHtmlBtn.addEventListener('click', ()=>{
  const payload = {
    name: fullNameEl.value.trim() || 'Khach',
    id: idNumberEl.value.trim(),
    phone: phoneEl.value.trim(),
    date: signDateEl.value ? yyyymmddToLocale(signDateEl.value) : yyyymmddToLocale(new Date().toISOString().slice(0,10)),
    amount: formatCurrency(amountEl.value),
    durationText: (Number(durationEl.value)>=365 ? Math.round(Number(durationEl.value)/365)+' năm' : durationEl.value+' ngày'),
    terms: termsEl.value,
    signature: signatureEl.value || fullNameEl.value.trim()
  };
  const html = buildPrintableHtml(payload);
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const fname = 'contract_' + slugifyName(payload.name || 'customer') + '.html';
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  a.remove();
});

// render preview when inputs change 
function updateAndRender(){
  renderPreview();
}
[fullNameEl,idNumberEl,phoneEl,signDateEl,amountEl,durationEl,termsEl,signatureEl].forEach(i => i.addEventListener('input', updateAndRender));
