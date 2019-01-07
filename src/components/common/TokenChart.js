import React from "react";
import ReactEcharts from "echarts-for-react";
import { Row, Col } from "../../helpers/react-flexbox-grid";
import { Colors } from "../../helpers/numberHelpers";

const getOption = tokenBalance => {
  const tokenCountData = [];
  const tokenDollarData = [];
  const legendData = ["balance", "dollar Value"];
  for (const key in tokenBalance) {
    if (Object.prototype.hasOwnProperty.call(tokenBalance, key)) {
      tokenCountData.push({ value: tokenBalance[key].balance, name: key });
      tokenDollarData.push({ value: tokenBalance[key].dollarValue, name: key });
    }
  }
  return {
    color: Colors(tokenCountData.length),
    tooltip: {
      trigger: "item",
      // formatter(params) {
      //   const seriesI =
      //     params.seriesIndex === 2 || params.seriesIndex === 0
      //       ? `$${formatCurrencyNumber(params.value, 0)}`
      //       : `${formatCurrencyNumber(params.value, 0)}`;
      //   const seriesEther = params.seriesIndex === 2 ? `<br/>${significantDigits(params.value / etherPrice)} ETH` : ``;
      //   return `${params.seriesName} <br/>${params.name}: ${seriesI} (${params.percent}%)${seriesEther}`;
      // },
      textStyle: { fontFamily: "Montserrat", fontSize: "14" }
    },
    legend: {
      show: false,
      orient: "vertical",
      x: "right",
      data: legendData
    },
    series: [
      {
        name: "Token Value ($)",
        type: "pie",
        selectedMode: "single",
        radius: ["0%", "35%"],
        label: {
          show: false
        },
        data: tokenDollarData
      },
      {
        name: "Token Count",
        type: "pie",
        radius: ["55%", "80%"],
        label: {
          show: false
        },
        data: tokenCountData
      }
    ]
  };
};

const TokenChart = props => {
  const { tokenBalance } = props || {};
  return (
    <div>
      <div className="txt-xxxl text--primary">Portfolio Distribution Chart</div>
      <Row>
        <Col xs={12} lg={6}>
          <div>
            <ReactEcharts
              option={getOption(tokenBalance)}
              notMerge
              lazyUpdate
              style={{ height: "30em", width: "30em", padding: "0px" }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TokenChart;
