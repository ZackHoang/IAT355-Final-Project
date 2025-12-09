let crunchyrollsubscriptionsSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  background: "#191919",
  description:
    "Number of Crunchyroll paying subscriptionscribers worldwide from September 2012 to June 2024",
  
  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",
  height: 300,
  data: {
    values: [
      { year: "Sep 2012", subscriptions: 0.1 },
      { year: "Mar 2013", subscriptions: 0.2 },
      { year: "Nov 2014", subscriptions: 0.4 },
      { year: "Nov 2015", subscriptions: 0.75 },
      { year: "Feb 2017", subscriptions: 1 },
      { year: "Nov 2018", subscriptions: 2 },
      { year: "Jul 2020", subscriptions: 3 },
      { year: "Feb 2021", subscriptions: 4 },
      { year: "Aug 2021", subscriptions: 5 },
      { year: "Jan 2024", subscriptions: 13 },
      { year: "Jun 2024", subscriptions: 15 },
    ],
  },
  transform: [
    { calculate: "datum.subscriptions + ' millions'", as: "subsLabel" },
  ],
  layer: [
    {
      mark: {
        type: "line",
        cornerRadius: 5,
      },
      encoding: {
        x: {
          field: "year",
          type: "ordinal",
          axis: {
            title: null,
            labelColor: "white",
            titleColor: "white",
            labelFontSize: 18,
            titleFontSize: 18,
          },
          scale: {
            padding: 0.25,
          },
          sort: { field: "subscriptions", order: "ascending" },
        },
        y: {
          field: "subscriptions",
          type: "quantitative",
          axis: {
            title: null,
            labelColor: "white",
            tickCount: 12,
            labelFontSize: 18,
            titleFontSize: 18,
            gridColor: "#8F8F8F",
            gridWidth: 2,
            domain: false,
          },
        },
        color: {
          value: "#008EF3",
        },
        tooltip: [
          {
            field: "subscriptions",
            type: "quantitative",
            title: "Subscriptions (in millions)",
          },
          {
            field: "year",
            type: "ordinal",
            title: "Year",
          },
        ],
      },
    },
    // {
    //   mark: {
    //     type: "text",
    //     align: "left",
    //     baseline: "middle",
    //     dx: 4,
    //     fontSize: 18,
    //     color: "white",
    //   },
    //   encoding: {
    //     x: { field: "subscriptions", type: "quantitative" },
    //     y: {
    //       field: "year",
    //       type: "ordinal",
    //       sort: { field: "subscriptions", order: "ascending" },
    //     },
    //     text: { field: "subsLabel" },
    //   },
    // },
  ],

  config: {
    view: {
      stroke: "transparent",
    },
  },
};

vegaEmbed("#crunchyroll-subscriptions", crunchyrollsubscriptionsSpec, {
  actions: false,
});
