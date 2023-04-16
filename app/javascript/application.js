// Entry point for the build script in your package.json
import "@hotwired/turbo-rails";
import "./controllers";
import './react/src/index.js'
import { notification } from "./react/src/components/alerts/notifications";

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');

  const flashMessages = document.querySelectorAll('.flash-message-content');

  flashMessages.forEach((flashMessage) => {
    const type = flashMessage.getAttribute('data-type');

    if (type === 'notice') {
      notification.showSuccess({title: '', message: flashMessage.innerText});
    } else {
      notification.showError({title: '', message: flashMessage.innerText});
    }
  });
});

