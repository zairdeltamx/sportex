import { Controller } from "@hotwired/stimulus";
import dayjs from "dayjs";
// Connects to data-controller="sessions"
let intervalReveal;
let intervalRewards;
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
    function countdownReveal() {
      const now = dayjs(); // fecha actual
      const targetDate = dayjs("2023-05-29"); // fecha objetivo
      const diffInSeconds = targetDate.diff(now, "second"); // diferencia en segundos

      const days = Math.floor(diffInSeconds / (60 * 60 * 24));
      const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
      const seconds = diffInSeconds % 60;

      document.getElementById("days-reveal").textContent = days;
      document.getElementById("hours-reveal").textContent = hours;
      document.getElementById("minutes-reveal").textContent = minutes;
      document.getElementById("seconds-reveal").textContent = seconds;
      console.log(
        `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
      );
    }
    function countdownRewards() {
      const now = dayjs(); // fecha actual
      const targetDate = dayjs("2023-06-25"); // fecha objetivo
      const diffInSeconds = targetDate.diff(now, "second"); // diferencia en segundos

      const days = Math.floor(diffInSeconds / (60 * 60 * 24));
      const hours = Math.floor((diffInSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
      const seconds = diffInSeconds % 60;

      document.getElementById("days-rewards").textContent = days;
      document.getElementById("hours-rewards").textContent = hours;
      document.getElementById("minutes-rewards").textContent = minutes;
      document.getElementById("seconds-rewards").textContent = seconds;
      console.log(
        `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
      );
    }
    intervalReveal = setInterval(() => {
      countdownReveal();
    }, 1000);
    intervalRewards = setInterval(() => {
      countdownRewards();
    }, 1000);
  }
  disconnect() {
    clearInterval(intervalReveal);
    clearInterval(intervalRewards);
  }
}
