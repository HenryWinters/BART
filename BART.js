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
    northboundDepartures.textContent = "";
    southboundDepartures.textContent = "";
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

                    let departureDiv = document.createElement('div');
                    departureDiv.style.display = 'flex';

                    let departureListing = document.createElement('p');
                    let departureColorDisplay = document.createElement('div');
                    departureColorDisplay.setAttribute('id', 'departure-color-display');
                    departureColorDisplay.style['background-color'] = departureColor;
                    Number.isInteger(parseInt(departureTime)) ? departureListing.textContent = `${departureLength}-car train heading towards ${departureDestination} 
                        is arriving in ${departureTime} minutes on Platform ${departurePlatform}` : departureListing.textContent = `${departureLength}-car train 
                        heading towards ${departureDestination} is ${departureTime} right now on Platform ${departurePlatform}`;
                    departureDirection === "North" ? departureDiv.appendChild(departureListing) && departureDiv.appendChild(departureColorDisplay) 
                    && northboundDepartures.appendChild(departureDiv) 
                    : departureDiv.appendChild(departureListing) && departureDiv.appendChild(departureColorDisplay) && southboundDepartures.appendChild(departureDiv);
                }

            } 
        }
    })
};
