import { useEffect, useMemo, useState } from 'react';

type Role = 'customer' | 'manager';

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  zone: string;
  address: string;
};

type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
};

type Gardener = {
  id: string;
  name: string;
  specialization: string;
  zone: string;
  rating: number;
  availability: boolean;
};

type Booking = {
  id: string;
  customerId: string;
  serviceId: string;
  gardenerId: string;
  date: string;
  zone: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  notes: string;
  total: number;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  emoji: string;
};

type OrderItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'Paid' | 'Processing' | 'Delivered';
  createdAt: string;
};

type InventoryRecord = {
  productId: string;
  stock: number;
  reorderPoint: number;
  lastUpdated: string;
};

type BusinessData = {
  users: User[];
  services: Service[];
  gardeners: Gardener[];
  bookings: Booking[];
  products: Product[];
  orders: Order[];
  inventory: InventoryRecord[];
};

const STORAGE_KEY = 'root-bloom-cia3-data';

const initialData: BusinessData = {
  users: [
    { id: 'u1', name: 'Aarav Mehta', email: 'aarav@example.com', role: 'customer', zone: 'Koramangala', address: '12, 4th Block' },
    { id: 'u2', name: 'Nisha Rao', email: 'nisha@example.com', role: 'customer', zone: 'Whitefield', address: '77, Brigade Street' },
    { id: 'm1', name: 'Manager Priya', email: 'manager@rootandbloom.co', role: 'manager', zone: 'Bengaluru', address: 'HQ' },
  ],
  services: [
    { id: 's1', name: 'Lawn Maintenance', category: 'Outdoor Care', price: 899, duration: 120 },
    { id: 's2', name: 'Landscape Design', category: 'Design', price: 2199, duration: 180 },
    { id: 's3', name: 'Pest Control', category: 'Plant Health', price: 1299, duration: 90 },
    { id: 's4', name: 'Seasonal Pruning', category: 'Maintenance', price: 1099, duration: 100 },
  ],
  gardeners: [
    { id: 'g1', name: 'Ravi Kumar', specialization: 'Lawn Maintenance', zone: 'Koramangala', rating: 4.9, availability: true },
    { id: 'g2', name: 'Meera Iyer', specialization: 'Landscape Design', zone: 'Whitefield', rating: 4.8, availability: true },
    { id: 'g3', name: 'Sandeep Das', specialization: 'Pest Control', zone: 'Indiranagar', rating: 4.7, availability: true },
    { id: 'g4', name: 'Harini Nair', specialization: 'Seasonal Pruning', zone: 'Koramangala', rating: 4.6, availability: true },
    { id: 'g5', name: 'Karthik Roy', specialization: 'Landscape Design', zone: 'Koramangala', rating: 4.5, availability: true },
  ],
  bookings: [
    { id: 'BK-1001', customerId: 'u1', serviceId: 's1', gardenerId: 'g1', date: '2026-09-05', zone: 'Koramangala', status: 'Confirmed', notes: 'Front lawn trimming', total: 899 },
    { id: 'BK-1002', customerId: 'u2', serviceId: 's2', gardenerId: 'g2', date: '2026-09-07', zone: 'Whitefield', status: 'Pending', notes: 'Terrace redesign', total: 2199 },
  ],
  products: [
    { id: 'p1', name: 'Snake Plant', category: 'Plants', price: 449, stock: 12, reorderPoint: 5, emoji: '🌿' },
    { id: 'p2', name: 'Organic Compost', category: 'Soil & Fertilizer', price: 299, stock: 18, reorderPoint: 8, emoji: '🌾' },
    { id: 'p3', name: 'Pruning Shears', category: 'Tools', price: 399, stock: 7, reorderPoint: 5, emoji: '✂️' },
    { id: 'p4', name: 'Ceramic Planter', category: 'Pots', price: 799, stock: 4, reorderPoint: 6, emoji: '🏺' },
    { id: 'p5', name: 'Solar Garden Lights', category: 'Decor', price: 899, stock: 10, reorderPoint: 6, emoji: '✨' },
  ],
  orders: [
    { id: 'OR-2001', customerId: 'u1', items: [{ productId: 'p1', quantity: 2, unitPrice: 449 }], total: 898, status: 'Delivered', createdAt: '2026-08-15' },
    { id: 'OR-2002', customerId: 'u2', items: [{ productId: 'p2', quantity: 1, unitPrice: 299 }], total: 299, status: 'Processing', createdAt: '2026-08-20' },
  ],
  inventory: [
    { productId: 'p1', stock: 12, reorderPoint: 5, lastUpdated: '2026-08-24' },
    { productId: 'p2', stock: 18, reorderPoint: 8, lastUpdated: '2026-08-24' },
    { productId: 'p3', stock: 7, reorderPoint: 5, lastUpdated: '2026-08-24' },
    { productId: 'p4', stock: 4, reorderPoint: 6, lastUpdated: '2026-08-24' },
    { productId: 'p5', stock: 10, reorderPoint: 6, lastUpdated: '2026-08-24' },
  ],
};

