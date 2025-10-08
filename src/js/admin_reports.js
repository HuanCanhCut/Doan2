const DataService = {
  KEY_CONTRACTS: 'real_estate_contracts',
  KEY_LISTINGS: 'real_estate_listings',

  getAllContracts(){
    let arr = JSON.parse(localStorage.getItem(this.KEY_CONTRACTS) || 'null');
    if(!Array.isArray(arr)){
      arr = [
        {id:'c1', propertyTitle:'Căn 2PN Sunrise', createdAt:'2025-01-05', start:'2025-01-05', status:'signed', amount:2500000000, commission:50000000},
        {id:'c2', propertyTitle:'Biệt thự Vinhomes', createdAt:'2025-01-20', start:'2025-01-20', status:'pending', amount:10000000000, commission:200000000},
        {id:'c3', propertyTitle:'Shophouse CBD', createdAt:'2024-11-12', start:'2024-11-12', status:'signed', amount:7500000000, commission:150000000},
        {id:'c4', propertyTitle:'Căn 1PN Moonlight', createdAt:'2024-06-20', start:'2024-06-20', status:'cancelled', amount:1800000000, commission:36000000},
        {id:'c5', propertyTitle:'Căn Studio Midtown', createdAt:'2025-02-02', start:'2025-02-02', status:'signed', amount:1200000000, commission:24000000},
        {id:'c6', propertyTitle:'Penthouse Central', createdAt:'2025-03-15', start:'2025-03-15', status:'signed', amount:15000000000, commission:300000000}
      ];
      localStorage.setItem(this.KEY_CONTRACTS, JSON.stringify(arr));
    }
    return arr;
  },

  getAllListings(){
    let arr = JSON.parse(localStorage.getItem(this.KEY_LISTINGS) || 'null');
    if(!Array.isArray(arr)){
      arr = [
        {id:'l1', title:'Tin 1', createdAt:'2025-01-03'},
        {id:'l2', title:'Tin 2', createdAt:'2025-01-08'},
        {id:'l3', title:'Tin 3', createdAt:'2024-12-29'},
        {id:'l4', title:'Tin 4', createdAt:'2025-02-10'},
        {id:'l5', title:'Tin 5', createdAt:'2025-03-05'},
        {id:'l6', title:'Tin 6', createdAt:'2025-03-11'},
        {id:'l7', title:'Tin 7', createdAt:'2024-06-20'},
        {id:'l8', title:'Tin 8', createdAt:'2024-11-30'},
        {id:'l9', title:'Tin 9', createdAt:'2025-01-25'}
      ];
      localStorage.setItem(this.KEY_LISTINGS, JSON.stringify(arr));
    }
    return arr;
  }
};


