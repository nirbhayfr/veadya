import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import ProductCard from '../shop/ProductCard';
import { useHomepageSection } from '../../context/SiteDataContext';

import { useSelector } from 'react-redux';

const FullVeadyaEdit = () => {
  const content = useHomepageSection('full-veadya-edit') || {};
  const products = useSelector((state) => state.products.items);
  // Products 0-3 are shown in the homepage grid. Do not clone API records:
  // Swiper duplication plus array tripling caused the same content to repeat.
  const displayProducts = products.slice(4);

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 text-white full-veadya-section">
      {/* Background Ambient Glows */}
      <div className="full-veadya-glow-1"></div>
      <div className="full-veadya-glow-2"></div>
      
      {/* Decorative Brand Blobs for Modern Background Depth */}
      <div className="full-veadya-blob-1"></div>
      <div className="full-veadya-blob-2"></div>

      <div className="section-container relative z-10">
        {/* Header Content */}
        <div className="text-center mb-12">
          <p className="text-[#9abcb9] text-[10px] uppercase tracking-[0.25em] font-medium mb-4 flex items-center justify-center gap-2">
            <span className="text-xs">✦</span> {content.eyebrow || 'THE FULL VEADYA EDIT'}
          </p>
          <h2 className="font-serif text-[42px] md:text-[56px] leading-[1.1] mb-4 font-normal text-white">
            {content.title || 'Ritual Collection'}
          </h2>
          <p className="text-[#9abcb9] text-[15px] font-light tracking-wide">
            {content.description || 'Five pillars of Ayurvedic wellness, distilled into daily ritual.'}
          </p>
        </div>

        {/* Swiper Carousel */}
        <div className="mb-12">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={displayProducts.length > 5}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            className="w-full border-t border-b border-white/10"
          >
            {displayProducts.map((product) => (
              <SwiperSlide key={product._id || product.id} className="border-r border-white/10 h-auto flex">
                <ProductCard product={product} isDark={true} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Footer Button */}
        <div className="text-center">
          <Link to={content.buttonLink || '/shop'} className="inline-flex items-center gap-3 bg-[#f3eed5] text-[var(--bg-deep)] px-8 py-3.5 rounded-sm font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg">
            → {content.buttonText || 'EXPLORE ALL PRODUCTS'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FullVeadyaEdit;
