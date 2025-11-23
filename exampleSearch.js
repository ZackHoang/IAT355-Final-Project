var searchSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Exact-match Anime Score Bar Chart",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",

  data: { url: "./data/anime-dataset-2023.csv" },

  params: [
    {
      name: "animeSearch",
      value: "", // initial empty string
      bind: { input: "text", placeholder: "Type exact anime title..." }
    }
  ],

  transform: [
    { calculate: "toNumber(datum.Score)", as: "ScoreNum" },
    { filter: "isValid(datum.ScoreNum)" },

    // Create a boolean field that is true only if Name exactly matches the param
    {
      calculate: "trim(lower(datum.Name)) === trim(lower(animeSearch))",
      as: "isMatch"
    },

    // Keep only the matching anime
    { filter: "datum.isMatch" }
  ],

   mark: { type: "bar", size: 30 },

  encoding: {
    x: { field: "Name", type: "nominal", title: "Anime Title" },
    y: { field: "ScoreNum", type: "quantitative", title: "Score", scale: { domain: [0, 10] } },
    tooltip: [
      { field: "Name", title: "Anime" },
      { field: "ScoreNum", title: "Score" }
    ]
  }
};

vegaEmbed("#animeBarChart", searchSpec, { actions: false });
