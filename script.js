// Lista de lugares a fotografiar
const photoLocations = ["Living Room", "Kitchen", "Bedroom", "Bathroom"];
let currentLocationIndex = 0;
let map, marker;

// Función para verificar la clave de orden
function checkOrder() {
    const orderKey = document.getElementById("order-key").value.trim();
    if (orderKey === "1") {
        document.getElementById("address-display").textContent = "The registered address is: 742 Evergreen Terrace";
        document.getElementById("order-input").style.display = "none";
        document.getElementById("address-confirmation").style.display = "flex";
    } else {
        alert("Order number not found. Please try again.");
    }
}

// Función para mostrar la tarjeta de localización
function showLocationCard() {
    document.getElementById("address-confirmation").style.display = "none";
    document.getElementById("location-card").style.display = "flex";
}

// Función para obtener y mostrar la ubicación en el mapa
function getLocation() {
    const date = new Date();
    document.getElementById("location-time").textContent = `Request time: ${date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const { latitude, longitude, accuracy } = position.coords;

    // Establecemos un nivel de zoom que muestra aproximadamente un área de 5 km
    const zoomLevel = 14;  // Este nivel de zoom es adecuado para un radio aproximado de 5 km

    if (!map) {
        // Inicializa el mapa y centra en la posición obtenida con el zoom adecuado
        map = L.map('map').setView([latitude, longitude], zoomLevel);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18, // Permitimos un mayor acercamiento si es necesario
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Colocamos un marcador en la posición inicial
        marker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`Your location (Accuracy: ${Math.round(accuracy)} meters)`)
            .openPopup();
        
    } else {
        // Actualizamos el centro del mapa a la nueva ubicación
        map.setView([latitude, longitude], zoomLevel);

        // Actualizamos la posición del marcador
        marker.setLatLng([latitude, longitude])
            .bindPopup(`Your location (Accuracy: ${Math.round(accuracy)} meters)`)
            .openPopup()
            .update();
    }
}

function showError(error) {
    const errorMessages = {
        [error.PERMISSION_DENIED]: "User denied the request for Geolocation.",
        [error.POSITION_UNAVAILABLE]: "Location information is unavailable.",
        [error.TIMEOUT]: "The request to get user location timed out.",
        [error.UNKNOWN_ERROR]: "An unknown error occurred."
    };
    alert(errorMessages[error.code] || "An unknown error occurred.");
}

// Función para iniciar la cámara después de la localización
function startCamera() {
    document.getElementById("location-card").style.display = "none";
    document.getElementById("instruction").style.display = "block";
    document.getElementById("camera-frame").style.display = "flex";
    updateInstruction();
    startCameraStream();
}

// Función para iniciar el flujo de la cámara
function startCameraStream() {
    const video = document.getElementById("video");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream)
        .catch(error => {
            console.error("Error accessing the camera:", error);
            alert("Unable to access the camera. Please check your camera permissions.");
        });
}

// Función para capturar una foto y mostrarla en vista previa
function capturePhoto() {
    const video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    document.getElementById("captured-image").src = canvas.toDataURL("image/png");

    document.getElementById("camera-frame").style.display = "none";
    document.getElementById("instruction").style.display = "none"; // Ocultar título en vista previa
    document.getElementById("photo-preview").style.display = "flex";
    document.getElementById("photo-title").textContent = photoLocations[currentLocationIndex];
}

// Función para aprobar la foto y avanzar al siguiente lugar
function approvePhoto() {
    currentLocationIndex++;
    if (currentLocationIndex < photoLocations.length) {
        updateInstruction();
        resetView();
    } else {
        showSurvey(); // Mostrar encuesta después de todas las fotos
    }
}

// Función para rechazar la foto y volver a la cámara
function rejectPhoto() {
    resetView();
}

// Función para actualizar la instrucción de la ubicación a fotografiar
function updateInstruction() {
    document.getElementById("instruction").textContent = `Take a Photo of the ${photoLocations[currentLocationIndex]}`;
}

// Función para mostrar la encuesta de una pregunta a la vez
function showSurvey() {
    document.getElementById("camera-frame").style.display = "none";
    document.getElementById("photo-preview").style.display = "none";
    document.getElementById("survey-question-1").style.display = "flex"; // Mostrar primera pregunta
}

// Función para avanzar a la siguiente pregunta de la encuesta
function nextQuestion(currentQuestion) {
    document.getElementById(`survey-question-${currentQuestion}`).style.display = "none";
    document.getElementById(`survey-question-${currentQuestion + 1}`).style.display = "flex";
}

// Función para retroceder a la pregunta anterior en la encuesta
function previousQuestion(currentQuestion) {
    document.getElementById(`survey-question-${currentQuestion}`).style.display = "none";
    document.getElementById(`survey-question-${currentQuestion - 1}`).style.display = "flex";
}

// Función para enviar la encuesta y mostrar el mensaje de agradecimiento
function submitSurvey() {
    document.getElementById("survey-question-3").style.display = "none";
    document.getElementById("thank-you-survey").style.display = "flex";
}

// Función para restablecer la vista de la cámara
function resetView() {
    document.getElementById("camera-frame").style.display = "flex";
    document.getElementById("instruction").style.display = "block";
    document.getElementById("photo-preview").style.display = "none";
}