function parseDate(s){
  if(!s) return null;
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, m-1, d);
}
function formatDate(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function lastDayOfMonth(y,m){
  return new Date(y, m, 0).getDate();
}


function daysBetween(startStr, endStr){
  const start = parseDate(startStr);
  const end = parseDate(endStr);
  const arr = [];
  for(let d = new Date(start); d <= end; d.setDate(d.getDate()+1)){
    arr.push(formatDate(new Date(d)));
  }
  return arr;
}


function aggregate(rangeItems){
  const contracts = DataService.getAllContracts();
  const listings = DataService.getAllListings();

  const labels = [];
  const listingsCounts = [];
  const contractsCounts = [];
  const commissions = [];

  let totalListings = 0;
  let totalSignedContracts = 0;
  let totalCommissionSum = 0;

  rangeItems.forEach(r => {
    labels.push(r.label);

    
    const liCount = listings.filter(x => {
      return x.createdAt >= r.start && x.createdAt <= r.end;
    }).length;
    listingsCounts.push(liCount);
    totalListings += liCount;

    
    const cIn = contracts.filter(x => {
      return (x.createdAt >= r.start && x.createdAt <= r.end) && (x.status === 'signed');
    });
    const cCount = cIn.length;
    const commissionSum = cIn.reduce((s, c)=> s + (Number(c.commission)||0), 0);
    contractsCounts.push(cCount);
    commissions.push(commissionSum);

    totalSignedContracts += cCount;
    totalCommissionSum += commissionSum;
  });

  return {
    labels, listingsCounts, contractsCounts, commissions,
    totals: { totalListings, totalSignedContracts, totalCommissionSum }
  };
}


function makeDayRanges(startStr, endStr){
  const days = daysBetween(startStr, endStr);
  return days.map(d => ({ label: d.replace(/^\d+-0?/, 'Ngày '), start: d, end: d }));
}
function makeMonthRanges(startStr, endStr){
  const s = parseDate(startStr), e = parseDate(endStr);
  const arr = [];
  let y = s.getFullYear(), m = s.getMonth()+1;
  while(true){
    const start = `${y}-${String(m).padStart(2,'0')}-01`;
    const endDay = lastDayOfMonth(y,m);
    const end = `${y}-${String(m).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`;
    arr.push({ label: `Tháng ${m}/${y}`, start, end });
    if(y === e.getFullYear() && m === (e.getMonth()+1)) break;
    m++;
    if(m>12){ m=1; y++; }
  }
  return arr;
}
function makeQuarterRanges(year, q){
  const qNum = Number(q.replace(/[^\d]/g,'')); 
  const startMonth = (qNum-1)*3 + 1;
  const ranges = [];
  for(let m = startMonth; m < startMonth+3; m++){
    const start = `${year}-${String(m).padStart(2,'0')}-01`;
    const endDay = lastDayOfMonth(year, m);
    const end = `${year}-${String(m).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`;
    ranges.push({ label:`Tháng ${m}/${year}`, start, end });
  }
  return ranges;
}
function makeYearRanges(year){
  const ranges = [];
  for(let m=1;m<=12;m++){
    const start = `${year}-${String(m).padStart(2,'0')}-01`;
    const endDay = lastDayOfMonth(year, m);
    const end = `${year}-${String(m).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`;
    ranges.push({ label:`Tháng ${m}/${year}`, start, end });
  }
  return ranges;
}


const ctx = document.getElementById('reportChart').getContext('2d');
let chart = null;
function renderChart(data){
  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    data: {
      labels: data.labels,
      datasets: [
        { type:'bar', label: 'Tin đăng', data: data.listingsCounts, backgroundColor: 'rgba(255,159,64,0.85)', yAxisID: 'y' },
        { type:'bar', label: 'Hợp đồng (Đã ký)', data: data.contractsCounts, backgroundColor: 'rgba(255,99,71,0.85)', yAxisID: 'y' },
        { type:'line', label: 'Hoa hồng (₫)', data: data.commissions, borderColor: 'rgba(255,205,86,0.95)', backgroundColor:'rgba(255,205,86,0.3)', yAxisID: 'y2', tension:0.3, pointRadius:4 }
      ]
    },
    options: {
      responsive:true,
      interaction: { mode: 'index', intersect: false },
      stacked: false,
      scales: {
        y: {
          beginAtZero:true,
          title: { display:true, text:'Số lượng' },
          ticks: { precision:0 }
        },
        y2: {
          beginAtZero:true,
          position:'right',
          grid: { drawOnChartArea:false },
          title: { display:true, text:'Hoa hồng (₫)' },
          ticks: {
            callback: function(v){ return Number(v).toLocaleString('vi-VN') + ' ₫'; }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context){
              const label = context.dataset.label || '';
              const v = context.parsed.y ?? context.parsed;
              if(context.dataset.label.includes('Hoa hồng')) return `${label}: ${Number(v).toLocaleString('vi-VN')} ₫`;
              return `${label}: ${v}`;
            }
          }
        },
        legend: { position: 'bottom' }
      }
    }
  });
}


const startDateEl = document.getElementById('startDate');
const endDateEl = document.getElementById('endDate');
const btnApplyRange = document.getElementById('btnApplyRange');
const btnReset = document.getElementById('btnReset');
const quickBtns = document.querySelectorAll('.quick-btn');
const optionSelector = document.getElementById('optionSelector');

