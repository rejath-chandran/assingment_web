document.documentElement.classList.add('js');


const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

if (menuButton && mainNav) {

  menuButton.hidden = false;
  function setMenuOpen(isOpen) {
    menuButton.setAttribute('aria-expanded', String(isOpen));
  }

  menuButton.addEventListener('click', function () {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
}



const classFilter = document.querySelector('#class-filter');

if (classFilter) {
  const filterButtons = classFilter.querySelectorAll('button[data-filter]');
  const filterStatus = document.querySelector('#filter-status');
  const classCards = document.querySelectorAll('.class-card');
  const daySections = document.querySelectorAll('.day');

  function applyFilter(filter) {
    let shownCount = 0;

    classCards.forEach(function (card) {
      const tags = card.dataset.tags.split(' ');
      const matches = filter === 'all' || tags.includes(filter);
      card.hidden = !matches;
      if (matches) {
        shownCount++;
      }
    });

    daySections.forEach(function (day) {
      const visibleCards = day.querySelectorAll('.class-card:not([hidden])');
      day.hidden = visibleCards.length === 0;
    });


    filterButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
    });

    filterStatus.textContent = 'Showing ' + shownCount + ' of ' + classCards.length + ' classes.';
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.filter);
    });
  });


  applyFilter('all');
  classFilter.hidden = false;
}



const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(function (item) {
  const heading = item.querySelector('h3');
  const answer = item.querySelector('.faq-answer');


  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'faq-toggle';
  button.textContent = heading.textContent;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', answer.id);

  heading.textContent = '';
  heading.appendChild(button);

  answer.hidden = true;

  button.addEventListener('click', function () {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
  });
});