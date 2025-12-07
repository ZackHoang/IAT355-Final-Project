let topVODBrands = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "a",
  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  width: "container",
  background: "#313131",

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

  mark: {
    type: "bar",
  },

  encoding: {
    x: {
      field: "percentage",
      type: "quantitative",
      axis: {
        title: "Percentages of respondents",
        labelColor: "white",
        titleColor: "white",
      },
    },
    y: {
      field: "brand",
      type: "ordinal",
      axis: {
        title: "Brand",
        labelColor: "white",
        titleColor: "white",
      },
      scale: {
        padding: 0.25,
      },
      sort: { field: "percentage", order: "descending" },
    },
    color: {
      condition: {
        test: "datum.brand !== 'Crunchyroll'",
        value: "#D3D3D3",
      },
      value: "#FF6600",
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
};

vegaEmbed("#brands-vis", topVODBrands);
