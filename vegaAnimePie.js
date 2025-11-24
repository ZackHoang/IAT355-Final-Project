var searchPieSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Exact-match Anime Reviewer Gender Pie Chart",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  params: [
    {
      name: "animeSearch",
      value: "",
      bind: { input: "text", placeholder: "Type exact anime title..." }
    }
  ],

  transform: [
    { calculate: "trim(lower(datum.Name)) === trim(lower(animeSearch))", as: "isMatch" },
    { filter: "datum.isMatch" },
    { calculate: "datum.number_of_male_reviewers", as: "Male" },
    { calculate: "datum.number_of_female_reviewers", as: "Female" },
    { fold: ["Male", "Female"], as: ["Gender", "Count"] },
    { filter: "datum.Count > 0" }
  ],

  mark: "arc",

  encoding: {
    theta: { field: "Count", type: "quantitative" },
    color: { field: "Gender", type: "nominal", scale: { range: ["#1f77b4", "#ff7f0e"] } },
    tooltip: [
      { field: "Gender", type: "nominal", title: "Gender" },
      { field: "Count", type: "quantitative", title: "Number of Reviewers" }
    ]
  }
};

vegaEmbed("#animePieChart", searchPieSpec, { actions: false });
