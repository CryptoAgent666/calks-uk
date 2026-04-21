from playwright.sync_api import sync_playwright
import os

PAGES = {
    "homepage": "https://calks.uk/",
    "income_tax": "https://calks.uk/calculator/income-tax-calculator/",
    "category_tax": "https://calks.uk/category/tax/",
    "about": "https://calks.uk/about/",
}

VIEWPORTS = {
    "desktop": {"width": 1920, "height": 1080},
    "mobile": {"width": 375, "height": 812},
}

OUTPUT_DIR = "/Users/konstantin/Documents/New project/CALK-UK/screenshots"

def capture_all():
    with sync_playwright() as p:
        # --- Light mode captures ---
        browser = p.chromium.launch()
        for vp_name, vp in VIEWPORTS.items():
            context = browser.new_context(
                viewport=vp,
                color_scheme="light",
            )
            page = context.new_page()
            for page_name, url in PAGES.items():
                print(f"Capturing {page_name} [{vp_name}] light...")
                try:
                    page.goto(url, wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(1500)
                    # Above-the-fold (viewport only)
                    out = f"{OUTPUT_DIR}/{page_name}_{vp_name}_light_atf.png"
                    page.screenshot(path=out, full_page=False)
                    # Full page
                    out_full = f"{OUTPUT_DIR}/{page_name}_{vp_name}_light_full.png"
                    page.screenshot(path=out_full, full_page=True)
                    print(f"  Saved: {out}")
                except Exception as e:
                    print(f"  ERROR: {e}")
            context.close()

        # --- Dark mode captures ---
        for vp_name, vp in VIEWPORTS.items():
            context = browser.new_context(
                viewport=vp,
                color_scheme="dark",
            )
            page = context.new_page()
            for page_name, url in PAGES.items():
                print(f"Capturing {page_name} [{vp_name}] dark...")
                try:
                    page.goto(url, wait_until="networkidle", timeout=30000)
                    page.wait_for_timeout(1500)
                    out = f"{OUTPUT_DIR}/{page_name}_{vp_name}_dark_atf.png"
                    page.screenshot(path=out, full_page=False)
                    print(f"  Saved: {out}")
                except Exception as e:
                    print(f"  ERROR: {e}")
            context.close()

        # --- Logo and author image probe ---
        print("\nProbing asset URLs...")
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()
        for asset in [
            "https://calks.uk/logo.png",
            "https://calks.uk/author.jpg",
            "https://calks.uk/favicon.ico",
        ]:
            try:
                response = page.goto(asset, timeout=10000)
                status = response.status if response else "no response"
                ct = response.headers.get("content-type", "?") if response else "?"
                print(f"  {asset} -> HTTP {status} | {ct}")
            except Exception as e:
                print(f"  {asset} -> ERROR: {e}")
        context.close()
        browser.close()

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    capture_all()
    print("\nAll done.")
