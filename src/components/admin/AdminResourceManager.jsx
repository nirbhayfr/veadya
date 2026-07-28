/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, react-refresh/only-export-components */
import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Check, Edit2, Plus, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { api } from '../../utils/api';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#114232]/20';

const toInputValue = (field, value) => {
  if (field.type === 'tags') return Array.isArray(value) ? value.join(', ') : value || '';
  if (field.type === 'json') return value ? JSON.stringify(value, null, 2) : field.default || '';
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'date' && value) return String(value).slice(0, 10);
  if (value && typeof value === 'object' && value._id) return value._id;
  return value ?? field.default ?? '';
};

const serializeValue = (field, value) => {
  if (field.type === 'number') return value === '' ? undefined : Number(value);
  if (field.type === 'tags') return String(value || '').split(',').map(item => item.trim()).filter(Boolean);
  if (field.type === 'boolean') return Boolean(value);
  if (field.type === 'json') {
    if (!String(value || '').trim()) return field.emptyValue ?? [];
    return JSON.parse(value);
  }
  if (field.type === 'date') return value ? new Date(value).toISOString() : undefined;
  return value === '' && field.optional ? undefined : value;
};

const getPath = (row, path) => path.split('.').reduce((value, key) => value?.[key], row);

const formatCell = (value) => {
  if (Array.isArray(value)) return value.map(item => typeof item === 'object' ? item.label || item.name : item).join(', ') || '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value && typeof value === 'object') return JSON.stringify(value);
  return value ?? '—';
};

