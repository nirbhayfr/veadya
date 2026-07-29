import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { resolveMediaUrl, withImageFallback } from '../utils/mediaUrl';

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : '';

const LoadingState = ({ label }) => (
  <main className="min-h-[60vh] bg-[#faf9f6] pt-28 sm:pt-36 lg:pt-40 pb-28 sm:pb-36 lg:pb-40">
    <div className="section-container px-5 sm:px-8 text-center">
      <div className="w-10 h-10 border-2 border-[#114232]/15 border-t-[#114232] rounded-full animate-spin mx-auto" />
      <p className="mt-5 text-xs uppercase tracking-[0.2em] text-gray-400">
        {label}
      </p>
    </div>
  </main>
);

const ErrorState = ({ message }) => (
  <main className="min-h-[60vh] bg-[#faf9f6] pt-28 sm:pt-36 lg:pt-40 pb-28 sm:pb-36 lg:pb-40">
    <div className="section-container px-5 sm:px-8 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-[#114232]">
        Veadya
      </p>
      <h1 className="text-3xl sm:text-4xl font-serif mt-4 text-gray-900">
        This page is unavailable
      </h1>
      <p className="mt-4 text-sm text-gray-500">{message}</p>
      <Link
        to="/"
        className="inline-flex mt-8 px-6 py-3 rounded-xl bg-[#114232] text-white text-xs uppercase tracking-widest"
      >
        Return home
      </Link>
    </div>
  </main>
);

export const CmsPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/page/slug/${encodeURIComponent(slug)}`)
      .then((response) => setPage(response.data))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!page) return <LoadingState label="Loading page" />;

  return (
    <main className="bg-[#faf9f6] pt-24 sm:pt-28 lg:pt-32 pb-28 sm:pb-36 lg:pb-40">
      <article className="section-container px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.16em] text-gray-400 mb-10 sm:mb-14">
            <Link to="/" className="hover:text-[#114232] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#114232] truncate">{page.title}</span>
          </nav>

          <header className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#114232] font-semibold">
              Veadya
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.08] mt-4 text-gray-900">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-lg sm:text-xl leading-8 text-gray-500 mt-6 max-w-2xl">
                {page.excerpt}
              </p>
            )}
          </header>

          {page.featuredImage && (
            <div className="overflow-hidden rounded-2xl sm:rounded-[28px] mb-10 sm:mb-14 bg-gray-100">
              <img
                src={resolveMediaUrl(page.featuredImage)}
                onError={withImageFallback()}
                alt={page.title}
                className="w-full max-h-[560px] object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl bg-white border border-gray-100 rounded-2xl sm:rounded-3xl px-6 sm:px-10 lg:px-12 py-8 sm:py-12 shadow-sm">
            <div className="text-[16px] sm:text-[17px] text-gray-700 leading-8 sm:leading-9 whitespace-pre-wrap">
              {page.content}
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export const Journal = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/post')
      .then((response) =>
        setPosts(
          (response.data || []).filter((post) => post.status === 'published'),
        ),
      )
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading journal" />;
  if (error) return <ErrorState message={error} />;

  return (
    <main className="bg-[#faf9f6] min-h-[70vh] pt-24 sm:pt-28 lg:pt-32 pb-28 sm:pb-36 lg:pb-40">
      <section className="section-container px-5 sm:px-8">
        <header className="max-w-3xl mb-12 sm:mb-16 lg:mb-20">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#114232] font-semibold">
            The Journal
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.08] mt-4 text-gray-900">
            Botanical knowledge
          </h1>
          <p className="text-base sm:text-lg leading-8 text-gray-500 mt-6 max-w-2xl">
            Considered notes on Ayurvedic living, botanical ingredients, and
            building thoughtful everyday rituals.
          </p>
        </header>

        {!posts.length ? (
          <div className="bg-white border border-gray-100 rounded-3xl py-20 px-6 text-center">
            <p className="font-serif text-2xl text-gray-700">
              New stories are being prepared.
            </p>
            <p className="text-sm text-gray-400 mt-3">Please return soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/journal/${post.slug}`}
                className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  {post.featuredImage ? (
                    <img
                      src={resolveMediaUrl(post.featuredImage)}
                      onError={withImageFallback()}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#e8eee9]" />
                  )}
                </div>
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#114232]/70">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                  <h2 className="font-serif text-2xl sm:text-[28px] leading-tight mt-3 text-gray-900 group-hover:text-[#114232] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm leading-6 text-gray-500 mt-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 mt-7 pt-5 border-t border-gray-100 text-[10px] uppercase tracking-[0.18em] font-semibold text-[#114232]">
                    Read article
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export const JournalPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/post/slug/${encodeURIComponent(slug)}`)
      .then((response) => setPost(response.data))
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) return <ErrorState message={error} />;
  if (!post) return <LoadingState label="Loading article" />;

  return (
    <main className="bg-[#faf9f6] pt-24 sm:pt-28 lg:pt-32 pb-28 sm:pb-36 lg:pb-40">
      <article className="section-container px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.16em] text-gray-400 mb-10 sm:mb-14">
            <Link to="/journal" className="hover:text-[#114232] transition-colors">
              Journal
            </Link>
            <span>/</span>
            <span className="text-[#114232] truncate">{post.title}</span>
          </nav>

          <header className="max-w-4xl mb-10 sm:mb-14">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.18em] text-[#114232]">
              <span>The Journal</span>
              <span className="w-1 h-1 rounded-full bg-[#114232]/40" />
              <span className="text-gray-400">
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.08] mt-5 text-gray-900">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg sm:text-xl leading-8 text-gray-500 mt-6 max-w-3xl">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.featuredImage && (
            <div className="overflow-hidden rounded-2xl sm:rounded-[28px] mb-10 sm:mb-14 bg-gray-100">
              <img
                src={resolveMediaUrl(post.featuredImage)}
                onError={withImageFallback()}
                alt={post.title}
                className="w-full max-h-[600px] object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl bg-white border border-gray-100 rounded-2xl sm:rounded-3xl px-6 sm:px-10 lg:px-12 py-8 sm:py-12 shadow-sm">
            <div className="text-[16px] sm:text-[17px] text-gray-700 leading-8 sm:leading-9 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="max-w-3xl mt-10 sm:mt-14 pt-8 border-t border-gray-200">
            <Link
              to="/journal"
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] font-semibold text-[#114232]"
            >
              <span aria-hidden="true">←</span>
              Back to the journal
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
};
