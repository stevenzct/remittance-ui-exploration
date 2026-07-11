
const links = [...document.querySelectorAll('.nav a')];
const sections = [...document.querySelectorAll('.slide')];
const progress = document.querySelector('.progress');
const body = document.body;

const setActive = (id) => {
  links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
};

const observer = new IntersectionObserver(entries => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActive(visible.target.id);
}, { threshold: [0.35, 0.6, 0.8] });

sections.forEach(section => observer.observe(section));

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max ? (window.scrollY / max) * 100 : 0;
  progress.style.width = `${value}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const activeIndex = () => {
  const middle = window.scrollY + window.innerHeight / 2;
  let current = 0;
  sections.forEach((section, index) => {
    if (section.offsetTop <= middle) current = index;
  });
  return current;
};

document.querySelector('[data-next]').addEventListener('click', () => {
  const next = Math.min(activeIndex() + 1, sections.length - 1);
  sections[next].scrollIntoView({ behavior: 'smooth' });
});
document.querySelector('[data-prev]').addEventListener('click', () => {
  const prev = Math.max(activeIndex() - 1, 0);
  sections[prev].scrollIntoView({ behavior: 'smooth' });
});

document.addEventListener('keydown', event => {
  if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(event.key)) {
    event.preventDefault();
    document.querySelector('[data-next]').click();
  }
  if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
    document.querySelector('[data-prev]').click();
  }
});

document.querySelector('.menu-button').addEventListener('click', () => body.classList.toggle('menu-open'));
links.forEach(link => link.addEventListener('click', () => body.classList.remove('menu-open')));
