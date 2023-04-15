import { Controller } from "@hotwired/stimulus";
// Connects to data-controller="sessions"
export default class extends Controller {
  connect() {
    let menu = document.querySelector(".links_container_landing");
    let containerMenu = document.querySelector(".container_menu");
    let buttonMenu = document.getElementById("menu_hamburger");
    let buttonClose = document.getElementById("close_menu");

    let videoModal = document.querySelector(".video_modal_landing");
    let player = document.querySelector(".video_player_landing");
    let btnPlay = document.querySelector(".open_modal");
    let video = document.querySelector(".video_landing_control");
    btnPlay.onclick = function () {
      console.log("enra");
      videoModal.style.display = "block";
      console.log(video, "video");
      video.play();
      //     player.innerHTML = `<video width="320" height="240" controls autoplay>
      //     <source src="/videos/videoSportx.mp4" type="video/mp4">
      //     Tu navegador no soporta el elemento video.
      //   </video>`
    };
    window.onclick = function (event) {
      if (event.target == videoModal) {
        videoModal.style.display = "none";
        video.pause();
      }
    };

    containerMenu.addEventListener("click", () => {
      if (menu.classList.contains("active")) {
        buttonClose.style.display = "none";
        buttonMenu.style.display = "block";
        menu.classList.remove("active");
        return;
      }
      buttonClose.style.display = "block";
      buttonMenu.style.display = "none";
      menu.classList.add("active");
    });
  }
}
