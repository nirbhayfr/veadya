/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import { useHomepageSection } from '../../context/SiteDataContext';

const communityData = [
  {
    tag: "Ashwagandha Gold",
    text: '"The routine was easy to follow and fitted comfortably into my mornings."',
    avatar: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=120&q=80",
    name: "Priya Sharma",
    role: "Yoga Instructor · Mumbai",
    city: "Mumbai",
    excerpt: "The routine fitted comfortably into my mornings.",
  },
  {
    tag: "Immunity Drops",
    text: '"I found the product easy to use consistently as part of my daily wellness routine."',
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&q=80",
    name: "Dr. Nandita Rao",
    role: "Physician · Chennai",
    city: "Chennai",
    excerpt: "Easy to use consistently as part of my daily routine.",
  },
  {
    tag: "Pitta Cooling Drops",
    text: '"I found the drops simple to include in my everyday wellness routine."',
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&q=80",
    name: "Riya Menon",
    role: "Wellness Coach · Bengaluru",
    city: "Bengaluru",
    excerpt: "Simple to include in an everyday wellness routine.",
  },
  {
    tag: "Brahmi Mind Oil",
    text: '"The product was straightforward to use and worked well with my daily schedule."',
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80",
    name: "Kavya Iyer",
    role: "Software Engineer · Pune",
    city: "Pune",
    excerpt: "Straightforward to use with my daily schedule.",
  },
  {
    tag: "Triphala Cleanse",
    text: '"I appreciated how easy the product was to add to a consistent routine."',
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80",
    name: "Ananya Desai",
    role: "Teacher · Ahmedabad",
    city: "Ahmedabad",
    excerpt: "Easy to add to a consistent routine.",
  },
  {
    tag: "Shatavari Elixir",
    text: '"The formulation fitted naturally into my everyday wellness routine."',
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=80",
    name: "Meera Pillai",
    role: "Nutritionist · Kochi",
    city: "Kochi",
    excerpt: "Fitted naturally into my everyday wellness routine.",
  }
];

const CARDS_PER_PAGE = 3;

const CommunitySection = () => {
  const content = useHomepageSection('community') || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pageOffset, setPageOffset] = useState(0);
  const timerRef = useRef(null);
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % communityData.length;
        if (next < pageOffset || next >= pageOffset + CARDS_PER_PAGE) {
          setPageOffset(Math.floor(next / CARDS_PER_PAGE) * CARDS_PER_PAGE);
        }
        return next;
      });
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [pageOffset]);

  const handleCardClick = (idx) => {
    setCurrentIndex(idx);
    startTimer();
  };

  const handlePaginate = (dir) => {
    const next = pageOffset + dir * CARDS_PER_PAGE;
    if (next >= 0 && next < communityData.length) {
      setPageOffset(next);
    }
  };

  const visibleReviews = communityData.slice(pageOffset, pageOffset + CARDS_PER_PAGE);
  const currentReview = communityData[currentIndex];

  return (
    <section className="community-section">
      <div className="section-container">
        <div className="section-header">
          <p className="section-eyebrow">
            <i className="fa-solid fa-spa"></i> {content.eyebrow || 'Real Experiences from Our Community'}
          </p>
          <h2 className="section-title">{content.title || 'What Our Customers Say'}</h2>
          <p className="section-desc">
            {content.description || 'Read how customers have included Veadya products in their everyday wellness routines.'}
          </p>
        </div>
        <div className="community-grid">
          {/* SPOTLIGHT */}
          <div className="community-spotlight">
            <div className="community-spotlight-inner" key={currentIndex}>
              <div className="community-author">
                <img src={currentReview.avatar} alt={currentReview.name} />
                <div>
                  <div className="community-author-name">{currentReview.name}</div>
                  <div className="community-author-role">{currentReview.role}</div>
                </div>
              </div>
              <span className="community-product-tag">
                <i className="fa-solid fa-seedling" style={{ fontSize: '8px' }}></i> {currentReview.tag}
              </span>
              <div className="community-stars">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="community-review-text">{currentReview.text}</p>
            </div>
            <div className="community-progress" key={`progress-${currentIndex}`}></div>
          </div>
          {/* RIGHT PANEL */}
          <div className="community-right-panel">
            <div className="community-pagination-row">
              <span className="community-page-indicator">
                {pageOffset + 1} – {Math.min(pageOffset + CARDS_PER_PAGE, communityData.length)} of {communityData.length}
              </span>
              <div className="community-pagination-arrows">
                <button 
                  className="community-arrow-btn" 
                  disabled={pageOffset === 0}
                  onClick={() => handlePaginate(-1)}
                >
                  <i className="fa-solid fa-chevron-up"></i>
                </button>
                <button 
                  className="community-arrow-btn" 
                  disabled={pageOffset + CARDS_PER_PAGE >= communityData.length}
                  onClick={() => handlePaginate(1)}
                >
                  <i className="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
            <div className="community-reviews-list">
              {visibleReviews.map((review, i) => {
                const globalIdx = pageOffset + i;
                return (
                  <div 
                    key={globalIdx} 
                    className={`community-review-card ${globalIdx === currentIndex ? 'community-review-active' : ''}`}
                    onClick={() => handleCardClick(globalIdx)}
                  >
                    <div className="community-review-header">
                      <img src={review.avatar} alt={review.name} className="community-reviewer-avatar"/>
                      <div>
                        <div className="community-reviewer-name">{review.name}</div>
                        <div className="community-reviewer-city">{review.city}</div>
                      </div>
                      <div className="community-review-stars">
                        <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                      </div>
                    </div>
                    <div className="community-review-excerpt">{review.excerpt}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
