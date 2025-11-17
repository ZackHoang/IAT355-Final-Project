var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Average Score vs Popularity by Genre",

  data: {
    url: "./data/anime-dataset-2023.csv"
  },

  transform: [
    {
      calculate: "trim(split(datum.Genres, ',')[0])",
      as: "OneGenre"
    },
    {
      calculate: "toNumber(datum.Score)",
      as: "ScoreNumber"
    },
    {
      calculate: "toNumber(datum.Popularity)",
      as: "PopularityNumber"
    },
    {
      filter: "isValid(datum.ScoreNumber) && isValid(datum.PopularityNumber)"
    },
    {
      filter: "datum.OneGenre != 'Ecchi' && datum.OneGenre != 'Hentai' && datum.OneGenre != 'Erotica'"
    },
    {
      aggregate: [
        { op: "mean", field: "ScoreNumber", as: "AverageScore" },
        { op: "mean", field: "PopularityNumber", as: "AveragePopularity" },
        { op: "count", as: "AnimeCount" }
      ],
      groupby: ["OneGenre"]
    }
  ],

  mark: "point",

  encoding: {
    x: { field: "AverageScore", type: "quantitative", title: "Score" },
    y: { field: "AveragePopularity", type: "quantitative", title: "Popularity" },
    color: { field: "OneGenre", type: "nominal", title: "Genre" },
    size: { field: "AnimeCount", type: "quantitative", title: "Number of Anime" },
    tooltip: [
      { field: "OneGenre", type: "nominal", title: "Genre" },
      { field: "AverageScore", type: "quantitative", title: "Score" },
      { field: "AveragePopularity", type: "quantitative", title: "Popularity" },
      { field: "AnimeCount", type: "quantitative", title: "Number of Anime" }
    ]
  }
};

vegaEmbed("#scatterPlot", scatterSpec);
