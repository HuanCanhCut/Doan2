import middleware from './middleware.js'
middleware();

const DataService = {
  KEY: 'real_estate_contracts',
  getAll(){
    const raw = localStorage.getItem(this.KEY);
    if(!raw) return [];
    try { return JSON.parse(raw); } catch(e){ console.error(e); return []; }
  },
  saveAll(arr){ localStorage.setItem(this.KEY, JSON.stringify(arr)); },
  add(item){ const a=this.getAll(); a.push(item); this.saveAll(a); },
  update(id, patch){ const a=this.getAll(); const i=a.findIndex(x=>x.id===id); if(i===-1) return false; a[i] = {...a[i], ...patch}; this.saveAll(a); return true; },
  remove(id){ const a=this.getAll().filter(x=>x.id!==id); this.saveAll(a); }
};

// seed dữ liệu mẫu nếu rỗng
(function seed(){
  if(!localStorage.getItem(DataService.KEY)){
    const sample=[
      { id:'c1', propertyId:'p1', propertyTitle:'Căn hộ 2PN - Sunrise City', buyerName:'Nguyễn Văn A', agentName:'Ngọc Huy', amount:2500000000, commission:50000000, status:'pending', start:'2024-05-10', end:'2024-06-10', createdAt:'2024-05-10' },
      { id:'c2', propertyId:'p2', propertyTitle:'Biệt thự Vinhomes', buyerName:'Trần Thị B', agentName:'Linh Phạm', amount:10000000000, commission:200000000, status:'signed', start:'2024-03-02', end:'2024-03-15', createdAt:'2024-03-02' },
      { id:'c3', propertyId:'p3', propertyTitle:'Shophouse CBD', buyerName:'Lê Văn C', agentName:'Ngọc Huy', amount:7500000000, commission:150000000, status:'cancelled', start:'2023-12-01', end:'2023-12-12', createdAt:'2023-12-01' },
      { id:'c4', propertyId:'p4', propertyTitle:'Căn hộ 1PN - Moonlight', buyerName:'Phan Thị D', agentName:'Mai Trần', amount:1800000000, commission:36000000, status:'signed', start:'2024-06-20', end:'2024-07-01', createdAt:'2024-06-20' }
    ];
    DataService.saveAll(sample);
  }
})();

function money(v){ return (Number(v)||0).toLocaleString('vi-VN') + ' ₫'; }
function escapeHtml(s=''){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }
function statusPill(status){ //trả HTML span màu theo trạng thái
  if(status==='pending') return `<span class="status st-dangcho">Đang chờ</span>`;
  if(status==='signed') return `<span class="status st-dayky">Đã ký</span>`;
  return `<span class="status st-dahuy">Đã hủy</span>`;
}

const tbody = document.querySelector('#contractsTable tbody');
const filterStatus = document.getElementById('filterStatus');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const searchInput = document.getElementById('searchInput');
const btnFilter = document.getElementById('btnFilter');
const btnReset = document.getElementById('btnReset');
const btnNew = document.getElementById('btnNew');
const btnExport = document.getElementById('btnExport');
const globalSearch = document.getElementById('globalSearch');
const statCount = document.getElementById('statCount');
const statAmount = document.getElementById('statAmount');
const statComm = document.getElementById('statComm');
const modalBack = document.getElementById('modalBack');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const btnMarkSigned = document.getElementById('btnMarkSigned');
const btnMarkCancelled = document.getElementById('btnMarkCancelled');
const btnModalDelete = document.getElementById('btnModalDelete');
let currentId = null;

function renderTable(list){
  tbody.innerHTML = '';
  if(!list.length){
    tbody.innerHTML = `<tr><td colspan="9" class="small" style="padding:20px;text-align:center;color:var(--muted)">Không có hợp đồng</td></tr>`;
    return;
  }
  list.forEach((c, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td><strong>${escapeHtml(c.propertyTitle)}</strong><div class="small">${escapeHtml(c.propertyId)}</div></td>
      <td>${escapeHtml(c.buyerName)}</td>
      <td>${escapeHtml(c.agentName)}</td>
      <td>${money(c.amount)}</td>
      <td>${money(c.commission)}</td>
      <td class="small">${escapeHtml(c.start||'-')}</td>
      <td>${statusPill(c.status)}</td>
      <td class="actions"><button class="btn secondary btn-view" data-id="${c.id}">Xem</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-view').forEach(b=>{
    b.addEventListener('click',()=> openModal(b.dataset.id));
  });
}

