let topVODBrands = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  background: "#191919",
  data: {
    values: [
      { brand: "Starz", percentage: 73 },
      { brand: "Discovery+", percentage: 70 },
      { brand: "PlayStation Store", percentage: 68 },
      { brand: "Sling TV", percentage: 66 },
      { brand: "Microsoft Store", percentage: 65 },
      { brand: "Fandango (Vudu)", percentage: 60 }, 
      { brand: "MGM+", percentage: 56 },
      { brand: "Crunchyroll", percentage: 50 },
    ],
  },
  autosize: { type: "fit", contains: "padding", resize: true },
  width: "container",
  height: 400,
  transform: [{ calculate: "datum.percentage + '%'", as: "percentageLabel" }],

  layer: [
    {
      mark: {
        type: "bar",
        size: 35,
      cornerRadiusTopRight: 5,
      cornerRadiusBottomRight: 5,
      cornerRadiusTopLeft: 0,
      cornerRadiusBottomLeft: 0
      },
      encoding: {
        x: {
          field: "percentage",
          type: "quantitative",
          axis: {
            title: "Respondents (%)",
            titleColor: "white",
            labelColor: "white",
            tickCount: 12,
            labelFontSize: 18,
            titleFontSize: 18,
            gridColor: "#8F8F8F",
            gridWidth: 2,
            domain: false,
          },
        },
        y: {
          field: "brand",
          type: "ordinal",
          axis: null,
          // axis: {
          //   title: null,
          //   labelColor: "white",
          //   labelFontSize: 18,
          //   titleFontSize: 18,
          //   domain: false,
          // },
          scale: {
            padding: 0.2,
          },
          sort: { field: "percentage", order: "descending" },
        },
        color: {
          condition: {
            test: "datum.brand !== 'Crunchyroll'",
            value: "white",
          },
          value: "#008EF3",
        },
        tooltip: [
          {
            field: "brand",
            type: "ordinal",
            title: "Brand",
          },
          {
            field: "percentage",
            type: "quantitative",
            title: "Percentages of respondents",
          },
        ],
      },
    },
    {
      mark: {
        type: "text",
        align: "left",
        baseline: "middle",
        dx: 5,
        fontSize: 18,
        fill: "black",
      },
      encoding: {
        x: { value: 0 },
        y: {
          field: "brand",
          type: "ordinal",
          sort: { field: "percentage", order: "descending" },
        },
        text: { field: "brand" },
      },
    },
    {
      mark: {
        type: "text",
        align: "right",
        baseline: "middle",
        dx: -4,
        fill: "black",
        fontSize: 18,
      },
      encoding: {
        x: { field: "percentage", type: "quantitative" },
        y: {
          field: "brand",
          type: "ordinal",
          sort: { field: "percentage", order: "descending" },
        },
        text: { field: "percentageLabel" },
      },
    },
  ],

  config: {
    view: {
      stroke: "transparent",
    },
  },
};

vegaEmbed("#brands-vis", topVODBrands, { actions: false });
