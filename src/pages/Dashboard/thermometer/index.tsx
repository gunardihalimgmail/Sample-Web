import React from 'react'
import FusionCharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import ReactFC from 'react-fusioncharts';
import { formatDate } from '../../../services/functions';
// import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

ReactFC.fcRoot(FusionCharts, Widgets, charts);

const ThermometerFC = ({caption="", value=0, subcaption="", subcaption2=""}) => {
    // chart termometer
    setTimeout(()=>{
        let tspan_trial = document.querySelectorAll("tspan");
        tspan_trial.forEach((ele:any)=>{
            let reg = new RegExp(/(^.*)(FusionCharts XT Trial|undefined)(.*$)/,'gi');
            if (reg.test(ele.textContent)){
                ele.textContent = "";
            }
        })
    },500)  

    let dataSource_Suhu = {
        chart: {
          caption: `${caption}`,
          subcaption: formatDate(new Date(subcaption),'DD MMMM YYYY') + '\n' + formatDate(new Date(subcaption2),'HH:mm'),
          lowerlimit: "0",
          upperlimit: "70",
          numbersuffix: "°C",
          thmfillcolor: "#008ee4",
          showgaugeborder: "1",
          gaugebordercolor: "#008ee4",
          gaugeborderthickness: "2",
          plottooltext: "Temperature: <b>$datavalue</b> ",
          theme: "gammel",
          showvalue: "1",
          // "bgColor": "EEEEEE,CCCCCC",
          "bgColor": "ffffff",
          // "bgColor": "f0f8ff",
          // "borderColor": "#666666",
          "borderThickness": "4",
          // "borderAlpha": "80",
          showBorder:"0",
          thmFillColor: "#29C3BE",
          "showhovereffect": "1",
          "plotFillHoverColor": "#007cc9",
          "baseFont": "Verdana",
          "baseFontSize": "8",
          // "baseFontColor": "#0066cc"
        },
        value: `${value}`
      };
      // ... <end>

    let chartConfigs_Suhu = {
        type: 'thermometer',
        width: 150,
        height: 300,
        dataFormat: 'JSON',
        dataSource: dataSource_Suhu
    };

    return (
        <div>
            <ReactFC {...chartConfigs_Suhu}/>
        </div>
    )
}

export default ThermometerFC