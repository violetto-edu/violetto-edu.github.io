export function setupImageViewer() {
  // Create overlay elements
  const overlay = document.createElement("div");
  overlay.className = "image-overlay";
  overlay.style.display = "none";

  const enlargedImg = document.createElement("img");
  enlargedImg.className = "enlarged-image";

  overlay.appendChild(enlargedImg);
  document.body.appendChild(overlay);

  // Function to handle image click
  function handleImageClick(event) {
    const img = event.target;
    if (img.tagName === "IMG" && !img.closest(".image-overlay")) {
      enlargedImg.src = img.src;
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  // Function to handle overlay click (close)
  function handleOverlayClick(event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    }
  }

  // Event listeners for image clicks
  document.addEventListener("click", handleImageClick);
  overlay.addEventListener("click", handleOverlayClick);

  // Add escape key handler
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.style.display === "flex") {
      overlay.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

// Function to lazy load images
export function lazyLoadImages(container) {
  const images = container.querySelectorAll("img");
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const image = entry.target;
          const placeholderWrapper = image.closest(".image-placeholder-wrapper");

          image.src = image.dataset.src;

          image.onload = function () {
            // Remove placeholder class once image is loaded
            if (placeholderWrapper) {
              placeholderWrapper.classList.remove("loading");
              placeholderWrapper.style.backgroundColor = "transparent";
            }

            // Set wrapper and image styles
            const isSmallImage = image.naturalWidth < 1000;
            
            if (isSmallImage) {
              placeholderWrapper.style.width = "60%";
              placeholderWrapper.style.margin = "0 auto";
            } else {
              placeholderWrapper.style.width = "100%";
              placeholderWrapper.style.margin = "";
            }

            image.style.width = "100%";
            image.style.height = "auto";
            image.style.objectFit = "contain";
          };

          observer.unobserve(image);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  images.forEach((img) => {
    // Create a wrapper for the image
    const wrapper = document.createElement("div");
    wrapper.className = "image-placeholder-wrapper loading";

    wrapper.style.position = "relative";
    wrapper.style.width = "100%";
    wrapper.style.backgroundColor = "var(--block-quote)";
    wrapper.style.overflow = "hidden";

    // Add loading indicator
    wrapper.innerHTML = `
      <div class="image-placeholder-loader" style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        opacity: 0.5;
      ">
        Loading...
      </div>
    `;

    // Replace image with wrapped version
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Prepare for lazy loading
    img.dataset.src = img.src;
    img.src = ""; // Clear src to prevent immediate loading

    // Style the image
    img.style.display = "block";
    img.style.width = "100%";
    img.style.height = "auto";

    imageObserver.observe(img);
  });
}
