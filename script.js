// Helper: format harga ke Rupiah
function toRupiah(angka) {
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Update cart count di semua halaman
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = cart.reduce((total, item) => total + item.qty, 0);
  });
}

// Tambahkan produk ke keranjang
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(item => item.id === product.id);
  if (idx !== -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({...product, qty: 1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Untuk halaman index.html dan navigasi hamburger
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Event tombol beli produk
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = btn.closest('.product-card');
      const product = {
        id: card.getAttribute('data-id'),
        name: card.getAttribute('data-name'),
        price: parseInt(card.getAttribute('data-price')),
        img: card.getAttribute('data-img')
      };
      addToCart(product);
      btn.textContent = "Ditambahkan!";
      setTimeout(() => btn.textContent = "Beli", 1300);
    });
  });

  // Untuk halaman checkout
  if (document.getElementById('cart-items')) {
    renderCart();
    document.getElementById('checkout-btn').addEventListener('click', function() {
      // Proteksi: Cek login
      const isLogin = localStorage.getItem("isLogin") === "true";
      if(!isLogin) {
        alert("Silakan login dulu untuk checkout.");
        return;
      }
      localStorage.removeItem('cart');
      updateCartCount();
      renderCart();
      document.getElementById('checkout-success').style.display = 'block';
      this.textContent = "Checkout Berhasil!";
      this.disabled = true;
      setTimeout(() => {
        document.getElementById('checkout-success').style.display = 'none';
        this.textContent = "Checkout Sekarang";
        this.disabled = false;
      }, 2000);
    });
  }
});

// Render cart di checkout.html
function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cart.length) {
    cartItems.innerHTML = "<p style='color:#999; margin-bottom:2rem;'>Keranjang kosong.</p>";
    cartTotal.textContent = 'Rp 0';
    document.getElementById('checkout-btn').disabled = true;
    return;
  }
  let html = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    html += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-info">
          <div>${item.name}</div>
          <div>Qty: ${item.qty}</div>
          <div class="cart-item-price">${toRupiah(item.price * item.qty)}</div>
        </div>
      </div>
    `;
  });
  cartItems.innerHTML = html;
  cartTotal.textContent = toRupiah(total);
  document.getElementById('checkout-btn').disabled = false;
}
