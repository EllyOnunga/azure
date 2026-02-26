/**
 * Azure Bay - Error Handler & Resource Fallback Utility
 * Handles JavaScript errors, resource loading failures, and provides monitoring
 */

(function () {
    "use strict";

    // Configuration
    const config = {
        enableLogging: false, // Set to true in development
        enableErrorTracking: false, // Enable if using error tracking service
        retryAttempts: 3,
        retryDelay: 1000,
    };

    // Utility: Retry function for failed resources
    function retryLoad(resourceUrl, attempts = config.retryAttempts) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", resourceUrl, true);

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else if (attempts > 0) {
                    setTimeout(() => {
                        retryLoad(resourceUrl, attempts - 1)
                            .then(resolve)
                            .catch(reject);
                    }, config.retryDelay);
                } else {
                    reject(new Error(`Failed to load ${resourceUrl} after ${config.retryAttempts} attempts`));
                }
            };

            xhr.onerror = function () {
                if (attempts > 0) {
                    setTimeout(() => {
                        retryLoad(resourceUrl, attempts - 1)
                            .then(resolve)
                            .catch(reject);
                    }, config.retryDelay);
                } else {
                    reject(new Error(`Network error loading ${resourceUrl}`));
                }
            };

            xhr.send();
        });
    }

    // Handle failed image loads with fallback
    function initImageFallback() {
        const images = document.querySelectorAll("img");

        images.forEach((img) => {
            // Skip if already has error handler
            if (img.dataset.fallbackInitialized) return;
            img.dataset.fallbackInitialized = "true";

            img.addEventListener("error", function () {
                // Try to set a fallback image
                const fallback = img.dataset.fallback || "images/placeholder.svg";
                if (img.src !== fallback) {
                    img.src = fallback;
                    img.alt = img.alt || "Image unavailable";
                }

                // Log error if logging enabled
                if (config.enableLogging) {
                    console.warn("Image failed to load:", img.src);
                }
            });
        });
    }

    // Handle failed script loads
    function initScriptFallback() {
        const scripts = document.querySelectorAll("script[src]");

        scripts.forEach((script) => {
            if (script.dataset.fallbackInitialized) return;
            script.dataset.fallbackInitialized = "true";

            // Create a backup function for critical scripts
            const originalSrc = script.src;

            script.addEventListener("error", function () {
                if (config.enableLogging) {
                    console.error("Script failed to load:", originalSrc);
                }

                // Try to reload from CDN as fallback for external scripts
                if (originalSrc.includes("jsdelivr") || originalSrc.includes("cdnjs")) {
                    const alternativeSrc = originalSrc.replace(/cdn\..+\//, "cdn.jsdelivr.net/");

                    const newScript = document.createElement("script");
                    newScript.src = alternativeSrc;
                    newScript.async = script.async;
                    newScript.defer = script.defer;
                    document.head.appendChild(newScript);
                }
            });
        });
    }

    // Global error handler for uncaught errors
    function initGlobalErrorHandler() {
        window.addEventListener("error", function (event) {
            // Don't report errors for resources
            if (event.filename && event.filename.includes("/images/")) {
                return true;
            }

            const errorInfo = {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error ? event.error.stack : null,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            };

            if (config.enableLogging) {
                console.error("Global error caught:", errorInfo);
            }

            // Send to error tracking service if configured
            if (config.enableErrorTracking && window.trackError) {
                window.trackError(errorInfo);
            }

            // Return false to let default error handler run
            return false;
        });

        // Handle unhandled promise rejections
        window.addEventListener("unhandledrejection", function (event) {
            const errorInfo = {
                message: event.reason,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
            };

            if (config.enableLogging) {
                console.error("Unhandled promise rejection:", errorInfo);
            }

            if (config.enableErrorTracking && window.trackError) {
                window.trackError(errorInfo);
            }
        });
    }

    // Offline detection and handling
    function initOfflineHandler() {
        const offlineMessage = document.createElement("div");
        offlineMessage.id = "offline-message";
        offlineMessage.className = "offline-banner";
        offlineMessage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff9800;
            color: white;
            padding: 10px;
            text-align: center;
            z-index: 10000;
            display: none;
            font-family: system-ui, sans-serif;
        `;
        offlineMessage.textContent = "You appear to be offline. Some content may not be available.";

        window.addEventListener("online", function () {
            offlineMessage.style.display = "none";
            // Reload the page to refresh cached content
            window.location.reload();
        });

        window.addEventListener("offline", function () {
            document.body.appendChild(offlineMessage);
            offlineMessage.style.display = "block";
        });

        // Check initial state
        if (!navigator.onLine) {
            document.body.appendChild(offlineMessage);
            offlineMessage.style.display = "block";
        }
    }

    // Lazy loading with Intersection Observer
    function initLazyLoading() {
        if ("IntersectionObserver" in window) {
            const imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                if (img.dataset.srcset) {
                                    img.srcset = img.dataset.srcset;
                                }
                                img.classList.add("lazy-loaded");
                                observer.unobserve(img);
                            }
                        }
                    });
                },
                {
                    rootMargin: "50px 0px",
                    threshold: 0.01,
                },
            );

            // Observe images with data-src
            document.querySelectorAll("img[data-src]").forEach((img) => {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize all handlers
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", init);
            return;
        }

        initGlobalErrorHandler();
        initImageFallback();
        initScriptFallback();
        initOfflineHandler();
        initLazyLoading();

        if (config.enableLogging) {
            console.log("Error Handler & Resource Fallback initialized");
        }
    }

    // Expose public API
    window.ErrorHandler = {
        init: init,
        retryLoad: retryLoad,
        config: config,
    };

    // Auto-initialize
    init();
})();
