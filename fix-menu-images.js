const fs = require('fs');

try {
    let content = fs.readFileSync('e:\\Projects\\azure\\menu.html', 'utf8');

    const imageMap = {
        'p1': 'images/menu/p1.png',
        'p5': 'images/gallery-2.jpg',
        'p6': 'images/gallery-3.jpg',
        'p7': 'images/gallery-4.jpg',
        'p2': 'images/service-grilled-fish.png',
        'p8': 'images/post-1.jpg',
        'p9': 'images/post-2.jpg',
        'p10': 'images/post-3.jpg',
        'p3': 'images/gallery-5.jpg',
        'p12': 'images/gallery-6.jpg',
        'p11': 'images/gallery-7.jpg',
        'p13': 'images/gallery-8.jpg',
        'p4': 'images/post-4.jpg',
        'p14': 'images/post-5.jpg'
    };

    // Replace the generic image source with mapped image source
    for (const [id, imgSrc] of Object.entries(imageMap)) {
        const regex = new RegExp(`(<div class="menu-item-card glass-panel"[^>]*data-id="${id}"[^>]*>[\\s\\S]*?<img src=")images/menu/${id}.jpg(" alt="Azure Bay Dish")`, 'g');
        content = content.replace(regex, `$1${imgSrc}$2`);
    }

    fs.writeFileSync('e:\\Projects\\azure\\menu.html', content);
    console.log("Successfully updated menu.html images mapping");
} catch(err) {
    console.error(err);
}
