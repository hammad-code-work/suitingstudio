// src/components/layout/HeroBanner.jsx
import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './HeroBanner.css';

// ── YOUR LOCAL IMAGE ─────────────────────────────────────────
// Your file is at: src/components/assets/img.jpg
// Correct relative path from HeroBanner.jsx (inside src/components/layout/):
import heroImage1 from '../assets/hero1.jpeg';
import heroImage2 from '../assets/hero2.jpeg';
import heroImage3 from '../assets/hero3.jpg';
// ─────────────────────────────────────────────────────────────

const slides = [
  {
    id: 1,
    tag: 'New Collection',
    title: 'UNLEASH YOUR STYLE WITH OUR NEW COLLECTION',
    subtitle: "Discover premium women's garments crafted with passion",
    cta: 'Shop Women',
    link: '/shop/Women',
    bgColor: '#fdf6ee',
    accentColor: '#c8860a',
    image: heroImage1,
  },
  {
    id: 2,
    tag: 'Kids Collection',
    title: 'ADORABLE STYLES FOR LITTLE ONES',
    subtitle: 'Comfortable and stylish clothing for children aged 1-12 years',
    cta: 'Shop Kids',
    link: '/shop/Kids',
    bgColor: '#eef5fd',
    accentColor: '#2563eb',
    image: heroImage2,
  },
  {
    id: 3,
    tag: 'Season Sale',
    title: 'EXCLUSIVE SALE UP TO 40% OFF',
    subtitle: 'Limited time offers on our finest garment collections',
    cta: 'Shop Sale',
    link: '/shop?sale=true',
    bgColor: '#fdf0f0',
    accentColor: '#e63946',
    image: heroImage3,
  },
];

const HeroBanner = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    pauseOnFocus: false,
    cssEase: 'ease-in-out',
    arrows: false,
    appendDots: (dots) => (
      <div className="hero-dots-wrap">
        <ul className="hero-dots-list">{dots}</ul>
      </div>
    ),
    customPaging: () => <button className="hero-dot" />,
  };

  return (
    <section className="hero-banner">
      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="hero-slide" style={{ background: slide.bgColor }}>

              {/* Follow us — vertical left */}
              <div className="hero-follow">
                <span>Follow Us</span>
                <div className="hero-follow-links">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer">in</a>
                  <a href="https://pinterest.com" target="_blank" rel="noreferrer">p</a>
                </div>
              </div>

              {/* Text content */}
              <div className="hero-content">
                <div className="hero-tag">
                  <span style={{ background: slide.accentColor }} />
                  {slide.tag}
                </div>
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <Link to={slide.link} className="btn btn-primary btn-lg hero-cta">
                  {slide.cta} <span className="hero-cta-arrow">→</span>
                </Link>
              </div>

              {/* Image */}
              <div className="hero-image">
                <div className="hero-image-bg" style={{ background: slide.accentColor + '18' }} />
                <img
                  src={slide.image}
                  alt={slide.tag}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

            </div>
          </div>
        ))}
      </Slider>

      {/* Prev arrow — OUTSIDE Slider so z-index works */}
      <button
        className="hero-arrow hero-arrow--prev"
        onClick={() => { sliderRef.current?.slickPrev(); }}
        aria-label="Previous slide"
        type="button"
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Next arrow */}
      <button
        className="hero-arrow hero-arrow--next"
        onClick={() => { sliderRef.current?.slickNext(); }}
        aria-label="Next slide"
        type="button"
      >
        <FiChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroBanner;