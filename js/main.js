const aboutNumbers = document.querySelectorAll(".about__number");
const heroTextHidden = document.querySelector(".hero__text-hidden");
const heroTextShow = document.querySelector(".hero__text-show");
const fullBurger = new Fullburger(".fullburger", {
  breakpoint: 992,
});
if (document.querySelector(".slider")) {
  new Slider("slider1");
}

function increaseNumber(numberElement, target, speed) {
  numberElement.textContent = +numberElement.textContent + 1;
  if (+numberElement.textContent === target) {
    return;
  }
  setTimeout(() => {
    increaseNumber(numberElement, target, speed);
  }, speed);
}
const textTypeWriter = (i = 0) => {
  heroTextShow.textContent += heroTextHidden.textContent[i];
  if (i === heroTextHidden.textContent.length - 1) {
    return;
  }
  setTimeout(() => {
    textTypeWriter(i + 1);
  }, 50);
};

textTypeWriter();
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      increaseNumber(entry.target, +entry.target.dataset.number, 50);
      observer.unobserve(entry.target);
    }
  });
});
aboutNumbers.forEach((el) => observer.observe(el));

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animation-element_active");
      animationObserver.unobserve(entry.target);
    }
  });
});
const animation = document.querySelectorAll(".animation-element");
animation.forEach((el) => animationObserver.observe(el));
