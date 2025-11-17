var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Average Score vs Popularity by Genre with interactive legend filtering",

  data: { url: "./data/anime-dataset-2023.csv" },

  transform: [
    { calculate: "trim(split(datum.Genres, ',')[0])", as: "OneGenre" },
    { calculate: "toNumber(datum.Score)", as: "ScoreNum" },
    { calculate: "toNumber(datum.Popularity)", as: "PopularityNum" },
    { filter: "isValid(datum.ScoreNum) && isValid(datum.PopularityNum)" },
    { filter: "datum.OneGenre != 'Ecchi' && datum.OneGenre != 'Hentai' && datum.OneGenre != 'Erotica'" },
    {
      aggregate: [
        { op: "mean", field: "ScoreNum", as: "AverageScore" },
        { op: "mean", field: "PopularityNum", as: "AveragePopularity" },
        { op: "count", as: "AnimeCount" }
      ],
      groupby: ["OneGenre"]
    }
  ],

  selection: {
    genreFilter: {
      type: "multi",
      fields: ["OneGenre"],
      bind: "legend"
    }
  },

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
    ],
    opacity: {
      condition: { selection: "genreFilter", value: 1 },
      value: 0.1
    }
  }
};

vegaEmbed("#scatterPlot", scatterSpec);
