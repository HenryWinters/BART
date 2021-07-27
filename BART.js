let stationSelector = document.querySelector('#station-selector');
let stationSelection = "";
let northboundDepartures = document.querySelector('#northbound-departures');
let southboundDepartures = document.querySelector('#southbound-departures');

function generateStationOptions() {
    fetch('https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y')
    .then(response => response.json())
    .then(data => {
        let stationList = data.root.stations.station; 
        for (let i = 0; i < stationList.length; i++) {
            let stationName = stationList[i]['name'];
            let station = document.createElement('option');
            station.value = stationName; 
            station.textContent = stationName; 
            stationSelector.appendChild(station);
         }
    }
)};

generateStationOptions(); 

stationSelector.addEventListener('change', (event) => {
    document.querySelectorAll('p').forEach(element => element.remove());
    let stationSelection = event.target.value; 
    getStationDepartures(stationSelection);
});

function getStationDepartures(stationToSearchFor) { 
    fetch('https://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=MW9S-E7SL-26DU-VV8V&json=y')
    .then(response => response.json())
    .then(data => {
        let allStationsArr = data.root.station;
        for (let i = 0; i < allStationsArr.length; i++) {
            if (allStationsArr[i]['name'] == stationToSearchFor) {
                let stationObj = allStationsArr[i];
                let stationDeparturesArr = stationObj['etd'];
                stationDeparturesArr.sort((a,b) => parseInt(a['estimate'][0]['minutes']) - parseInt(b['estimate'][0]['minutes']));
                for (let j = 0; j < stationDeparturesArr.length; j++) {
                    let departureDestination = stationDeparturesArr[j]['destination'];
                    let departureTime = stationDeparturesArr[j]['estimate'][0]['minutes'];
                    let departureDirection = stationDeparturesArr[j]['estimate'][0]['direction'];
                    let departureColor = stationDeparturesArr[j]['estimate'][0]['hexcolor'];
                    let departurePlatform = stationDeparturesArr[j]['estimate'][0]['platform'];
                    let departureLength = stationDeparturesArr[j]['estimate'][0]['length'];

                    let destinationContainerNorth = document.querySelector('#destination-north');
                    let timeContainerNorth = document.querySelector('#minutes-north');
                    let lengthContainerNorth = document.querySelector('#train-length-north');
                    let platformContainerNorth = document.querySelector('#platform-north');
                    let colorContainerNorth = document.querySelector('#color-north');

                    let destinationContainerSouth = document.querySelector('#destination-south');
                    let timeContainerSouth = document.querySelector('#minutes-south');
                    let lengthContainerSouth = document.querySelector('#train-length-south');
                    let platformContainerSouth = document.querySelector('#platform-south');
                    let colorContainerSouth = document.querySelector('#color-south');

                    let destinationElement = document.createElement('p');
                    let timeElement = document.createElement('p');
                    let lengthElement = document.createElement('p');
                    let platformElement = document.createElement('p');
                    let departureColorDisplay = document.createElement('p');
                    destinationElement.textContent = `${departureDestination}`; 
                    timeElement.textContent = `${departureTime}`; 
                    lengthElement.textContent = `${departureLength}`; 
                    platformElement.textContent = `${departurePlatform}`; 

                    departureColorDisplay.setAttribute('id', 'departure-color-display');
                    departureColorDisplay.style['background-color'] = departureColor;

                    departureDirection === "North" ? 
                        destinationContainerNorth.appendChild(destinationElement) &&
                        timeContainerNorth.appendChild(timeElement) &&
                        lengthContainerNorth.appendChild(lengthElement) &&
                        platformContainerNorth.appendChild(platformElement) && 
                        colorContainerNorth.appendChild(departureColorDisplay) 
                        :
                        destinationContainerSouth.appendChild(destinationElement) &&
                        timeContainerSouth.appendChild(timeElement) &&
                        lengthContainerSouth.appendChild(lengthElement) &&
                        platformContainerSouth.appendChild(platformElement) && 
                        colorContainerSouth.appendChild(departureColorDisplay) 

                }

            } 
        }
    })
};