export const resourceConfigs = {
  categories: {
    title: 'Product Categories', endpoint: '/category', singular: 'Category',
    columns: [['name', 'Name'], ['slug', 'Slug'], ['status', 'Status'], ['isFeatured', 'Featured']],
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug', required: true },
      { name: 'description', label: 'Description', type: 'textarea', optional: true },
      { name: 'image', label: 'Category Image', type: 'image', optional: true },
      { name: 'parentCategory', label: 'Parent Category ID', optional: true },
      { name: 'isFeatured', label: 'Featured Category', type: 'boolean' },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], default: 'active' },
    ],
  },
  pages: {
    title: 'Pages', endpoint: '/page', singular: 'Page',
    columns: [['title', 'Title'], ['slug', 'Slug'], ['status', 'Status'], ['updatedAt', 'Updated']],
    fields: [
      { name: 'title', label: 'Title', required: true },
      { name: 'slug', label: 'Slug', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', optional: true },
      { name: 'content', label: 'Page Content', type: 'textarea', required: true, wide: true },
      { name: 'featuredImage', label: 'Featured Image', type: 'image', optional: true },
      { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], default: 'draft' },
      { name: 'seoTitle', label: 'SEO Title', optional: true },
      { name: 'seoDescription', label: 'SEO Description', type: 'textarea', optional: true },
      { name: 'seoKeywords', label: 'SEO Keywords', type: 'tags', optional: true },
    ],
  },
  posts: {
    title: 'Journal Posts', endpoint: '/post', singular: 'Post',
    columns: [['title', 'Title'], ['slug', 'Slug'], ['status', 'Status'], ['publishedAt', 'Published']],
    fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'slug', label: 'Slug', required: true },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', optional: true },
      { name: 'content', label: 'Article Content', type: 'textarea', required: true, wide: true },
      { name: 'featuredImage', label: 'Featured Image', type: 'image', optional: true },
      { name: 'postCategory', label: 'Post Category ID', optional: true },
      { name: 'author', label: 'Author ID', optional: true },
      { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], default: 'draft' },
      { name: 'publishedAt', label: 'Published Date', type: 'date', optional: true },
      { name: 'seoTitle', label: 'SEO Title', optional: true },
      { name: 'seoDescription', label: 'SEO Description', type: 'textarea', optional: true },
      { name: 'seoKeywords', label: 'SEO Keywords', type: 'tags', optional: true },
    ],
  },
  postCategories: {
    title: 'Post Categories', endpoint: '/post-category', singular: 'Post Category',
    columns: [['name', 'Name'], ['slug', 'Slug'], ['status', 'Status']],
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug', required: true },
      { name: 'description', label: 'Description', type: 'textarea', optional: true },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], default: 'active' },
    ],
  },
  banners: {
    title: 'Banners & Campaigns', endpoint: '/banner', singular: 'Banner',
    columns: [['title', 'Title'], ['position', 'Position'], ['status', 'Status'], ['order', 'Order']],
    fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'subtitle', label: 'Subtitle', type: 'textarea', optional: true },
      { name: 'image', label: 'Banner Image', type: 'image', required: true },
      { name: 'buttonText', label: 'Button Text', optional: true }, { name: 'buttonLink', label: 'Button Link', optional: true },
      { name: 'position', label: 'Position', type: 'select', options: ['homepage', 'category', 'sidebar', 'popup'], default: 'homepage' },
      { name: 'order', label: 'Display Order', type: 'number', default: 0 },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], default: 'active' },
    ],
  },
  menus: {
    title: 'Navigation Menus', endpoint: '/menu', singular: 'Menu',
    columns: [['name', 'Name'], ['location', 'Location'], ['items', 'Items']],
    fields: [
      { name: 'name', label: 'Menu Name', required: true },
      { name: 'location', label: 'Location', type: 'select', options: ['header', 'footer', 'mobile'], required: true },
      { name: 'items', label: 'Menu Items (JSON)', type: 'json', wide: true, required: true, default: '[\n  { "label": "Home", "url": "/", "order": 0, "target": "_self" }\n]' },
    ],
  },
  contentTypes: {
    title: 'Content Types', endpoint: '/content-type', singular: 'Content Type',
    columns: [['name', 'Name'], ['slug', 'Slug'], ['fields', 'Fields']],
    fields: [
      { name: 'name', label: 'Name', required: true }, { name: 'slug', label: 'Slug', required: true },
      { name: 'description', label: 'Description', type: 'textarea', optional: true },
      { name: 'fields', label: 'Field Definitions (JSON)', type: 'json', wide: true, required: true, default: '[\n  { "name": "title", "label": "Title", "type": "text", "required": true }\n]' },
    ],
  },
  contentEntries: {
    title: 'Content Entries', endpoint: '/content', singular: 'Content Entry',
    columns: [['contentType.name', 'Content Type'], ['status', 'Status'], ['updatedAt', 'Updated']],
    fields: [
      { name: 'contentType', label: 'Content Type ID', required: true },
      { name: 'data', label: 'Content Data (JSON)', type: 'json', wide: true, required: true, default: '{\n  "title": ""\n}', emptyValue: {} },
      { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published'], default: 'draft' },
    ],
  },
  coupons: {
    title: 'Coupons', endpoint: '/coupon', singular: 'Coupon',
    columns: [['code', 'Code'], ['type', 'Type'], ['value', 'Value'], ['status', 'Status'], ['expiryDate', 'Expires']],
    fields: [
      { name: 'code', label: 'Coupon Code', required: true }, { name: 'description', label: 'Description', type: 'textarea', optional: true },
      { name: 'type', label: 'Discount Type', type: 'select', options: ['percentage', 'fixed'], required: true },
      { name: 'value', label: 'Discount Value', type: 'number', required: true },
      { name: 'minOrderAmount', label: 'Minimum Order', type: 'number', optional: true },
      { name: 'maxDiscount', label: 'Maximum Discount', type: 'number', optional: true },
      { name: 'usageLimit', label: 'Usage Limit', type: 'number', optional: true },
      { name: 'startDate', label: 'Start Date', type: 'date', optional: true },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date', optional: true },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], default: 'active' },
    ],
  },
  newsletter: {
    title: 'Newsletter Subscribers', endpoint: '/newsletter', singular: 'Subscriber', create: false,
    columns: [['email', 'Email'], ['status', 'Status'], ['createdAt', 'Subscribed']],
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'unsubscribed'], default: 'active' },
    ],
  },
  notifications: {
    title: 'Admin Notifications', endpoint: '/notification', singular: 'Notification',
    columns: [['title', 'Title'], ['type', 'Type'], ['isRead', 'Read'], ['createdAt', 'Created']],
    fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'message', label: 'Message', type: 'textarea', required: true },
      { name: 'type', label: 'Type', type: 'select', options: ['system', 'order', 'promotion', 'announcement'], default: 'system' },
      { name: 'user', label: 'User ID', optional: true }, { name: 'isRead', label: 'Mark as read', type: 'boolean' },
      { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], default: 'active' },
    ],
  },
  users: {
    title: 'Customers & Administrators', endpoint: '/user', singular: 'User', create: false,
    columns: [['firstName', 'First Name'], ['lastName', 'Last Name'], ['email', 'Email'], ['role', 'Role'], ['createdAt', 'Joined']],
    fields: [
      { name: 'firstName', label: 'First Name', optional: true }, { name: 'lastName', label: 'Last Name', optional: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'role', label: 'Role', type: 'select', options: ['user', 'admin'], required: true },
    ],
  },
};