function getFiltered(){
  let arr = DataService.getAll().slice().sort((a,b)=> (b.createdAt||'') > (a.createdAt||'') ? 1 : -1);
  const s = filterStatus.value;
  const f = fromDate.value;
  const t = toDate.value;
  const q = (searchInput.value||'').toLowerCase().trim() || (globalSearch.value||'').toLowerCase().trim();
  if(s) arr = arr.filter(x=>x.status===s);
  if(f) arr = arr.filter(x=> (x.start||'') >= f);
  if(t) arr = arr.filter(x=> (x.start||'') <= t);
  if(q) arr = arr.filter(x=> (x.buyerName||'').toLowerCase().includes(q) || (x.agentName||'').toLowerCase().includes(q) || (x.propertyTitle||'').toLowerCase().includes(q));
  return arr;
}

btnFilter.onclick = ()=>{ renderTable(getFiltered()); renderStats(); };
btnReset.onclick = ()=>{ filterStatus.value=''; fromDate.value=''; toDate.value=''; searchInput.value=''; globalSearch.value=''; renderTable(getFiltered()); renderStats(); };
globalSearch.onkeyup = ()=>{ renderTable(getFiltered()); renderStats(); };

btnExport.onclick = ()=>{
  const arr = getFiltered();
  if(!arr.length) return alert('Không có dữ liệu để xuất.');
  const headers=['id','propertyId','propertyTitle','buyerName','agentName','amount','commission','status','start','end'];
  const rows = arr.map(r => headers.map(h=> `"${String(r[h]||'').replace(/"/g,'""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='hopdong_export.csv'; a.click(); URL.revokeObjectURL(url);
};

function openModal(id){
  const c = DataService.getAll().find(x=>x.id===id);
  if(!c) return alert('Không tìm thấy hợp đồng.');
  currentId = id;
  modalBody.innerHTML = `
    <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="flex:1;min-width:260px">
        <div class="muted">Bất động sản</div><div><strong>${escapeHtml(c.propertyTitle)}</strong></div><div class="muted">${escapeHtml(c.propertyId)}</div>
        <div class="muted" style="margin-top:8px">Người mua</div><div>${escapeHtml(c.buyerName)}</div>
        <div class="muted" style="margin-top:8px">Nhân viên môi giới</div><div>${escapeHtml(c.agentName)}</div>
      </div>
      <div style="flex:1;min-width:220px">
        <div class="muted">Giá trị hợp đồng</div><div><strong>${money(c.amount)}</strong></div>
        <div class="muted" style="margin-top:8px">Hoa hồng</div><div><strong>${money(c.commission)}</strong></div>
        <div class="muted" style="margin-top:8px">Thời gian</div><div>${escapeHtml(c.start||'-')} — ${escapeHtml(c.end||'-')}</div>
        <div class="muted" style="margin-top:8px">Trạng thái</div><div>${statusPill(c.status)}</div>
      </div>
    </div>`;
  modalBack.style.display='flex';
}
modalClose.onclick = ()=>{ modalBack.style.display='none'; currentId=null; };

btnMarkSigned.onclick = ()=>{
  if(!currentId) return;
  DataService.update(currentId, {status:'signed'});
  modalBack.style.display='none';
  renderTable(getFiltered());
  renderStats();
  alert('Đã cập nhật trạng thái sang "Đã ký"');
};

btnMarkCancelled.onclick = ()=>{
  if(!currentId) return;
  DataService.update(currentId, {status:'cancelled'});
  modalBack.style.display='none';
  renderTable(getFiltered());
  renderStats();
  alert('Đã cập nhật trạng thái sang "Đã hủy"');
};

btnModalDelete.onclick = ()=>{
  if(!currentId) return;
  if(!confirm('Bạn có chắc muốn xóa hợp đồng này không?')) return;
  DataService.remove(currentId);
  modalBack.style.display='none';
  renderTable(getFiltered());
  renderStats();
  alert('Đã xóa hợp đồng.');
};

function renderStats(){
  const all = DataService.getAll();
  const signed = all.filter(x=>x.status==='signed');
  statCount.textContent = signed.length;
  const total = signed.reduce((s,i)=> s + (Number(i.amount)||0), 0);
  const comm = signed.reduce((s,i)=> s + (Number(i.commission)||0), 0);
  statAmount.textContent = money(total);
  statComm.textContent = money(comm);
}

renderTable(getFiltered());
renderStats();