var genreLineSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Anime count per genre per year",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  params: [
    {
      name: "selectedGenre1",
      value: "Action",
      bind: {
        input: "select",
        options: [
          "Action", "Adventure", "Sci-Fi", "Comedy", "Drama", "Fantasy",
          "Gourmet", "Horror", "Mystery", "Romance", "Slice of Life",
          "Sports", "Supernatural", "Suspense"
        ]
      }
    },
    {
      name: "selectedGenre2",
      value: "Comedy",
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
    { filter: "datum.Year >= 1975 && datum.Year <= 2023" },
    {
      calculate: "split(replace(datum.Genres, '\"', ''), ',')",
      as: "GenreArray"
    },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },
    
    // Only keep rows matching either selected genre
    { filter: "datum.OneGenre === selectedGenre1 || datum.OneGenre === selectedGenre2" },

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
      axis: { format: "d" } // removes commas
    },
    y: {
      field: "AnimeCount",
      type: "quantitative",
      title: "Number of Anime Released"
    },
    color: {
      field: "OneGenre",
      type: "nominal",
      title: "Genre"
    },
    tooltip: [
      { field: "OneGenre", type: "nominal" },
      { field: "Year", type: "quantitative" },
      { field: "AnimeCount", type: "quantitative" }
    ]
  }
};

vegaEmbed("#lineChart", genreLineSpec, { actions: false });
