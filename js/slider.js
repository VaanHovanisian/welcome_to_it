class Slider {
  constructor(t, i) {
    let e = {
      gap: 0,
      pagination: !1,
      perView: 1,
      loop: !1,
      autoPlay: !1,
      autoPlayInterval: 3e3,
      breakpoints: {},
    };
    (this.options = Object.assign(e, i)),
      (this.options2 = Object.assign(e, i)),
      (this.elem = document.querySelector(`[data-slider="${t}"]`)),
      (this.list = this.elem.querySelector(".slider__list")),
      (this.slides = this.list.querySelectorAll(".slider__slide")),
      (this.sliesPerView = this.list.querySelectorAll(
        `.slider__slide:nth-child(${this.options.perView}n+1)`
      )),
      (this.buttonPrev = document.querySelector(".slider__button-prev")),
      (this.buttonNext = document.querySelector(".slider__button-next")),
      (this.pagination = this.elem.querySelector(".slider__pagination")),
      (this.paginationButtons = this.pagination.querySelectorAll(
        ".slider__pagination-button"
      )),
      this.init(),
      this.setBreakpoints();
  }
  init() {
    if (
      (this.setPagination(),
      this.setAutoPlay(),
      this.setBreakpoints(),
      this.elem.style.setProperty("--per-view", this.options.perView),
      this.options.perView > 1)
    ) {
      const t = this.options.gap / this.options.perView;
      this.list.style.setProperty("--gap", this.options.gap - t + "px"),
        (this.list.style.gap = this.options.gap + "px"),
        console.log(t);
    }
    this.sliesPerView.forEach((t, i) => {
      t.setAttribute("data-index", i),
        this.setObserverSlides().observe(t),
        this.setSlide(this.buttonPrev, "prev", t),
        this.setSlide(this.buttonNext, "next", t);
    });
  }
  setObserverSlides() {
    return new IntersectionObserver(
      (t) => {
        t.forEach((i) => {
          i.isIntersecting
            ? i.target
                .closest("[data-slider]")
                .querySelectorAll(".slider__pagination-button")
                .forEach((e) => {
                  e.dataset.index == i.target.dataset.index &&
                    e.classList.add("slider__pagination-button--active");
                })
            : i.target
                .closest("[data-slider]")
                .querySelectorAll(".slider__pagination-button")
                .forEach((e) => {
                  e.dataset.index == i.target.dataset.index &&
                    e.classList.remove("slider__pagination-button--active");
                });
        });
      },
      {
        //rootMargin: "0px -5px 0px -5px",
        threshold: 0.5,
      }
    );
  }
  setSlide(t, i, e) {
    t.onclick = () => {
      this.list.scrollBy({
        left: i === "next" ? e.offsetWidth : -e.offsetWidth,
        top: 0,
        behavior: "smooth",
      }),
        i === "next" && this.setLoop();
    };
  }
  setPagination() {
    if (!this.options.pagination) return;
    let t = this.options.perView,
      i = this.slides.length / t;
    for (let e = 0; e < i; e++) {
      const s = document.createElement("button");
      s.setAttribute("data-index", e),
        (s.innerHTML = e + 1),
        s.classList.add("slider__pagination-button"),
        this.pagination.append(s),
        (s.onclick = () => {
          (this.list.style.scrollBehavior = "smooth"),
            (this.list.scrollLeft = e * this.list.offsetWidth);
        });
    }
  }
  setAutoPlay() {
    if (!this.options.autoPlay) return;
    let t;
    const i = () => {
        t = setInterval(() => {
          this.list.scrollBy({
            left: this.list.offsetWidth,
            top: 0,
            behavior: "smooth",
          }),
            this.setLoop();
        }, this.options.autoPlayInterval);
      },
      e = () => {
        clearInterval(t);
      };
    i(),
      this.elem.addEventListener("mouseenter", e),
      this.elem.addEventListener("mouseleave", i);
  }
  setLoop() {
    if (!this.options.loop) return;
    const {
      style: t,
      scrollWidth: i,
      scrollLeft: e,
      offsetWidth: s,
    } = this.list;
    t.scrollBehavior === "smooth" && (t.scrollBehavior = "auto"),
      e + s >= i && (this.list.scrollLeft = 0);
  }
  setBreakpoints() {
    if (Object.keys(this.options.breakpoints).length === 0) return;
    const t = Object.assign(this.options.breakpoints, {
      0: { ...this.options },
    });
    new ResizeObserver((i) => {
      Object.entries(t).forEach(([e, s]) => {
        if (i[0].contentRect.width >= +e) {
          if (
            (this.slides.forEach((o) => {
              o.removeAttribute("data-index");
            }),
            this.list
              .querySelectorAll(`.slider__slide:nth-child(${s.perView}n+1)`)
              .forEach((o, l) => {
                o.setAttribute("data-index", l),
                  this.setObserverSlides().observe(o);
              }),
            (this.options = Object.assign(this.options, s)),
            this.list.style.setProperty("--gap", "0px"),
            (this.list.style.gap = "0px"),
            "gap" in s)
          ) {
            const o = s.gap / s.perView;
            this.list.style.setProperty("--gap", s.gap - o + "px"),
              (this.list.style.gap = s.gap + "px"),
              console.log(o);
          }
          this.elem.style.setProperty("--per-view", s.perView),
            (this.pagination.innerHTML = ""),
            this.setPagination();
        }
      });
    }).observe(document.body);
  }
}
