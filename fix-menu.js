const fs = require('fs');

try {
    let content = fs.readFileSync('e:\\Projects\\azure\\menu.html', 'utf8');

    // Replace inner structure with image and item-content wrapper
    content = content.replace(
        /(<div class="menu-item-card glass-panel" data-category="[^"]+" data-id="([^"]+)" data-name="[^"]+" data-price="[^"]+">)\s*(<div class="item-meta">[\s\S]*?<button class="add-to-order-btn" title="Add to Order">\+<\/button>)\s*<\/div>/g,
        `$1
                <img src="images/menu/$2.jpg" alt="Azure Bay Dish" onerror="this.src='images/gallery-1.jpg'" class="menu-item-image">
                <div class="item-content">
                    $3
                </div>
            </div>`
    );

    fs.writeFileSync('e:\\Projects\\azure\\menu.html', content);
    console.log("Successfully updated menu.html");
} catch(err) {
    console.error(err);
}
