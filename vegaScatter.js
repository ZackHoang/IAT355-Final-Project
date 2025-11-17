var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Average Score vs Popularity by Genre",

  data: { url: "./data/anime-dataset-2023.csv" },

  transform: [
    // counting only the first genre in the csv file
    // { calculate: "trim(split(datum.Genres, ',')[0])", as: "OneGenre" }, 

    // countring each anime for each genre it specified -> used chatGPT to do array version
    { calculate: "split(replace(datum.Genres, '\"', ''), ',')", as: "GenreArray"},
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },

    //numbers are not stored as calculable numbers so had to convert for score and popularity
    { calculate: "toNumber(datum.Score)", as: "ScoreNum" },
    { calculate: "toNumber(datum.Popularity)", as: "PopularityNum" },
    //filters out invalid values in score and popularity
    { filter: "isValid(datum.ScoreNum) && isValid(datum.PopularityNum)" },
    //filtered out nsfw or offensive genres as well as genres that are not the ones we would consider on the list
    { filter: "datum.OneGenre != 'Ecchi' && datum.OneGenre != 'Hentai' && datum.OneGenre != 'Erotica' && datum.OneGenre != 'Avant Garde' && datum.OneGenre != 'Award Winning' && datum.OneGenre != 'UNKNOWN' && datum.OneGenre != 'Girls Love' && datum.OneGenre != 'Boys Love'" },
    //averages out score and popularity, giving the final values for each Genre
    {
      aggregate: [
        { op: "mean", field: "ScoreNum", as: "AverageScore" },
        { op: "mean", field: "PopularityNum", as: "AveragePopularity" },
        { op: "count", as: "AnimeCount" }
      ],
      groupby: ["OneGenre"]
    },
    //round numbers for score and popularity
    { calculate: "round(datum.AveragePopularity)", as: "AveragePopularity" },
    { calculate: "round(datum.AverageScore * 100) / 100", as: "AverageScore" }
  ],

  //allows for particular selection of categories
  selection: {
    genreFilter: {
      type: "multi",
      fields: ["OneGenre"],
      bind: "legend"
    }
  },

  mark: "point",

  //view model of the scatterplot
  encoding: {
    x: { field: "AverageScore", type: "quantitative", title: "Score", scale: { domain: [5.6, 7.4] } },
    y: { field: "AveragePopularity", type: "quantitative", title: "Popularity",   scale: {domain: [4000, 9000]} },
    color: { field: "OneGenre", type: "nominal", title: "Genre", scale: { scheme: "tableau20" } },
    size: { field: "AnimeCount", type: "quantitative", title: "Number of Anime", legend: {values: [0, 1000, 3000, 5000]} },
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

vegaEmbed("#scatterPlot", scatterSpec, { actions: false });