function loadData(): BusinessData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialData;
  } catch {
    return initialData;
  }
}

function calculatePriorityScore(gardener: Gardener, customerZone: string, currentBookings: number): number {
  const zoneMatch = gardener.zone === customerZone ? 1 : 0;
  const workloadFactor = 1 - Math.min(currentBookings / 6, 1);
  return Number((0.5 * gardener.rating + 0.3 * zoneMatch + 0.2 * workloadFactor).toFixed(2));
}

function findBestGardener(service: Service, zone: string, gardeners: Gardener[], bookings: Booking[]): Gardener | null {
  const sameSpecialization = gardeners.filter((g) => g.specialization === service.name || g.specialization === service.category);
  const availableCandidates = sameSpecialization.filter((g) => {
    const assignedThisDay = bookings.filter((b) => b.gardenerId === g.id && b.date === new Date().toISOString().slice(0, 10)).length;
    return g.availability && assignedThisDay < 3;
  });

  if (availableCandidates.length === 0) return null;

  const ranked = availableCandidates.map((g) => ({
    gardener: g,
    score: calculatePriorityScore(g, zone, bookings.filter((b) => b.gardenerId === g.id).length),
  }));

  ranked.sort((a, b) => b.score - a.score);
  return ranked[0].gardener;
}

function recommendReorder(stock: number, reorderPoint: number) {
  return stock <= reorderPoint ? Math.max(12, reorderPoint * 2 - stock) : 0;
}