const statListings = document.getElementById('statListings');
const statContracts = document.getElementById('statContracts');
const statCommission = document.getElementById('statCommission');


function updateStats(totals){
  statListings.textContent = totals.totalListings;
  statContracts.textContent = totals.totalSignedContracts;
  statCommission.textContent = Number(totals.totalCommissionSum).toLocaleString('vi-VN') + ' ₫';
}


btnApplyRange.addEventListener('click', ()=>{
  const s = startDateEl.value;
  const e = endDateEl.value;
  if(!s || !e){ alert('Vui lòng chọn cả từ và đến ngày.'); return; }
  if(s > e){ alert('Ngày bắt đầu phải <= ngày kết thúc'); return; }

  
  const d1 = parseDate(s), d2 = parseDate(e);
  const diffDays = Math.round((d2 - d1) / (24*60*60*1000)) + 1;
  let ranges;
  if(diffDays <= 90){
    ranges = makeDayRanges(s,e);
  } else {
    ranges = makeMonthRanges(s,e);
  }
  const agg = aggregate(ranges);
  renderChart(agg);
  updateStats(agg.totals);
  optionSelector.classList.add('hidden');
});


btnReset.addEventListener('click', ()=>{
  startDateEl.value = '';
  endDateEl.value = '';
  optionSelector.classList.add('hidden');
  loadDefault(); 
});


quickBtns.forEach(btn => {
  btn.addEventListener('click', ()=>{
    const t = btn.dataset.type;
    optionSelector.innerHTML = '';
    optionSelector.classList.remove('hidden');

    if(t === 'month'){
      const year = new Date().getFullYear();
      for(let m=1;m<=12;m++){
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.textContent = `Tháng ${m}/${year}`;
        b.dataset.month = m;
        b.dataset.year = year;
        b.addEventListener('click', ()=>{
          document.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          const ym = `${year}-${String(m).padStart(2,'0')}`;
          const start = `${ym}-01`;
          const end = `${ym}-${String(lastDayOfMonth(year,m)).padStart(2,'0')}`;
          const ranges = makeDayRanges(start, end);
          const agg = aggregate(ranges);
          renderChart(agg);
          updateStats(agg.totals);
        });
        optionSelector.appendChild(b);
      }
    } else if(t === 'quarter'){
      const year = new Date().getFullYear();
      ['Q1','Q2','Q3','Q4'].forEach(q=>{
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.textContent = `${q}/${year}`;
        b.dataset.q = q;
        b.addEventListener('click', ()=>{
          document.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          const ranges = makeQuarterRanges(year, q);
          const agg = aggregate(ranges);
          renderChart(agg);
          updateStats(agg.totals);
        });
        optionSelector.appendChild(b);
      });
    } else if(t === 'year'){
      const startYear = new Date().getFullYear() - 2;
      for(let y = startYear; y <= startYear + 4; y++){
        const b = document.createElement('button');
        b.className = 'option-btn';
        b.textContent = `${y}`;
        b.dataset.year = y;
        b.addEventListener('click', ()=>{
          document.querySelectorAll('.option-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          const ranges = makeYearRanges(y);
          const agg = aggregate(ranges);
          renderChart(agg);
          updateStats(agg.totals);
        });
        optionSelector.appendChild(b);
      }
    }
  });
});


function loadDefault(){
  const now = new Date();
  const yy = now.getFullYear(), mm = now.getMonth()+1;
  const start = `${yy}-${String(mm).padStart(2,'0')}-01`;
  const end = `${yy}-${String(mm).padStart(2,'0')}-${String(lastDayOfMonth(yy,mm)).padStart(2,'0')}`;
  startDateEl.value = start;
  endDateEl.value = end;
  const ranges = makeDayRanges(start,end);
  const agg = aggregate(ranges);
  renderChart(agg);
  updateStats(agg.totals);
  optionSelector.classList.add('hidden');
}


loadDefault();
