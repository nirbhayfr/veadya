import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';
import { setProducts } from '../store/slices/productSlice';
import { 
  Package, 
  FolderTree, 
  Mail, 
  Database, 
  ShoppingBag,
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const hasStoredToken = Boolean(localStorage.getItem('token'));

  // Active tab state
  const [activeTab, setActiveTab] = useState('products');

  // Products CRUD states
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states (Product creation/edit)
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '100',
    sku: '',
    categoryName: 'Capsule',
    size: '60 Capsules',
    tags: '',
    images: [],
    bg: '#fcfbfa',
    accent: '#114232',
    textColor: '#111111',
    subColor: '#666666',
  };
  const [productForm, setProductForm] = useState(initialFormState);

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!isAuthenticated && !hasStoredToken) {
      navigate('/login');
    } else if (isAuthenticated && user?.role !== 'admin') {
      alert('Access denied. Admin authorization required.');
      navigate('/');
    }
  }, [isAuthenticated, hasStoredToken, user, navigate]);

  // Load backend data based on active tab
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [activeTab, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      if (activeTab === 'products') {
        const res = await api.get('/product?limit=100');
        setProductsList(res.data || []);
      } else if (activeTab === 'categories') {
        const res = await api.get('/category');
        setCategoriesList(res.data || []);
      } else if (activeTab === 'messages') {
        const res = await api.get('/contact');
        setMessagesList(res.data || []);
      } else if (activeTab === 'orders') {
        const res = await api.get('/order?limit=100');
        setOrdersList(res.data || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // Image Upload handler via Cloudinary helper
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setErrorMsg('');
      const uploaded = await uploadToCloudinary(file);
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, uploaded.url]
      }));
      setSuccessMsg('Image uploaded to Cloudinary successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  // Delete uploaded image from local form state
  const handleRemoveImage = (index) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) {
      setErrorMsg('Product name and price are required.');
      return;
    }

    try {
      setActionLoading(true);
      setErrorMsg('');

      // Map tags to array
      const tagsArray = productForm.tags 
        ? productForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      // Format payload correctly for Product controller
      const payload = {
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: Number(productForm.stock),
        sku: productForm.sku || undefined,
        category: productForm.categoryName,
        categoryName: productForm.categoryName,
        size: productForm.size,
        tags: tagsArray,
        images: productForm.images.map(imgUrl => ({ url: imgUrl })),
        bg: productForm.bg,
        accent: productForm.accent,
        textColor: productForm.textColor,
        subColor: productForm.subColor,
        status: 'active'
      };

      if (isEditing) {
        await api.put(`/product/${editProductId}`, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await api.post('/product', payload);
        setSuccessMsg('Product created successfully!');
      }

      // Close form and refresh products
      setShowForm(false);
      setProductForm(initialFormState);
      fetchData();

      // Refresh products in Redux App store
      const refreshRes = await api.get('/product?limit=100');
      if (refreshRes.data) {
        const normalized = refreshRes.data.map(p => ({
          id: p.sku && p.sku.startsWith("VEADYA-") ? parseInt(p.sku.replace("VEADYA-", "")) : p._id,
          _id: p._id,
          name: p.title,
          price: p.price,
          image: p.images?.[0]?.url || "/p-1.png",
          category: p.categoryName,
          tag: p.categoryName,
          problem: p.tags?.[0] || "General Wellness",
          shortDescription: p.description,
          originalPrice: p.originalPrice,
          size: p.size,
          notes: p.notes,
          sku: p.sku,
          bg: p.bg,
          accent: p.accent,
          textColor: p.textColor,
          subColor: p.subColor,
          rating: p.ratingAverage,
          reviews: p.ratingCount,
        }));
        dispatch(setProducts(normalized));
      }

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit action
  const handleEditClick = (p) => {
    setIsEditing(true);
    setEditProductId(p._id);
    setProductForm({
      title: p.title || '',
      description: p.description || '',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      stock: p.stock || '100',
      sku: p.sku || '',
      categoryName: p.categoryName || 'Capsule',
      size: p.size || '60 Capsules',
      tags: p.tags ? p.tags.join(', ') : '',
      images: p.images ? p.images.map(img => img.url) : [],
      bg: p.bg || '#fcfbfa',
      accent: p.accent || '#114232',
      textColor: p.textColor || '#111111',
      subColor: p.subColor || '#666666',
    });
    setShowForm(true);
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setActionLoading(true);
      await api.delete(`/product/${id}`);
      setSuccessMsg('Product deleted successfully.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      setActionLoading(true);
      await api.delete(`/contact/${id}`);
      setSuccessMsg('Message deleted successfully.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete message.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, orderStatus) => {
    try {
      setActionLoading(true);
      setErrorMsg('');
      await api.put(`/order/${orderId}/status`, { orderStatus });
      setSuccessMsg('Order status updated successfully.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update order status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkOrderPaid = async (orderId) => {
    try {
      setActionLoading(true);
      setErrorMsg('');
      await api.put(`/order/${orderId}/pay`, {});
      setSuccessMsg('Order marked as paid.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to mark order as paid.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      setActionLoading(true);
      setErrorMsg('');
      await api.delete(`/order/${id}`);
      setSuccessMsg('Order deleted successfully.');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete order.');
    } finally {
      setActionLoading(false);
    }
  };

  // Trigger seed script API
  const handleSeedDatabase = async () => {
    if (!window.confirm('This will wipe all existing products and categories and reload defaults. Continue?')) return;

    try {
      setActionLoading(true);
      setErrorMsg('');
      const res = await api.post('/product/seed');
      setSuccessMsg(res.message || 'Database seeded successfully!');
      fetchData();
      
      // Reload products in App
      const refreshRes = await api.get('/product?limit=100');
      if (refreshRes.data) {
        const normalized = refreshRes.data.map(p => ({
          id: p.sku && p.sku.startsWith("VEADYA-") ? parseInt(p.sku.replace("VEADYA-", "")) : p._id,
          _id: p._id,
          name: p.title,
          price: p.price,
          image: p.images?.[0]?.url || "/p-1.png",
          category: p.categoryName,
          tag: p.categoryName,
          problem: p.tags?.[0] || "General Wellness",
          shortDescription: p.description,
          originalPrice: p.originalPrice,
          size: p.size,
          notes: p.notes,
          sku: p.sku,
          bg: p.bg,
          accent: p.accent,
          textColor: p.textColor,
          subColor: p.subColor,
          rating: p.ratingAverage,
          reviews: p.ratingCount,
        }));
        dispatch(setProducts(normalized));
      }

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to seed database.');
    } finally {
      setActionLoading(false);
    }
  };

  const getOrderCustomerName = (order) => {
    const userName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim();
    return userName || order.shippingAddress?.name || 'Guest customer';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'bg-amber-50 text-amber-700 border-amber-100',
      confirmed: 'bg-blue-50 text-blue-700 border-blue-100',
      processing: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      shipped: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      cancelled: 'bg-red-50 text-red-700 border-red-100',
      paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      failed: 'bg-red-50 text-red-700 border-red-100',
      refunded: 'bg-slate-50 text-slate-700 border-slate-100',
    };

    return classes[status] || 'bg-gray-50 text-gray-600 border-gray-100';
  };

  if (!isAuthenticated && hasStoredToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: '"Jost", sans-serif' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#114232]/20 border-t-[#114232] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Restoring admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: '"Jost", sans-serif' }}>
      
      {/* ── Left Sidebar Navigation ── */}
      <aside className="w-64 bg-[#114232] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-serif font-bold text-[#e2d5c3] tracking-wide">Veadya Admin</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">Control Center</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => { setActiveTab('products'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'products' ? 'bg-[#efdbbb] text-[#114232] shadow-md' : 'hover:bg-white/10 text-white/80'}`}
          >
            <Package size={18} />
            Products Management
          </button>

          <button 
            onClick={() => { setActiveTab('categories'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'categories' ? 'bg-[#efdbbb] text-[#114232] shadow-md' : 'hover:bg-white/10 text-white/80'}`}
          >
            <FolderTree size={18} />
            Categories Overview
          </button>

          <button 
            onClick={() => { setActiveTab('messages'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'messages' ? 'bg-[#efdbbb] text-[#114232] shadow-md' : 'hover:bg-white/10 text-white/80'}`}
          >
            <Mail size={18} />
            Contact Inquiries
          </button>

          <button 
            onClick={() => { setActiveTab('orders'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'orders' ? 'bg-[#efdbbb] text-[#114232] shadow-md' : 'hover:bg-white/10 text-white/80'}`}
          >
            <ShoppingBag size={18} />
            Orders Management
          </button>

          <button 
            onClick={() => { setActiveTab('actions'); setShowForm(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'actions' ? 'bg-[#efdbbb] text-[#114232] shadow-md' : 'hover:bg-white/10 text-white/80'}`}
          >
            <Database size={18} />
            System Actions
          </button>
        </nav>

        <div className="p-6 border-t border-white/10 text-xs text-white/50">
          Logged in as:<br />
          <strong className="text-white">{user?.name || user?.email}</strong>
        </div>
      </aside>

      {/* ── Main Panel View ── */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center shadow-xs">
          <div>
            <h2 className="text-2xl font-serif text-gray-800 capitalize font-medium">
              {activeTab === 'products' ? 'Products Catalog' : 
               activeTab === 'categories' ? 'Categories Structure' : 
               activeTab === 'messages' ? 'Inbound Inquiries' :
               activeTab === 'orders' ? 'Orders Management' : 'System Operations'}
            </h2>
            <p className="text-xs text-gray-400 mt-1">Manage the online botanical apothecary store.</p>
          </div>
          
          {activeTab === 'products' && !showForm && (
            <button 
              onClick={() => { setIsEditing(false); setProductForm(initialFormState); setShowForm(true); }}
              className="bg-[#114232] text-[#efdbbb] hover:bg-[#1a5b46] px-5 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-semibold transition-all shadow-md"
            >
              <Plus size={16} /> Add New Product
            </button>
          )}
        </header>

        {/* Content body */}
        <div className="p-8 flex-1 overflow-y-auto">

          {/* Success / Error Banners */}
          {successMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
              <Check className="shrink-0" size={18} />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
              <AlertCircle className="shrink-0" size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── PRODUCTS TAB ── */}
          {activeTab === 'products' && (
            <>
              {/* Product Form Drawer/Container */}
              {showForm ? (
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm max-w-4xl mx-auto animate-in slide-in-from-top duration-300">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                    <h3 className="text-lg font-serif text-gray-800 font-bold">
                      {isEditing ? 'Modify Product Specifications' : 'Define New Botanical Product'}
                    </h3>
                    <button 
                      onClick={() => { setShowForm(false); setProductForm(initialFormState); }} 
                      className="p-1.5 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Product Title *</label>
                        <input 
                          type="text" 
                          name="title" 
                          value={productForm.title} 
                          onChange={handleFormChange} 
                          placeholder="e.g. Somarasa Drops"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Custom SKU (Optional)</label>
                        <input 
                          type="text" 
                          name="sku" 
                          value={productForm.sku} 
                          onChange={handleFormChange} 
                          placeholder="e.g. VEADYA-9"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2 col-span-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Description</label>
                        <textarea 
                          name="description" 
                          value={productForm.description} 
                          onChange={handleFormChange} 
                          placeholder="Specify the benefits and natural origins of the formula..."
                          rows="3"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Price (INR) *</label>
                        <input 
                          type="number" 
                          name="price" 
                          value={productForm.price} 
                          onChange={handleFormChange} 
                          placeholder="e.g. 599"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Original Price (INR)</label>
                        <input 
                          type="number" 
                          name="originalPrice" 
                          value={productForm.originalPrice} 
                          onChange={handleFormChange} 
                          placeholder="e.g. 799"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Stock Available</label>
                        <input 
                          type="number" 
                          name="stock" 
                          value={productForm.stock} 
                          onChange={handleFormChange} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          required 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Botanical Category</label>
                        <select 
                          name="categoryName" 
                          value={productForm.categoryName} 
                          onChange={handleFormChange} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="Capsule">Capsule</option>
                          <option value="Juice">Juice</option>
                          <option value="Drop">Drop</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Standard Volume/Size</label>
                        <input 
                          type="text" 
                          name="size" 
                          value={productForm.size} 
                          onChange={handleFormChange} 
                          placeholder="e.g. 60 Capsules or 500ml"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Tags (comma separated)</label>
                        <input 
                          type="text" 
                          name="tags" 
                          value={productForm.tags} 
                          onChange={handleFormChange} 
                          placeholder="e.g. Capsule, Men Wellness, Stamina"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Image Upload Block via Cloudinary */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                      <label className="text-xs uppercase tracking-wider text-[#114232] font-semibold block">Product Studio Images</label>
                      
                      <div className="grid grid-cols-5 gap-4">
                        {productForm.images.map((imgUrl, index) => (
                          <div key={index} className="aspect-square bg-gray-50 border border-gray-200 rounded-xl overflow-hidden relative group">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {productForm.images.length < 5 && (
                          <label className={`aspect-square border-2 border-dashed border-gray-300 hover:border-[#114232] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 ${uploadingImage ? 'opacity-50 cursor-wait' : ''}`}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                              disabled={uploadingImage}
                              className="hidden" 
                            />
                            {uploadingImage ? (
                              <span className="text-[10px] text-gray-400 text-center font-medium animate-pulse">Uploading...</span>
                            ) : (
                              <>
                                <Upload size={20} className="text-gray-400" />
                                <span className="text-[10px] text-gray-400 mt-1 font-semibold">Upload Photo</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Styling Preferences */}
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-50">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Theme BG</label>
                        <input type="color" name="bg" value={productForm.bg} onChange={handleFormChange} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white p-1" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Theme Accent</label>
                        <input type="color" name="accent" value={productForm.accent} onChange={handleFormChange} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white p-1" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Text Color</label>
                        <input type="color" name="textColor" value={productForm.textColor} onChange={handleFormChange} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white p-1" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-gray-400 block">Sub-Text Color</label>
                        <input type="color" name="subColor" value={productForm.subColor} onChange={handleFormChange} className="w-full h-10 rounded-lg cursor-pointer border border-gray-200 bg-white p-1" />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                      <button 
                        type="button" 
                        onClick={() => { setShowForm(false); setProductForm(initialFormState); }}
                        className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 text-xs uppercase tracking-widest font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={actionLoading}
                        className="bg-[#114232] text-[#efdbbb] hover:bg-[#1a5b46] px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shadow-md disabled:opacity-50"
                      >
                        {actionLoading ? 'Saving specifications...' : 'Commit Product'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Products Table */
                <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
                  {loading ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Synchronizing products...</div>
                  ) : productsList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 text-sm">No botanical products in catalog. Try seeding from the Actions tab.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-widest font-semibold">
                            <th className="py-4 px-6">Product</th>
                            <th className="py-4 px-6">SKU / Size</th>
                            <th className="py-4 px-6">Category</th>
                            <th className="py-4 px-6">Price</th>
                            <th className="py-4 px-6 text-center">Stock</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                          {productsList.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6 flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-1 shrink-0">
                                  <img src={p.images?.[0]?.url || '/p-1.png'} alt="" className="max-h-full max-w-full object-contain" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{p.title}</p>
                                  <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{p.description}</p>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <p className="font-medium text-xs font-mono">{p.sku || 'N/A'}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{p.size || 'N/A'}</p>
                              </td>
                              <td className="py-4 px-6">
                                <span className="bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                  {p.categoryName || 'General'}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-semibold">
                                ₹{p.price}
                                {p.originalPrice && (
                                  <span className="text-xs font-normal text-gray-400 line-through ml-1.5">₹{p.originalPrice}</span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`font-semibold font-mono ${p.stock === 0 ? 'text-red-500' : p.stock <= 5 ? 'text-amber-500' : 'text-gray-600'}`}>
                                  {p.stock}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex justify-end gap-1.5">
                                  <button 
                                    onClick={() => handleEditClick(p)}
                                    className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-xl transition-colors"
                                    title="Edit Specification"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(p._id)}
                                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors"
                                    title="Delete product"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── CATEGORIES TAB ── */}
          {activeTab === 'categories' && (
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
              {loading ? (
                <div className="p-12 text-center text-gray-400 text-sm">Fetching categories catalog...</div>
              ) : categoriesList.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">No category files loaded. Try seeding.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-widest font-semibold">
                        <th className="py-4 px-6">Category Name</th>
                        <th className="py-4 px-6">Slug</th>
                        <th className="py-4 px-6">Description</th>
                        <th className="py-4 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {categoriesList.map((c) => (
                        <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-800">{c.name}</td>
                          <td className="py-4 px-6 font-mono text-xs text-gray-500">{c.slug}</td>
                          <td className="py-4 px-6 text-xs text-gray-400 max-w-xs truncate">{c.description || 'N/A'}</td>
                          <td className="py-4 px-6 text-center">
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] uppercase font-bold tracking-wider px-2 py-1.5 rounded-lg border border-emerald-100">
                              {c.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === 'messages' && (
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
              {loading ? (
                <div className="p-12 text-center text-gray-400 text-sm">Loading inbound messages...</div>
              ) : messagesList.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">No inquiries in mailbox.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-widest font-semibold">
                        <th className="py-4 px-6">Sender Details</th>
                        <th className="py-4 px-6">Subject / Inquiry</th>
                        <th className="py-4 px-6">Message Text</th>
                        <th className="py-4 px-6">Received At</th>
                        <th className="py-4 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {messagesList.map((m) => (
                        <tr key={m._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-800">{m.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{m.email}</p>
                          </td>
                          <td className="py-4 px-6 font-medium text-xs text-gray-600">
                            {m.subject}
                          </td>
                          <td className="py-4 px-6 text-xs text-gray-500 max-w-sm whitespace-pre-line leading-relaxed">
                            {m.message}
                          </td>
                          <td className="py-4 px-6 text-xs text-gray-400">
                            {new Date(m.createdAt).toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button 
                              onClick={() => handleDeleteMessage(m._id)}
                              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors"
                              title="Remove Message"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── ORDERS TAB ── */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs">
              {loading ? (
                <div className="p-12 text-center text-gray-400 text-sm">Loading customer orders...</div>
              ) : ordersList.length === 0 ? (
                <div className="p-12 text-center text-gray-400 text-sm">No orders have been placed yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-widest font-semibold">
                        <th className="py-4 px-6">Order</th>
                        <th className="py-4 px-6">Customer</th>
                        <th className="py-4 px-6">Items</th>
                        <th className="py-4 px-6">Payment</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {ordersList.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50/50 transition-colors align-top">
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</p>
                            <p className="text-[11px] text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                            <p className="font-semibold text-[#114232] mt-2">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-semibold text-gray-800">{getOrderCustomerName(order)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{order.user?.email || order.shippingAddress?.email || 'No email'}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{order.shippingAddress?.phone || order.user?.phone || 'No phone'}</p>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1.5 max-w-[260px]">
                              {order.items?.map((item, index) => (
                                <p key={`${order._id}-${index}`} className="text-xs text-gray-600">
                                  <span className="font-semibold">{item.quantity}x</span> {item.title}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="bg-gray-50 text-gray-700 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-lg border border-gray-100">
                              {order.paymentMethod}
                            </span>
                            <span className={`block w-fit mt-2 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1.5 rounded-lg border ${getStatusBadgeClass(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              disabled={actionLoading}
                              className={`min-w-[132px] border rounded-xl px-3 py-2 text-xs font-semibold capitalize focus:outline-none focus:ring-2 focus:ring-primary/20 ${getStatusBadgeClass(order.orderStatus)}`}
                            >
                              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-1.5">
                              {order.paymentStatus !== 'paid' && (
                                <button
                                  onClick={() => handleMarkOrderPaid(order._id)}
                                  disabled={actionLoading}
                                  className="px-3 py-2 hover:bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl transition-colors text-[10px] uppercase tracking-widest font-bold disabled:opacity-50"
                                  title="Mark as paid"
                                >
                                  Paid
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteOrder(order._id)}
                                disabled={actionLoading}
                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                                title="Delete order"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SYSTEM ACTIONS TAB ── */}
          {activeTab === 'actions' && (
            <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-xs text-center space-y-6">
              <div className="w-16 h-16 bg-[#efdbbb]/30 rounded-full flex items-center justify-center text-[#114232] mx-auto">
                <Database size={28} />
              </div>
              
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-800">Database Synchronization &amp; Seeding</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Reset the database catalog to the primary default wellness products. This will delete all products and categories, then recreate the initial Capsule, Juice, and Drop items.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSeedDatabase}
                  disabled={actionLoading}
                  className="bg-[#114232] hover:bg-[#1a5b46] text-[#efdbbb] px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all shadow-md disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Database size={16} />
                  {actionLoading ? 'Initializing database defaults...' : 'Re-seed Database Products'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
