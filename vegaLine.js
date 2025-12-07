var genreLineSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Anime count per genre per year",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  params: [
    {
      name: "selectedGenre",
      value: "Action",
      bind: {
        input: "select",
        options: [
          "Action", "Adventure", "Sci-Fi", "Comedy", "Drama", "Fantasy",
          "Gourmet", "Horror", "Mystery", "Romance", "Slice of Life",
          "Sports", "Supernatural", "Suspense"
        ]
      }
    }
  ],

  transform: [
    {
      calculate: "year(toDate(split(datum.Aired, ' to ')[0], '%b %d, %Y'))",
      as: "Year"
    },
    { filter: "isValid(datum.Year)" },

    // Limit year range to 1975–2023
    { filter: "datum.Year >= 1975 && datum.Year <= 2023" },

    {
      calculate: "split(replace(datum.Genres, '\"', ''), ',')",
      as: "GenreArray"
    },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },

    { filter: "datum.OneGenre === selectedGenre" },

    {
      aggregate: [{ op: "count", as: "AnimeCount" }],
      groupby: ["Year", "OneGenre"]
    }
  ],

  mark: { type: "line", point: true },

  encoding: {
    x: {
      field: "Year",
      type: "quantitative",
      title: "Year",
      scale: { domain: [1975, 2023] },
      axis: { format: "d" }
    },

    y: {
      field: "AnimeCount",
      type: "quantitative",
      title: "Number of Anime Released"
    },

    // Legend removed by setting legend: null
    color: {
      field: "OneGenre",
      type: "nominal",
      legend: null
    },

    tooltip: [
      { field: "OneGenre", type: "nominal" },
      { field: "Year", type: "quantitative" },
      { field: "AnimeCount", type: "quantitative" }
    ]
  }
};

vegaEmbed("#lineChart", genreLineSpec, { actions: false });
