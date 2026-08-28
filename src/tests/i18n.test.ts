import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getLanguageFromUrl } from '@/js/i18n/i18n';

describe('getLanguageFromUrl', () => {
  const originalLocation = window.location;
  const originalNavigator = window.navigator;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, pathname: '/' },
      writable: true,
      configurable: true,
    });

    localStorage.clear();

    // Reset navigator
    Object.defineProperty(window, 'navigator', {
      value: { ...originalNavigator },
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window.navigator, 'languages', {
      value: [],
      configurable: true,
    });

    // Reset import.meta.env
    vi.stubEnv('BASE_URL', '/');
    vi.stubEnv('VITE_DEFAULT_LANGUAGE', 'en');
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    vi.unstubAllEnvs();
  });

  it('should return language from URL path', () => {
    window.location.pathname = '/de/about';
    expect(getLanguageFromUrl()).toBe('de');
  });

  it('should return Russian from URL path /ru', () => {
    window.location.pathname = '/ru';
    expect(getLanguageFromUrl()).toBe('ru');
  });

  it('should prioritize URL path over localStorage and browser settings', () => {
    window.location.pathname = '/fr/';
    localStorage.setItem('i18nextLng', 'es');
    Object.defineProperty(window.navigator, 'languages', {
      value: ['zh-CN', 'zh', 'en'],
      configurable: true,
    });
    expect(getLanguageFromUrl()).toBe('fr');
  });

  it('should return default language (en) at root path even if localStorage has another language', () => {
    window.location.pathname = '/';
    localStorage.setItem('i18nextLng', 'ru');
    expect(getLanguageFromUrl()).toBe('en');
  });

  it('should return default language (en) at root path even if navigator.languages prefers Chinese or Russian', () => {
    window.location.pathname = '/';
    Object.defineProperty(window.navigator, 'languages', {
      value: ['zh-CN', 'zh', 'ru-RU', 'ru'],
      configurable: true,
    });
    expect(getLanguageFromUrl()).toBe('en');
  });

  it('should fallback to env variable VITE_DEFAULT_LANGUAGE if URL has no language prefix', () => {
    window.location.pathname = '/';
    vi.stubEnv('VITE_DEFAULT_LANGUAGE', 'vi');
    expect(getLanguageFromUrl()).toBe('vi');
  });

  it('should fallback to en if VITE_DEFAULT_LANGUAGE is empty', () => {
    window.location.pathname = '/';
    vi.stubEnv('VITE_DEFAULT_LANGUAGE', '');
    expect(getLanguageFromUrl()).toBe('en');
  });
});
