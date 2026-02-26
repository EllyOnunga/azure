(function () {
    // 1. Inject HTML for WhatsApp button, popup and audio
    const whatsappHTML = `
        <div id="whatsapp-container">
            <!-- Audio for notification -->
            <audio id="whatsapp-notification-sound" preload="auto">
                <source src="https://raw.githubusercontent.com/Anand-Chowdhary/whatsapp-clone/master/client/src/assets/audio/notification.mp3" type="audio/mpeg">
                <source src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" type="audio/mpeg">
            </audio>

            <!-- Notification Popup -->
            <div id="whatsapp-popup" class="whatsapp-popup">
                <div class="whatsapp-popup-header">
                    <img src="images/favicon.png" alt="Azure Bay">
                    <div class="whatsapp-popup-header-info">
                        <h4>Azure Bay</h4>
                        <p>Typically replies in minutes</p>
                    </div>
                    <span id="close-whatsapp-popup" class="whatsapp-popup-close"><i class="fa-solid fa-xmark"></i></span>
                </div>
                <div class="whatsapp-popup-body">
                    <div class="whatsapp-msg">
                        Hello! 👋 Welcome to Azure Bay. How can we help you today with your reservation or inquiry?
                        <span class="time">${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, "0")}</span>
                    </div>
                </div>
            </div>

            <!-- Main Button -->
            <a href="https://wa.me/254710297603" id="whatsapp-button" class="floating-whatsapp" target="_blank" aria-label="Chat on WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
                <span id="whatsapp-badge" class="whatsapp-badge">1</span>
            </a>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", whatsappHTML);

    // 2. Elements
    const popup = document.getElementById("whatsapp-popup");
    const badge = document.getElementById("whatsapp-badge");
    const closeBtn = document.getElementById("close-whatsapp-popup");
    const sound = document.getElementById("whatsapp-notification-sound");
    const button = document.getElementById("whatsapp-button");

    // 3. Logic
    let soundPlayed = false;

    const playNotificationSound = () => {
        if (soundPlayed) return;

        sound.currentTime = 0;
        const playPromise = sound.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    soundPlayed = true;
                    console.log("Notification sound played successfully");
                })
                .catch((error) => {
                    console.log("Audio play deferred until user interaction.");
                });
        }
    };

    const showNotification = () => {
        // Only show if user hasn't interacted yet in this session
        if (!sessionStorage.getItem("whatsapp_notified")) {
            setTimeout(() => {
                popup.classList.add("active");
                badge.classList.add("active");
                playNotificationSound();
                sessionStorage.setItem("whatsapp_notified", "true");
            }, 5000); // 5 seconds delay
        }
    };

    // Browser policy workaround: Play sound on first user click anywhere if it hasn't played yet
    document.addEventListener(
        "click",
        () => {
            if (!soundPlayed && sessionStorage.getItem("whatsapp_notified")) {
                // If notification is already visible but sound was blocked, try one more time on click
                playNotificationSound();
            }
        },
        { once: true },
    );

    // Close popup
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        popup.classList.remove("active");
    });

    // Hide badge on click
    button.addEventListener("click", () => {
        badge.classList.remove("active");
        popup.classList.remove("active");
    });

    // Trigger on load
    window.addEventListener("load", showNotification);
})();
