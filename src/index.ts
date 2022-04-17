import "./style.css"; 

function initMap(): void {
    const directionsService = new google.maps.DirectionsService(); //utilisation de service de direction
    const directionsRenderer = new google.maps.DirectionsRenderer(); // creation des trajets
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        zoom: 10,
        center: { lat: 36.837186, lng: 10.191982 }, // centrer la map dans les cordone de tunis
    }); // creaction du map et injection de cette map dans la page html

    directionsRenderer.setMap(map); // application des trajets dans la map crée

    (document.getElementById("submit") as HTMLElement).addEventListener("click", () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer); //utlisation de la fonction de calcul de distance et temps
    }); //lorsque on clique sur submit dans le html il va calculer et afficher les trajets
}
// creaction de la fonction de calcul de distance et temps
function calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService, //utilisation du service de direction
    directionsRenderer: google.maps.DirectionsRenderer //utilisation du servise de trajet
) {
    const waypts: google.maps.DirectionsWaypoint[] = []; //creation de tableau qui contient les place que la voiture va passr
    const checkboxArray = document.getElementById("waypoints") as HTMLSelectElement; //selction la zone ou les places sont declare dans le html

    //cette fonction pour lire la valeur selecionner (waypoints)
    for (let i = 0; i < checkboxArray.length; i++) {
        if (checkboxArray.options[i].selected) {
            waypts.push({
                location: (checkboxArray[i] as HTMLOptionElement).value,
                stopover: true,
            });
        }
    }

    directionsService
        .route({
            origin: (document.getElementById("start") as HTMLInputElement).value, //lire la valeur origin selectionner dans le html
            destination: (document.getElementById("end") as HTMLInputElement).value, //lire la valeur destination selectionner dans le html
            waypoints: waypts, //lire les places selectionner entre oringin et destination dans le html
            optimizeWaypoints: true, //optimiser les distances de waypoints
            travelMode: google.maps.TravelMode.DRIVING, //selectioner le mode de voyage
        })
        .then((response) => {
            directionsRenderer.setDirections(response);

            const route = response.routes[0];
            const summaryPanel = document.getElementById("directions-panel") as HTMLElement; //selectiooner la zone d affichaeg du resume dans le html

            summaryPanel.innerHTML = ""; //initisalisation du champs de resume
            let total = 0; //initisalisation du total distance
            let duration = ""; //initisalisation du totale duration
            let hours = 0; //initisalisation des heurs
            let minutes = 0; //initisalisation des minutes

            // For each route, display summary information.
            for (let i = 0; i < route.legs.length; i++) {
                const routeSegment = i + 1;

                summaryPanel.innerHTML += "<hr><b>Route Segment: " + routeSegment + "</b><br><hr>";
                summaryPanel.innerHTML += "From <i>" + route.legs[i].start_address + "</i> to ";
                summaryPanel.innerHTML += "<i>" + route.legs[i].end_address + "</i><br>";
                summaryPanel.innerHTML += "DISTANCE : " + route.legs[i].distance!.text + "<br>";
                summaryPanel.innerHTML += "DURATION : " + route.legs[i].duration!.text + "<br><hr>";
                // hours calcul
                route.legs[i].duration!.text.length <= 10
                    ? (hours += 0)
                    : (hours += parseFloat(route.legs[i].duration!.text.substring(0, 1)));
                // minutes calcul && test
                route.legs[i].duration!.text.length <= 10
                    ? (minutes += parseFloat(route.legs[i].duration!.text.substring(0, 2)))
                    : route.legs[i].duration!.text.length >= 10 &&
                      route.legs[i].duration!.text.length <= 14
                    ? (minutes += parseFloat(route.legs[i].duration!.text.substring(8, 10)))
                    : (minutes += parseFloat(route.legs[i].duration!.text.substring(9, 11)));
                if (minutes > 60) {
                    hours += 1;
                    minutes = minutes - 60;
                } else {
                    hours += 0;
                }
                //calcul total distance
                total += parseFloat(route.legs[i].distance!.text);
            }
            
            duration = `${hours} heures ${minutes} minutes`; 
            let totale = document.getElementById("total") as HTMLElement; //selectionnerla zone  d'affichage du totale distance
            totale.innerHTML = "TOTAL DISTANCE : " + total + " km";//afficahge du totale disatnce dans la zone selectionner
            let duree = document.getElementById("duration") as HTMLElement;//selectionnerla zone  d'affichage du totale distance
            duree.innerHTML = "TOTAL DURATION : " + duration;//afficahge du totale disatnce dans la zone selectionner
        })
        .catch((e) => window.alert("Directions request failed due to " + status));//en cas d'erreur il va afficher ce message
}
export { initMap };
