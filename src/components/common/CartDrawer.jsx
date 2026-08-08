import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleCart } from '../../store/slices/uiSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);

  if (!isCartOpen) return null;

  const handleNotify = () => {
    dispatch(toggleCart());
    window.dispatchEvent(new Event('open-notify-modal'));
  };

  return (
    <div className="fixed inset-0 z-[500] animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(toggleCart())}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl shadow-black/20 flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div
          className="px-6 py-5 flex justify-between items-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #f5f9f8 0%, #eaf3f2 100%)',
            borderBottom: '1px solid rgba(1,114,110,0.1)',
          }}
        >
          <div>
            <h2
              className="font-serif text-text-dark flex items-center gap-2.5"
              style={{ fontSize: '19px', fontWeight: 500, letterSpacing: '0.03em' }}
            >
              <i className="fa-solid fa-lock text-primary" style={{ fontSize: '15px' }} />
              Store Locked
            </h2>
            <p
              className="font-sans mt-0.5"
              style={{ fontSize: '10.5px', letterSpacing: '0.12em', color: 'var(--text-mid)', fontWeight: 400 }}
            >
              Commerce Coming Soon
            </p>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-primary/10"
            style={{ border: '1px solid rgba(1,114,110,0.15)', color: 'var(--primary)' }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '14px' }} />
          </button>
        </div>

        {/* Body — Locked State */}
        <div className="flex-grow overflow-y-auto px-6 flex flex-col items-center justify-center text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-tr from-bg-mist to-white border border-primary/10 shadow-lg shadow-primary/5 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-2 border border-dashed border-primary/20 rounded-full" />
            <i className="fa-solid fa-lock text-3xl text-primary/60" />
          </div>

          <h3 className="text-2xl font-serif text-text-dark font-medium mb-3 tracking-wide">
            Purchases Opening Soon
          </h3>
          
          <p className="text-sm text-text-mid font-light leading-relaxed mb-8 max-w-[290px]">
            Our Ayurvedic shopping experience is being handcrafted. Leave your details to get notified as soon as ordering goes live.
          </p>

          <button
            onClick={handleNotify}
            className="btn-primary w-full py-4 justify-center tracking-widest text-xs font-bold uppercase flex items-center gap-2 group shadow-xl shadow-primary/15 hover:shadow-primary/25 transition-all mb-4"
          >
            <i className="fa-regular fa-bell text-sm" />
            NOTIFY ME WHEN LIVE
          </button>

          <Link
            to="/shop"
            onClick={() => dispatch(toggleCart())}
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary hover:underline py-2"
          >
            Explore Collection
          </Link>
        </div>

        {/* Footer Security Note */}
        <div
          className="flex-shrink-0 px-6 py-4 text-center"
          style={{ borderTop: '1px solid rgba(1,114,110,0.08)', background: '#fafcfb' }}
        >
          <p style={{ fontFamily: '"Jost", sans-serif', fontSize: '10.5px', color: 'var(--text-mid)' }}>
            🌿 Veadya Life Sciences · Authentic Ayurvedic Care
          </p>
        </div>

      </div>
    </div>
  );
};

export default CartDrawer;
