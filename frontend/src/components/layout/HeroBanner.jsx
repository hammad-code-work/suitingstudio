// src/components/layout/HeroBanner.jsx
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

const slides = [
  {
    id: 1,
    tag: 'New Collection',
    title: 'Unleash Your Style\nWith Our New\nCollection',
    subtitle: 'Discover premium women\'s garments crafted with passion',
    cta: 'Shop Women',
    link: '/shop/Women',
    bgColor: '#fdf6ee',
    accentColor: '#c8860a',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
  },
  {
    id: 2,
    tag: 'Kids Collection',
    title: 'Adorable Styles\nFor Little\nOnes',
    subtitle: 'Comfortable and stylish clothing for children aged 1-12 years',
    cta: 'Shop Kids',
    link: '/shop/Kids',
    bgColor: '#eef5fd',
    accentColor: '#2563eb',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80',
  },
  {
    id: 3,
    tag: 'Season Sale',
    title: 'Exclusive Sale\nUp to 40%\nOff',
    subtitle: 'Limited time offers on our finest garment collections',
    cta: 'Shop Sale',
    link: '/shop?sale=true',
    bgColor: '#fdf0f0',
    accentColor: '#e63946',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
  },
];

const HeroBanner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    dotsClass: 'hero-dots',
    appendDots: (dots) => <div className="hero-dots-wrap">{dots}</div>,
    customPaging: () => <div className="hero-dot" />,
  };

  return (
    <section className="hero-banner">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div className="hero-slide" style={{ background: slide.bgColor }}>
              {/* Left — follow us */}
              <div className="hero-follow">
                <span>Follow Us</span>
                <div className="hero-follow-links">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer">in</a>
                  <a href="https://pinterest.com" target="_blank" rel="noreferrer">p</a>
                </div>
              </div>

              {/* Content */}
              <div className="hero-content">
                <div className="hero-tag">
                  <span style={{ background: slide.accentColor }} />
                  {slide.tag}
                </div>
                <h1 className="hero-title">
                  {slide.title.split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}<br /></React.Fragment>
                  ))}
                </h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <Link to={slide.link} className="btn btn-primary btn-lg hero-cta">
                  {slide.cta}
                  <span className="hero-cta-arrow">→</span>
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
    </section>
  );
};

export default HeroBanner;
