var scatterSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Average Score vs Popularity by Genre",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",
  background: "#075AA8",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  transform: [
    { calculate: "split(replace(datum.Genres, '\"', ''), ',')", as: "GenreArray" },
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
        { op: "count", as: "AnimeCount" }
      ],
      groupby: ["OneGenre"]
    },
    { calculate: "round(datum.AveragePopularity)", as: "AveragePopularity" },
    { calculate: "round(datum.AverageScore * 100) / 100", as: "AverageScore" }
  ],

  mark: { type: "point", filled: true },

  // One checkbox parameter per genre, all checked by default
  params: [
    { name: "Action", value: true, bind: { input: "checkbox", name: "Action" } },
    { name: "Adventure", value: true, bind: { input: "checkbox", name: "Adventure" } },
    { name: "SciFi", value: true, bind: { input: "checkbox", name: "Sci-Fi" } },
    { name: "Comedy", value: true, bind: { input: "checkbox", name: "Comedy" } },
    { name: "Drama", value: true, bind: { input: "checkbox", name: "Drama" } },
    { name: "Fantasy", value: true, bind: { input: "checkbox", name: "Fantasy" } },
    { name: "Gourmet", value: true, bind: { input: "checkbox", name: "Gourmet" } },
    { name: "Horror", value: true, bind: { input: "checkbox", name: "Horror" } },
    { name: "Mystery", value: true, bind: { input: "checkbox", name: "Mystery" } },
    { name: "Romance", value: true, bind: { input: "checkbox", name: "Romance" } },
    { name: "SliceOfLife", value: true, bind: { input: "checkbox", name: "Slice of Life" } },
    { name: "Sports", value: true, bind: { input: "checkbox", name: "Sports" } },
    { name: "Supernatural", value: true, bind: { input: "checkbox", name: "Supernatural" } },
    { name: "Suspense", value: true, bind: { input: "checkbox", name: "Suspense" } }
  ],

  encoding: {
    x: {
      field: "AverageScore",
      type: "quantitative",
      title: "Score",
      scale: { domain: [5.5, 7.5] },
      axis: { domainColor: "white", labelColor: "white", titleColor: "white", tickCount: 21, grid: true, gridColor: "rgba(255,255,255,0.5)" }
    },
    y: {
      field: "AveragePopularity",
      type: "quantitative",
      title: "Popularity",
      scale: { domain: [9000, 4000] },
      axis: { domainColor: "white", labelColor: "white", titleColor: "white", grid: true, gridColor: "rgba(255,255,255,0.5)" }
    },
    color: {
      field: "OneGenre",
      type: "nominal",
      scale: { scheme: "tableau20" },
      legend: null 
    },
        size: { field: "AnimeCount", type: "quantitative", scale: { range: [100, 1800] }, legend: null },
    tooltip: [
      { field: "OneGenre", type: "nominal", title: "Genre" },
      { field: "AverageScore", type: "quantitative", title: "Score" },
      { field: "AveragePopularity", type: "quantitative", title: "Popularity" },
      { field: "AnimeCount", type: "quantitative", title: "Number of Anime" }
    ],
    opacity: {
      condition: [
        {
          test: `
            (datum.OneGenre === "Action" && Action) ||
            (datum.OneGenre === "Adventure" && Adventure) ||
            (datum.OneGenre === "Sci-Fi" && SciFi) ||
            (datum.OneGenre === "Comedy" && Comedy) ||
            (datum.OneGenre === "Drama" && Drama) ||
            (datum.OneGenre === "Fantasy" && Fantasy) ||
            (datum.OneGenre === "Gourmet" && Gourmet) ||
            (datum.OneGenre === "Horror" && Horror) ||
            (datum.OneGenre === "Mystery" && Mystery) ||
            (datum.OneGenre === "Romance" && Romance) ||
            (datum.OneGenre === "Slice of Life" && SliceOfLife) ||
            (datum.OneGenre === "Sports" && Sports) ||
            (datum.OneGenre === "Supernatural" && Supernatural) ||
            (datum.OneGenre === "Suspense" && Suspense)
          `,
          value: 1
        }
      ],
      value: 0.2
    }
  },

  config: {
    view: { stroke: null },
    title: { color: "white" }
  }
};

vegaEmbed("#scatterPlot", scatterSpec, { actions: false });




// var scatterSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v6.json",
//   description: "Average Score vs Popularity by Genre",

//   autosize: {
//     type: "fit-x",
//     contains: "padding",
//     resize: true,
//   },
//   width: "container",
//   background: "#075AA8",

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

//   mark: {
//     type: "point",
//     filled: true 
//   },

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
//       scale: { domain: [5.5, 7.5] },
//       axis: {
//         domain: true,       
//         domainColor: "white",
//         labelColor: "white",
//         titleColor: "white",
//         tickCount: 21, 
//         grid: true,
//         gridColor: "rgba(255,255,255,0.5)",        
//       },
//     },
//     y: {
//       field: "AveragePopularity",
//       type: "quantitative",
//       title: "Popularity",
//       scale: { domain: [9000, 4000] },
//       axis: {
//         domain: true,     
//         domainColor: "white",
//         labelColor: "white",
//         titleColor: "white",
//         grid: true,
//         gridColor: "rgba(255,255,255,0.5)",      
//       },
//     },
//     color: {
//       field: "OneGenre",
//       type: "nominal",
//       title: "Genre",
//       scale: { scheme: "tableau20" }, 
//       legend: {
//         orient: "bottom",
//         direction: "vertical",
//         labelColor: "white",
//         titleColor: "white",
//         fillColor: "#075AA8",
//         padding: 10,
//         offset: 0,
//         strokeColor: null
//       }
//     },
//     size: {
//       field: "AnimeCount",
//       type: "quantitative",
//       title: "Number of Anime",
//       scale: { range: [100, 2000] },
//       legend: {
//         orient: "bottom",
//         direction: "vertical",
//         labelColor: "white",
//         titleColor: "white",
//         fillColor: "#075AA8",
//         symbolFillColor: "white",
//         padding: 10,
//         offset: 0,
//         strokeColor: null
//       },
//     },
//     tooltip: [
//       { field: "OneGenre", type: "nominal", title: "Genre" },
//       { field: "AverageScore", type: "quantitative", title: "Score" },
//       { field: "AveragePopularity", type: "quantitative", title: "Popularity" },
//       { field: "AnimeCount", type: "quantitative", title: "Number of Anime" },
//     ],
//     opacity: {
//       condition: [{ selection: "pointSelect", value: 1}],
//       value: 0.2,
//     },
//   },

//   config: {
//     view: { stroke: null }, 
//     title: { color: "white" },
//   },
// };

// vegaEmbed("#scatterPlot", scatterSpec, { actions: false });