const Field = ({ field, value, onChange, uploading, setUploading }) => {
  if (field.type === 'textarea' || field.type === 'json') {
    return <textarea rows={field.type === 'json' ? 9 : 4} className={`${inputClass} font-${field.type === 'json' ? 'mono' : 'sans'}`} value={value} onChange={e => onChange(e.target.value)} required={field.required} />;
  }
  if (field.type === 'select') {
    return <select className={inputClass} value={value} onChange={e => onChange(e.target.value)} required={field.required}>
      {field.options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>;
  }
  if (field.type === 'boolean') {
    return <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
      <input type="checkbox" checked={Boolean(value)} onChange={e => onChange(e.target.checked)} /> Enabled
    </label>;
  }
  if (field.type === 'image') {
    return <div className="space-y-3">
      {value && <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-gray-200"><img src={value} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"><X size={12} /></button></div>}
      <label className={`inline-flex items-center gap-2 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-xs font-semibold cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
        <Upload size={15} /> {uploading ? 'Uploading…' : 'Upload image'}
        <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async e => {
          const file = e.target.files?.[0]; if (!file) return;
          try { setUploading(true); const result = await uploadToCloudinary(file); onChange(result.url); } finally { setUploading(false); }
        }} />
      </label>
      <input className={inputClass} value={value} onChange={e => onChange(e.target.value)} placeholder="Or paste an HTTPS image URL" required={field.required} />
    </div>;
  }
  return <input type={field.type || 'text'} className={inputClass} value={value} onChange={e => onChange(e.target.value)} required={field.required} />;
};

const emptyForm = config => Object.fromEntries(config.fields.map(field => [field.name, toInputValue(field, undefined)]));

export const AdminResourceManager = ({ resource }) => {
  const config = resourceConfigs[resource];
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(() => emptyForm(config));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      setLoading(true); setError('');
      const response = await api.get(config.endpoint);
      setRows(Array.isArray(response.data) ? response.data : []);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [resource]);

  const startCreate = () => { setEditing('new'); setForm(emptyForm(config)); setError(''); };
  const startEdit = row => {
    setEditing(row._id);
    setForm(Object.fromEntries(config.fields.map(field => [field.name, toInputValue(field, getPath(row, field.name))])));
    setError('');
  };
  const save = async e => {
    e.preventDefault();
    try {
      setSaving(true); setError('');
      const payload = Object.fromEntries(config.fields.map(field => [field.name, serializeValue(field, form[field.name])]).filter(([, value]) => value !== undefined));
      if (payload.socialLinks) payload.socialLinks = Object.fromEntries(Object.entries(payload.socialLinks).filter(([, value]) => value));
      if (editing === 'new') await api.post(config.endpoint, payload);
      else await api.put(`${config.endpoint}/${editing}`, payload);
      window.dispatchEvent(new Event('veadya-site-data-refresh'));
      setSuccess(`${config.singular} saved successfully.`);
      setEditing(null); await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err instanceof SyntaxError ? 'One of the JSON fields contains invalid JSON.' : err.message); } finally { setSaving(false); }
  };
  const remove = async row => {
    if (!window.confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    try { await api.delete(`${config.endpoint}/${row._id}`); window.dispatchEvent(new Event('veadya-site-data-refresh')); setSuccess(`${config.singular} deleted.`); await load(); } catch (err) { setError(err.message); }
  };

  const renderedRows = useMemo(() => rows, [rows]);

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div><h3 className="text-2xl font-serif text-gray-800">{config.title}</h3><p className="text-xs text-gray-400 mt-1">{rows.length} records from {config.endpoint}</p></div>
      <div className="flex gap-2">
        <button onClick={load} className="p-3 border border-gray-200 rounded-xl text-gray-500 hover:bg-white"><RefreshCw size={16} /></button>
        {config.create !== false && <button onClick={startCreate} className="bg-[#114232] text-[#efdbbb] px-5 py-3 rounded-xl flex items-center gap-2 text-xs uppercase tracking-widest font-semibold"><Plus size={15} /> Add {config.singular}</button>}
      </div>
    </div>
    {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex gap-2 text-sm"><AlertCircle size={18} />{error}</div>}
    {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex gap-2 text-sm"><Check size={18} />{success}</div>}
    {editing && <form onSubmit={save} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">
      <div className="flex justify-between mb-6"><h4 className="font-serif text-lg">{editing === 'new' ? `New ${config.singular}` : `Edit ${config.singular}`}</h4><button type="button" onClick={() => setEditing(null)}><X size={20} /></button></div>
      <div className="grid grid-cols-2 gap-5">
        {config.fields.map(field => <div key={field.name} className={`space-y-2 ${field.wide ? 'col-span-2' : ''}`}>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-[#114232]">{field.label}{field.required ? ' *' : ''}</label>
          <Field field={field} value={form[field.name]} onChange={value => setForm(prev => ({ ...prev, [field.name]: value }))} uploading={uploading} setUploading={setUploading} />
        </div>)}
      </div>
      <div className="flex justify-end gap-3 mt-7 pt-5 border-t"><button type="button" onClick={() => setEditing(null)} className="px-5 py-3 border rounded-xl text-xs uppercase">Cancel</button><button disabled={saving || uploading} className="px-6 py-3 bg-[#114232] text-[#efdbbb] rounded-xl text-xs uppercase font-semibold disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button></div>
    </form>}
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      {loading ? <div className="p-12 text-center text-gray-400">Loading from API…</div> : !renderedRows.length ? <div className="p-12 text-center text-gray-400">No records found.</div> :
        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">{config.columns.map(([, label]) => <th key={label} className="px-5 py-4">{label}</th>)}<th className="px-5 py-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y">{renderedRows.map(row => <tr key={row._id} className="text-sm hover:bg-gray-50/60">{config.columns.map(([path]) => <td key={path} className="px-5 py-4 max-w-xs truncate">{formatCell(getPath(row, path))}</td>)}<td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => startEdit(row)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={15} /></button><button onClick={() => remove(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button></div></td></tr>)}</tbody>
        </table></div>}
    </div>
  </div>;
};

export const AdminSettings = () => {
  const config = {
    title: 'Site Settings', endpoint: '/settings', singular: 'Settings',
    fields: [
      { name: 'siteName', label: 'Site Name', optional: true }, { name: 'siteDescription', label: 'Site Description', type: 'textarea', optional: true },
      { name: 'logo', label: 'Logo', type: 'image', optional: true }, { name: 'favicon', label: 'Favicon', type: 'image', optional: true },
      { name: 'contactEmail', label: 'Contact Email', type: 'email', optional: true }, { name: 'contactPhone', label: 'Contact Phone', optional: true },
      { name: 'address', label: 'Address', type: 'textarea', optional: true },
      { name: 'socialLinks', label: 'Social Links (JSON)', type: 'json', wide: true, default: '{\n  "instagram": "",\n  "facebook": "",\n  "youtube": ""\n}', emptyValue: {} },
    ],
  };
  const [form, setForm] = useState(() => emptyForm(config));
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { api.get('/settings').then(res => setForm(Object.fromEntries(config.fields.map(field => [field.name, toInputValue(field, res.data?.[field.name])])))).catch(err => setMessage(err.message)); }, []);
  const save = async e => {
    e.preventDefault();
    try {
      const payload = Object.fromEntries(config.fields.map(field => [field.name, serializeValue(field, form[field.name])]).filter(([, value]) => value !== undefined));
      if (payload.socialLinks) payload.socialLinks = Object.fromEntries(Object.entries(payload.socialLinks).filter(([, value]) => value));
      await api.put('/settings', payload); window.dispatchEvent(new Event('veadya-site-data-refresh')); setMessage('Settings saved successfully.');
    } catch (err) { setMessage(err instanceof SyntaxError ? 'Social links JSON is invalid.' : err.message); }
  };
  return <form onSubmit={save} className="bg-white border border-gray-100 rounded-3xl p-8 max-w-4xl shadow-sm space-y-6"><div><h3 className="text-2xl font-serif">Site Settings</h3><p className="text-xs text-gray-400 mt-1">Global branding and contact information from /settings</p></div>{message && <div className="bg-gray-50 border rounded-xl p-3 text-sm">{message}</div>}<div className="grid grid-cols-2 gap-5">{config.fields.map(field => <div key={field.name} className={`space-y-2 ${field.wide ? 'col-span-2' : ''}`}><label className="text-[11px] uppercase font-semibold text-[#114232]">{field.label}</label><Field field={field} value={form[field.name]} onChange={value => setForm(prev => ({ ...prev, [field.name]: value }))} uploading={uploading} setUploading={setUploading} /></div>)}</div><div className="text-right"><button disabled={uploading} className="bg-[#114232] text-[#efdbbb] px-6 py-3 rounded-xl text-xs uppercase font-semibold">Save Settings</button></div></form>;
};

export const AdminReviews = () => {
  const [products, setProducts] = useState([]); const [productId, setProductId] = useState(''); const [reviews, setReviews] = useState([]); const [error, setError] = useState('');
  useEffect(() => { api.get('/product?limit=100').then(res => { setProducts(res.data || []); if (res.data?.[0]) setProductId(res.data[0]._id); }); }, []);
  useEffect(() => { if (productId) api.get(`/review/product/${productId}`).then(res => setReviews(res.data || [])).catch(err => setError(err.message)); }, [productId]);
  return <div className="space-y-6"><div><h3 className="text-2xl font-serif">Product Reviews</h3><p className="text-xs text-gray-400 mt-1">Reviews are loaded per product through the review API.</p></div><select className={`${inputClass} max-w-md`} value={productId} onChange={e => setProductId(e.target.value)}>{products.map(product => <option key={product._id} value={product._id}>{product.title}</option>)}</select>{error && <div className="text-red-600">{error}</div>}<div className="grid gap-4">{reviews.map(review => <div key={review._id} className="bg-white border rounded-2xl p-5"><div className="flex justify-between"><strong>{review.user?.firstName || review.user?.name || 'Customer'}</strong><span className="text-amber-500">{'★'.repeat(review.rating)}</span></div><p className="text-sm text-gray-600 mt-2">{review.comment}</p></div>)}{!reviews.length && <div className="bg-white border rounded-2xl p-10 text-center text-gray-400">No reviews for this product.</div>}</div></div>;
};

export const AdminSeo = () => {
  const [type, setType] = useState('page'); const [slug, setSlug] = useState(''); const [result, setResult] = useState(null); const [error, setError] = useState('');
  const inspect = async e => { e.preventDefault(); try { setError(''); setResult(await api.get(`/seo/meta?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`)); } catch (err) { setError(err.message); } };
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  return <div className="space-y-6 max-w-4xl"><div><h3 className="text-2xl font-serif">SEO Tools</h3><p className="text-xs text-gray-400 mt-1">Inspect dynamic metadata and search-engine endpoints.</p></div><div className="grid grid-cols-2 gap-4"><a className="bg-white border rounded-2xl p-5 hover:border-[#114232]" href={`${base}/seo/sitemap.xml`} target="_blank" rel="noreferrer">Open sitemap.xml</a><a className="bg-white border rounded-2xl p-5 hover:border-[#114232]" href={`${base}/seo/robots.txt`} target="_blank" rel="noreferrer">Open robots.txt</a></div><form onSubmit={inspect} className="bg-white border rounded-3xl p-6 space-y-4"><h4 className="font-serif text-lg">Metadata preview</h4><div className="grid grid-cols-3 gap-4"><select className={inputClass} value={type} onChange={e => setType(e.target.value)}><option>page</option><option>post</option><option>product</option><option>category</option><option>post-category</option></select><input className={`${inputClass} col-span-2`} value={slug} onChange={e => setSlug(e.target.value)} placeholder="Resource slug" required /></div><button className="bg-[#114232] text-white rounded-xl px-5 py-3 text-xs uppercase">Inspect metadata</button>{error && <p className="text-red-600 text-sm">{error}</p>}{result && <pre className="bg-gray-950 text-emerald-300 rounded-xl p-4 overflow-auto text-xs">{JSON.stringify(result.data, null, 2)}</pre>}</form></div>;
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/order/stats').then(response => setStats(response.data)).catch(err => setError(err.message)); }, []);
  if (error) return <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">{error}</div>;
  if (!stats) return <div className="bg-white border rounded-3xl p-12 text-center text-gray-400">Loading live business metrics…</div>;
  const cards = [
    ['Total revenue', `₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`],
    ['Orders', stats.totalOrders || 0], ['Products', stats.totalProducts || 0], ['Customers', stats.totalUsers || 0],
  ];
  return <div className="space-y-7"><div className="grid grid-cols-4 gap-5">{cards.map(([label, value]) => <div key={label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"><p className="text-[10px] uppercase tracking-widest text-gray-400">{label}</p><p className="text-3xl font-serif text-[#114232] mt-3">{value}</p></div>)}</div><div className="grid grid-cols-2 gap-6"><div className="bg-white border rounded-3xl p-6"><h4 className="font-serif text-lg mb-4">Order status</h4><div className="space-y-3">{Object.entries(stats.statusCounts || {}).map(([status, count]) => <div key={status} className="flex justify-between text-sm capitalize border-b pb-2"><span>{status}</span><strong>{count}</strong></div>)}</div></div><div className="bg-white border rounded-3xl p-6"><h4 className="font-serif text-lg mb-4">Recent orders</h4><div className="space-y-3">{(stats.recentOrders || []).map(order => <div key={order._id} className="flex justify-between border-b pb-3 text-sm"><div><strong>#{order._id.slice(-8).toUpperCase()}</strong><p className="text-xs text-gray-400">{order.user?.email || 'Customer'}</p></div><span>₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</span></div>)}</div></div></div></div>;
};
