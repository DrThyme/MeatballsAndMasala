import en from './en.json';
import sv from './sv.json';
import hi from './hi.json';

const translations: Record<string, Record<string, string>> = { en, sv, hi };

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in translations) return lang;
  return 'en';
}

export function t(lang: string, key: string): string {
  return translations[lang]?.[key] ?? translations['en'][key] ?? key;
}

export function getLocalePath(lang: string, hash?: string): string {
  const base = lang === 'en' ? '/' : `/${lang}/`;
  return hash ? `${base}#${hash}` : base;
}
