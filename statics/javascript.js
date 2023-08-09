const menu = document.querySelector('.menu');
const closeMenu = document.querySelector('.close-menu');
const sidebar = document.querySelector('.sidebar-terms');

closeMenu.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Agregar un evento de clic al menú
menu.addEventListener('click', function() {
  // Alternar la clase 'active' en el menú
  sidebar.classList.toggle('active');
});

const sidebarLinks = document.querySelectorAll('.sidebar-terms a');
sidebarLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    closeSidebar();
  });
});

// Agregar un evento de clic al documento
document.addEventListener('click', function(event) {
  // Verificar si el objetivo del clic no es el sidebar ni el menú
  if (!sidebar.contains(event.target) && !menu.contains(event.target)) {
    closeSidebar();
  }
});

function closeSidebar() {
  sidebar.classList.toggle('active');
//   sidebar.style.transform = 'translateX(-100%)';
}
