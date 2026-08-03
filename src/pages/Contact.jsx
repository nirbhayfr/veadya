import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useSiteData } from '../context/SiteDataContext';

const Contact = () => {
  const { settings } = useSiteData();
  const contactPhone = settings.contactPhone || '+91 12345 67890';
  const contactEmail = settings.contactEmail || 'hello@veadya.in';
  const contactAddress = settings.address || 'Rishikesh, Uttarakhand, India';
  const whatsappNumber = contactPhone.replace(/\D/g, '');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await api.post('/contact', formData);
      setLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Question', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit query. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ background: '#fcfbfa' }}>

      {/* ── Page Header / Hero Section (Standardized matching Shop layout) ── */}
      <section className="shop-hero">
        {/* Decorative floating orbs */}
        <div className="shop-hero-orb shop-hero-orb-1" />
        <div className="shop-hero-orb shop-hero-orb-2" />

        <div className="section-container shop-hero-inner">
          {/* Breadcrumb */}
          <div className="shop-hero-breadcrumb">
            <Link to="/">Home</Link>
            <i className="fa-solid fa-chevron-right" />
            <span>Contact Us</span>
          </div>

          {/* Eyebrow */}
          <p className="shop-hero-eyebrow">
            <i className="fa-solid fa-feather-pointed" />
            We’re Here to Help
          </p>

          {/* Heading */}
          <h1 className="shop-hero-title">
            How Can We <em>Help You?</em>
          </h1>

          {/* Subtitle */}
          <p className="shop-hero-subtitle">
            Whether you need help choosing a product, have a question about an order, or want to discuss a wholesale partnership, the Veadya team is ready to assist you.
          </p>
        </div>
      </section>

      <section style={{ marginTop: '64px' }}>
        <div className="section-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1.3fr',
            gap: '64px',
            alignItems: 'start'
          }} className="about-values-grid">

            {/* ── Left Column: Contact Cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

              {/* Office and customer support card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(1, 114, 110, 0.08)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 16px 40px rgba(1, 114, 110, 0.02)'
              }}>
                <span style={{
                  fontFamily: '"Jost", sans-serif',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  display: 'block',
                  marginBottom: '16px'
                }}>
                  Visit or Contact Veadya
                </span>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '25px',
                  fontWeight: 500,
                  color: 'var(--text-dark)',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Veadya Office &amp; Customer Support
                </h3>
                <p style={{
                  fontFamily: '"Jost", sans-serif',
                  fontSize: '13.5px',
                  color: 'var(--text-mid)',
                  lineHeight: '1.7',
                  fontWeight: 300,
                  marginBottom: '32px'
                }}>
                  {contactAddress}
                </p>

                {/* Info List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(239, 219, 187, 0.25)',
                      border: '1px solid rgba(1, 114, 110, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <i className="fa-solid fa-phone" style={{ fontSize: '14px' }} />
                    </div>
                    <div>
                      <span style={{ fontFamily: '"Jost", sans-serif', fontSize: '9px', fontWeight: 600, color: 'var(--primary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Call Our Support Team</span>
                      <a href={`tel:${contactPhone}`} style={{ fontFamily: '"Jost", sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)', textDecoration: 'none', transition: 'color 0.3s ease' }} className="contact-link-hover">{contactPhone}</a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(239, 219, 187, 0.25)',
                      border: '1px solid rgba(1, 114, 110, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)'
                    }}>
                      <i className="fa-solid fa-envelope" style={{ fontSize: '14px' }} />
                    </div>
                    <div>
                      <span style={{ fontFamily: '"Jost", sans-serif', fontSize: '9px', fontWeight: 600, color: 'var(--primary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email Us</span>
                      <a href={`mailto:${contactEmail}`} style={{ fontFamily: '"Jost", sans-serif', fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)', textDecoration: 'none', transition: 'color 0.3s ease' }} className="contact-link-hover">{contactEmail}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support & Ritual Care Card */}
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(1, 114, 110, 0.08)',
                borderRadius: '24px',
                padding: '40px',
                boxShadow: '0 16px 40px rgba(1, 114, 110, 0.02)'
              }}>
                <span style={{
                  fontFamily: '"Jost", sans-serif',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  display: 'block',
                  marginBottom: '16px'
                }}>
                  Product Guidance
                </span>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '25px',
                  fontWeight: 500,
                  color: 'var(--text-dark)',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  Talk to Our Support Team
                </h3>
                <p style={{
                  fontFamily: '"Jost", sans-serif',
                  fontSize: '13.5px',
                  color: 'var(--text-mid)',
                  lineHeight: '1.7',
                  fontWeight: 300,
                  marginBottom: '28px'
                }}>
                  Our support team is available Monday to Saturday, from 10:00 AM to 7:00 PM IST, to help with product information, order-related questions, and general assistance.
                </p>

                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '14px' }} />
                  Chat with Us on WhatsApp
                </a>
              </div>

            </div>

            {/* ── Right Column: Interactive Message Form ── */}
            <div style={{
              background: '#ffffff',
              border: '1px solid rgba(1, 114, 110, 0.08)',
              borderRadius: '24px',
              padding: '48px',
              boxShadow: '0 24px 64px rgba(1, 114, 110, 0.04)',
              position: 'relative'
            }}>

              {isSubmitted ? (
                /* Success Message State */
                <div style={{
                  textAlign: 'center',
                  padding: '40px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(1, 114, 110, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '24px'
                  }}>
                    <i className="fa-solid fa-check" style={{ fontSize: '28px' }} />
                  </div>
                  <h3 style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '28px',
                    fontWeight: 500,
                    color: 'var(--text-dark)',
                    marginBottom: '16px'
                  }}>
                    Message Received
                  </h3>
                  <p style={{
                    fontFamily: '"Jost", sans-serif',
                    fontSize: '14.5px',
                    color: 'var(--text-mid)',
                    fontWeight: 300,
                    lineHeight: '1.7',
                    maxWidth: '360px',
                    margin: '0 auto 28px'
                  }}>
                    Thank you for contacting Veadya. Our team will review your message and respond as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontFamily: '"Jost", sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fa-solid fa-arrow-left" /> Send another message
                  </button>
                </div>
              ) : (
                /* Interactive Form State */
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div style={{
                      background: '#fef2f2',
                      color: '#b91c1c',
                      fontSize: '13px',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      border: '1px solid #fca5a5',
                      fontFamily: '"Jost", sans-serif',
                      marginBottom: '20px'
                    }}>
                      {error}
                    </div>
                  )}
                  <h3 style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '30px',
                    fontWeight: 500,
                    color: 'var(--text-dark)',
                    marginBottom: '8px'
                  }}>
                    Send Us a Message
                  </h3>
                  <p style={{
                    fontFamily: '"Jost", sans-serif',
                    fontSize: '13.5px',
                    color: 'var(--text-mid)',
                    fontWeight: 300,
                    marginBottom: '36px'
                  }}>
                    Contact us for product information, order support, business enquiries, or media-related questions. Our team will respond as soon as possible.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Full Name Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="name" style={{
                        fontFamily: '"Jost", sans-serif',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--primary)'
                      }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter Your Full Name"
                        className="contact-custom-input"
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: '1.5px solid rgba(1, 114, 110, 0.1)',
                          borderRadius: '10px',
                          fontFamily: '"Jost", sans-serif',
                          fontSize: '13.5px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                      />
                    </div>

                    {/* Email Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="email" style={{
                        fontFamily: '"Jost", sans-serif',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--primary)'
                      }}>
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter Your Email Address"
                        className="contact-custom-input"
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: '1.5px solid rgba(1, 114, 110, 0.1)',
                          borderRadius: '10px',
                          fontFamily: '"Jost", sans-serif',
                          fontSize: '13.5px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: '#ffffff'
                        }}
                      />
                    </div>

                    {/* Subject/Inquiry Category Dropdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="subject" style={{
                        fontFamily: '"Jost", sans-serif',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--primary)'
                      }}>
                        How Can We Help?
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="contact-custom-input"
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: '1.5px solid rgba(1, 114, 110, 0.1)',
                          borderRadius: '10px',
                          fontFamily: '"Jost", sans-serif',
                          fontSize: '13.5px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="General Question">General Question</option>
                        <option value="Product Information">Product Information</option>
                        <option value="Order Support">Order Support</option>
                        <option value="Wholesale or Distribution">Wholesale or Distribution</option>
                        <option value="Media or Collaboration">Media or Collaboration</option>
                        <option value="Consultation Request">Consultation Request</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Message Box */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label htmlFor="message" style={{
                        fontFamily: '"Jost", sans-serif',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--primary)'
                      }}>
                        Tell Us More
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us how we can help, and include any relevant order or product details."
                        rows="5"
                        className="contact-custom-input"
                        style={{
                          width: '100%',
                          padding: '18px 20px',
                          border: '1.5px solid rgba(1, 114, 110, 0.1)',
                          borderRadius: '10px',
                          fontFamily: '"Jost", sans-serif',
                          fontSize: '13.5px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: '#ffffff',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="w-full mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full"
                        style={{
                          justifyContent: 'center',
                          padding: '16px 36px',
                          cursor: 'pointer'
                        }}
                      >
                        {loading ? (
                          <>
                            <i className="fa-solid fa-circle-notch fa-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="fa-regular fa-paper-plane" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Product Guidance Banner ── */}
      <section className="shop-connect-section" style={{ marginTop: '80px' }}>
        {/* Vertical standing divider line right in the middle */}
        <div className="shop-connect-gradient-overlay" />

        <div className="shop-connect-grid">
          {/* Left Column: Image Part (50%) */}
          <div className="shop-connect-img-col">
            <img
              src="/images/homebanner3.jfif"
              alt="Veadya product guidance"
              className="shop-connect-img"
            />
            <div className="shop-connect-img-overlay" />
          </div>

          {/* Right Column: Content Part (50%) */}
          <div className="shop-connect-content-col">
            {/* Soft glowing ambient gold orb background */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '280px',
              background: 'rgba(226, 213, 195, 0.05)',
              filter: 'blur(70px)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 1
            }} />

            <div style={{ position: 'relative', zIndex: 3 }}>
              <p className="shop-connect-eyebrow">
                <i className="fa-solid fa-feather-pointed" />
                Personalised Product Guidance
              </p>
              <h2 className="shop-connect-title">
                Book a Complimentary Product Guidance Call
              </h2>

              {/* Premium Gold fading line ornament */}
              <div style={{
                width: '60px',
                height: '1.5px',
                background: 'linear-gradient(90deg, var(--bloom-pale) 0%, rgba(226, 213, 195, 0.1) 100%)',
                margin: '14px 0 22px'
              }} />

              <p className="shop-connect-desc">
                Not sure which Veadya product may fit your wellness routine? Book a short call with our team to understand the available options and receive general product guidance.
              </p>
              <a
                href={`mailto:${contactEmail}?subject=Product%20Guidance%20Call`}
                className="btn-primary w-fit"
                style={{
                  background: 'var(--bloom-pale)',
                  color: 'var(--primary)',
                  border: 'none',
                  boxShadow: '0 8px 24px rgba(1, 114, 110, 0.2)',
                  position: 'relative',
                  zIndex: 4
                }}
              >
                <i className="fa-regular fa-calendar-check mr-2" />
                Book a 15-Minute Call
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
