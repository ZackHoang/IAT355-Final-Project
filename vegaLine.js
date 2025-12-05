// vegaLine.js (rewritten clean)
// Line chart: Action anime produced per year (1980–2025)
// vegaLine.js (rewritten clean)
// Line chart: Action anime produced per year (1980–2025)

// vegaLine.js
// Line chart showing how many anime per genre were released each year

// vegaLine.js
// Working Line chart: Number of anime released per genre per year

var genreLineSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Anime count per genre per year",

  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  width: "container",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  transform: [
    // Extract year from Aired column (format: "Sep 1, 2001")
    {
      calculate: "year(toDate(datum.Aired, '%b %d, %Y'))",
      as: "Year",
    },
    { filter: "isValid(datum.Year)" },

    // Split multi-genre strings into array
    {
      calculate: "split(replace(datum.Genres, '\"', ''), ',')",
      as: "GenreArray",
    },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },

    // Group by year + genre, count number of anime
    {
      aggregate: [{ op: "count", as: "AnimeCount" }],
      groupby: ["Year", "OneGenre"],
    },
  ],

  mark: {
    type: "line",
    point: true,
  },

  encoding: {
    x: {
      field: "Year",
      type: "quantitative",
      title: "Year",
    },

    y: {
      field: "AnimeCount",
      type: "quantitative",
      title: "Number of Anime Released",
    },

    color: {
      field: "OneGenre",
      type: "nominal",
      title: "Genre",
    },

    tooltip: [
      { field: "OneGenre", type: "nominal", title: "Genre" },
      { field: "Year", type: "quantitative", title: "Year" },
      { field: "AnimeCount", type: "quantitative", title: "Anime Count" }
    ],
  }
};

// Embed the chart with container 'lineChart'
vegaEmbed("#lineChart", genreLineSpec, { actions: false });
