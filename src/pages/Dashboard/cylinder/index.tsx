import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import Widgets from 'fusioncharts/fusioncharts.widgets';
import React from 'react'
import ReactFC from 'react-fusioncharts';
import { formatDate } from '../../../services/functions';

ReactFC.fcRoot(FusionCharts, Widgets, Charts);

const CylinderFC = ({caption="", value=0, 
                        plottooltext_hover=""
                        ,subcaption="", subcaption2=""}) => {
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

    let dataSource = {
        chart: {
          caption: `${caption}`,
          subcaption: formatDate(new Date(subcaption),'DD MMMM YYYY') + '\n' + formatDate(new Date(subcaption2),'HH:mm'),
          // subcaption: "(Real Time)",
          lowerlimit: "0",
          upperlimit: "6000000",
          numbersuffix: " kg",
        //   thmfillcolor: "#008ee4",
          showgaugeborder: "1",
          gaugebordercolor: "#008ee4",
          gaugeborderthickness: "2",
          plottooltext: `${plottooltext_hover} : <b>$datavalue</b> `,
          theme: "gammel",
          showvalue: "1",
          // "bgColor": "EEEEEE,CCCCCC",
          "bgColor": "ffffff",
          // "bgColor": "f0f8ff",
          // "borderColor": "#666666",
          "borderThickness": "4",
          // "borderAlpha": "80",
          showBorder:"0",
          thmFillColor: "#f39801",
          "showhovereffect": "1",
          "plotFillHoverColor": "fbdb01",
          "baseFont": "Verdana",
          "baseFontSize": "8",
          lowerLimitdisplay: "Empty",
          // upperlimitdisplay: "Full",
          // "baseFontColor": "#0066cc"
        },
        value: `${value}`
      };
      // ... <end>

    let chartConfigs = {
        type: 'cylinder',
        width: 180,
        height: 300,
        dataFormat: 'JSON',
        dataSource: dataSource
    };

    return (
        <div>
            <ReactFC {...chartConfigs}/>
        </div>
    )
}

export default CylinderFC