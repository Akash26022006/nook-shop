
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Star,
  Plus,
  Minus,
  X,
  ArrowRight,
  SlidersHorizontal,
  Trash2,
  Menu,
  CheckCircle2,
} from "lucide-react";
import "./index.css";

const products = [
  {
    id: 1,
    name: "Studio Wireless Headphones",
    category: "Electronics",
    price: 2499,
    oldPrice: 3299,
    rating: 4.8,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=85",
    color: "peach",
  },
  {
    id: 2,
    name: "Minimal Everyday Backpack",
    category: "Accessories",
    price: 1899,
    oldPrice: 2499,
    rating: 4.7,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&auto=format&fit=crop&q=85",
    color: "lavender",
  },
  {
    id: 3,
    name: "Essential Running Sneakers",
    category: "Fashion",
    price: 2799,
    oldPrice: 3599,
    rating: 4.9,
    badge: "TRENDING",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=85",
    color: "mint",
  },
  {
    id: 4,
    name: "Modern Smart Watch",
    category: "Electronics",
    price: 3299,
    oldPrice: 4299,
    rating: 4.6,
    badge: "NEW ARRIVAL",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=85",
    color: "blue",
  },
  {
    id: 5,
    name: "Everyday Classic Sunglasses",
    category: "Accessories",
    price: 999,
    oldPrice: 1499,
    rating: 4.5,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&auto=format&fit=crop&q=85",
    color: "peach",
  },
  {
    id: 6,
    name: "Premium Everyday Sneakers",
    category: "Fashion",
    price: 2199,
    oldPrice: 2999,
    rating: 4.8,
    badge: "TOP RATED",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&auto=format&fit=crop&q=85",
    color: "lavender",
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 1599,
    oldPrice: 2199,
    rating: 4.6,
    badge: "",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700&auto=format&fit=crop&q=85",
    color: "mint",
  },
  {
    id: 8,
    name: "Daily Carry Crossbody Bag",
    category: "Accessories",
    price: 1299,
    oldPrice: 1799,
    rating: 4.7,
    badge: "JUST IN",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&auto=format&fit=crop&q=85",
    color: "blue",
  },
];

