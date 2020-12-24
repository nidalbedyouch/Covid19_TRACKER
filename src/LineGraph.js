import React, {useState, useEffect} from 'react';
import {buildChartData} from './utils';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

function LineGraph({className,casesType = 'cases'}) {
    const [data, setData] = useState([]);
    //https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect( () => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data,casesType);
                setData(chartData);
            });
        }
        fetchData();
    }, [casesType]);


    return (
        <div className={className}>
            {data?.length > 0 && (
                 <Line data={{
                datasets: [{
                    backgroundColor : "rgba(204,16,52,0.5)",
                    borderColor : "#CC1034",
                    data : data
                }]
            }}
            options = {options} />
            )}
           
        </div>
    )
}

export default LineGraph
