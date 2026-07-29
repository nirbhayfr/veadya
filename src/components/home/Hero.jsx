import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";
import { useContentEntries, useSiteData } from "../../context/SiteDataContext";
import { withImageFallback } from "../../utils/mediaUrl";

const Hero = () => {
	const [swiperInstance, setSwiperInstance] = useState(null);
	const { banners, loading } = useSiteData();
	const trustEntries = useContentEntries("trust-point");
	const trustPoints = trustEntries.length
		? trustEntries
			.map(entry => entry.data)
			.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
		: [
			{ title: "100% Natural", description: "Sourced directly from earth's bounty.", icon: "fa-solid fa-seedling" },
			{ title: "GMP Certified", description: "Highest global safety standards.", icon: "fa-solid fa-shield-halved" },
			{ title: "No Chemicals", description: "Pure botanicals, nothing artificial.", icon: "fa-solid fa-flask-vial" },
			{ title: "Thousands Trust", description: "Join our community of wellness.", icon: "fa-solid fa-users" },
		];
	const slidesData = banners.homepage.map(banner => ({
		id: banner._id,
		img: banner.image,
		title: banner.title,
		eyebrow: banner.eyebrow,
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
												onError={withImageFallback("/banner-1.png")}
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
													{slide.eyebrow || "Premium Ayurvedic Wellness"}
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
						{trustPoints.map((point, index) => (
							<div key={`${point.title}-${index}`} className={`trust-item ${index < trustPoints.length - 1 ? "trust-item-border-r" : ""}`}>
								<div className="trust-icon-wrap">
									<i className={`${point.icon || "fa-solid fa-leaf"} trust-icon`} />
								</div>
								<div>
									<p className="trust-title">{point.title}</p>
									<p className="trust-desc">{point.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default Hero;
