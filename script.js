document.addEventListener("DOMContentLoaded", () => {
    // 1. Split Text for Hero Name
    const heroTitle = document.getElementById('hero-title');
    const text = heroTitle.textContent.trim();
    heroTitle.innerHTML = '';
    
    text.split('').forEach(char => {
        if (char === ' ') {
            heroTitle.innerHTML += `<span class="char-wrapper" style="width: 0.2em; display: inline-block;">&nbsp;</span>`;
        } else {
            heroTitle.innerHTML += `<span class="char-wrapper"><span class="char">${char}</span></span>`;
        }
    });

    const chars = document.querySelectorAll('.char');
    const revealFades = document.querySelectorAll('.reveal-fade');
    const mainContainer = document.querySelector('.main-container');

    // 2. Reduced Motion Check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 3. Loading Animation
    let progress = { value: 0 };
    const loaderNumber = document.querySelector('.loader-number');
    const loaderLine = document.querySelector('.loader-line');
    const loader = document.querySelector('.loader');

    const loaderDuration = prefersReducedMotion ? 0.1 : 2.5;

    const tlLoader = gsap.timeline({
        onComplete: () => {
            gsap.set(mainContainer, { visibility: 'visible', opacity: 1 });
            
            const tlMain = gsap.timeline();
            
            tlMain.to(loader, {
                yPercent: -100,
                duration: prefersReducedMotion ? 0 : 1.2,
                ease: "power3.inOut"
            })
            
            .to(chars, {
                y: "0%",
                duration: prefersReducedMotion ? 0 : 1.4,
                stagger: prefersReducedMotion ? 0 : 0.06,
                ease: "power4.out"
            }, prefersReducedMotion ? "+=0" : "-=0.4")
            
            .to(revealFades, {
                opacity: 1,
                y: 0,
                duration: prefersReducedMotion ? 0 : 1.2,
                stagger: prefersReducedMotion ? 0 : 0.1,
                ease: "power2.out"
            }, prefersReducedMotion ? "+=0" : "-=1");
        }
    });

    tlLoader.to(progress, {
        value: 100,
        duration: loaderDuration,
        ease: "power2.inOut",
        onUpdate: () => {
            let currentProg = Math.round(progress.value);
            loaderNumber.innerText = currentProg < 10 ? `0${currentProg}` : currentProg;
            gsap.set(loaderLine, { width: `${progress.value}%` });
        }
    });

    // 4. Update Local Time
    const timeElement = document.getElementById('local-time');
    
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timeElement.innerText = `LOCAL TIME · ${hours}:${minutes} ${ampm}`;
    }
    
    updateTime();
    setInterval(updateTime, 1000);

    // 5. Custom Cursor & Magnetic Effect
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('.hover-target');
    const magneticLinks = document.querySelectorAll('.magnetic-link');
    
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    
    if (isFinePointer && !prefersReducedMotion) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let outlineX = mouseX;
        let outlineY = mouseY;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            gsap.set(cursorDot, { x: mouseX, y: mouseY });
        });
        
        gsap.ticker.add(() => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            gsap.set(cursorOutline, { x: outlineX, y: outlineY });
        });

        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hover');
            });
            target.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover');
            });
        });

        magneticLinks.forEach(link => {
            link.addEventListener('mousemove', (e) => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(link, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
        
        const charWrappers = document.querySelectorAll('.char-wrapper');
        charWrappers.forEach(wrapper => {
            wrapper.addEventListener('mouseenter', () => {
                gsap.to(wrapper, { y: -10, duration: 0.3, ease: "back.out(1.5)" });
            });
            wrapper.addEventListener('mouseleave', () => {
                gsap.to(wrapper, { y: 0, duration: 0.4, ease: "power2.out" });
            });
        });
        
        const heroNameContainer = document.querySelector('.hero-name-container');
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20; 
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            
            gsap.to(heroNameContainer, {
                x: x,
                y: y,
                duration: 1.5,
                ease: "power2.out"
            });
        });
    }
});
