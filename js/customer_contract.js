import middleware from './middleware.js'
middleware()

function formatCurrency(v) {
    return (Number(v) || 0).toLocaleString('vi-VN') + ' ₫'
}
function yyyymmddToLocale(dstr) {
    if (!dstr) return ''
    const d = new Date(dstr)
    return d.toLocaleDateString('vi-VN')
}
function slugifyName(name) {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '')
        .replace(/[^\w]/g, '')
}
function escapeHtml(s = '') {
    return String(s).replace(
        /[&<>"']/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    )
}

const form = document.getElementById('contractForm')
const fullNameEl = document.getElementById('fullName')
const idNumberEl = document.getElementById('idNumber')
const phoneEl = document.getElementById('phone')
const addressEl = document.getElementById('address')
const signDateEl = document.getElementById('signDate')
const amountEl = document.getElementById('amount')
const durationEl = document.getElementById('duration')
const termsEl = document.getElementById('terms')
const signatureEl = document.getElementById('signature')
const paymentEl = document.getElementById('payment')
const previewEl = document.getElementById('contractPreview')
const downloadHtmlBtn = document.getElementById('downloadHtml')

// ===== Party A (Bên bán) =====
const DEFAULT_PARTY_A = {
    name: 'Công ty Bất động sản Real Estate',
    address: 'Đường Đỗ Thế Diên, Nguyễn Xá, Mỹ Hào, Hưng Yên, Việt Nam',
    phone: '024 9999 8888',
}

function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('post_id') || params.get('property_id') || params.get('id')
    const n = Number(raw)
    return Number.isFinite(n) && n > 0 ? n : null
}

function resolvePartyA() {
    const postId = getPostIdFromUrl()
    if (!postId) return DEFAULT_PARTY_A

    const posts = JSON.parse(localStorage.getItem('posts')) || []
    const users = JSON.parse(localStorage.getItem('users')) || []

    const post = posts.find((p) => Number(p.id) === postId)
    if (!post) return DEFAULT_PARTY_A

    const agent = users.find((u) => Number(u.id) === Number(post.user_id))
    if (!agent) return DEFAULT_PARTY_A

    return {
        name: agent.full_name || agent.nickname || DEFAULT_PARTY_A.name,
        address: agent.address || DEFAULT_PARTY_A.address,
        phone: agent.phone || DEFAULT_PARTY_A.phone,
    }
}

let partyA = resolvePartyA()

const params = new URLSearchParams(location.search)
const postId = params.get('post_id') || params.get('property_id') // hỗ trợ link cũ

const navTinDang = document.getElementById('navTinDang')
if (navTinDang && postId) {
    navTinDang.href = `./details.html?post_id=${postId}`
}

// ===== initialize defaults =====
;(function init() {
    const today = new Date()
    const iso = today.toISOString().slice(0, 10)
    signDateEl.value = iso
    amountEl.value = 1000000000

    fullNameEl.addEventListener('input', () => {
        if (!signatureEl.dataset.touched) {
            signatureEl.value = fullNameEl.value
        }
        renderPreview()
    })
    signatureEl.addEventListener('input', () => {
        signatureEl.dataset.touched = '1'
        renderPreview()
    })
    ;[idNumberEl, phoneEl, addressEl, signDateEl, amountEl, durationEl, termsEl, paymentEl].forEach((i) =>
        i.addEventListener('input', renderPreview)
    )
    renderPreview()
})()

// ===== render preview =====
function renderPreview() {
    const name = fullNameEl.value || '—'
    const id = idNumberEl.value || '—'
    const phone = phoneEl.value || '—'
    const address = addressEl.value || '—'
    const date = signDateEl.value ? yyyymmddToLocale(signDateEl.value) : '—'
    const amount = amountEl.value ? formatCurrency(amountEl.value) : '—'
    const durationYears = Number(durationEl.value)
    const durationText = durationYears + ' năm'
    const payment = paymentEl.value
    const terms = termsEl.value || ''
    const sig = signatureEl.value || name

    previewEl.innerHTML = `
    <div style="text-align:center; line-height:1.5; margin-bottom:20px;">
        <h3 style="margin:0; font-size:18px; font-weight:bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
        <p style="margin:0; font-size:16px;">Độc lập - Tự do - Hạnh phúc</p>
        <hr style="width:200px; border:1px solid black; margin:5px auto 20px;">
    </div>

    <div class="title">HỢP ĐỒNG MUA BÁN NHÀ ĐẤT</div>
    <div class="metadata">
      <div>Người ký: <strong>${escapeHtml(name)}</strong></div>
      <div>Ngày ký: <strong>${escapeHtml(date)}</strong></div>
    </div>

    <div class="section"><strong>Bên A (Bên Bán)</strong>
      <div>Họ tên: ${escapeHtml(partyA.name)}</div>
      <div>Địa chỉ: ${escapeHtml(partyA.address)}</div>
      <div>Điện thoại: ${escapeHtml(partyA.phone)}</div>
    </div>

    <div class="section"><strong>Bên B (Bên Mua)</strong>
      <div>Họ tên: ${escapeHtml(name)}</div>
      <div>CCCD/CMTND: ${escapeHtml(id)}</div>
      <div>Điện thoại: ${escapeHtml(phone)}</div>
      <div>Địa chỉ: ${escapeHtml(address)}</div>
    </div>

    <div class="section"><strong>Thông tin hợp đồng</strong>
      <div>Giá trị hợp đồng: <strong>${escapeHtml(amount)}</strong></div>
      <div>Thời hạn hợp đồng: <strong>${escapeHtml(durationText)}</strong> (từ ngày ký)</div>
      <div>Hình thức thanh toán: ${escapeHtml(payment)}</div>
    </div>

    <div class="section"><strong>Điều khoản</strong>
      <div class="terms">${escapeHtml(terms).replace(/\n/g, '<br>')}</div>
    </div>

    <div class="sig">
      <div>Người ký (ký bằng tên):</div>
      <div class="name">${escapeHtml(sig)}</div>
    </div>
  `
}

// ===== build printable HTML =====
function buildPrintableHtml(payload) {
    const partyA = payload.partyA || DEFAULT_PARTY_A // fallback để không bị undefined

    const css = `
    body{font-family:"Be Vietnam Pro",Inter,Arial,sans-serif;color:#14202b;padding:28px;line-height:1.5}
    .container{max-width:800px;margin:0 auto;}
    .title{text-align:center;color:#fa6819;font-weight:700;font-size:20px;margin:20px 0;}
    .meta{display:flex;justify-content:space-between;margin-bottom:18px;font-size:14px}
    .section{margin-bottom:14px;font-size:14px}
    .section .head{font-weight:700;margin-bottom:6px}
    .terms{background:#fafafa;border:1px solid #eee;padding:12px;border-radius:6px}
    .sig{margin-top:28px;text-align:right}
    .sig .name{font-weight:700}
    .quoc-hieu{text-align:center;font-size:15px;line-height:1.4;margin-top:10px}
    .quoc-hieu .line{width:160px;height:1px;background:#000;margin:6px auto;}
  `
    return `
  <!doctype html>
  <html><head><meta charset="utf-8"><title>Hợp đồng</title><style>${css}</style></head>
  <body><div class="container">
    <div class="quoc-hieu">
      <div><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
      <div><em>Độc lập - Tự do - Hạnh phúc</em></div>
      <div class="line"></div>
    </div>

    <h1 class="title">HỢP ĐỒNG MUA BÁN NHÀ ĐẤT</h1>
    <div class="meta"><div>Người ký: <strong>${escapeHtml(
        payload.name
    )}</strong></div><div>Ngày ký: <strong>${escapeHtml(payload.date)}</strong></div></div>

    <div class="section"><div class="head">Bên A (Bên Bán)</div>
      <div>Họ tên: ${escapeHtml(partyA.name)}</div>
      <div>Địa chỉ: ${escapeHtml(partyA.address)}</div>
      <div>Điện thoại: ${escapeHtml(partyA.phone)}</div>
    </div>

    <div class="section"><div class="head">Bên B (Bên Mua)</div>
      <div>Họ tên: ${escapeHtml(payload.name)}</div>
      <div>CCCD/CMTND: ${escapeHtml(payload.id)}</div>
      <div>Điện thoại: ${escapeHtml(payload.phone)}</div>
      <div>Địa chỉ: ${escapeHtml(payload.address)}</div>
    </div>

    <div class="section"><div class="head">Thông tin hợp đồng</div>
      <div>Giá trị hợp đồng: <strong>${escapeHtml(payload.amount)}</strong></div>
      <div>Thời hạn hợp đồng: <strong>${escapeHtml(payload.durationText)}</strong> (từ ngày ký)</div>
      <div>Hình thức thanh toán: ${escapeHtml(payload.payment)}</div>
    </div>

    <div class="section"><div class="head">Điều khoản</div>
      <div class="terms">${escapeHtml(payload.terms).replace(/\n/g, '<br>')}</div>
    </div>

    <div class="sig">
      <div>Người ký (ký bằng tên):</div>
      <div class="name">${escapeHtml(payload.signature)}</div>
    </div>
  </div></body></html>`
}

// ===== on submit =====
form.addEventListener('submit', (e) => {
    e.preventDefault()

    // validate nâng cao
    const name = fullNameEl.value.trim()
    const id = idNumberEl.value.trim()
    const phone = phoneEl.value.trim()
    const address = addressEl.value.trim()
    const amount = Number(amountEl.value)
    const duration = Number(durationEl.value)

    if (!name) return alert('Vui lòng nhập họ tên')
    if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name)) return alert('Họ tên không được chứa số hoặc ký tự đặc biệt')

    if (!id) return alert('Vui lòng nhập CCCD/CMTND')
    if (!/^\d{9,12}$/.test(id)) return alert('Số CCCD/CMTND phải có 9 hoặc 12 chữ số')

    if (!phone) return alert('Vui lòng nhập số điện thoại')
    if (!/^(0|\+84)\d{9}$/.test(phone)) return alert('Số điện thoại không hợp lệ')

    if (!address) return alert('Vui lòng nhập địa chỉ')

    if (!amount || amount <= 0) return alert('Giá trị hợp đồng phải là số dương hợp lệ')

    if (!duration || duration <= 0) return alert('Thời hạn hợp đồng phải là số năm hợp lệ')

    if (!paymentEl.value.trim()) return alert('Vui lòng chọn hình thức thanh toán')

    // Nếu qua hết validate thì mới tạo payload
    const payload = {
        name,
        id,
        phone,
        address,
        date: signDateEl.value
            ? yyyymmddToLocale(signDateEl.value)
            : yyyymmddToLocale(new Date().toISOString().slice(0, 10)),
        amount: formatCurrency(amount),
        durationText: duration + ' năm',
        payment: paymentEl.value,
        terms: termsEl.value,
        signature: signatureEl.value || name,
        partyA,
    }

    // In ra bản hợp đồng
    const html = buildPrintableHtml(payload)
    const w = window.open('', '_blank')
    if (!w) return alert('Trình duyệt chặn cửa sổ bật lên.')
    w.document.open()
    w.document.write(html)
    w.document.close()
    setTimeout(() => {
        w.focus()
        w.print()
    }, 400)
})

// ===== download HTML =====
downloadHtmlBtn.addEventListener('click', () => {
    const payload = {
        name: fullNameEl.value.trim() || 'Khach',
        id: idNumberEl.value.trim(),
        phone: phoneEl.value.trim(),
        address: addressEl.value.trim(),
        date: signDateEl.value
            ? yyyymmddToLocale(signDateEl.value)
            : yyyymmddToLocale(new Date().toISOString().slice(0, 10)),
        amount: formatCurrency(amountEl.value),
        durationText: durationEl.value + ' năm',
        payment: paymentEl.value,
        terms: termsEl.value,
        signature: signatureEl.value || fullNameEl.value.trim(),
        partyA, // ✅ thêm để buildPrintableHtml không bị undefined
    }
    const html = buildPrintableHtml(payload)
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'contract_' + slugifyName(payload.name) + '.html'
    a.click()
})
