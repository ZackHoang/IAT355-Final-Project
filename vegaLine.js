var genreLineSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Anime count per genre per year",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",
  height: 350,
  background: "#075AA8",

  config: {
    axis: {
      labelColor: "white",
      titleColor: "white",
      grid: true,
      gridColor: "rgba(255,255,255,0.5)",
      domain: true,
      domainColor: "white",
    },
    view: { stroke: null },
    title: { color: "white" },
  },

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  params: [
    {
      name: "selectedGenre1",
      value: "Action",
      bind: {
        input: "select",
        name: "Genre 1: ",
        options: [
          "None",
          "Action",
          "Adventure",
          "Sci-Fi",
          "Comedy",
          "Drama",
          "Fantasy",
          "Horror",
          "Mystery",
          "Romance",
          "Slice of Life",
          "Sports"
        ],
        style: "color:white;",
      },
    },
    {
      name: "selectedGenre2",
      value: "None",
      bind: {
        input: "select",
        name: "Genre 2: ",
        options: [
          "None",
          "Action",
          "Adventure",
          "Sci-Fi",
          "Comedy",
          "Drama",
          "Fantasy",
          "Horror",
          "Mystery",
          "Romance",
          "Slice of Life",
          "Sports"
        ],
        style: "color:white;",
      },
    },
  ],

  transform: [
    {
      calculate: "year(toDate(split(datum.Aired, ' to ')[0], '%b %d, %Y'))",
      as: "Year",
    },
    { filter: "isValid(datum.Year)" },
    { filter: "datum.Year >= 1975 && datum.Year <= 2022" },

    {
      calculate: "split(replace(datum.Genres, '\"', ''), ',')",
      as: "GenreArray",
    },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },

    { filter: "datum.OneGenre != 'Suspense' && datum.OneGenre != 'Supernatural' && datum.OneGenre != 'Gourmet'" },

    {
      filter:
        "(selectedGenre1 !== 'None' && datum.OneGenre === selectedGenre1) || " +
        "(selectedGenre2 !== 'None' && datum.OneGenre === selectedGenre2)",
    },

    {
      aggregate: [{ op: "count", as: "AnimeCount" }],
      groupby: ["Year", "OneGenre"],
    },

    {
      calculate:
        "datum.OneGenre === selectedGenre1 ? 'Genre1' : " +
        "(datum.OneGenre === selectedGenre2 ? 'Genre2' : null)",
      as: "ColorKey",
    },
  ],

  mark: { type: "line", point: true },

  encoding: {
    x: {
      field: "Year",
      type: "quantitative",
      title: "Year",
      scale: { domain: [1975, 2022] },
      axis: {
        format: "d",
        values: [1975, 1985, 1995, 2005, 2015, 2022],
      },
    },
    y: {
      field: "AnimeCount",
      type: "quantitative",
      title: "Number of Anime Released",
      scale: { domain: [0, 350] },
    },

    color: {
      field: "ColorKey",
      type: "nominal",
      scale: {
        domain: ["Genre1", "Genre2"],
        range: ["#ff5e00", "#008ef3"],
      },
      legend: null,
    },

    tooltip: [
      { field: "OneGenre", type: "nominal" },
      { field: "Year", type: "quantitative" },
      { field: "AnimeCount", type: "quantitative" },
    ],
  },
};

vegaEmbed("#lineChart", genreLineSpec, { actions: false });
