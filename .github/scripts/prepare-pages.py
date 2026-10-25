from __future__ import annotations

import os
import re
import shutil
from pathlib import Path


source = Path("src/main/resources/static")
destination = Path("pages-site")
repository = os.environ["GITHUB_REPOSITORY"].split("/", maxsplit=1)[1]
base_path = f"/{repository}"
pages = {
    "index",
    "restaurants",
    "restaurant-detail",
    "cart",
    "checkout",
    "login",
    "register",
    "customer-dashboard",
    "restaurant-dashboard",
    "delivery-dashboard",
    "order-history",
    "order-tracking",
    "reports",
    "admin-dashboard",
    "rider-analytics",
    "vip",
}
static_path = re.compile(
    r"""(?P<prefix>["'`=])/(?P<path>(?:css|js|images|img)/|(?:{}).html)""".format(
        "|".join(sorted(pages))
    )
)
notice = (
    '<aside style="padding:12px;text-align:center;background:#fff3cd;color:#664d03;'
    'font:14px Arial,sans-serif">'
    "Static GitHub Pages preview: sign-in, ordering, live tracking, and other "
    "server features need the BiteHub backend."
    "</aside>"
)

if destination.exists():
    shutil.rmtree(destination)
shutil.copytree(source, destination)

for file in (*destination.rglob("*.html"), *destination.rglob("*.js")):
    content = file.read_text(encoding="utf-8-sig")
    content = static_path.sub(
        lambda match: (
            f"{match.group('prefix')}{base_path}/{match.group('path')}"
        ),
        content,
    )
    if file.suffix == ".html":
        content = re.sub(r"(<body[^>]*>)", rf"\1{notice}", content, count=1, flags=re.IGNORECASE)
    file.write_text(content, encoding="utf-8")
