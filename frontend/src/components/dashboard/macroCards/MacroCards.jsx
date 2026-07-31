import { useRef, useState } from "react";
import "./MacroCards.css";
import { BadgeCheck } from "lucide-react";

export const MacroCards = ({ summary, userGoals }) => {
  const macros = [
    {
      key: "carbs",
      label: "Carbs",
      emoji: "🍞",
      value: summary?.carbs?.total || 0,
      target: userGoals?.carbs || 250,
      theme: "carbs",
    },
    {
      key: "protein",
      label: "Protein",
      emoji: "🍗",
      value: summary?.proteins || 0,
      target: userGoals?.proteins || 120,
      theme: "protein",
    },
    {
      key: "fat",
      label: "Fat",
      emoji: "🥑",
      value: summary?.fats?.total || 0,
      target: userGoals?.fats || 65,
      theme: "fat",
    },
    {
      key: "fibers",
      label: "Fibers",
      emoji: "🥦",
      value: summary?.fibers || 0,
      target: 30,
      theme: "fibers",
    },
    {
      key: "salt",
      label: "Salt",
      emoji: "🧂",
      value: summary?.salt || 0,
      target: 5,
      theme: "salt",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      // Arrotondiamo per capire su quale "schermata" ci troviamo
      const newIndex = Math.round(scrollLeft / clientWidth);
      setActiveIndex(newIndex);
    }
  };

  const handleDotClick = (index) => {
    if (carouselRef.current) {
      const scrollPosition = index * carouselRef.current.clientWidth;

      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftPos.current = carouselRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();

    const x = e.pageX - carouselRef.current.offsetLeft;

    const walk = (x - startX.current) * 2;

    carouselRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const totalDots = carouselRef.current
    ? Math.ceil(
        carouselRef.current.scrollWidth / carouselRef.current.clientWidth,
      )
    : 3;

  return (
    <>
      <section
        className="d-flex overflow-x-auto no-scrollbar mt-4 gap-3 macro-carousel drag-container"
        ref={carouselRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
      >
        {macros.map((m, index) => {
          const target = m.target > 0 ? m.target : 1;
          const isGoalReached = m.value >= target;

          const pct = Math.min(100, Math.round((m.value / target) * 100));
          return (
            <article
              key={m.key}
              className="app-card h-100 p-3 p-md-4 macro-card overflow-hidden"
            >
              <span
                className={`macro-icon-box d-flex justify-content-center align-items-center rounded-circle bg-${m.theme}-soft`}
              >
                {m.emoji}
              </span>

              <div className="d-flex align-items-center gap-1 mt-3 mb-1">
                <p className="mb-0 fw-medium text-muted small">{m.label}</p>
                {isGoalReached && (
                  <BadgeCheck
                    size={16}
                    className="text-success"
                    style={{ animation: "popIn 0.3s ease-out" }}
                  />
                )}
              </div>

              <p
                className="font-heading fs-6 fw-bold lh-sm mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {m.value}
                <span
                  className="small fw-medium text-muted ms-1"
                  style={{ fontSize: "0.75rem" }}
                >
                  /{m.target}g
                </span>
              </p>

              <div className={`progress macro-progress bg-${m.theme}-soft`}>
                <div
                  className={`progress-bar bg-${m.theme}`}
                  role="progressbar"
                  style={{ width: `${pct}%` }}
                  aria-valuenow={pct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </article>
          );
        })}
      </section>
      <div className="d-flex justify-content-center gap-2 mt-3 custom-carousel-dots">
        {Array.from({ length: totalDots }).map((_, idx) => (
          <span
            key={idx}
            className={`carousel-dot ${activeIndex === idx ? "active" : ""}`}
            onClick={() => handleDotClick(idx)}
          ></span>
        ))}
      </div>
    </>
  );
};
