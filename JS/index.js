const toggles = document.querySelectorAll(".faq-toggle");

toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const parent = toggle.parentElement;
        
        parent.classList.toggle("active");
        
        toggle.textContent = parent.classList.contains("active") ? "-" : "+";
    });
});