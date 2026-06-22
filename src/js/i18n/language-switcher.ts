import {
  supportedLanguages,
  languageNames,
  getLanguageFromUrl,
  changeLanguage,
  t,
} from './i18n';

export const createLanguageSwitcher = (): HTMLElement => {
  const currentLang = getLanguageFromUrl();

  const container = document.createElement('div');
  container.className = 'relative';
  container.id = 'language-switcher';

  const button = document.createElement('button');
  button.className = `
    inline-flex items-center gap-1.5 text-sm font-medium
    bg-white text-gray-900 border border-gray-200
    px-3 py-1.5 rounded-full transition-colors duration-200
    shadow-sm hover:shadow-md hover:bg-gray-50
  `.trim();
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');

  const textSpan = document.createElement('span');
  textSpan.className = 'font-medium';
  textSpan.textContent = languageNames[currentLang];

  const chevron = document.createElement('svg');
  chevron.className = 'w-4 h-4';
  chevron.setAttribute('fill', 'none');
  chevron.setAttribute('stroke', 'currentColor');
  chevron.setAttribute('viewBox', '0 0 24 24');
  chevron.innerHTML =
    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>';

  button.appendChild(textSpan);
  button.appendChild(chevron);

  const dropdown = document.createElement('div');
  dropdown.className = `
    hidden absolute right-0 mt-2 z-50
    w-64 max-w-[calc(100vw-2rem)]
    rounded-lg bg-white border border-gray-200 shadow-xl
    flex flex-col overflow-hidden
  `.trim();
  dropdown.setAttribute('role', 'menu');

  const searchWrapper = document.createElement('div');
  searchWrapper.className =
    'p-2 border-b border-gray-200 bg-white flex-shrink-0';

  const searchPlaceholder =
    t('nav.searchLanguage') !== 'nav.searchLanguage'
      ? t('nav.searchLanguage')
      : 'Search language…';

  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = searchPlaceholder;
  searchInput.className = `
    w-full px-3 py-1.5 text-sm
    bg-gray-100 text-gray-900
    border border-gray-200 rounded-md
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    placeholder-gray-400
  `.trim();
  searchInput.setAttribute('aria-label', searchPlaceholder);
  searchWrapper.appendChild(searchInput);
  dropdown.appendChild(searchWrapper);

  const list = document.createElement('div');
  list.className = 'max-h-64 overflow-y-auto py-1 bg-white';
  list.setAttribute('role', 'none');

  const emptyState = document.createElement('p');
  emptyState.className = 'hidden px-4 py-3 text-sm text-gray-400 text-center';
  const emptyText =
    t('nav.noLanguagesFound') !== 'nav.noLanguagesFound'
      ? t('nav.noLanguagesFound')
      : 'No languages found';
  emptyState.textContent = emptyText;

  const options: HTMLButtonElement[] = [];
  supportedLanguages.forEach((lang) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `
      w-full px-4 py-2 text-left text-sm text-gray-900
      hover:bg-gray-50 flex items-center gap-2 transition-colors
      ${lang === currentLang ? 'bg-gray-100' : ''}
    `.trim();
    option.setAttribute('role', 'menuitem');
    option.dataset.lang = lang;
    option.dataset.searchKey = `${languageNames[lang]} ${lang}`.toLowerCase();

    const name = document.createElement('span');
    name.textContent = languageNames[lang];
    option.appendChild(name);

    option.addEventListener('click', () => {
      if (lang !== currentLang) {
        changeLanguage(lang);
      }
    });

    options.push(option);
    list.appendChild(option);
  });

  list.appendChild(emptyState);
  dropdown.appendChild(list);

  const filterOptions = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;
    options.forEach((option) => {
      const key = option.dataset.searchKey || '';
      const match = !query || key.includes(query);
      option.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    emptyState.classList.toggle('hidden', visible > 0);
  };

  searchInput.addEventListener('input', filterOptions);
  dropdown.addEventListener('click', (e) => {
    if (e.target instanceof HTMLButtonElement && e.target.dataset.lang) return;
    e.stopPropagation();
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      dropdown.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });

  container.appendChild(button);
  container.appendChild(dropdown);

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const nextOpen = !isExpanded;
    button.setAttribute('aria-expanded', nextOpen.toString());
    dropdown.classList.toggle('hidden', !nextOpen);
    if (nextOpen) {
      searchInput.value = '';
      filterOptions();
      list.scrollTop = 0;
      requestAnimationFrame(() => searchInput.focus());
    }
  });

  document.addEventListener('click', () => {
    button.setAttribute('aria-expanded', 'false');
    dropdown.classList.add('hidden');
  });

  return container;
};

