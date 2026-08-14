import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleCart } from '../../store/slices/uiSlice';
import CartItem from '../cart/CartItem';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

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
              <i className="fa-solid fa-bag-shopping text-primary" style={{ fontSize: '15px' }} />
              Your Ritual Bag
            </h2>
            <p
              className="font-sans mt-0.5"
              style={{ fontSize: '10.5px', letterSpacing: '0.12em', color: 'var(--text-mid)', fontWeight: 400 }}
            >
              {cartItems.length} item{cartItems.length === 1 ? '' : 's'}
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

        <div className="flex-grow overflow-y-auto px-6 py-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <i className="fa-solid fa-bag-shopping text-4xl text-primary/50 mb-5" />
              <h3 className="text-2xl font-serif text-text-dark font-medium mb-3">Your bag is empty</h3>
              <Link to="/shop" onClick={() => dispatch(toggleCart())} className="btn-primary px-6 py-3">
                Explore Collection
              </Link>
            </div>
          ) : (
            cartItems.map((item) => <CartItem key={item.id} item={item} isDrawer />)
          )}
        </div>

        {/* Footer Security Note */}
        <div
          className="flex-shrink-0 px-6 py-4 text-center"
          style={{ borderTop: '1px solid rgba(1,114,110,0.08)', background: '#fafcfb' }}
        >
          {cartItems.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-3 text-sm">
                <span>Subtotal</span>
                <strong>₹{subtotal.toLocaleString()}</strong>
              </div>
              <Link to="/cart" onClick={() => dispatch(toggleCart())} className="btn-primary w-full py-3 justify-center flex">
                View Cart
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default CartDrawer;
