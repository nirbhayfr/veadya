import { Link } from 'react-router-dom';

const CommerceComingSoon = () => (
  <div className="cart-page-root">
    <section className="shop-hero">
      <div className="shop-hero-orb shop-hero-orb-1" />
      <div className="shop-hero-orb shop-hero-orb-2" />
      <div className="section-container shop-hero-inner">
        <div className="shop-hero-breadcrumb">
          <Link to="/">Home</Link>
          <i className="fa-solid fa-chevron-right" />
          <span>Coming Soon</span>
        </div>
        <p className="shop-hero-eyebrow"><i className="fa-regular fa-clock" /> The Veadya Store</p>
        <h1 className="shop-hero-title">Coming <em>Soon</em></h1>
        <p className="shop-hero-subtitle">Our shopping experience is being prepared with care. Purchases will be available soon.</p>
      </div>
    </section>

    <div className="section-container py-32 text-center">
      <div className="cart-empty-icon-wrap">
        <i className="fa-regular fa-clock cart-empty-icon" />
      </div>
      <h2 className="cart-empty-title">Something special is on its way</h2>
      <p className="cart-empty-desc">You can explore our Ayurvedic collection now and return soon to place your order.</p>
      <Link to="/shop" className="btn-primary inline-flex items-center gap-2 mt-8">
        Explore Collection <i className="fa-solid fa-arrow-right ml-1" />
      </Link>
    </div>
  </div>
);

export default CommerceComingSoon;
