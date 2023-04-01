export const showModal = (modal) => {
    var div = document.getElementById("modalInstallMetamask");

    // Verificar si se debe agregar o eliminar el modal-component
    if (modal) {
        // Crear el modal-component y agregarlo al div
        var modalComponent = document.createElement("modal-component");
        div.appendChild(modalComponent);
    } else {
        // Buscar el modal-component existente y eliminarlo del div
        var existingModalComponent = div.querySelector("modal-component");
        if (existingModalComponent) {
            div.removeChild(existingModalComponent);
        }
    }
}