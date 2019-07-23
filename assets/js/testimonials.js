const toggleMenu = () => {
  menu.classList.toggle("menu--open");
};

const menu = document.querySelector(".menu");

const menuButton = document.querySelector(".menu-button");

menuButton.addEventListener("click", function() {
  toggleMenu();
});

class Carousel {
  constructor(ele) {
    this.ele = ele;
    this.leftBtn = this.ele.querySelector(".left-button");
    this.rightBtn = this.ele.querySelector(".right-button");
    this.images = this.ele.querySelectorAll("img");
    this.currentIndex = this.images[0];
    this.leftBtn.addEventListener("click", () => this.left());
    this.rightBtn.addEventListener("click", () => this.right());
    this.currentIndex.style.display = "block";
    this.i = 1;
  }

  left() {
    this.images.forEach(img => (img.style.display = "none"));
    if (this.i > -1) {
      this.images[this.i].style.display = "block";
      this.i -= 1;
    } else {
      this.images[3].style.display = "block";
      this.i = 1;
    }
  }

  right() {
    this.images.forEach(img => (img.style.display = "none"));
    //this.currentIndex = this.currentIndex.nextElementSibling;
    if (this.i < 4) {
      this.images[this.i].style.display = "block";
      this.i += 1;
    } else {
      this.images[0].style.display = "block";
      this.i = 1;
    }
  }
}

let carousel = document.querySelector(".carousel");
new Carousel(carousel);
