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
  height: "container",
  transform: [{ calculate: "datum.percentage + '%'", as: "percentageLabel" }],

  layer: [
    {
      mark: {
        type: "bar",
        // size: 35,
      },

      encoding: {
        x: {
          field: "percentage",
          type: "quantitative",
          axis: {
            title: "Percentages of respondents",
            labelColor: "white",
            titleColor: "white",
            tickCount: 12,
            labelFontSize: 18,
            titleFontSize: 18,
          },
        },
        y: {
          field: "brand",
          type: "ordinal",
          axis: {
            title: "Brand",
            labelColor: "white",
            titleColor: "white",
            labelFontSize: 18,
            titleFontSize: 18,
          },
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
};

vegaEmbed("#brands-vis", topVODBrands, { actions: false });
