import middleware from './middleware.js'
await middleware();

const sampleData = [
  // 2023
  { date: '2023-01-12', listings: 5, contracts: 1, commission: 8000000 },
  { date: '2023-03-15', listings: 10, contracts: 3, commission: 25000000 },
  { date: '2023-06-10', listings: 18, contracts: 5, commission: 52000000 },
  { date: '2023-09-20', listings: 20, contracts: 6, commission: 70000000 },
  { date: '2023-12-05', listings: 14, contracts: 4, commission: 36000000 },

  // 2024
  { date: '2024-01-10', listings: 8, contracts: 2, commission: 15000000 },
  { date: '2024-03-18', listings: 12, contracts: 3, commission: 29000000 },
  { date: '2024-05-25', listings: 19, contracts: 6, commission: 60000000 },
  { date: '2024-08-12', listings: 25, contracts: 8, commission: 94000000 },
  { date: '2024-11-30', listings: 22, contracts: 7, commission: 82000000 },

  // 2025
  { date: '2025-01-10', listings: 8, contracts: 2, commission: 15000000 },
  { date: '2025-02-05', listings: 12, contracts: 3, commission: 28000000 },
  { date: '2025-03-20', listings: 15, contracts: 4, commission: 45000000 },
  { date: '2025-04-10', listings: 20, contracts: 5, commission: 60000000 },
  { date: '2025-05-05', listings: 18, contracts: 6, commission: 72000000 },
  { date: '2025-06-15', listings: 25, contracts: 8, commission: 98000000 },
  { date: '2025-07-10', listings: 22, contracts: 6, commission: 88000000 },
  { date: '2025-08-12', listings: 19, contracts: 7, commission: 94000000 },
  { date: '2025-09-18', listings: 24, contracts: 10, commission: 120000000 },
  { date: '2025-10-02', listings: 21, contracts: 9, commission: 110000000 }
];

