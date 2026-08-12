import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const heroProblems = [
	{
		id: 1,
		name: "Immune Support",
		img: "/immunity.png",
		link: "/shop?problem=Immunity+Wellness",
	},
	{
		id: 2,
		name: "Digestive Support",
		img: "/digestive.png",
		link: "/shop?problem=Digestive+Wellness",
	},
	{
		id: 3,
		name: "Joint & Mobility Support",
		img: "/pain.png",
		link: "/shop?problem=Pain+Reliever",
	},
	{
		id: 4,
		name: "Heart Wellness",
		img: "/cardiac.png",
		link: "/shop?problem=Cardiac+Wellness",
	},
	{
		id: 5,
		name: "Ayurveda & Wellness",
		img: "/skin.png",
		link: "/shop?problem=Ayurveda+Wellness",
	},
	{
		id: 6,
		name: "Everyday Cleansing Support",
		img: "/blood.png",
		link: "/shop?problem=Blood+Purifier",
	},
];

const HeroCategories = () => {
	return (
		<section className="hero-cat-section">
			<div className="section-container">
				{/* Section Header */}
				<div className="section-header">
					<p className="section-eyebrow">
						<i className="fa-solid fa-leaf section-eyebrow-icon"></i>
						Explore by Wellness Need
					</p>
					<h2 className="section-title">
						Find Support for Your Wellness Goals
					</h2>
					<p className="section-desc">
						Choose a wellness goal to explore Ayurvedic
						juices, capsules, and herbal drops suited to your
						everyday routine.
					</p>
				</div>

				{/* Circular Category Cards Swiper Carousel */}
				<div className="hero-cat-swiper-wrap animate-fade-in">
					<Swiper
						modules={[Autoplay]}
						spaceBetween={20}
						slidesPerView={2}
						loop={true}
						autoplay={{
							delay: 2500,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						breakpoints={{
							480: {
								slidesPerView: 3,
								spaceBetween: 20,
							},
							768: {
								slidesPerView: 4,
								spaceBetween: 30,
							},
							1024: {
								slidesPerView: 5,
								spaceBetween: 30,
							},
							1200: {
								slidesPerView: 6,
								spaceBetween: 40,
							},
						}}
						className="swiper-categories"
					>
						{heroProblems.map((prob) => (
							<SwiperSlide key={prob.id}>
								<a
									href={prob.link}
									className="hero-cat-item"
								>
									<div className="hero-cat-circle">
										<img
											src={prob.img}
											alt={prob.name}
											className="hero-cat-img"
										/>
									</div>
									<p
										className="hero-cat-name text-center"
										style={{
											fontSize: "13.5px",
											fontFamily:
												'"Poppins", sans-serif',
											fontWeight: "500",
											color: "#1f362e",
										}}
									>
										{prob.name}
									</p>
								</a>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</section>
	);
};

export default HeroCategories;
