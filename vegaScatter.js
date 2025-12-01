var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Average Score vs Popularity by Genre",

  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  width: "container",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  transform: [
    {
      calculate: "split(replace(datum.Genres, '\"', ''), ',')",
      as: "GenreArray",
    },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },
    { calculate: "toNumber(datum.Score)", as: "ScoreNum" },
    { calculate: "toNumber(datum.Popularity)", as: "PopularityNum" },
    { filter: "isValid(datum.ScoreNum) && isValid(datum.PopularityNum)" },
    // the dataset no longer has those directly
    // { filter: "datum.OneGenre != 'Ecchi' && datum.OneGenre != 'Hentai' && datum.OneGenre != 'Erotica' && datum.OneGenre != 'Avant Garde' && datum.OneGenre != 'Award Winning' && datum.OneGenre != 'UNKNOWN' && datum.OneGenre != 'Girls Love' && datum.OneGenre != 'Boys Love'" },
    {
      aggregate: [
        { op: "mean", field: "ScoreNum", as: "AverageScore" },
        { op: "mean", field: "PopularityNum", as: "AveragePopularity" },
        { op: "count", as: "AnimeCount" },
      ],
      groupby: ["OneGenre"],
    },
    { calculate: "round(datum.AveragePopularity)", as: "AveragePopularity" },
    { calculate: "round(datum.AverageScore * 100) / 100", as: "AverageScore" },
  ],

  mark: "point",

  selection: {
    pointSelect: {
      type: "multi",
      fields: ["OneGenre"],
      on: "click",
      toggle: true,
    },
  },

  encoding: {
    x: {
      field: "AverageScore",
      type: "quantitative",
      title: "Score",
      scale: { domain: [5.6, 7.4] },
    },
    y: {
      field: "AveragePopularity",
      type: "quantitative",
      title: "Popularity",
      scale: { domain: [4000, 9000] },
    },
    color: {
      field: "OneGenre",
      type: "nominal",
      title: "Genre",
      scale: { scheme: "tableau20" },
    },
    size: {
      field: "AnimeCount",
      type: "quantitative",
      title: "Number of Anime",
      legend: { values: [0, 1000, 3000, 5000] },
    },
    tooltip: [
      { field: "OneGenre", type: "nominal", title: "Genre" },
      { field: "AverageScore", type: "quantitative", title: "Score" },
      { field: "AveragePopularity", type: "quantitative", title: "Popularity" },
      { field: "AnimeCount", type: "quantitative", title: "Number of Anime" },
    ],
    opacity: {
      condition: [{ selection: "pointSelect", value: 1 }],
      value: 0.1,
    },
  },
};

let crunchyrollsubscriptionsSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  title: "a",
  // chart was not displaying properly due to long title, deadass
  // title:
  //   "Number of Crunchyroll paying subscriptionscribers worldwide from September 2012 to June 2024",
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
      },
      sort: { field: "subscriptions", order: "descending" },
    },
    x: {
      field: "subscriptions",
      type: "quantitative",
      axis: { title: "Number of subscribers in millions" },
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
vegaEmbed("#scatterPlot", scatterSpec, { actions: false });