// ====================== //
// DỊCH VỤ DỮ LIỆU
// ====================== //
const DataService = {
  filterByRange(data, start, end) {
    return data.filter(d => {
      const dt = new Date(d.date);
      return (!start || dt >= start) && (!end || dt <= end);
    });
  },

  // Nhóm theo YEAR-MONTH, không gộp các tháng khác năm
  groupByYearMonth(data) {
    const map = new Map();
    data.forEach(d => {
      const dt = new Date(d.date);
      const y = dt.getFullYear();
      const m = dt.getMonth() + 1;
      const key = `${y}-${String(m).padStart(2,'0')}`; 
      if (!map.has(key)) map.set(key, { year: y, month: m, listings: 0, contracts: 0, commission: 0 });
      const rec = map.get(key);
      rec.listings += d.listings || 0;
      rec.contracts += d.contracts || 0;
      rec.commission += d.commission || 0;
    });

    // sắp xếp các khóa theo thứ tự thời gian
    const arr = Array.from(map.values()).sort((a,b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    //label "Tháng M/YYYY"
    return arr.map(r => ({ label: `Tháng ${r.month}/${r.year}`, listings: r.listings, contracts: r.contracts, commission: r.commission }));
  },

  // Nhóm theo tháng nhưng giới hạn trong một năm cụ thể — hữu ích cho giao diện người dùng "tháng" hoặc "quý" chỉ sử dụng năm 2025
  groupByMonthForYear(data, year) {
    const map = new Map();
    data.forEach(d => {
      const dt = new Date(d.date);
      if (dt.getFullYear() !== year) return;
      const m = dt.getMonth() + 1;
      const key = `${year}-${String(m).padStart(2,'0')}`;
      if (!map.has(key)) map.set(key, { month: m, listings: 0, contracts: 0, commission: 0 });
      const rec = map.get(key);
      rec.listings += d.listings || 0;
      rec.contracts += d.contracts || 0;
      rec.commission += d.commission || 0;
    });
    const arr = Array.from(map.values()).sort((a,b)=> a.month - b.month);
    return arr.map(r => ({ label: `Tháng ${r.month}/${year}`, listings: r.listings, contracts: r.contracts, commission: r.commission }));
  }
};

// ====================== //
// VẼ BIỂU ĐỒ CANVAS
// ====================== //
const canvas = document.getElementById("reportChart");
const ctx = canvas.getContext("2d");

function pxRatio() { //Điều chỉnh kích thước canvas theo tỷ lệ pixel của màn hình
  return window.devicePixelRatio || 1;
}

function renderChart(data) {
  const ratio = pxRatio();
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0); 
  ctx.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);

  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  const margin = 60;
  const chartW = W - margin * 2;
  const chartH = H - margin * 1.6;
  const n = Math.max(1, data.labels.length);
  const barGroupWidth = chartW / n;
  const barWidth = Math.max(18, barGroupWidth / 3.5);

  const commissionsInM = data.commissions.map(v => v / 1000000);
  const maxY = Math.max(1, ...data.listingsCounts, ...data.contractsCounts, ...commissionsInM);

  ctx.font = "12px 'Be Vietnam Pro', Arial, sans-serif";
  ctx.fillStyle = "#666";
  ctx.textAlign = "right";
  ctx.lineWidth = 1;
  const steps = 6;
  ctx.strokeStyle = "#eee";
  for (let i=0;i<=steps;i++){
    const y = margin + (chartH * i / steps);
    const val = Math.round(maxY * (steps - i) / steps); 
    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(W - margin, y);
    ctx.stroke();
    ctx.fillText(val, margin - 12, y + 4);
  }

  ctx.strokeStyle = "#cfcfcf";
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, H - margin);
  ctx.lineTo(W - margin, H - margin);
  ctx.stroke();

  data.labels.forEach((lbl, i) => {
    const centerX = margin + (i + 0.5) * barGroupWidth;
    const leftBarX = centerX - barWidth - 4;
    const rightBarX = centerX + 4;

    // listings (orange)
    const h1 = (data.listingsCounts[i] / maxY) * chartH;
    ctx.fillStyle = "rgba(255,159,64,0.9)";
    ctx.fillRect(leftBarX, H - margin - h1, barWidth, h1);
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(data.listingsCounts[i], leftBarX + barWidth/2, H - margin - h1 - 8);

    // contracts (red)
    const h2 = (data.contractsCounts[i] / maxY) * chartH;
    ctx.fillStyle = "rgba(255,99,71,0.9)";
    ctx.fillRect(rightBarX, H - margin - h2, barWidth, h2);
    ctx.fillStyle = "#333";
    ctx.fillText(data.contractsCounts[i], rightBarX + barWidth/2, H - margin - h2 - 8);
  });

  // hoa hồng line (yellow)
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,205,86,1)";
  ctx.lineWidth = 2;
  commissionsInM.forEach((valM, i) => {
    const x = margin + (i + 0.5) * barGroupWidth;
    const y = margin + (chartH * (1 - (valM / maxY)));
    if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  commissionsInM.forEach((valM, i) => {
    const x = margin + (i + 0.5) * barGroupWidth;
    const y = margin + (chartH * (1 - (valM / maxY)));
    ctx.fillStyle = "#f5c518";
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText((data.commissions[i]/1000000).toFixed(1) + " tr", x, y - 10);
  });

  ctx.fillStyle = "#333";
  ctx.textAlign = "center";
  data.labels.forEach((lbl, i) => {
    const x = margin + (i + 0.5) * barGroupWidth;
    ctx.fillText(lbl, x, H - margin + 18);
  });
}

// ====================== //
//CẬP NHẬT THỐNG KÊ
// ====================== //
function updateStats(grouped) {
  const totalListings = grouped.reduce((s,r)=> s + (r.listings||0), 0);
  const totalContracts = grouped.reduce((s,r)=> s + (r.contracts||0), 0);
  const totalCommission = grouped.reduce((s,r)=> s + (r.commission||0), 0);

  document.getElementById("statListings").textContent = totalListings;
  document.getElementById("statContracts").textContent = totalContracts;
  document.getElementById("statCommission").textContent = totalCommission.toLocaleString("vi-VN") + " ₫";
}

// ====================== //
// LỌC VÀ HIỂN THỊ
// ====================== //
const startDateEl = document.getElementById("startDate");
const endDateEl = document.getElementById("endDate");
const btnApplyRange = document.getElementById("btnApplyRange");
const btnReset = document.getElementById("btnReset");
const quickBtns = document.querySelectorAll(".quick-btn");
const selector = document.getElementById("optionSelector");

// render Month/Quarter/Year options
function renderOptions(type) {
  selector.innerHTML = "";
  selector.classList.remove("hidden");

  let opts = [];
  if (type === "month") {
    const year = new Date().getFullYear();
    for (let m=1;m<=12;m++) opts.push({ label: `Tháng ${m}/${year}`, value: `${year}-${String(m).padStart(2,'0')}` });
  } else if (type === "quarter") {
    const year = new Date().getFullYear();
    opts = [
      { label: `Quý 1/${year}`, value: `Q1-${year}` },
      { label: `Quý 2/${year}`, value: `Q2-${year}` },
      { label: `Quý 3/${year}`, value: `Q3-${year}` },
      { label: `Quý 4/${year}`, value: `Q4-${year}` }
    ];
  } else if (type === "year") {
    opts = ["2023","2024","2025"].map(y => ({ label: y, value: y }));
  }

  opts.forEach(o => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = o.label;
    btn.onclick = (e)=> handleSelect(type, o.value, e);
    selector.appendChild(btn);
  });
}

