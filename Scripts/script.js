// Collapsible sidebar
const btn = document.getElementById("toggleBtn");
const bar = document.getElementById("sidebar");
btn.addEventListener("click", () => {
    bar.classList.toggle("active");
});

// Scroll fade-in animation
const faders=document.querySelectorAll(".fade-in");
const appearOptions={threshold:0.1};
const appearOnScroll=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
        }
    });
},appearOptions);

faders.forEach(fader=>appearOnScroll.observe(fader));
