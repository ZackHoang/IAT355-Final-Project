var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Average Score vs Popularity by Genre",

  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  width: "container",
  background: "#075AA8",

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

  mark: {
    type: "point",
    filled: true 
  },

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
      scale: { domain: [5.5, 7.5] },
      axis: {
        domain: true,       
        domainColor: "white",
        labelColor: "white",
        titleColor: "white",
        tickCount: 21, 
        grid: true,
        gridColor: "rgba(255,255,255,0.5)",        
      },
    },
    y: {
      field: "AveragePopularity",
      type: "quantitative",
      title: "Popularity",
      scale: { domain: [9000, 4000] },
      axis: {
        domain: true,     
        domainColor: "white",
        labelColor: "white",
        titleColor: "white",
        grid: true,
        gridColor: "rgba(255,255,255,0.5)",      
      },
    },
    color: {
      field: "OneGenre",
      type: "nominal",
      title: "Genre",
      scale: { scheme: "tableau20" }, 
      legend: {
        orient: "bottom",
        direction: "vertical",
        labelColor: "white",
        titleColor: "white",
        fillColor: "#075AA8",
        padding: 10,
        offset: 0,
        strokeColor: null
      }
    },
    size: {
      field: "AnimeCount",
      type: "quantitative",
      title: "Number of Anime",
      scale: { range: [100, 2000] },
      legend: {
        orient: "bottom",
        direction: "vertical",
        labelColor: "white",
        titleColor: "white",
        fillColor: "#075AA8",
        symbolFillColor: "white",
        padding: 10,
        offset: 0,
        strokeColor: null
      },
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

  config: {
    view: { stroke: null }, 
    title: { color: "white" },
  },
};

vegaEmbed("#scatterPlot", scatterSpec, { actions: false });



