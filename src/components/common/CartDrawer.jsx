import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../../store/slices/uiSlice';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch(toggleCart())}
      />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl shadow-black/20 flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-center" style={{background: 'linear-gradient(135deg, #f5f9f8 0%, #eaf3f2 100%)', borderBottom: '1px solid rgba(1,114,110,0.1)'}}>
          <div>
            <h2 className="font-serif text-text-dark flex items-center gap-2.5" style={{fontSize:'19px', fontWeight:500, letterSpacing:'0.03em'}}>
              <i className="fa-solid fa-bag-shopping text-primary" style={{fontSize:'15px'}}></i> Your Bag
            </h2>
            <p className="font-sans mt-0.5" style={{fontSize:'10.5px', letterSpacing:'0.12em', color:'var(--text-mid)', fontWeight:400}}>
              Shopping launches soon
            </p>
          </div>
          <button 
            onClick={() => dispatch(toggleCart())}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-primary/10"
            style={{border:'1px solid rgba(1,114,110,0.15)', color:'var(--primary)'}}
          >
            <i className="fa-solid fa-xmark" style={{fontSize:'14px'}}></i>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-24 h-24 bg-gradient-to-tr from-bg-mist to-white border border-primary/10 shadow-lg shadow-primary/5 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-2 border border-dashed border-primary/20 rounded-full animate-spin duration-[40s]"></div>
                <i className="fa-solid fa-bag-shopping text-3xl text-primary/45"></i>
              </div>
              <h3 className="text-2xl font-serif text-text-dark font-medium mb-3 tracking-wide">Coming soon</h3>
              <p className="text-sm text-text-mid font-light leading-relaxed mb-10 max-w-[280px]">
                Our shopping experience is being prepared with care. Explore our Ayurvedic formulas while we get ready.
              </p>
              <button 
                onClick={() => dispatch(toggleCart())}
                className="btn-primary w-full py-4 justify-center tracking-widest text-xs font-bold uppercase flex items-center gap-2 group shadow-xl shadow-primary/15 hover:shadow-primary/25 hover:translate-y-[-2px] transition-all"
              >
                EXPLORE COLLECTION
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