function handleSelect(type, value, ev) {
  selector.querySelectorAll(".option-btn").forEach(b => b.classList.remove("active"));
  ev.target.classList.add("active");

  let filtered = [];
  if (type === "month") {
    const [y, m] = value.split('-').map(Number);
    filtered = sampleData.filter(d => {
      const dt = new Date(d.date);
      return dt.getFullYear() === y && (dt.getMonth()+1) === m;
    });
    const grouped = DataService.groupByYearMonth(filtered);
    showGrouped(grouped);
  } else if (type === "quarter") {
    const [qStr, yStr] = value.split('-');
    const q = Number(qStr.replace('Q',''));
    const y = Number(yStr);
    const startM = (q-1)*3 + 1, endM = startM + 2;
    filtered = sampleData.filter(d=>{
      const dt = new Date(d.date);
      const m = dt.getMonth()+1;
      return dt.getFullYear() === y && m >= startM && m <= endM;
    });
    const grouped = DataService.groupByYearMonth(filtered);
    showGrouped(grouped);
  } else {
    const y = Number(value);
    filtered = sampleData.filter(d => new Date(d.date).getFullYear() === y);
    const grouped = DataService.groupByYearMonth(filtered);
    showGrouped(grouped);
  }
}

function showGrouped(grouped) {
  if (!grouped.length) {
    updateStats([]);
    renderChart({ labels: ['-'], listingsCounts: [0], contractsCounts: [0], commissions: [0] });
    return;
  }
  const labels = grouped.map(g => g.label);
  const listingsCounts = grouped.map(g => g.listings);
  const contractsCounts = grouped.map(g => g.contracts);
  const commissions = grouped.map(g => g.commission);
  updateStats(grouped);
  renderChart({ labels, listingsCounts, contractsCounts, commissions });
}

//lọc theo khoảng thời gian tự 
btnApplyRange.onclick = () => {
  const start = startDateEl.value ? new Date(startDateEl.value + 'T00:00:00') : null;
  const end = endDateEl.value ? new Date(endDateEl.value + 'T23:59:59') : null;
  if (start && end && start > end) { alert('Ngày bắt đầu phải <= ngày kết thúc'); return; }
  const filtered = DataService.filterByRange(sampleData, start, end);
  const grouped = DataService.groupByYearMonth(filtered); // sử dụng nhóm YEAR-MONTH để các tháng của những năm khác nhau được tách biệt
  showGrouped(grouped);
};

btnReset.onclick = () => {
  startDateEl.value = "";
  endDateEl.value = "";
  selector.classList.add("hidden");
  loadDefault();
};

quickBtns.forEach(b => b.addEventListener('click', ()=> renderOptions(b.dataset.type)));

function loadDefault() {
  const year = 2025; 
  const filtered = sampleData.filter(d => new Date(d.date).getFullYear() === year);
  const grouped = DataService.groupByYearMonth(filtered);
  showGrouped(grouped);
}

loadDefault();
