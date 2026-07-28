import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext";

const Hero = () => {
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { banners, loading } = useSiteData();
	const slidesData = banners.homepage.map(banner => ({
		id: banner._id,
		img: banner.image,
		title: banner.title,
		subtitle: banner.subtitle,
		desc: banner.subtitle,
		buttonText: banner.buttonText,
		buttonLink: banner.buttonLink,
	}));

	const handlePrev = () => {
		if (swiperInstance) {
			swiperInstance.slidePrev();
			swiperInstance.autoplay?.start();
		}
	};

	const handleNext = () => {
		if (swiperInstance) {
			swiperInstance.slideNext();
			swiperInstance.autoplay?.start();
		}
	};

	if (!loading && slidesData.length === 0) return null;
	if (slidesData.length === 0) {
		return <section className="hero-section"><div className="hero-container animate-pulse bg-[#e8eee9] min-h-[520px]" /></section>;
	}

	return (
		<>
			<section className="hero-section">
				<div className="hero-container">
					<Swiper
						modules={[Autoplay, EffectFade]}
						onSwiper={setSwiperInstance}
						effect="fade"
						fadeEffect={{ crossFade: true }}
						loop={true}
						speed={1000}
						autoplay={{
							delay: 3200,
							disableOnInteraction: false,
							pauseOnMouseEnter: false,
						}}
						className="swiper-hero"
					>
						{slidesData.map((slide) => (
							<SwiperSlide key={slide.id}>
								{({ isActive }) => (
									<div className="hero-slide-content">
										{/* Background Image */}
										<div className="hero-slide-bg">
											<img
												src={slide.img}
												alt={slide.title}
												className="hero-bg-img"
											/>
										</div>

										{/* Overlay */}
										<div className="hero-overlay" />

										{/* Text Content */}
										<div className="hero-content-wrapper">
											<div
												className={`hero-content ${isActive ? "is-active" : ""}`}
											>
												<p className="hero-tag">
													Premium
													Ayurvedic
													Wellness
												</p>

												<h1 className="hero-title">
													{slide.title}
												</h1>

												<h2 className="hero-subtitle">
													{
														slide.subtitle
													}
												</h2>

												<p className="hero-description">
													{slide.desc}
												</p>

												<div className="hero-buttons">
													{slide.buttonText && slide.buttonLink && (
														<Link className="hero-btn-primary" to={slide.buttonLink}>
															{slide.buttonText}
														</Link>
													)}
													{/* <button className="hero-btn-secondary" disabled aria-label="Coming soon">
												Coming Soon
											</button> */}
												</div>
											</div>
										</div>

										{/* Navigation — inside slide so it's always visible */}
										<div className="hero-nav-wrapper">
											<button
												className="hero-prev-btn"
												onClick={handlePrev}
												aria-label="Previous slide"
											>
												<i className="fa-solid fa-chevron-left" />
											</button>
											<button
												className="hero-next-btn"
												onClick={handleNext}
												aria-label="Next slide"
											>
												<i className="fa-solid fa-chevron-right" />
											</button>
										</div>
									</div>
								)}
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</section>

			{/* Trust Bar */}
			<section className="trust-section">
				<div className="section-container">
					<div className="trust-bar">
						<div className="trust-item trust-item-border-r">
							<div className="trust-icon-wrap">
								<i className="fa-solid fa-seedling trust-icon" />
							</div>
							<div>
								<p className="trust-title">
									100% Natural
								</p>
								<p className="trust-desc">
									Sourced directly from earth's
									bounty.
								</p>
							</div>
						</div>
						<div className="trust-item trust-item-border-r">
							<div className="trust-icon-wrap">
								<i className="fa-solid fa-shield-halved trust-icon" />
							</div>
							<div>
								<p className="trust-title">
									GMP Certified
								</p>
								<p className="trust-desc">
									Highest global safety standards.
								</p>
							</div>
						</div>
						<div className="trust-item trust-item-border-r">
							<div className="trust-icon-wrap">
								<i className="fa-solid fa-flask-vial trust-icon" />
							</div>
							<div>
								<p className="trust-title">
									No Chemicals
								</p>
								<p className="trust-desc">
									Pure botanicals, nothing
									artificial.
								</p>
							</div>
						</div>
						<div className="trust-item">
							<div className="trust-icon-wrap">
								<i className="fa-solid fa-users trust-icon" />
							</div>
							<div>
								<p className="trust-title">
									Thousands Trust
								</p>
								<p className="trust-desc">
									Join our community of wellness.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
