import { Link } from 'react-router-dom';
import { useHomepageSection } from '../../context/SiteDataContext';
import { withImageFallback } from '../../utils/mediaUrl';

const HomeBottomBanner = () => {
  const content = useHomepageSection('bottom-banner') || {};
  const image = (
    <img
      src={content.image || '/homebottombanner.png'}
      onError={withImageFallback('/homebottombanner.png')}
      alt={content.title || 'Veadya Promotional Banner'}
      className="w-full h-auto object-cover block"
    />
  );
  return (
    <section className="home-bottom-banner-section py-8 md:py-12">
      <div className="section-container">
        <div className="w-full rounded-[16px] overflow-hidden shadow-xs">
          {content.buttonLink ? <Link to={content.buttonLink} aria-label={content.buttonText || content.title}>{image}</Link> : image}
        </div>
      </div>
    </section>
  );
};

export default HomeBottomBanner;
