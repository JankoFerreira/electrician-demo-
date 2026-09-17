import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const business = {
  name: 'Northline Electrical',
  phone: '(555) 018-2400',
  whatsapp: '15550182400',
  email: 'hello@northline-electrical.com',
};

const reviews = [
  {
    quote: '"They upgraded our panel, labeled everything clearly, and left the garage cleaner than it was before."',
    author: 'MAYA R.',
    detail: 'Westhaven / Panel upgrade',
  },
  {
    quote: '"No drama, no scare tactics. Just a clear quote, clean work, and power back on the same afternoon."',
    author: 'DANIEL K.',
    detail: 'Northline / Fault finding',
  },
  {
    quote: '"The lighting install completely changed our kitchen. The finish was tidy and the advice was spot on."',
    author: 'SOFIA M.',
    detail: 'Brookmere / Lighting installation',
  },
  {
    quote: '"Our EV charger was installed neatly, tested properly, and explained in plain English before they left."',
    author: 'JAMES T.',
    detail: 'Ridge Park / EV charger',
  },
];

const services = [
  {
    name: 'Panel upgrades',
    eyebrow: 'Capacity and safety',
    duration: '1-2 days',
    price: 'quoted upfront',
    description: 'Modern switchboards, clean labeling, safer circuits, and capacity planning for future appliances.',
    includes: ['Load assessment', 'Circuit labeling', 'Safety testing'],
  },
  {
    name: 'Lighting installs',
    eyebrow: 'Interior and exterior',
    duration: 'same-day options',
    price: 'from inspection',
    description: 'Recessed lighting, feature pendants, exterior fixtures, and practical lighting plans for finished homes.',
    includes: ['Fixture placement', 'Dimmers', 'Clean patch-ready cuts'],
  },
  {
    name: 'EV chargers',
    eyebrow: 'Home charging',
    duration: '1 day typical',
    price: 'quoted upfront',
    description: 'Dedicated charger circuits, panel checks, neat cable routes, and final testing before handover.',
    includes: ['Panel check', 'Dedicated circuit', 'Charger testing'],
  },
  {
    name: 'Safety inspections',
    eyebrow: 'Peace of mind',
    duration: '60-90 min',
    price: 'fixed call-out',
    description: 'Practical inspections for older homes, tripping breakers, property purchases, and renovation planning.',
    includes: ['Visual inspection', 'Fault notes', 'Priority plan'],
  },
];

const galleryItems = [
  {
    title: 'Kitchen lighting',
    meta: 'Recessed trim / warm LED',
    className: 'lighting',
  },
  {
    title: 'Panel relabel',
    meta: 'Breaker schedule / safety check',
    className: 'panel',
  },
  {
    title: 'EV charger',
    meta: 'Dedicated circuit / final test',
    className: 'ev',
  },
  {
    title: 'Exterior fixture',
    meta: 'Weather-rated wall light',
    className: 'exterior',
  },
  {
    title: 'Cabinet LED',
    meta: 'Concealed strip lighting',
    className: 'kitchen',
  },
  {
    title: 'Inspection',
    meta: 'Load test / panel report',
    className: 'inspection',
  },
];

