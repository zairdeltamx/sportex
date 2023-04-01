export const showLoader = (active) => {
    var div = document.getElementById("loader");
    console.log("ENTRA LOADER");
    // Verificar si se debe agregar o eliminar el modal-component
    if (active) {
        // Crear el modal-component y agregarlo al div
        var loaderComponent = document.createElement("loader-component");
        div.appendChild(loaderComponent);
    } else {
        // Buscar el modal-component existente y eliminarlo del div
        var existingLoaderComponent = div.querySelector("loader-component");
        if (existingLoaderComponent) {
            div.removeChild(existingLoaderComponent);
        }
    }
}