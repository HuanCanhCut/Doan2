import middleware from './middleware.js'
middleware();

const DataService = {
  KEY: 'real_estate_contracts',
  getAll() {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; }
  },
  saveAll(arr) { localStorage.setItem(this.KEY, JSON.stringify(arr)); }
};

(function seedSample() {
  if (!localStorage.getItem(DataService.KEY)) {
    const sample = [
      {
        id: 'HD001',
        propertyId: 'BDS001',
        propertyName: 'Căn hộ 2PN - Vinhomes Central Park',
        buyer: 'Nguyễn Văn A',
        agent: 'Ngọc Huy',
        price: 3500000000,
        commission: 50000000,
        status: 'signed',
        signedDate: '2025-10-02'
      },
      {
        id: 'HD002',
        propertyId: 'BDS002',
        propertyName: 'Chung cư Sunrise Riverside',
        buyer: 'Trần Thị B',
        agent: 'Ngọc Huy',
        price: 2800000000,
        commission: 30000000,
        status: 'pending',
        signedDate: '2025-09-15'
      },
      {
        id: 'HD003',
        propertyId: 'BDS003',
        propertyName: 'Căn hộ Masteri An Phú',
        buyer: 'Lê Văn C',
        agent: 'Ngọc Huy',
        price: 4200000000,
        commission: 40000000,
        status: 'cancelled',
        signedDate: '2025-07-10'
      },
      {
        id: 'HD004',
        propertyId: 'BDS004',
        propertyName: 'Căn hộ 3PN - The Sun Avenue',
        buyer: 'Đỗ Thị D',
        agent: 'Ngọc Huy',
        price: 5200000000,
        commission: 60000000,
        status: 'signed',
        signedDate: '2025-08-05'
      },
      {
        id: 'HD005',
        propertyId: 'BDS005',
        propertyName: 'Penthouse Empire City',
        buyer: 'Phạm Thị K',
        agent: 'Ngọc Huy',
        price: 18500000000,
        commission: 300000000,
        status: 'signed',
        signedDate: '2025-10-15'
      }
    ];
    DataService.saveAll(sample);
  }
})();

function money(v) {
  return (Number(v) || 0).toLocaleString('vi-VN') + ' ₫';
}
function statusLabel(status) {
  if (status === 'pending') return '<span class="status st-dangcho">Chờ thanh toán</span>';
  if (status === 'signed') return '<span class="status st-dayky">Hoàn tất</span>';
  return '<span class="status st-dahuy">Hết hiệu lực</span>';
}

const tbody = document.querySelector('#contractsTable tbody');
const filterStatus = document.getElementById('filterStatus');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const searchInput = document.getElementById('searchInput');
const globalSearch = document.getElementById('globalSearch');
const btnFilter = document.getElementById('btnFilter');
const btnReset = document.getElementById('btnReset');
const statCount = document.getElementById('statCount');
const statAmount = document.getElementById('statAmount');
const statComm = document.getElementById('statComm');
const modalBack = document.getElementById('modalBack');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function getFiltered() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const agentName = currentUser?.full_name || currentUser?.nickname || currentUser?.name || '';

  let list = DataService.getAll();
  if (agentName) list = list.filter(x => x.agent === agentName);

  const status = filterStatus.value;
  const f = fromDate.value;
  const t = toDate.value;
  const q = (searchInput.value || globalSearch.value || '').toLowerCase().trim();

  if (status) list = list.filter(x => x.status === status);
  if (f) list = list.filter(x => x.signedDate >= f);
  if (t) list = list.filter(x => x.signedDate <= t);
  if (q)
    list = list.filter(
      x =>
        x.buyer.toLowerCase().includes(q) ||
        x.propertyName.toLowerCase().includes(q)
    );

  return list;
}

function renderTable() {
  const list = getFiltered();
  tbody.innerHTML = '';

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--muted)">Không có hợp đồng</td></tr>`;
    return;
  }

  list.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${c.propertyName}</td>
      <td>${c.buyer}</td>
      <td>${money(c.price)}</td>
      <td>${money(c.commission)}</td>
      <td>${c.signedDate}</td>
      <td>${statusLabel(c.status)}</td>
      <td><button class="btn secondary btn-detail" data-id="${c.id}">Xem</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.onclick = () => openModal(btn.dataset.id);
  });
}

function openModal(id) {
  const c = DataService.getAll().find(x => x.id === id);
  if (!c) return;

  modalBody.innerHTML = `
    <div class="grid">
      <div>
        <div class="muted">Mã hợp đồng</div>
        <div>${c.id}</div>
        <div class="muted">Bất động sản</div>
        <div><strong>${c.propertyName}</strong></div>
        <div class="muted">Mã BĐS</div>
        <div>${c.propertyId}</div>
        <div class="muted">Ngày ký</div>
        <div>${c.signedDate}</div>
      </div>
      <div>
        <div class="muted">Khách hàng</div>
        <div>${c.buyer}</div>
        <div class="muted">Giá trị hợp đồng</div>
        <div>${money(c.price)}</div>
        <div class="muted">Hoa hồng</div>
        <div>${money(c.commission)}</div>
        <div class="muted">Trạng thái</div>
        <div>${statusLabel(c.status)}</div>
      </div>
    </div>
  `;
  modalBack.style.display = 'flex';
}

modalClose.onclick = () => (modalBack.style.display = 'none');
window.onclick = e => {
  if (e.target === modalBack) modalBack.style.display = 'none';
};

function renderStats() {
  const list = getFiltered();
  const totalAmount = list.reduce((s, x) => s + (x.price || 0), 0);
  const totalComm = list.reduce((s, x) => s + (x.commission || 0), 0);
  statCount.textContent = list.length;
  statAmount.textContent = money(totalAmount);
  statComm.textContent = money(totalComm);
}

btnFilter.onclick = () => {
  renderTable();
  renderStats();
};
btnReset.onclick = () => {
  filterStatus.value = '';
  fromDate.value = '';
  toDate.value = '';
  searchInput.value = '';
  globalSearch.value = '';
  renderTable();
  renderStats();
};
globalSearch.onkeyup = () => {
  renderTable();
  renderStats();
};

renderTable();
renderStats();
