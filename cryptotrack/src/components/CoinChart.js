import React, {useState, useEffect} from 'react'
import {Line} from '@reactchartjs/react-chart.js'
import './CoinChart.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Chart } from 'react-chartjs-2';


export default function CoinChart({id, coinData}) {
  const {day, week, month, year, details} = coinData
  const [timeFormat, setTimeFormat] = useState('day')

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const formatTime = () => {
    switch (timeFormat) {
      case 'day':
        return day
      case 'week':
        return week
      case 'month':
        return month
      case 'year':
        return year
      default:
        return day
    }
  }

  useEffect(() => {
    Chart.pluginService.register({
      afterDraw: function(chart, easing) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const activePoint = chart.controller.tooltip._active[0];
          const ctx = chart.ctx;
          const x = activePoint.tooltipPosition().x;
          const topY = chart.scales['y-axis-0'].top;
          const bottomY = chart.scales['y-axis-0'].bottom;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#808080";
          ctx.setLineDash([5])
          ctx.stroke();
          ctx.restore();
        }
      }
    });
  }, [])

  const data = {
    datasets: [
      {
        label: '$',
        data: formatTime(),
        backgroundColor: "rgb(64,150,233, 0.1)",
        borderColor: 'rgb(80,150,255)',
        borderWidth: 1.5,
        pointRadius: 0,
        // pointHitRadius: 0
      },
    ]
  }
  
  const options = {
    // title: {
    //   display: false,
    //   text: `${id.charAt(0).toUpperCase() + id.slice(1)} Chart`,
    //   fontColor: 'black',
    //   fontSize: 18,
    // },
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (tooltipItem, data) =>  {
          return "Price: " + numberWithCommas(tooltipItem.yLabel.toFixed(2));
        },
      }
   },

   hover: {
      mode: 'index',
      intersect: true,
   },
    legend: {
      display: false
    },
    animation: {
      display: true,
      duration: 500
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
          type: "time",
          time: {
            tooltipFormat:'MM/DD/YYYY HH:mm',
          },
          distribution: "linear",
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            fontColor: "black",
          },
        },
      ],
      yAxes: [{
          ticks: {
            fontColor: "black",
          },
          gridLines: {
            color: "black",
            lineWidth: 0.25
          }
        }
      ]
    }
  }

  return (
    <div className='coin-chart'>
      <ButtonGroup color="primary" aria-label="primary button group" className='history-buttons'>
          <Button className={timeFormat === "day" ? 'active-button' : 'regular-button'} onClick={() => setTimeFormat('day')}>1d</Button>
          <Button className={timeFormat === "week" ? 'active-button' : 'regular-button'} onClick={() => setTimeFormat('week')}>7d</Button>
          <Button className={timeFormat === "month" ? 'active-button' : 'regular-button'} onClick={() => setTimeFormat('month')}>30d</Button>
          <Button className={timeFormat === "year" ? 'active-button' : 'regular-button'} onClick={() => setTimeFormat('year')}>1Y</Button>
      </ButtonGroup>
      <Line 
          data={data}
          options={options}
          />
    </div>
  )
}
