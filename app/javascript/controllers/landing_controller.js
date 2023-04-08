import { Controller } from "@hotwired/stimulus";
// Connects to data-controller="sessions"
export default class extends Controller {
    connect() {
        let menu = document.querySelector('.links_container_landing')
        let containerMenu = document.querySelector('.container_menu')
        let buttonMenu = document.getElementById('menu_hamburger')
        let buttonClose = document.getElementById('close_menu')
        containerMenu.addEventListener('click', () => {
            if (menu.classList.contains('active')) {
                buttonClose.style.display = 'none'
                buttonMenu.style.display = 'block'
                menu.classList.remove('active')
                return
            }
            buttonClose.style.display = 'block'
            buttonMenu.style.display = 'none'
            menu.classList.add('active')
        })

    }
}