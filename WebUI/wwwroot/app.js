// Single Page Application Router & Logic

const routes = {
  '#/': 'view-home',
  '#/products': 'view-products',
  '#/policies': 'view-policies',
  '#/dashboard': 'view-dashboard',
  '#/chat': 'view-chat',
  '#/account': 'view-account'
};

function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

function handleRouteChange() {
  let hash = window.location.hash || '#/';
  // Normalize query strings like #/chat?demo=1 -> #/chat
  let cleanHash = hash.split('?')[0];

  if (!routes[cleanHash]) {
    cleanHash = '#/';
  }

  // Hide all views
  document.querySelectorAll('.page-view').forEach(view => {
    view.style.display = 'none';
  });

  // Show target view
  const targetViewId = routes[cleanHash];
  const targetEl = document.getElementById(targetViewId);
  if (targetEl) {
    targetEl.style.display = 'block';
  }

  // Update nav active state
  document.querySelectorAll('#nav a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href.startsWith(cleanHash)) {
      link.classList.add('active');
    }
  });

  // Auto trigger view logic
  if (cleanHash === '#/products') {
    loadProducts();
  } else if (cleanHash === '#/account') {
    lookupAccount();
  }
}

// 1. CHAT LOGIC
function initChat() {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const sysTimeEl = document.getElementById('sys-time');
  if (sysTimeEl) sysTimeEl.textContent = timeStr;

  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendBubble('user', 'Đại lý tư vấn', text);
    chatInput.value = '';

    // Attempt to notify backend ChatService (Port 4099)
    try {
      fetch('http://localhost:4099/api/Notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      }).catch(() => {});
    } catch (e) {}

    // Simulated response from Support Agent / System
    setTimeout(() => {
      appendBubble('agent', 'Hệ thống hỗ trợ', `Cảm ơn bạn đã liên hệ! Tin nhắn "${text}" đã được gửi qua mạng nội bộ SignalR.`);
    }, 700);
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
}

function appendBubble(type, sender, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}-bubble`;
  bubble.innerHTML = `
    <div class="bubble-meta">${sender} &middot; ${timeStr}</div>
    <div class="bubble-content">${escapeHtml(text)}</div>
  `;

  container.appendChild(bubble);

  // Auto scroll to bottom
  const chatCard = document.querySelector('.chat-box-card');
  if (chatCard) chatCard.scrollTop = chatCard.scrollHeight;
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.innerText = string;
  return div.innerHTML;
}

// 2. PRODUCTS LOGIC
const defaultProducts = [
  {
    code: 'TRI',
    name: 'Safe Traveller',
    icon: 'plane',
    description: 'Bảo hiểm du lịch toàn diện bảo vệ chi phí y tế và sự cố khi đi lại.',
    covers: ['Illness ($5,000)', 'Assistance']
  },
  {
    code: 'HSI',
    name: 'Happy House',
    icon: 'home',
    description: 'Bảo hiểm nhà ở bảo vệ tài sản trước hỏa hoạn, ngập lụt và mất cắp.',
    covers: ['Fire ($200,000)', 'Flood ($100,000)', 'Theft ($50,000)', 'Assistance']
  },
  {
    code: 'FAI',
    name: 'Happy Farm',
    icon: 'apple-alt',
    description: 'Bảo hiểm trang trại dành cho mùa màng và trang thiết bị nông nghiệp.',
    covers: ['Crops ($200,000)', 'Flood ($100,000)', 'Fire ($50,000)', 'Equipment ($300,000)']
  },
  {
    code: 'CAR',
    name: 'Happy Driver',
    icon: 'car',
    description: 'Bảo hiểm xe cơ giới bảo đảm an toàn trên mọi hành trình lưu thông.',
    covers: ['Assistance']
  }
];

async function loadProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading-spinner"><i class="fa fa-circle-notch fa-spin"></i> Đang tải dữ liệu sản phẩm từ ProductService (Cổng 5030)...</div>';

  let products = defaultProducts;

  try {
    const res = await fetch('http://localhost:5030/api/Products', { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        products = data.map(p => ({
          code: p.code,
          name: p.name,
          icon: p.icon || 'shield-alt',
          description: p.description || 'Gói bảo hiểm chính hãng.',
          covers: p.covers ? p.covers.map(c => `${c.name} ${c.sumInsured ? '($' + c.sumInsured + ')' : ''}`) : []
        }));
      }
    }
  } catch (err) {
    console.log('ProductService not responding or CORS, using seeded product list');
  }

  renderProducts(products);
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = products.map(p => {
    let iconClass = 'fa-shield-alt';
    if (p.icon === 'plane') iconClass = 'fa-plane-departure';
    else if (p.icon === 'building' || p.icon === 'home') iconClass = 'fa-home';
    else if (p.icon === 'apple' || p.icon === 'apple-alt') iconClass = 'fa-seedling';
    else if (p.icon === 'car') iconClass = 'fa-car';

    const coversHtml = p.covers.map(c => `<span class="cover-tag">${c}</span>`).join('');

    return `
      <div class="product-card">
        <div class="product-icon"><i class="fa ${iconClass}"></i></div>
        <div class="product-code">${p.code}</div>
        <div class="product-title">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-covers-title">Quyền lợi bảo hiểm:</div>
        <div class="covers-tags">${coversHtml}</div>
        <button class="btn btn-primary" style="margin-top:auto;" onclick="alert('Đã chọn gói bảo hiểm ${p.name} (${p.code})')">Đăng ký báo giá</button>
      </div>
    `;
  }).join('');
}

// 3. ACCOUNT / PAYMENT LOGIC
let currentBalance = 0;

async function lookupAccount() {
  const input = document.getElementById('policy-number-input');
  const policyNo = (input && input.value.trim()) || 'POLICY_1';

  let accountData = {
    policyNumber: policyNo,
    policyAccountNumber: '231232132131',
    balance: currentBalance
  };

  try {
    const res = await fetch(`http://localhost:5070/api/Payment/accounts/${policyNo}`, { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.balance) {
        accountData.policyAccountNumber = data.balance.policyAccountNumber || '231232132131';
        accountData.balance = data.balance.balance || currentBalance;
      }
    }
  } catch (e) {
    console.log('PaymentService fallback');
  }

  document.getElementById('acc-policy-no').textContent = accountData.policyNumber;
  document.getElementById('acc-account-no').textContent = accountData.policyAccountNumber;
  document.getElementById('acc-balance').textContent = `${accountData.balance.toFixed(2)} USD`;
  document.getElementById('account-result').style.display = 'block';
}

function makePayment() {
  const amountInput = document.getElementById('pay-amount');
  const amount = parseFloat(amountInput.value) || 0;
  if (amount <= 0) {
    alert('Vui lòng nhập số tiền hợp lệ lớn hơn 0');
    return;
  }

  currentBalance += amount;
  document.getElementById('acc-balance').textContent = `${currentBalance.toFixed(2)} USD`;

  const alertBox = document.getElementById('pay-alert');
  alertBox.style.display = 'block';
  alertBox.innerHTML = `<i class="fa fa-check-circle"></i> Đã thanh toán thành công <strong>${amount.toFixed(2)} USD</strong> vào tài khoản hợp đồng! Mã biên lai: RCP-${Date.now().toString().slice(-6)}.`;
}

// Startup
document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initChat();
});
