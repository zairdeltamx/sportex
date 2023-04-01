import Swal from "sweetalert2";

export const notification = {
  showSuccessWithButton: ({ title, message, footer }) => {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      footer: footer ?? '<span>Sportex</span>'
    })
  },
  showErrorWithButton: ({ title, message, footer }) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      footer: footer ?? '<span>Sportex</span>'
    })
  },
  showWarningWithButton: ({ title, message, footer }) => {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      footer: footer ?? '<span>Sportex</span>'
    })
  },
  showSuccess: ({ title, message }) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 2500,
    });
  },

  showError: ({ title, message }) => {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: title,
      text: message,
      showConfirmButton: true,
    });
  },

  showWarning: ({ title, message }) => {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: title,
      text: message,
      showConfirmButton: true,
    });
  },
};
