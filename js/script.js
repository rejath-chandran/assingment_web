// The CSS only collapses the mobile menu when this class is present, so the
// navigation stays usable if the script fails to load.
document.documentElement.classList.add('js');

function isExpanded(button) {
  return button.getAttribute('aria-expanded') === 'true';
}

function setExpanded(button, expanded) {
  button.setAttribute('aria-expanded', String(expanded));
}

// Returns YYYY-MM-DD, the format <input type="date"> uses. Built from local
// time because toISOString() uses UTC, which can be a different day here.
function toDateInputValue(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}

function setUpMenu() {
  const menuButton = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('#main-nav');

  if (!menuButton || !mainNav) {
    return;
  }

  menuButton.hidden = false;

  menuButton.addEventListener('click', function () {
    setExpanded(menuButton, !isExpanded(menuButton));
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isExpanded(menuButton)) {
      setExpanded(menuButton, false);
      menuButton.focus();
    }
  });
}

function setUpClassFilter() {
  const classFilter = document.querySelector('#class-filter');

  if (!classFilter) {
    return;
  }

  const filterButtons = classFilter.querySelectorAll('button[data-filter]');
  const filterStatus = document.querySelector('#filter-status');
  const classCards = document.querySelectorAll('.class-card');
  const daySections = document.querySelectorAll('.day');

  function showClassesTagged(tag) {
    let shownCount = 0;

    classCards.forEach(function (card) {
      const cardTags = card.dataset.tags.split(' ');
      const isMatch = tag === 'all' || cardTags.includes(tag);
      card.hidden = !isMatch;
      if (isMatch) {
        shownCount++;
      }
    });

    // Hide a whole day when none of its classes match, so no empty
    // day headings are left on the page.
    daySections.forEach(function (daySection) {
      daySection.hidden = daySection.querySelector('.class-card:not([hidden])') === null;
    });

    filterButtons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === tag));
    });

    filterStatus.textContent = 'Showing ' + shownCount + ' of ' + classCards.length + ' classes.';
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      showClassesTagged(button.dataset.filter);
    });
  });

  showClassesTagged('all');

  // The buttons do nothing without JavaScript, so the HTML starts them hidden.
  classFilter.hidden = false;
}

// Answers are visible in the HTML and only collapsed here, so they can still
// be read if the script doesn't run.
function setUpFaq() {
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const heading = item.querySelector('h3');
    const answer = item.querySelector('.faq-answer');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'faq-toggle';
    toggle.textContent = heading.textContent;
    setExpanded(toggle, false);
    toggle.setAttribute('aria-controls', answer.id);

    // The button goes inside the <h3> rather than replacing it, so screen
    // reader users can still jump between questions by heading.
    heading.textContent = '';
    heading.appendChild(toggle);
    answer.hidden = true;

    toggle.addEventListener('click', function () {
      const wasOpen = isExpanded(toggle);
      setExpanded(toggle, !wasOpen);
      answer.hidden = wasOpen;
    });
  });
}

function setUpTrialDateLimit() {
  const dateInput = document.querySelector('#date');

  if (dateInput) {
    dateInput.min = toDateInputValue(new Date());
  }
}

setUpMenu();
setUpClassFilter();
setUpFaq();
setUpTrialDateLimit();
