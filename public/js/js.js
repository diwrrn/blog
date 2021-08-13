let nav = document.querySelector('.nav')
window.addEventListener("scroll", () =>{
    if(window.scrollY > 736){
        nav.style.backgroundColor= "white";

    }else{
        nav.style.backgroundColor = "transparent";
    }
});

let burger = document.querySelector('.toggle');
let navlist = document.querySelector(".nav-two");

burger.addEventListener("click", () =>{
    console.log("clicked")
    navlist.classList.toggle('nav-active')
})
