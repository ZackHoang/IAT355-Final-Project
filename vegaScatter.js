var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Average Score vs Popularity by Genre",

  autosize: {
    type: "fit-x",
    contains: "padding",
    resize: true,
  },
  width: "container",
  background: "#075AA8", // updated background

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
    filled: true // fill all points
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
      scale: { scheme: "tableau20" }, // still using tableau20, but fits new background
      legend: {
        orient: "bottom",
        direction: "vertical",
        labelColor: "white",
        titleColor: "white",
        fillColor: "#075AA8", // updated legend background
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
        fillColor: "#075AA8", // updated legend background
        symbolFillColor: "white", // make size legend circles white
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




// var scatterSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v6.json",
//   description: "Average Score vs Popularity by Genre",
//   background: "#008ef3",
//   // autosize: {
//   //   type: "fit-x",
//   //   contains: "padding",
//   //   resize: true,
//   // },
//   // width: "container",

//   data: { url: "./data/anime-dataset-2023-user-gender.csv" },

//   transform: [
//     {
//       calculate: "split(replace(datum.Genres, '\"', ''), ',')",
//       as: "GenreArray",
//     },
//     { flatten: ["GenreArray"] },
//     { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
//     { filter: "datum.OneGenre != ''" },
//     { calculate: "toNumber(datum.Score)", as: "ScoreNum" },
//     { calculate: "toNumber(datum.Popularity)", as: "PopularityNum" },
//     { filter: "isValid(datum.ScoreNum) && isValid(datum.PopularityNum)" },
//     // the dataset no longer has those directly
//     // { filter: "datum.OneGenre != 'Ecchi' && datum.OneGenre != 'Hentai' && datum.OneGenre != 'Erotica' && datum.OneGenre != 'Avant Garde' && datum.OneGenre != 'Award Winning' && datum.OneGenre != 'UNKNOWN' && datum.OneGenre != 'Girls Love' && datum.OneGenre != 'Boys Love'" },
//     {
//       aggregate: [
//         { op: "mean", field: "ScoreNum", as: "AverageScore" },
//         { op: "mean", field: "PopularityNum", as: "AveragePopularity" },
//         { op: "count", as: "AnimeCount" },
//       ],
//       groupby: ["OneGenre"],
//     },
//     { calculate: "round(datum.AveragePopularity)", as: "AveragePopularity" },
//     { calculate: "round(datum.AverageScore * 100) / 100", as: "AverageScore" },
//   ],

//   mark: "point",

//   selection: {
//     pointSelect: {
//       type: "multi",
//       fields: ["OneGenre"],
//       on: "click",
//       toggle: true,
//     },
//   },

//   encoding: {
//     x: {
//       field: "AverageScore",
//       type: "quantitative",
//       title: "Score",
//       scale: { domain: [5.6, 7.4] },
//       axis: {
//         labelColor: "white",
//         titleColor: "white",
//         domainColor: "white",
//         grid: false,
//       },
//     },
//     y: {
//       field: "AveragePopularity",
//       type: "quantitative",
//       title: "Popularity",
//       scale: { domain: [4000, 9000] },
//       axis: {
//         labelColor: "white",
//         titleColor: "white",
//         domainColor: "white",
//         grid: false,
//       },
//     },
//     color: {
//       field: "OneGenre",
//       type: "nominal",
//       title: "Genre",
//       scale: { scheme: "tableau20" },
//       legend: null,
//     },
//     // size: {
//     //   field: "AnimeCount",
//     //   type: "quantitative",
//     //   title: "Number of Anime",
//     //   legend: { values: [0, 1000, 3000, 5000] },
//     // },
//     tooltip: [
//       { field: "OneGenre", type: "nominal", title: "Genre" },
//       { field: "AverageScore", type: "quantitative", title: "Score" },
//       { field: "AveragePopularity", type: "quantitative", title: "Popularity" },
//       { field: "AnimeCount", type: "quantitative", title: "Number of Anime" },
//     ],
//     opacity: {
//       condition: [{ selection: "pointSelect", value: 1 }],
//       value: 0.1,
//     },
//   },
// };

// vegaEmbed("#scatterPlot", scatterSpec, { actions: false });