export default function App() {
  const [data, setData] = useState<BusinessData>(() => loadData());
  const [selectedRole, setSelectedRole] = useState<Role>('customer');
  const [selectedUserId, setSelectedUserId] = useState('u1');
  const [serviceId, setServiceId] = useState('s1');
  const [selectedBookingDate, setSelectedBookingDate] = useState('2026-09-10');
  const [selectedZone, setSelectedZone] = useState('Koramangala');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem('root-bloom-cart') ?? '{}');
    } catch {
      return {};
    }
  });
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('root-bloom-cart', JSON.stringify(cart));
  }, [cart]);

  const loggedUser = data.users.find((user) => user.id === selectedUserId) ?? data.users[0];

  const customerBookings = useMemo(
    () => data.bookings.filter((booking) => booking.customerId === loggedUser.id),
    [data.bookings, loggedUser.id],
  );

  const customerOrders = useMemo(
    () => data.orders.filter((order) => order.customerId === loggedUser.id),
    [data.orders, loggedUser.id],
  );

  const managerSummary = useMemo(() => {
    const totalRevenue = data.bookings.reduce((sum, booking) => sum + booking.total, 0);
    const pending = data.bookings.filter((booking) => booking.status === 'Pending').length;
    const avgRating = data.gardeners.reduce((sum, g) => sum + g.rating, 0) / data.gardeners.length;
    return { totalRevenue, pending, avgRating: Number(avgRating.toFixed(2)) };
  }, [data]);

  const handleBookService = (event: React.FormEvent) => {
    event.preventDefault();
    const selectedService = data.services.find((service) => service.id === serviceId);
    if (!selectedService) return;

    const today = new Date().toISOString().slice(0, 10);
    if (selectedBookingDate < today) {
      setBookingMessage('Choose today or a future date for your service.');
      return;
    }
    if (bookingNotes.length > 240) {
      setBookingMessage('Notes must be 240 characters or fewer.');
      return;
    }

    const assignedGardener = findBestGardener(selectedService, selectedZone, data.gardeners, data.bookings);
    if (!assignedGardener) {
      setBookingMessage('No available gardener matches this service. Please choose another option.');
      return;
    }

    const booking: Booking = {
      id: `BK-${Date.now()}`,
      customerId: loggedUser.id,
      serviceId: selectedService.id,
      gardenerId: assignedGardener.id,
      date: selectedBookingDate,
      zone: selectedZone,
      status: 'Confirmed',
      notes: bookingNotes || 'Customer requested standard visit',
      total: selectedService.price,
    };

    setData((current) => ({
      ...current,
      bookings: [booking, ...current.bookings],
    }));

    setBookingNotes('');
    setServiceId(selectedService.id);
    setBookingMessage(`Booking confirmed. ${assignedGardener.name} has been assigned.`);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setData((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status } : booking,
      ),
    }));
  };

  const cancelBooking = (bookingId: string) => {
    setData((current) => ({
      ...current,
      bookings: current.bookings.filter((booking) => booking.id !== bookingId),
    }));
  };

  const addToCart = (productId: string) => {
    const product = data.products.find((item) => item.id === productId);
    if (!product || product.stock <= (cart[productId] ?? 0)) return;
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + 1,
    }));
  };

  const checkoutCart = () => {
    const items = Object.entries(cart)
      .map(([productId, quantity]) => {
        const product = data.products.find((item) => item.id === productId);
        if (!product || quantity <= 0) return null;
        return { productId, quantity, unitPrice: product.price };
      })
      .filter(Boolean) as OrderItem[];

    if (items.length === 0) return;

    const unavailable = items.find((item) => {
      const product = data.products.find((entry) => entry.id === item.productId);
      return !product || item.quantity > product.stock;
    });
    if (unavailable) {
      setCart((current) => ({ ...current, [unavailable.productId]: data.products.find((product) => product.id === unavailable.productId)?.stock ?? 0 }));
      return;
    }

    const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const order: Order = {
      id: `OR-${Date.now()}`,
      customerId: loggedUser.id,
      items,
      total,
      status: 'Processing',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setData((current) => ({
      ...current,
      orders: [order, ...current.orders],
      products: current.products.map((product) => {
        const item = items.find((entry) => entry.productId === product.id);
        return item ? { ...product, stock: product.stock - item.quantity } : product;
      }),
      inventory: current.inventory.map((record) => {
        const item = items.find((entry) => entry.productId === record.productId);
        return item ? { ...record, stock: record.stock - item.quantity, lastUpdated: new Date().toISOString().slice(0, 10) } : record;
      }),
    }));

    setCart({});
  };

  const updateInventory = (productId: string, newStock: number) => {
    setData((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product,
      ),
      inventory: current.inventory.map((record) =>
        record.productId === productId ? { ...record, stock: newStock, lastUpdated: new Date().toISOString().slice(0, 10) } : record,
      ),
    }));
  };

  const addNewProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const category = String(form.get('category') ?? 'Plants');
    const price = Number(form.get('price') ?? 0);
    const stock = Number(form.get('stock') ?? 0);
    const reorderPoint = Number(form.get('reorderPoint') ?? 5);

    if (!name || price <= 0) return;

    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name,
      category,
      price,
      stock,
      reorderPoint,
      emoji: '🌱',
    };

    setData((current) => ({
      ...current,
      products: [newProduct, ...current.products],
      inventory: [{ productId: newProduct.id, stock, reorderPoint, lastUpdated: new Date().toISOString().slice(0, 10) }, ...current.inventory],
    }));
    event.currentTarget.reset();
  };

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = data.products.find((item) => item.id === productId);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean) as Array<{ product: Product; quantity: number }>;

  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const visibleProducts = data.products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(productSearch.toLowerCase()),
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Root & Bloom</p>
          <h1>Digital Business System</h1>
        </div>
        <div className="role-switch">
          <button className={selectedRole === 'customer' ? 'active' : ''} onClick={() => setSelectedRole('customer')}>
            Customer View
          </button>
          <button className={selectedRole === 'manager' ? 'active' : ''} onClick={() => setSelectedRole('manager')}>
            Manager View
          </button>
        </div>
      </header>

      <section className="login-bar">
        <label>
          Logged in as
          <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
            {data.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </label>
        <div className="user-meta">
          <strong>{loggedUser.name}</strong>
          <span>{loggedUser.zone}</span>
        </div>
      </section>

      {selectedRole === 'customer' ? (
        <main className="customer-layout">
          <section className="panel hero-panel">
            <div>
              <p className="eyebrow">Customer Dashboard</p>
              <h2>Book services and shop essentials</h2>
            </div>
            <div className="hero-stats">
              <div><span>Bookings</span><strong>{customerBookings.length}</strong></div>
              <div><span>Orders</span><strong>{customerOrders.length}</strong></div>
              <div><span>Zone</span><strong>{loggedUser.zone}</strong></div>
            </div>
          </section>

          <section className="panel booking-panel">
            <h3>Service Booking</h3>
            <form onSubmit={handleBookService} className="booking-form">
              <label>
                Service
                <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
                  {data.services.map((service) => (
                    <option key={service.id} value={service.id}>{service.name} - ₹{service.price}</option>
                  ))}
                </select>
              </label>
              <label>
                Preferred date
                <input type="date" value={selectedBookingDate} onChange={(event) => setSelectedBookingDate(event.target.value)} />
              </label>
              <label>
                Service zone
                <select value={selectedZone} onChange={(event) => setSelectedZone(event.target.value)}>
                  {['Koramangala', 'Whitefield', 'Indiranagar', 'HSR Layout', 'Banaswadi'].map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </label>
              <label className="full-width">
                Notes
                <textarea value={bookingNotes} onChange={(event) => setBookingNotes(event.target.value)} placeholder="Need watering, pruning or soil treatment?" />
              </label>
              <button type="submit" className="primary-btn">Book Service</button>
              {bookingMessage && <p className="form-message" role="status">{bookingMessage}</p>}
            </form>
          </section>

          <section className="panel shopping-panel">
            <h3>Marketplace</h3>
            <input
              className="product-search"
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Search plants, tools and supplies"
              aria-label="Search products"
            />
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-emoji">{product.emoji}</div>
                  <h4>{product.name}</h4>
                  <p>{product.category}</p>
                  <div className="product-row">
                    <span>₹{product.price}</span>
                    <button onClick={() => addToCart(product.id)} disabled={product.stock === 0 || (cart[product.id] ?? 0) >= product.stock}>
                      {product.stock === 0 ? 'Out of stock' : (cart[product.id] ?? 0) >= product.stock ? 'Max added' : 'Add'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-box">
              <h4>Cart Summary</h4>
              {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
                <>
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="cart-row">
                      <span>{product.name} × {quantity}</span>
                      <strong>₹{product.price * quantity}</strong>
                    </div>
                  ))}
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{cartTotal}</strong>
                  </div>
                  <button onClick={checkoutCart} className="primary-btn">Checkout</button>
                </>
              )}
            </div>
          </section>

          <section className="panel list-panel">
            <h3>My Bookings</h3>
            {customerBookings.length === 0 ? <p>No bookings yet.</p> : (
              <div className="list-stack">
                {customerBookings.map((booking) => {
                  const service = data.services.find((item) => item.id === booking.serviceId);
                  const gardener = data.gardeners.find((item) => item.id === booking.gardenerId);
                  return (
                    <div key={booking.id} className="list-item">
                      <div>
                        <strong>{service?.name}</strong>
                        <p>{booking.date} • {booking.zone}</p>
                        <small>Assigned to {gardener?.name}</small>
                      </div>
                      <div className="status-actions">
                        <span className={`badge ${booking.status.toLowerCase().replace(' ', '-')}`}>{booking.status}</span>
                        {booking.status !== 'Completed' && <button onClick={() => cancelBooking(booking.id)}>Cancel</button>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="panel list-panel">
            <h3>Order History</h3>
            {customerOrders.length === 0 ? <p>No orders yet.</p> : (
              <div className="list-stack">
                {customerOrders.map((order) => (
                  <div key={order.id} className="list-item">
                    <div>
                      <strong>{order.id}</strong>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="status-actions">
                      <span className="badge paid">{order.status}</span>
                      <strong>₹{order.total}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
        <main className="manager-layout">
          <section className="panel kpi-panel">
            <div>
              <p className="eyebrow">Manager Dashboard</p>
              <h2>Operations at a glance</h2>
            </div>
            <div className="kpi-grid">
              <div className="kpi-card">
                <span>Total revenue</span>
                <strong>₹{managerSummary.totalRevenue}</strong>
              </div>
              <div className="kpi-card">
                <span>Pending bookings</span>
                <strong>{managerSummary.pending}</strong>
              </div>
              <div className="kpi-card">
                <span>Avg. gardener rating</span>
                <strong>{managerSummary.avgRating}/5</strong>
              </div>
            </div>
          </section>

          <section className="panel manager-panel">
            <h3>Booking Management</h3>
            <div className="list-stack">
              {data.bookings.map((booking) => {
                const customer = data.users.find((u) => u.id === booking.customerId);
                const service = data.services.find((s) => s.id === booking.serviceId);
                return (
                  <div key={booking.id} className="list-item">
                    <div>
                      <strong>{customer?.name}</strong>
                      <p>{service?.name} • {booking.date}</p>
                    </div>
                    <div className="status-actions">
                      <select value={booking.status} onChange={(event) => updateBookingStatus(booking.id, event.target.value as Booking['status'])}>
                        {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button onClick={() => deleteBooking(booking.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel manager-panel">
            <h3>Inventory & Reorder Logic</h3>
            <div className="inventory-table">
              {data.products.map((product) => {
                const reorderQty = recommendReorder(product.stock, product.reorderPoint);
                return (
                  <div key={product.id} className="inventory-row">
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={product.stock}
                        min={0}
                        onChange={(event) => updateInventory(product.id, Number(event.target.value))}
                      />
                    </div>
                    <div>
                      <span className={reorderQty > 0 ? 'warning' : 'safe'}>
                        {reorderQty > 0 ? `Reorder ${reorderQty} units` : 'Healthy stock'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel manager-panel">
            <h3>Add New Product</h3>
            <form className="add-product-form" onSubmit={addNewProduct}>
              <input name="name" placeholder="Product name" required />
              <input name="category" placeholder="Category" defaultValue="Plants" />
              <input name="price" type="number" placeholder="Price" min="1" required />
              <input name="stock" type="number" placeholder="Stock" min="0" required />
              <input name="reorderPoint" type="number" placeholder="Reorder point" min="0" defaultValue="5" />
              <button type="submit" className="primary-btn">Add product</button>
            </form>
          </section>
        </main>
      )}
    </div>
  );
}
