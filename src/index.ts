import "./style.css";


function initMap(): void {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 10,
        center: { lat: 36.837186, lng: 10.191982 },
      }
    );
  
    directionsRenderer.setMap(map);
  
    (document.getElementById("submit") as HTMLElement).addEventListener(
      "click",
      () => {
        calculateAndDisplayRoute(directionsService, directionsRenderer);
      }
    );
  }
  
  function calculateAndDisplayRoute(
    directionsService: google.maps.DirectionsService,
    directionsRenderer: google.maps.DirectionsRenderer
  ) {
    const waypts: google.maps.DirectionsWaypoint[] = [];
    const checkboxArray = document.getElementById(
      "waypoints"
    ) as HTMLSelectElement;
  
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
        origin: (document.getElementById("start") as HTMLInputElement).value,
        destination: (document.getElementById("end") as HTMLInputElement).value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
  
        const route = response.routes[0];
        const summaryPanel = document.getElementById(
          "directions-panel"
        ) as HTMLElement;
  
        summaryPanel.innerHTML = "";
  
        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
  
          summaryPanel.innerHTML +=
            "<hr><b>Route Segment: " + routeSegment + "</b><br><hr>";
          summaryPanel.innerHTML += route.legs[i].start_address + " to ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
          summaryPanel.innerHTML +="DISTANCE : "+ route.legs[i].distance!.text + "<br>";
          summaryPanel.innerHTML += "DURATION : "+route.legs[i].duration!.text + "<br><hr>";
        }
      })
      .catch((e) => window.alert("Directions request failed due to " + status));
  }
export { initMap };
