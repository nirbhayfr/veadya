/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';

const SiteDataContext = createContext(null);

const uniqueRecords = (records = [], fallbackKey) => {
  const seen = new Set();
  return records.filter(record => {
    const key = record?._id || fallbackKey?.(record);
    if (!key || seen.has(String(key))) return false;
    seen.add(String(key));
    return true;
  });
};

const initialState = {
  settings: {},
  menus: { header: [], footer: [], mobile: [] },
  banners: { homepage: [], category: [], sidebar: [], popup: [] },
  categories: [],
  contentEntries: [],
  pages: [],
};

export const SiteDataProvider = ({ children }) => {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    const requests = [
      ['settings', api.get('/settings')],
      ['headerMenu', api.get('/menu/location/header')],
      ['footerMenu', api.get('/menu/location/footer')],
      ['mobileMenu', api.get('/menu/location/mobile')],
      ['homepageBanners', api.get('/banner/position/homepage')],
      ['categoryBanners', api.get('/banner/position/category')],
      ['sidebarBanners', api.get('/banner/position/sidebar')],
      ['popupBanners', api.get('/banner/position/popup')],
      ['categories', api.get('/category')],
      ['contentEntries', api.get('/content')],
      ['pages', api.get('/page')],
    ];
    const results = await Promise.allSettled(requests.map(([, request]) => request));
    const resolved = Object.fromEntries(results.map((result, index) => [
      requests[index][0],
      result.status === 'fulfilled' ? result.value.data : undefined,
    ]));
    const failures = results.filter(result => result.status === 'rejected');
    setData({
      settings: {
        ...(resolved.settings || {}),
        logo: resolveMediaUrl(resolved.settings?.logo),
        favicon: resolveMediaUrl(resolved.settings?.favicon),
      },
      menus: {
        header: resolved.headerMenu?.items || [],
        footer: resolved.footerMenu?.items || [],
        mobile: resolved.mobileMenu?.items || [],
      },
      banners: {
        homepage: Array.isArray(resolved.homepageBanners) ? uniqueRecords(resolved.homepageBanners, banner => `${banner.position}:${banner.title}`).map(banner => ({ ...banner, image: resolveMediaUrl(banner.image) })) : [],
        category: Array.isArray(resolved.categoryBanners) ? uniqueRecords(resolved.categoryBanners, banner => `${banner.position}:${banner.title}`).map(banner => ({ ...banner, image: resolveMediaUrl(banner.image) })) : [],
        sidebar: Array.isArray(resolved.sidebarBanners) ? uniqueRecords(resolved.sidebarBanners, banner => `${banner.position}:${banner.title}`).map(banner => ({ ...banner, image: resolveMediaUrl(banner.image) })) : [],
        popup: Array.isArray(resolved.popupBanners) ? uniqueRecords(resolved.popupBanners, banner => `${banner.position}:${banner.title}`).map(banner => ({ ...banner, image: resolveMediaUrl(banner.image) })) : [],
      },
      categories: Array.isArray(resolved.categories)
        ? uniqueRecords(resolved.categories, category => category.slug || category.name).map(category => ({ ...category, image: resolveMediaUrl(category.image) }))
        : [],
      contentEntries: Array.isArray(resolved.contentEntries)
        ? uniqueRecords(resolved.contentEntries, entry => `${entry.contentType?.slug}:${JSON.stringify(entry.data)}`)
          .filter(entry => entry.status === 'published')
          .map(entry => ({
            ...entry,
            data: entry.data
              ? { ...entry.data, image: resolveMediaUrl(entry.data.image) }
              : entry.data,
          }))
        : [],
      pages: Array.isArray(resolved.pages)
        ? uniqueRecords(
          resolved.pages.filter(page => page.status === 'published'),
          page => page.slug,
        )
        : [],
    });
    setError(failures.length ? `${failures.length} site content request${failures.length > 1 ? 's' : ''} failed.` : '');
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    const handleRefresh = () => refresh();
    window.addEventListener('veadya-site-data-refresh', handleRefresh);
    return () => window.removeEventListener('veadya-site-data-refresh', handleRefresh);
  }, []);

  const value = useMemo(() => ({ ...data, loading, error, refresh }), [data, loading, error]);
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error('useSiteData must be used inside SiteDataProvider');
  return context;
};

export const useContentEntries = (typeSlug) => {
  const { contentEntries } = useSiteData();
  return useMemo(
    () => contentEntries.filter(entry => entry.contentType?.slug === typeSlug),
    [contentEntries, typeSlug],
  );
};

export const useHomepageSection = (sectionKey) => {
  const entries = useContentEntries('homepage-section');
  return useMemo(
    () => entries.find(entry =>
      entry.data?.section === sectionKey,
    )?.data,
    [entries, sectionKey],
  );
};
