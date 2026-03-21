import { useEffect } from 'react';

const SITE_NAME = 'ToolsNoCode';
const BASE_URL = 'https://toolsnocode.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const TWITTER_HANDLE = '@Nocodeboy';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  jsonLd?: object | object[];
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: object | object[]) {
  let el = document.querySelector(`script[data-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-jsonld', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const el = document.querySelector(`script[data-jsonld="${id}"]`);
  if (el) el.remove();
}

export function useSEO({ title, description, image, url, type = 'website', noindex = false, jsonLd }: SEOProps) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Discover the Best AI & No-Code Tools`;
    const fullDescription = description || 'The ultimate discovery hub for AI and No-Code tools. Compare stacks, find experts, learn tutorials, and showcase projects built without code.';
    const fullImage = image || DEFAULT_OG_IMAGE;
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    document.title = fullTitle;

    setMeta('description', fullDescription);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('og:title', fullTitle, true);
    setMeta('og:description', fullDescription, true);
    setMeta('og:image', fullImage, true);
    setMeta('og:url', fullUrl, true);
    setMeta('og:type', type, true);

    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', fullDescription);
    setMeta('twitter:image', fullImage);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:site', TWITTER_HANDLE);

    setLink('canonical', fullUrl);

    const ldId = 'page-jsonld';
    if (jsonLd) {
      setJsonLd(ldId, jsonLd);
    } else {
      removeJsonLd(ldId);
    }

    return () => {
      removeJsonLd(ldId);
    };
  }, [title, description, image, url, type, noindex, jsonLd]);
}
