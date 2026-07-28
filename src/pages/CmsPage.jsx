import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { resolveMediaUrl, withImageFallback } from '../utils/mediaUrl';

export const CmsPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get(`/page/slug/${encodeURIComponent(slug)}`).then(res => setPage(res.data)).catch(err => setError(err.message)); }, [slug]);
  if (error) return <div className="section-container py-28 text-center"><h1 className="text-3xl font-serif">Page unavailable</h1><p className="mt-3 text-gray-500">{error}</p></div>;
  if (!page) return <div className="section-container py-28 text-center text-gray-400">Loading page…</div>;
  return <article className="section-container py-20 max-w-4xl mx-auto">
    {page.featuredImage && <img src={resolveMediaUrl(page.featuredImage)} onError={withImageFallback()} alt={page.title} className="w-full max-h-[480px] object-cover rounded-3xl mb-10" />}
    <p className="text-xs uppercase tracking-[0.2em] text-[#114232]">Veadya</p>
    <h1 className="text-5xl font-serif mt-3 text-gray-900">{page.title}</h1>
    {page.excerpt && <p className="text-xl text-gray-500 mt-5">{page.excerpt}</p>}
    <div className="mt-10 text-gray-700 leading-8 whitespace-pre-wrap">{page.content}</div>
  </article>;
};

export const Journal = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => { api.get('/post').then(res => setPosts((res.data || []).filter(post => post.status === 'published'))); }, []);
  return <section className="section-container py-20"><div className="max-w-2xl mb-12"><p className="text-xs uppercase tracking-[0.2em] text-[#114232]">The Journal</p><h1 className="text-5xl font-serif mt-3">Botanical knowledge</h1></div><div className="grid md:grid-cols-3 gap-7">{posts.map(post => <Link key={post._id} to={`/journal/${post.slug}`} className="bg-white border rounded-3xl overflow-hidden group">{post.featuredImage && <img src={resolveMediaUrl(post.featuredImage)} onError={withImageFallback()} alt={post.title} className="w-full h-56 object-cover" />}<div className="p-6"><p className="text-xs text-gray-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</p><h2 className="font-serif text-2xl mt-2 group-hover:text-[#114232]">{post.title}</h2><p className="text-sm text-gray-500 mt-3">{post.excerpt}</p></div></Link>)}</div></section>;
};

export const JournalPost = () => {
  const { slug } = useParams(); const [post, setPost] = useState(null);
  useEffect(() => { api.get(`/post/slug/${encodeURIComponent(slug)}`).then(res => setPost(res.data)); }, [slug]);
  if (!post) return <div className="section-container py-28 text-center text-gray-400">Loading article…</div>;
  return <article className="section-container py-20 max-w-4xl mx-auto">{post.featuredImage && <img src={resolveMediaUrl(post.featuredImage)} onError={withImageFallback()} alt={post.title} className="w-full max-h-[520px] object-cover rounded-3xl mb-10" />}<p className="text-xs uppercase tracking-[0.2em] text-[#114232]">The Journal</p><h1 className="text-5xl font-serif mt-3">{post.title}</h1><p className="text-lg text-gray-500 mt-5">{post.excerpt}</p><div className="mt-10 text-gray-700 leading-8 whitespace-pre-wrap">{post.content}</div></article>;
};
