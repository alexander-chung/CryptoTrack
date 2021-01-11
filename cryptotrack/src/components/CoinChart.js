import React, {useState, useEffect} from 'react'
import {Line} from '@reactchartjs/react-chart.js'
import './CoinChart.css';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Chart } from 'react-chartjs-2';



export default function CoinChart({id, coinData}) {
  const {day, week, month, details} = coinData
  const [timeFormat, setTimeFormat] = useState('day')


  const formatTime = () => {
    switch (timeFormat) {
      case 'day':
        return day
      case 'week':
        return week
      case 'month':
        return month
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
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
          ctx.restore();
        }
      }
    });
  }, [])

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  const data = {
    datasets: [
      {
        label: '$',
        data: formatTime(),
        // backgroundColor: "rgb(64,150,233, 0.1)",
        borderColor: 'rgb(80,150,255)',
        borderWidth: 1.5,
        pointRadius: 0,
        pointHitRadius: 0
      },
    ]
  }
  
  const options = {
    
    title: {
      display: true,
      text: `${id.charAt(0).toUpperCase() + id.slice(1)} Chart`,
      fontColor: 'white',
      fontSize: 18,
    },
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
      intersect: false,
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
            fontColor: "white",
          },
        },
      ],
      yAxes: [{
          ticks: {
            fontColor: "white"
          },
          gridLines: {
            color: "#ffffff",
          }
        }
      ]
    }
  }

  return (
    <>
      <div className='coin-chart'>
        <ButtonGroup color="primary" aria-label="primary button group" className='history-buttons'>
            <Button style={{backgroundColor: timeFormat === "day" ? '#42a4f5' : 'transparent'}} onClick={() => setTimeFormat('day')}>1d</Button>
            <Button style={{backgroundColor: timeFormat === "week" ? '#42a4f5' : 'transparent'}} onClick={() => setTimeFormat('week')}>7d</Button>
            <Button style={{backgroundColor: timeFormat === "month" ? '#42a4f5' : 'transparent'}} onClick={() => setTimeFormat('month')}>30d</Button>
        </ButtonGroup>
        <Line 
          data={data}
          options={options}
          />
      </div>
    </>
  )
}
