import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { resolveMediaUrl } from "../utils/mediaUrl";

const FILTERS = ["all", "active", "delivered", "cancelled"];
const ACTIVE_STATUSES = ["pending", "confirmed", "processing", "shipped"];
const STATUS_STEP = { pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4 };

const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

const dateLabel = (value) =>
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));

const getItemTitle = (item) => item.title || item.name || item.product?.title || "Wellness essential";
const getItemImage = (item) => resolveMediaUrl(item.image || item.product?.images?.[0]?.url || "/p-1.png");

function OrderCard({ order, onCancel, cancelling }) {
  const [open, setOpen] = useState(false);
  const status = order.orderStatus || "pending";
  const currentStep = STATUS_STEP[status] ?? 0;
  const isActive = ACTIVE_STATUSES.includes(status);
  const shortId = String(order._id || "").slice(-8).toUpperCase();
  const address = order.shippingAddress || {};

  return (
    <article className={`order-card order-card--${status}`}>
      <div className="order-card-head">
        <div>
          <p className="order-label">Order number</p>
          <h2 className="order-number">#{shortId}</h2>
        </div>
        <div className="order-head-meta">
          <div><p className="order-label">Placed on</p><p>{dateLabel(order.createdAt)}</p></div>
          <span className={`order-status order-status--${status}`}><i className="fa-solid fa-circle" /> {status}</span>
        </div>
      </div>

      {isActive && (
        <div className="order-progress" aria-label={`Order status: ${status}`}>
          {["Confirmed", "Processing", "Shipped", "Delivered"].map((label, index) => {
            const reached = currentStep >= index + 1;
            return (
              <div className={`order-progress-step ${reached ? "is-reached" : ""}`} key={label}>
                <span>{reached ? <i className="fa-solid fa-check" /> : index + 1}</span>
                <small>{label}</small>
              </div>
            );
          })}
        </div>
      )}

      <div className="order-products">
        {(order.items || []).slice(0, open ? undefined : 2).map((item, index) => (
          <div className="order-product" key={`${item.product?._id || item.frontendId || index}`}>
            <img src={getItemImage(item)} alt={getItemTitle(item)} />
            <div className="order-product-copy">
              <h3>{getItemTitle(item)}</h3>
              <p>Qty {item.quantity} <span>•</span> {money(item.price)}</p>
            </div>
            <strong>{money((item.price || 0) * (item.quantity || 1))}</strong>
          </div>
        ))}
        {!open && order.items?.length > 2 && <p className="order-more">+ {order.items.length - 2} more item{order.items.length > 3 ? "s" : ""}</p>}
      </div>

      {open && (
        <div className="order-details">
          <div><span><i className="fa-solid fa-location-dot" /> Delivery address</span><p>{address.name}</p><p>{[address.addressLine1, address.city, address.state, address.pinCode].filter(Boolean).join(", ")}</p></div>
          <div><span><i className="fa-regular fa-credit-card" /> Payment</span><p>{order.paymentMethod === "cod" ? "Cash on delivery" : "Razorpay"}</p><p className="order-payment-state">{order.paymentStatus || "pending"}</p></div>
        </div>
      )}

      <div className="order-card-foot">
        <div><span>Total</span><strong>{money(order.totalAmount ?? order.subTotal)}</strong></div>
        <div className="order-actions">
          {status === "pending" && <button className="order-cancel-btn" onClick={() => onCancel(order)} disabled={cancelling}>{cancelling ? "Cancelling…" : "Cancel order"}</button>}
          <button className="order-detail-btn" onClick={() => setOpen((value) => !value)}>{open ? "Hide details" : "View details"} <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`} /></button>
        </div>
      </div>
    </article>
  );
}

export default function Orders() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState("");

  const loadOrders = async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      setLoading(true); setError("");
      const response = await api.get("/order/my-orders");
      setOrders(response.data || []);
    } catch (err) { setError(err.message || "We couldn't load your orders."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadOrders(); }, [isAuthenticated]);

  const visibleOrders = useMemo(() => orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") return ACTIVE_STATUSES.includes(order.orderStatus);
    return order.orderStatus === filter;
  }), [orders, filter]);

  const cancelOrder = async (order) => {
    if (!window.confirm("Cancel this order? This action cannot be undone.")) return;
    try {
      setCancelling(order._id);
      await api.put(`/order/${order._id}/cancel`, {});
      setOrders((current) => current.map((item) => item._id === order._id ? { ...item, orderStatus: "cancelled" } : item));
    } catch (err) { setError(err.message || "The order could not be cancelled."); }
    finally { setCancelling(""); }
  };

  return (
    <main className="orders-page">
      <section className="orders-hero">
        <div className="orders-hero-leaf orders-hero-leaf--one" /><div className="orders-hero-leaf orders-hero-leaf--two" />
        <div className="section-container orders-hero-inner">
          <div className="shop-hero-breadcrumb"><Link to="/">Home</Link><i className="fa-solid fa-chevron-right" /><span>My orders</span></div>
          <p className="orders-eyebrow"><i className="fa-solid fa-box-open" /> Your wellness journey</p>
          <h1>My <em>Orders</em></h1>
          <p>Track your rituals, revisit past favourites, and see every delivery in one place.</p>
        </div>
      </section>

      <section className="orders-content section-container">
        {!isAuthenticated ? (
          <div className="orders-state-card"><div className="orders-state-icon"><i className="fa-regular fa-user" /></div><h2>Sign in to see your orders</h2><p>Your order history and delivery updates are waiting for you.</p><button onClick={() => navigate("/login", { state: { from: location.pathname } })}>Sign in to your account <i className="fa-solid fa-arrow-right" /></button></div>
        ) : loading ? (
          <div className="orders-loading">{[1, 2].map((item) => <div className="order-skeleton" key={item}><span /><span /><span /></div>)}</div>
        ) : error ? (
          <div className="orders-state-card"><div className="orders-state-icon orders-state-icon--error"><i className="fa-solid fa-triangle-exclamation" /></div><h2>Something went astray</h2><p>{error}</p><button onClick={loadOrders}>Try again <i className="fa-solid fa-rotate-right" /></button></div>
        ) : orders.length === 0 ? (
          <div className="orders-state-card"><div className="orders-state-icon"><i className="fa-solid fa-bag-shopping" /></div><h2>Your order story starts here</h2><p>Explore time-honoured Ayurvedic rituals, made for modern life.</p><Link to="/shop">Explore the collection <i className="fa-solid fa-arrow-right" /></Link></div>
        ) : (
          <>
            <div className="orders-toolbar"><div><h2>Your purchases</h2><p>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p></div><div className="orders-filters">{FILTERS.map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
            {error && <div className="orders-inline-error"><i className="fa-solid fa-circle-exclamation" /> {error}<button onClick={() => setError("")} aria-label="Dismiss">×</button></div>}
            <div className="orders-list">{visibleOrders.map((order) => <OrderCard key={order._id} order={order} onCancel={cancelOrder} cancelling={cancelling === order._id} />)}</div>
            {visibleOrders.length === 0 && <div className="orders-filter-empty"><i className="fa-regular fa-folder-open" /><p>No {filter} orders to show.</p></div>}
          </>
        )}
      </section>
    </main>
  );
}