export const injectLanguageSwitcher = (): void => {
  // Priority 1: Simple mode container
  const simpleModeContainer = document.getElementById(
    'simple-mode-language-switcher'
  );
  if (simpleModeContainer) {
    const switcher = createLanguageSwitcher();
    simpleModeContainer.appendChild(switcher);
    return;
  }

  // Priority 2: Desktop navbar container
  const navDesktop = document.getElementById('nav-language-switcher');
  if (navDesktop) {
    const switcher = createLanguageSwitcher();
    navDesktop.appendChild(switcher);
  }

  // Priority 3: Mobile navbar container (compact globe icon button)
  const navMobile = document.getElementById('nav-language-switcher-mobile');
  if (navMobile) {
    const mobileSwitcher = createLanguageSwitcher();
    mobileSwitcher.className = 'relative';

    const btn = mobileSwitcher.querySelector('button');
    if (btn) {
      // Show only the globe icon on mobile to save space
      btn.className = `
        inline-flex items-center gap-1 text-sm font-medium
        bg-transparent text-gray-300 border border-gray-600
        px-2 py-1.5 rounded-full transition-colors duration-200
        hover:bg-gray-700 hover:text-white
      `.trim();
    }

    const dropdown = mobileSwitcher.querySelector(
      'div[role="menu"]'
    ) as HTMLElement | null;
    if (dropdown) {
      dropdown.classList.remove('right-0');
      dropdown.classList.add('left-0');
    }

    navMobile.appendChild(mobileSwitcher);
  }

  // Priority 4: Footer fallback (only if navbar containers not found)
  if (!navDesktop && !navMobile) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const headings = footer.querySelectorAll('h3');
    let followUsColumn: HTMLElement | null = null;

    headings.forEach((h3) => {
      if (
        h3.textContent?.trim() === 'Follow Us' ||
        h3.textContent?.trim() === 'Folgen Sie uns' ||
        h3.textContent?.trim() === 'Theo dõi chúng tôi'
      ) {
        followUsColumn = h3.parentElement;
      }
    });

    if (followUsColumn) {
      const socialIconsContainer = followUsColumn.querySelector('.space-x-4');

      if (socialIconsContainer) {
        const wrapper = document.createElement('div');
        wrapper.className = 'inline-flex flex-col gap-4';

        socialIconsContainer.parentNode?.insertBefore(
          wrapper,
          socialIconsContainer
        );

        wrapper.appendChild(socialIconsContainer);
        const switcher = createLanguageSwitcher();
        switcher.className = 'relative w-full';

        const button = switcher.querySelector('button');
        if (button) {
          button.className = `
            flex items-center justify-between w-full text-sm font-medium
            bg-gray-800 text-gray-400 border border-gray-700
            px-3 py-2 rounded-lg transition-colors duration-200
            hover:text-white hover:border-gray-600
          `.trim();
        }

        const dropdown = switcher.querySelector(
          'div[role="menu"]'
        ) as HTMLElement | null;
        if (dropdown) {
          dropdown.classList.remove('mt-2', 'w-64');
          dropdown.classList.add('bottom-full', 'mb-2', 'w-full');
        }

        wrapper.appendChild(switcher);
      } else {
        const switcherContainer = document.createElement('div');
        switcherContainer.className = 'mt-4 w-full';
        const switcher = createLanguageSwitcher();
        switcherContainer.appendChild(switcher);
        followUsColumn.appendChild(switcherContainer);
      }
    }
  }
};
