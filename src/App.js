import { FormControl,Select,MenuItem, Card, CardContent} from "@material-ui/core";
import React, {useState,useEffect} from "react";
import InfoBox from "./InfoBox";
import CovidMap from "./CovidMap";
import Table from "./Table";
import LineGraph from './LineGraph';
import numeral from "numeral";
import { sortData, prettyPrintStat} from "./utils";
import "leaflet/dist/leaflet.css";
import './App.css';


function App() {
  const [countries, setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);


  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data =>{ 
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        setMapCountries(data);
        const countries = data.map((country) => (
          {
            name : country.country,
            value : country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
      });
    }
    getCountriesData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
    const url = countryCode === 'worldwide'
     ? 'https://disease.sh/v3/covid-19/all' 
     : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(response => response.json())
    .then(data =>{ 
      setCountry(countryCode);
      //All of the data from the county response
      setCountryInfo(data);
      var centerCoord = [34.80746,-40.4796]
      var zoom = 3
      if(countryCode !== 'worldwide'){
        centerCoord = [data.countryInfo.lat, data.countryInfo.long]
        zoom = 4
      }
      setMapCenter(centerCoord);
      setMapZoom(zoom);
    });
  };

  const onCasesTypeChange =  (event) => {
      setCasesType(event.target.value);
  };

  return (
    <div className="app">
      <div className="app_left">
          {/* Header */}
          {/* Title + Select input dropdown field */}
          <div className="app_header">
            <h1> Covid-19 Tracker</h1>
            <FormControl className="app_dropdrown">
              <Select
                variant = "outlined"
                value = {country}
                onChange = {onCountryChange}
                >
                {/* Loop Through all the countries and show a drop dowsn list of options */}
                <MenuItem value="worldwide">WorldWide</MenuItem>
                {
                  countries.map( (country,i) => (
                    <MenuItem value={country.value} key={i}>{country.name}</MenuItem>
                  ))
                }
              </Select>

            </FormControl>
          </div>
     
          <div className="app_stats">
            {/* InfoBoxes title = "Coronavirus Cases*/}
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              isRed
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
            />
            {/* InfoBoxes title = "Coronavirus recoveries*/}
            <InfoBox
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              active={casesType === "recovered"}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={numeral(countryInfo.recovered).format("0.0a")}
            />
            {/* InfoBoxes title */}
            <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              isRed
              active={casesType === "deaths"}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
            />
          </div>
          {/* Map  */}
          <CovidMap countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={casesType}/>        
      </div>
      
      <Card className="app_right">
        <CardContent>
            {/* Table  */}
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            {/* Graph  */}
            <div className="app_right_lineChart">
              <h3 className="app_graphTitle">WorldWide new {casesType}</h3> 
              <Select
                variant = "outlined"
                value = {casesType}
                onChange = {onCasesTypeChange}
                >
                {/* Loop Through all the countries and show a drop dowsn list of options */}
                <MenuItem value="cases">cases</MenuItem>
                <MenuItem value="deaths">deaths</MenuItem>
                <MenuItem value="recovered">recovered</MenuItem>
              </Select>
            </div>
            <LineGraph className="app_graph" casesType = {casesType}/>
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
