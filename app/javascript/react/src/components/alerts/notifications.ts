import Swal from "sweetalert2";

export const notification = {
  showSuccess: ({ title, message }:{ title:string, message:string }) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: title,
      text: message,
      showConfirmButton: false,
      timer: 2500,
    });
  },

  showError: ({ title, message }:{ title:string, message:string }) => {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: title,
      text: message,
      showConfirmButton: true,
    });
  },

  showWarning: ({ title, message }:{ title:string, message:string }) => {
    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: title,
      text: message,
      showConfirmButton: true,
    });
  },
};
