let stationSelectionContainer = document.querySelector('#station-selection');

function generateStations() {
    fetch('https://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y')
    .then(response => response.json())
    .then(data => {
        let stationList = data.root.stations.station; 
        for (let i = 0; i < stationList.length; i++) {
            let stationName = stationList[i]['name'];
            let station = document.createElement('option');
            station.value = stationName; 
            station.textContent = stationName; 
            stationSelectionContainer.appendChild(station);
         }
    }
)};

generateStations(); 