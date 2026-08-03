import { Link } from "react-router-dom";
import { useHomepageSection } from "../../context/SiteDataContext";
import { withImageFallback } from "../../utils/mediaUrl";

const OurStory = () => {
	const content = useHomepageSection("our-story") || {};
	return (
		<section className="founder-section">
			<div className="founder-inner">
				<div className="founder-img-wrap">
					<img
						src={content.image || "/all-juices.png"}
						onError={withImageFallback("/all-juices.png")}
						alt={content.title || "Veadya Wellness"}
						className="founder-img"
					/>
				</div>

				<div className="founder-text">
					<p className="founder-eyebrow">
						<i className="fa-solid fa-seedling text-[8px]"></i>
						{content.eyebrow || "Traditional Ayurveda · Thoughtful Formulation"}
					</p>
					<h2 className="founder-heading">
						{content.title || "Make Ayurveda Part of Your Daily Routine"}
						<em className="block text-xl opacity-80 mt-1 font-normal font-sans tracking-[0.1em] uppercase">
							Ayurvedic Wellness for Everyday Life
						</em>
					</h2>
					<p className="founder-para">
						{content.description || "Explore our range of herbal juices, drops, and capsules inspired by traditional Ayurveda and created to support everyday balance, energy, and overall well-being."}
					</p>
					<div className="founder-pills mt-6 mb-6">
						<span className="founder-pill">
							<i className="fa-solid fa-leaf"></i> Carefully Selected Ingredients
						</span>
						<span className="founder-pill">
							<i className="fa-solid fa-shield-halved"></i>{" "}
							Made in a GMP-Certified Facility
						</span>
						<span className="founder-pill">
							<i className="fa-solid fa-flask-vial"></i>{" "}
							Thoughtful Formulation
						</span>
					</div>
					<div className="founder-cta-row">
						<Link to={content.buttonLink || "/shop"} className="founder-btn-primary">
							{content.buttonText || "Shop All Products"}{" "}
							<i className="fa-solid fa-arrow-right text-[9px]"></i>
						</Link>
						<a href="/about" className="founder-btn-ghost">
							Our Approach{" "}
							<i className="fa-solid fa-arrow-right text-[9px]"></i>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default OurStory;
