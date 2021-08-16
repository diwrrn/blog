
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

if(document.getElementsByClassName('header-text')[0] != null){
    var contain = document.getElementsByClassName('contain');
    for(let i = 0; i <= contain.length -1; i++){
        var j = document.getElementsByClassName('header-text')[i].textContent;
        var k = document.getElementsByClassName('header-text')[i];
        k.innerHTML = j
        }
}

if(document.getElementsByClassName('viewpage-desc')[0] != null){
    document.getElementsByClassName('viewpage-desc')[0].innerHTML = document.getElementsByClassName('viewpage-desc')[0].textContent
}

