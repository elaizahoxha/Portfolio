document.addEventListener("DOMContentLoaded", () => {

    const title = document.querySelector(".case-title span");
    
    /* initial highlight sweep on load */
    
    setTimeout(() => {
    
    title.parentElement.classList.add("animate");
    
    }, 400);
    
    
    /* scroll based highlight movement */
    
    window.addEventListener("scroll", () => {
    
    const scroll = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    
    const progress = scroll / maxScroll;
    
    title.style.backgroundPosition = `${100 - progress * 100}% 0`;
    
    });
    
    });