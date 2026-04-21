from playwright.sync_api import sync_playwright
import json

PAGES = {
    "homepage": "https://calks.uk/",
    "income_tax": "https://calks.uk/calculator/income-tax-calculator/",
    "category_tax": "https://calks.uk/category/tax/",
    "about": "https://calks.uk/about/",
}

def audit_page(page, url, name):
    page.goto(url, wait_until="networkidle", timeout=30000)
    page.wait_for_timeout(1000)

    results = page.evaluate("""() => {
        const h1s = Array.from(document.querySelectorAll('h1')).map(el => ({
            text: el.innerText.trim(),
            rect: el.getBoundingClientRect(),
            visible: el.getBoundingClientRect().top < window.innerHeight
        }));

        const imgs = Array.from(document.querySelectorAll('img')).map(el => ({
            src: el.src,
            alt: el.alt,
            naturalWidth: el.naturalWidth,
            naturalHeight: el.naturalHeight,
            complete: el.complete,
            rect: { top: el.getBoundingClientRect().top, width: el.getBoundingClientRect().width }
        })).filter(i => i.rect.top < 600);

        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.content || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.href || '';
        const ogTitle = document.querySelector('meta[property="og:title"]')?.content || '';
        const ogImg = document.querySelector('meta[property="og:image"]')?.content || '';

        // Check for layout shift indicators (elements with transforms/position that might cause CLS)
        const navHeight = document.querySelector('nav, header')?.getBoundingClientRect()?.height || 0;

        // Check body scroll width vs window width (horizontal scroll indicator)
        const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;

        // Touch targets — find buttons/links smaller than 48px in viewport
        const smallTargets = Array.from(document.querySelectorAll('a, button'))
            .filter(el => {
                const r = el.getBoundingClientRect();
                return r.top < window.innerHeight && r.height > 0 && (r.height < 44 || r.width < 44);
            })
            .slice(0, 5)
            .map(el => ({
                tag: el.tagName,
                text: el.innerText?.trim().slice(0, 40),
                height: Math.round(el.getBoundingClientRect().height),
                width: Math.round(el.getBoundingClientRect().width)
            }));

        return { h1s, imgs, title, metaDesc, canonical, ogTitle, ogImg, navHeight, hasHorizontalScroll, smallTargets };
    }""")

    print(f"\n=== {name.upper()} ({url}) ===")
    print(f"Title: {results['title']}")
    print(f"Meta desc ({len(results['metaDesc'])} chars): {results['metaDesc'][:120]}")
    print(f"Canonical: {results['canonical']}")
    print(f"OG Title: {results['ogTitle']}")
    print(f"OG Image: {results['ogImg']}")
    print(f"Nav height: {results['navHeight']}px")
    print(f"Horizontal scroll: {results['hasHorizontalScroll']}")
    print(f"H1 elements:")
    for h in results['h1s']:
        atf = "ATF" if h['visible'] else "BELOW FOLD"
        print(f"  [{atf}] top={h['rect']['top']:.0f}px — '{h['text'][:80]}'")
    print(f"Above-fold images (top<600px):")
    for img in results['imgs']:
        status = "OK" if img['naturalWidth'] > 0 else "BROKEN"
        print(f"  [{status}] {img['src'][:80]} | {img['naturalWidth']}x{img['naturalHeight']} | alt='{img['alt'][:40]}'")
    if results['smallTargets']:
        print(f"Small touch targets (<44px):")
        for t in results['smallTargets']:
            print(f"  {t['tag']} '{t['text']}' — {t['width']}x{t['height']}px")


def run():
    with sync_playwright() as p:
        # Desktop audit
        browser = p.chromium.launch()
        ctx_desktop = browser.new_context(viewport={"width": 1920, "height": 1080})
        page_desktop = ctx_desktop.new_page()
        print("\n### DESKTOP AUDIT (1920x1080) ###")
        for name, url in PAGES.items():
            audit_page(page_desktop, url, name)
        ctx_desktop.close()

        # Mobile audit
        ctx_mobile = browser.new_context(viewport={"width": 375, "height": 812})
        page_mobile = ctx_mobile.new_page()
        print("\n\n### MOBILE AUDIT (375x812) ###")
        for name, url in PAGES.items():
            audit_page(page_mobile, url, name)
        ctx_mobile.close()
        browser.close()

if __name__ == "__main__":
    run()