function PowerDivider({ tone = 'light' }) {
  return (
    <div className={`power-divider power-divider--${tone}`} aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  );
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeReview, setActiveReview] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(true);
  const review = reviews[activeReview];
  const service = services[activeService];
  const whatsappText = encodeURIComponent('Hi Northline Electrical, I would like to request a quote.');
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${whatsappText}`;

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > window.innerHeight * 0.72);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]');
    document.body.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      document.body.classList.remove('reveal-ready');
    };
  }, []);

  useEffect(() => {
    const trail = Array.from({ length: 5 }, () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));

    const updatePointer = (event) => {
      const siteZoom = Number.parseFloat(getComputedStyle(document.body).zoom) || 1;
      const x = event.clientX / siteZoom;
      const y = event.clientY / siteZoom;

      document.documentElement.style.setProperty('--cursor-x', `${x}px`);
      document.documentElement.style.setProperty('--cursor-y', `${y}px`);
      trail.unshift({ x, y });
      trail.pop();

      trail.forEach((point, index) => {
        document.documentElement.style.setProperty(`--trail-${index}-x`, `${point.x}px`);
        document.documentElement.style.setProperty(`--trail-${index}-y`, `${point.y}px`);
      });
    };

    const updateHoverState = (event) => {
      const target = event.target;
      const interactive = target instanceof Element ? target.closest('a, button, [data-cursor]') : null;
      const label = interactive?.dataset.cursor || (interactive ? 'Open' : '');
      document.documentElement.style.setProperty('--cursor-label', `"${label}"`);
      document.body.classList.toggle('cursor-has-label', Boolean(label));
      document.body.classList.toggle('cursor-is-hovering', Boolean(interactive));
    };

    const clearHoverState = () => document.body.classList.remove('cursor-is-hovering');

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('pointerover', updateHoverState, { passive: true });
    window.addEventListener('pointerout', clearHoverState, { passive: true });

    return () => {
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('pointerover', updateHoverState);
      window.removeEventListener('pointerout', clearHoverState);
    };
  }, []);

  useEffect(() => {
    const reviewTimer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length);
    }, 5200);

    return () => window.clearInterval(reviewTimer);
  }, []);

  const showReview = (direction) => {
    setActiveReview((current) => (current + direction + reviews.length) % reviews.length);
  };

  return (
    <main>
      <div className="cursor-aura" aria-hidden="true" />
      <div className="cursor-trail" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} style={{ '--trail-index': index }} />
        ))}
      </div>
      <div className="cursor-mark" aria-hidden="true">
        <svg viewBox="0 0 24 32" role="presentation">
          <path d="M14.2 1 3 18.4h8.2L8.9 31 21 12.2h-8.4L14.2 1Z" />
        </svg>
      </div>

      <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
        <a className="monogram" href="#top" aria-label={`${business.name} home`}>
          N
        </a>
        <nav aria-label="Main navigation">
          <a href="#about" data-cursor="About">About</a>
          <a href="#services" data-cursor="Work">Services</a>
          <a href="#gallery" data-cursor="Look">Gallery</a>
          <a href="#areas" data-cursor="Areas">Areas</a>
          <a href="#contact" data-cursor="Hello">Contact</a>
        </nav>
        <a className="book-link" href="#contact" data-cursor="Call">Contact</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <p className="hero-kicker">Residential / Commercial / EV</p>
        <h1 className="hero-title" aria-label="Northline Electrical">
          <svg viewBox="0 0 1500 360" role="presentation" aria-hidden="true">
            <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle">
              NORTHLINE
            </text>
          </svg>
          <span>Northline Electrical</span>
        </h1>
        <p className="hero-subtitle">Clean power. Careful hands. Clear communication.</p>
        <a className="hero-book" href="#contact" data-cursor="Call">Contact</a>
        <div className="hero-scroll" aria-hidden="true">
          <span />
          <small>Scroll</small>
        </div>
      </section>

      <section className="promise titled-section" aria-label="Northline promise">
        <span className="section-bg-title" aria-hidden="true">Standard</span>
        <div data-reveal>
          <p className="eyebrow">The Northline Standard</p>
          <blockquote>
            "Electrical work should feel orderly from the first call to the final label."
            <cite>- LICENSED, INSURED, AND DETAIL-LED</cite>
          </blockquote>
        </div>
        <div className="stats" aria-label="Company proof points" data-reveal>
          <span>*****</span>
          <strong>4.9</strong>
          <small>Star rating</small>
          <strong>12+</strong>
          <small>Years in trade</small>
          <strong>24</strong>
          <small>Hour urgent support</small>
        </div>
        <p data-reveal>Clean installs. Labeled panels. Respectful in-home service. No guesswork.</p>
      </section>

      <PowerDivider />

      <section className="gallery-rail titled-section" id="gallery" aria-label="Electrical project gallery">
        <span className="section-bg-title" aria-hidden="true">Proof</span>
        <div className="rail-copy" data-reveal>
          <p className="eyebrow">Recent work</p>
          <span>Live project reel</span>
          <a href="#services" data-cursor="Services">View services</a>
        </div>
        <div className="work-reel" data-reveal aria-label="Recent electrical work showcase">
          <div className="work-track">
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <article className={`photo-card ${item.className}`} key={`${item.title}-${index}`}>
                <span>{String((index % galleryItems.length) + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PowerDivider tone="warm" />

      <section className="story titled-section" id="about">
        <span className="section-bg-title" aria-hidden="true">Wired</span>
        <p className="eyebrow" data-reveal>About the company</p>
        <h2 data-reveal>Precision-led electrical work for homes that expect better.</h2>
        <div data-reveal>
          <p>
            Northline Electrical is built for homeowners and small businesses who want the
            job handled with the same care as the finish around it. Every visit starts with
            a proper assessment, a clear quote, and a tidy plan.
          </p>
          <p>
            From lighting plans to panel upgrades and EV charger circuits, the work stays
            calm, measured, and exact. No noise, no vague advice, no messy handover.
          </p>
          <p>
            The result is electrical service that feels established before the van even
            leaves the driveway.
          </p>
          <a href="#contact" data-cursor="Call">Request a quote <span>-&gt;</span></a>
        </div>
      </section>

      <PowerDivider tone="service" />

      <section className="services titled-section" id="services">
        <span className="section-bg-title" aria-hidden="true">Services</span>
        <p className="eyebrow" data-reveal>Services</p>
        <h2 data-reveal>Signature electrical services with a polished handover.</h2>
        <div className="service-experience" data-reveal>
          <div className="service-menu" role="tablist" aria-label="Northline service menu">
            {services.map((item, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeService === index}
                className={activeService === index ? 'is-active' : ''}
                key={item.name}
                onClick={() => setActiveService(index)}
                data-cursor="Select"
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item.name}</strong>
                <small>{item.duration}</small>
              </button>
            ))}
          </div>
          <article className="service-feature" key={service.name}>
            <p>{service.eyebrow}</p>
            <h3>{service.name}</h3>
            <strong>{service.price}</strong>
            <span>{service.duration}</span>
            <p>{service.description}</p>
            <ul>
              {service.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href="#contact" data-cursor="Call">Ask about this service &gt;</a>
          </article>
        </div>
      </section>

      <PowerDivider tone="night" />

      <section className="reviews titled-section" aria-label="Client reviews">
        <span className="section-bg-title" aria-hidden="true">Trust</span>
        <div className="review-photo" data-reveal />
        <div className="review-panel">
          <p className="eyebrow">What clients say</p>
          <figure className="active-review" key={review.author}>
            <span>0{activeReview + 1}</span>
            <blockquote>{review.quote}</blockquote>
            <figcaption>- {review.author}, VERIFIED CLIENT</figcaption>
            <small>{review.detail}</small>
          </figure>
          <div className="review-controls">
            <button type="button" aria-label="Previous review" onClick={() => showReview(-1)} data-cursor="Prev">
              &lt;-
            </button>
            <span>{String(activeReview + 1).padStart(2, '0')} / 04</span>
            <button type="button" aria-label="Next review" onClick={() => showReview(1)} data-cursor="Next">
              -&gt;
            </button>
          </div>
          <div className="review-progress" aria-hidden="true">
            <span key={activeReview} />
          </div>
          <p className="rating">4.9 ***** across residential and light commercial projects</p>
        </div>
      </section>

      <PowerDivider tone="areas" />

      <section className="locations titled-section" id="areas">
        <span className="section-bg-title" aria-hidden="true">Areas</span>
        <p className="eyebrow" data-reveal>Service areas</p>
        <h2 data-reveal>Local coverage with a clear response area.</h2>
        <p className="locations-intro" data-reveal>
          Northline services residential and light commercial clients across nearby suburbs.
        </p>
        <div className="location-grid">
          <article data-reveal>
            <p>Primary area</p>
            <h3>Northline</h3>
            <span>Panel upgrades, lighting, urgent faults, EV chargers, and inspection work.</span>
            <dl>
              <div><dt>Mon - Fri</dt><dd>7:30 - 17:30</dd></div>
              <div><dt>Urgent support</dt><dd>24 hour line</dd></div>
            </dl>
            <a href="#contact">Request service &gt;</a>
          </article>
          <article data-reveal>
            <p>Nearby suburbs</p>
            <h3>Westhaven / Brookmere</h3>
            <span>Scheduled work, renovation support, and safety checks for homes and small businesses.</span>
            <dl>
              <div><dt>Call-outs</dt><dd>By appointment</dd></div>
              <div><dt>Quotes</dt><dd>Clear and upfront</dd></div>
            </dl>
            <a href="#contact">Check availability &gt;</a>
          </article>
        </div>
      </section>

      <PowerDivider tone="contact" />

      <section className="booking" id="contact">
        <div className="booking-image" data-reveal />
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Ready to get the work handled properly?</h2>
          <p>Send a few details, request a quote, or call the team directly.</p>
          <div className="booking-actions">
            <a href={`tel:${business.phone.replace(/\D/g, '')}`}>{business.phone} &gt;</a>
            <a className="booking-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">
              WhatsApp quote &gt;
            </a>
          </div>
          <span>Quote requests / urgent support / service questions</span>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-brand">
          <a href="#top">Northline</a>
          <p>Clean power. Careful hands.</p>
        </div>
        <div>
          <p>Navigate</p>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#areas">Areas</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <p>Contact</p>
          <a href={`tel:${business.phone.replace(/\D/g, '')}`}>{business.phone}</a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <span>Northline / Westhaven / Brookmere</span>
        </div>
        <div>
          <p>Services</p>
          <a href="#services">Panel upgrades</a>
          <a href="#services">Lighting installs</a>
          <a href="#services">EV chargers</a>
          <a href="#services">Safety inspections</a>
        </div>
        <small className="footer-bottom">
          <span>(c) 2026 {business.name}</span>
          <a href="https://nxwbstudios.co.za" target="_blank" rel="noreferrer">
            Developed by <span>NexWeb AI Studios</span>
          </a>
        </small>
      </footer>

      <div className="floating-actions" aria-label="Quick actions">
        <a className="back-to-top" href="#top" aria-label="Back to top" data-cursor="Top">
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            <path d="M12 5 5.5 11.5l1.4 1.4 4.1-4.08V20h2V8.82l4.1 4.08 1.4-1.4L12 5Z" />
          </svg>
        </a>
        <div className="whatsapp-float">
          {isWhatsAppOpen && (
            <aside className="whatsapp-preview" aria-label="WhatsApp chat preview">
              <button
                type="button"
                aria-label="Close WhatsApp preview"
                onClick={() => setIsWhatsAppOpen(false)}
                data-cursor="Close"
              >
                x
              </button>
              <p>Northline Electrical</p>
              <strong>Need a quote or urgent help?</strong>
              <span>Send a few details and we will guide the next step.</span>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" data-cursor="Chat">
                Open WhatsApp
              </a>
            </aside>
          )}
          <a className="whatsapp-button" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" data-cursor="Chat">
            <svg viewBox="0 0 32 32" role="presentation" aria-hidden="true">
              <path d="M16.02 4.1A11.76 11.76 0 0 0 5.85 21.78L4.1 28l6.37-1.67A11.75 11.75 0 1 0 16.02 4.1Zm0 21.42c-1.8 0-3.55-.5-5.08-1.45l-.36-.22-3.78.99 1.01-3.68-.24-.38a9.67 9.67 0 1 1 8.45 4.74Zm5.3-7.23c-.29-.15-1.72-.85-1.99-.94-.27-.1-.47-.15-.67.15-.2.29-.76.94-.94 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.43-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.04 2.83 1.19 3.03c.15.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34Z" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
