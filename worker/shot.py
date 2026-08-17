import traceback
try:
    from playwright.sync_api import sync_playwright
    import pathlib
    urls = {
        "blender": "http://localhost:8099/Softwarebase/Blender.html",
        "index": "http://localhost:8099/index.html",
        "3dsmax": "http://localhost:8099/Softwarebase/3DDesign-3dsMax.html",
    }
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 800, "height": 1000})
        for name, url in urls.items():
            pg.goto(url)
            pg.wait_for_timeout(1000)
            pg.screenshot(path=f"worker/shot_{name}.png", full_page=True)
            with open("worker/shot_log.txt", "a", encoding="utf-8") as f:
                f.write("OK " + name + "\n")
        b.close()
    with open("worker/shot_log.txt", "a", encoding="utf-8") as f:
        f.write("DONE\n")
except Exception as e:
    with open("worker/shot_log.txt", "a", encoding="utf-8") as f:
        f.write("ERR " + repr(e) + "\n" + traceback.format_exc() + "\n")
