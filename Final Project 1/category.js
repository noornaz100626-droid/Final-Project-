// Minimal shared rendering logic for category pages
(function() {
  const categoryFromAttr = document.documentElement.getAttribute('data-category');
  const params = new URLSearchParams(window.location.search);
  const category = (params.get('category') || categoryFromAttr || '').toLowerCase();

  const grid = document.getElementById('products-grid');
  const empty = document.getElementById('products-empty');

  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <div class="product-thumb">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-meta">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>
    `;
    return card;
  }

  function renderProducts(list) {
    if (!grid || !empty) return;
    grid.innerHTML = '';
    if (!list.length) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    list.forEach(p => grid.appendChild(createProductCard(p)));
  }

  async function loadProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      const categoryMap = {
        men: "men's clothing",
        women: "women's clothing",
        electronics: "electronics", // placeholder mapping due to API categories
        accessories: "jewelery"
      };
      const apiCategory = categoryMap[category] || '';
      const filtered = apiCategory ? data.filter(p => (p.category || '').toLowerCase() === apiCategory.toLowerCase()) : data;
      // Normalize fields to match our renderer expectations
      const normalized = filtered.map(p => ({
        id: p.id,
        title: p.title,
        price: Number(p.price) || 0,
        image: p.image,
        category: p.category
      }));
      renderProducts(normalized);
    } catch (err) {
      console.error(err);
      renderProducts([]);
    }
  }

  loadProducts();
})();