const categories = ["All Products", "Electronics", "Fashion", "Accessories"];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nook-cart")) || [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("nook-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 2200);
    return () => clearTimeout(timer);
  }, [notice]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All Products" ||
        product.category === activeCategory;

      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeCategory, search, sort]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal === 0 || subtotal >= 2999 ? 0 : 99;
  const total = subtotal + shipping;

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });

    setNotice(`${product.name} added to your bag`);
    setCheckoutMessage("");
  }

  function changeQuantity(id, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id]
    );
  }

  function handleCheckout() {
    if (cart.length === 0) return;
    setCheckoutMessage(
      "Demo checkout successful! No real payment was processed."
    );
  }

  function selectCategory(category) {
    setActiveCategory(category);
    setMobileMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <div className="announcement">
        <span>THE EVERYDAY EDIT</span>
        <span>Thoughtful finds. Better living.</span>
        <span>Free shipping over ₹2,999</span>
      </div>

      <header className="site-header">
        <button
          className="icon-button mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={21} />
        </button>

        <a className="brand" href="#home" aria-label="Nook home">
          nook<span>.</span>
        </a>

        <nav className={`main-nav ${mobileMenuOpen ? "nav-open" : ""}`}>
          {categories.map((category) => (
            <button
              key={category}
              className={`nav-link ${
                activeCategory === category ? "nav-link-active" : ""
              }`}
              onClick={() => selectCategory(category)}
            >
              {category === "All Products" ? "Shop all" : category}
            </button>
          ))}
          <a className="nav-link" href="#story">
            Our story
          </a>
        </nav>

        <div className="header-actions">
          <label className="header-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </label>

          <button
            className="icon-button cart-trigger"
            onClick={() => setCartOpen(true)}
            aria-label={`Open shopping bag, ${cartCount} items`}
          >
            <ShoppingBag size={21} />
            <span className="cart-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR NEW EVERYDAY
            </div>

            <h1>
              Good things.
              <br />
              <span>Great finds.</span>
            </h1>

            <p>
              A little something for the way you live. Discover considered
              essentials that make every day feel a little more special.
            </p>

            <a className="primary-button" href="#products">
              Explore the collection <ArrowRight size={18} />
            </a>

            <div className="hero-proof">
              <div className="avatar-stack">
                <span>J</span>
                <span>M</span>
                <span>A</span>
              </div>
              <div>
                <div className="proof-stars">★★★★★</div>
                <p>Loved by everyday explorers</p>
              </div>
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=90"
                alt="A curated collection of everyday fashion essentials"
              />
            </div>

            <div className="floating-note">
              <span className="floating-note-icon">
                <Star size={17} fill="currentColor" />
              </span>
              <div>
                <strong>Little things,</strong>
                <p>big everyday joy.</p>
              </div>
            </div>

            <div className="hero-stamp">
              <span>CURATED</span>
              <span>WITH CARE</span>
              <span className="stamp-star">✳</span>
            </div>
          </div>
        </section>

        <section className="benefit-strip">
          <div>
            <CheckCircle2 size={19} />
            <span>Thoughtfully selected</span>
          </div>
          <div>
            <ShoppingBag size={19} />
            <span>Easy, secure shopping</span>
          </div>
          <div>
            <Heart size={19} />
            <span>Made for everyday life</span>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                THE NOOK COLLECTION
              </div>
              <h2>Find your favourites.</h2>
              <p>Useful things. Lovely details. Just your kind of finds.</p>
            </div>

            <div className="sort-control">
              <SlidersHorizontal size={17} />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </div>

          <div className="category-pills">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => selectCategory(category)}
                className={`category-pill ${
                  activeCategory === category ? "category-pill-active" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="results-line">
            <span>
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                Clear search <X size={14} />
              </button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className={`product-image ${product.color}`}>
                    <img src={product.image} alt={product.name} loading="lazy" />

                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}

                    <button
                      className={`favorite-button ${
                        favorites.includes(product.id) ? "is-favorite" : ""
                      }`}
                      onClick={() => toggleFavorite(product.id)}
                      aria-label={
                        favorites.includes(product.id)
                          ? "Remove from favourites"
                          : "Add to favourites"
                      }
                    >
                      <Heart
                        size={18}
                        fill={
                          favorites.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <button
                      className="quick-add"
                      onClick={() => addToCart(product)}
                    >
                      <Plus size={17} /> Add to bag
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3>{product.name}</h3>

                    <div className="product-bottom">
                      <div className="product-prices">
                        <strong>{money(product.price)}</strong>
                        <span>{money(product.oldPrice)}</span>
                      </div>

                      <div className="rating">
                        <Star size={14} fill="currentColor" />
                        {product.rating}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <Search size={34} />
              <h3>No products found</h3>
              <p>Try another search or select a different category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Products");
                }}
              >
                Show all products
              </button>
            </div>
          )}
        </section>

        <section className="story-section" id="story">
          <div className="story-mark">n.</div>
          <div>
            <div className="eyebrow">A LITTLE ABOUT US</div>
            <h2>Everyday essentials, with a little extra thought.</h2>
            <p>
              Nook is a demo storefront built around a simple idea: good design
              belongs in everyday life. Explore the collection, find your
              favourites and make the bag your own.
            </p>
          </div>
          <a href="#products" className="story-link">
            Shop the collection <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          nook<span>.</span>
        </a>
        <p>Good finds for everyday life.</p>
        <span>© 2026 Nook Store · Demo project</span>
      </footer>

      {notice && (
        <div className="toast-message" role="status">
          <CheckCircle2 size={19} />
          <span>{notice}</span>
        </div>
      )}

      {cartOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setCartOpen(false)}
          role="presentation"
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
            aria-label="Shopping bag"
          >
            <div className="drawer-header">
              <div>
                <div className="eyebrow">YOUR SELECTION</div>
                <h2>Your bag ({cartCount})</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping bag"
              >
                <X size={22} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  <ShoppingBag size={30} />
                </div>
                <h3>Your bag is taking a break.</h3>
                <p>Find something lovely to bring home.</p>
                <button
                  className="primary-button"
                  onClick={() => setCartOpen(false)}
                >
                  Explore products <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt={item.name} />

                      <div className="cart-item-info">
                        <span className="product-category">
                          {item.category}
                        </span>
                        <h3>{item.name}</h3>
                        <strong>{money(item.price)}</strong>

                        <div className="quantity-control">
                          <button
                            onClick={() => changeQuantity(item.id, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => changeQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  {subtotal < 2999 && (
                    <div className="shipping-hint">
                      Add {money(2999 - subtotal)} more for free shipping.
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? "FREE" : money(shipping)}</strong>
                  </div>
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <strong>{money(total)}</strong>
                  </div>
                  <button className="checkout-button" onClick={handleCheckout}>
                    Continue to checkout <ArrowRight size={18} />
                  </button>
                  <p className="demo-note">
                    Demo checkout only. No real payment is collected.
                  </p>
                  {checkoutMessage && (
                    <p className="checkout-message" role="status">
                      {checkoutMessage}
                    </p>
                  )}
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
