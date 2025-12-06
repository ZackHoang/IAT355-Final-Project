let crunchyrollsubscriptionsSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  background: "#313131",
  description:
    "Number of Crunchyroll paying subscriptionscribers worldwide from September 2012 to June 2024",
  width: "container",
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
  mark: {
    type: "bar",
  },
  encoding: {
    y: {
      field: "year",
      type: "ordinal",
      axis: {
        title: "Year",
        labelColor: "white",
        titleColor: "white",
      },
      scale: {
        padding: 0.25,
      },
      sort: { field: "subscriptions", order: "descending" },
    },
    x: {
      field: "subscriptions",
      type: "quantitative",
      axis: {
        title: "Subscribers in millions",
        labelColor: "white",
        titleColor: "white",
      },
    },
    color: {
      condition: {
        test: "datum.year !== 'Jun 2024'",
        value: "#D3D3D3",
      },
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
};

vegaEmbed("#crunchyroll-subscriptions", crunchyrollsubscriptionsSpec);
