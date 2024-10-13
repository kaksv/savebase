import { useEffect } from "react";
import ApexCharts from "apexcharts";
const CampaignChart = ({ data }) => {
    useEffect(() => {
      if (data && data.length > 0) {
        const options = {
          chart: {
            type: 'pie',
          },
          labels: data.map(item => item.owner),
          series: data.map(item => item.amount),
        };
  
        const chart = new ApexCharts(document.getElementById('apex-pie-chart'), options);
        chart.render();
  
        return () => chart.destroy();
      }
    }, [data]);
  
    return <div id="apex-pie-chart" />;
  };

  const SafeChart = ({ data }) => {
    useEffect(() => {
      if (data && data.length > 0) {
        const options = {
          chart: {
            type: 'pie',
          },
          labels: data.map(item => item.owner),
          series: data.map(item => item.amount/1e18),
          
        };
  
        const chart = new ApexCharts(document.getElementById('apex-pie-chart2'), options);
        chart.render();
  
        return () => chart.destroy();
      }
    }, [data]);
  
    return <div id="apex-pie-chart2" />;
  };
  
  export  {CampaignChart,SafeChart};

  