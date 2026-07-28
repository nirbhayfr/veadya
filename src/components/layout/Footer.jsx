import { useState } from "react";
import { Link } from "react-router-dom";
import { useSiteData } from "../../context/SiteDataContext";
import { api } from "../../utils/api";

const Footer = () => {
	const { settings, menus } = useSiteData();
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [newsletterMessage, setNewsletterMessage] = useState("");
	const subscribe = async event => {
		event.preventDefault();
		try {
			await api.post("/newsletter", { email: newsletterEmail });
			setNewsletterMessage("Thank you for subscribing.");
			setNewsletterEmail("");
		} catch (error) {
			setNewsletterMessage(error.message);
		}
	};
	return (
		<>
			<footer className="site-footer footer-inner">
				<div className="section-container">
					<div className="footer-grid">
						{/* Col 1: About */}
						<div>
							<Link
								to="/"
								className="footer-logo footer-logo-link"
							>
								<img
									src={settings.logo || "/logo/bgremovepng.png"}
									alt={settings.siteName || "Veadya"}
									className="footer-logo-img"
								/>
								<small>
									Ancient Wisdom · Modern Form
								</small>
							</Link>
							<p className="footer-about-text">
								For over a decade, Veadya has bridged
								5,000-year-old Ayurvedic wisdom with
								modern botanical science — crafting
								high-potency formulas for your everyday
								ritual.
							</p>
							<div className="footer-certs">
								<span className="cert-badge">
									<i className="fa-solid fa-seedling"></i>{" "}
									100% Natural
								</span>
								<span className="cert-badge">
									<i className="fa-solid fa-shield-halved"></i>{" "}
									GMP Certified
								</span>
								<span className="cert-badge">
									<i className="fa-solid fa-flask-vial"></i>{" "}
									No Synthetics
								</span>
							</div>
							<div className="footer-socials">
								<a
									href={settings.socialLinks?.instagram || "#"}
									className="social-btn"
									aria-label="Instagram"
								>
									<i className="fa-brands fa-instagram"></i>
								</a>
								<a
									href={settings.socialLinks?.facebook || "#"}
									className="social-btn"
									aria-label="Facebook"
								>
									<i className="fa-brands fa-facebook-f"></i>
								</a>
								<a
									href={settings.socialLinks?.twitter || "#"}
									className="social-btn"
									aria-label="Pinterest"
								>
									<i className="fa-brands fa-pinterest-p"></i>
								</a>
								<a
									href={settings.socialLinks?.youtube || "#"}
									className="social-btn"
									aria-label="YouTube"
								>
									<i className="fa-brands fa-youtube"></i>
								</a>
							</div>
							<form onSubmit={subscribe} className="mt-5 flex gap-2">
								<input type="email" required value={newsletterEmail} onChange={event => setNewsletterEmail(event.target.value)} placeholder="Email for wellness notes" className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-white/45 outline-none" />
								<button className="rounded-lg bg-white/15 px-3 py-2 text-[10px] uppercase tracking-wider text-white">Join</button>
							</form>
							{newsletterMessage && <p className="mt-2 text-[10px] text-white/60">{newsletterMessage}</p>}
						</div>

						{/* Col 2: Explore */}
						<div className="footer-explore-col">
							<p className="footer-col-title">Explore</p>
							{menus.footer.length > 0 && <ul className="footer-nav-list">
								{[...menus.footer].sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => (
									<li key={`${item.label}-${item.url}`}><Link to={item.url} target={item.target}>{item.label} <i className="fa-solid fa-arrow-right"></i></Link></li>
								))}
							</ul>}
							<ul className={`footer-nav-list ${menus.footer.length ? "hidden" : ""}`}>
								<li>
									<Link to="/">
										Home{" "}
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</li>
								<li>
									<Link to="/about">
										About Us{" "}
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</li>
								<li>
									<Link to="/shop">
										Shop All{" "}
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</li>
								<li>
									<a href="#">
										The Journal{" "}
										<i className="fa-solid fa-arrow-right"></i>
									</a>
								</li>
								<li>
									<Link to="/contact">
										Contact Us{" "}
										<i className="fa-solid fa-arrow-right"></i>
									</Link>
								</li>
							</ul>
						</div>

						{/* Col 3: Contact + Mosaic */}
						<div>
							<p className="footer-col-title">Contact</p>
							<ul className="footer-contact-list">
								<li className="footer-contact-item">
									<div className="c-icon">
										<i className="fa-solid fa-location-dot"></i>
									</div>
									<div>
										<div className="c-info-lbl">
											Address
										</div>
										<div className="c-info-val">
											{settings.address || "Address available soon"}
										</div>
									</div>
								</li>
								<li className="footer-contact-item">
									<div className="c-icon">
										<i className="fa-solid fa-envelope"></i>
									</div>
									<div>
										<div className="c-info-lbl">
											Email
										</div>
										<div className="c-info-val">
											<a href={`mailto:${settings.contactEmail || "hello@veadya.in"}`}>
												{settings.contactEmail || "hello@veadya.in"}
											</a>
										</div>
									</div>
								</li>
								<li className="footer-contact-item">
									<div className="c-icon">
										<i className="fa-solid fa-phone"></i>
									</div>
									<div>
										<div className="c-info-lbl">
											Phone
										</div>
										<div className="c-info-val">
											<a href={`tel:${settings.contactPhone || ""}`}>
												{settings.contactPhone || "Phone available soon"}
											</a>
										</div>
									</div>
								</li>
							</ul>

							<div className="mosaic-row">
								<span className="mosaic-lbl">
									@Veadya
								</span>
								<a href="#" className="mosaic-follow">
									Follow
								</a>
							</div>
							<div className="footer-mosaic">
								<div className="mosaic-img">
									<img src="/p-1.png" alt="" />
								</div>
								<div className="mosaic-img">
									<img src="/p-3.png" alt="" />
								</div>
								<div className="mosaic-img">
									<img src="/p-4.png" alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>

			<div className="copyright-strip">
				<div className="section-container copyright-inner">
					<p className="copyright-text">
						© 2026 <strong>Veadya</strong>. All rights
						reserved.
					</p>
					<p className="copyright-made">
						<i className="fa-solid fa-leaf"></i> Made with
						intention in India · 100% Natural · GMP Certified
					</p>
				</div>
			</div>
		</>
	);
};

export default Footer;
