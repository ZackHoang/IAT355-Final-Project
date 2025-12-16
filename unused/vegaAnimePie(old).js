
var searchPieSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Anime Reviewer Gender Pie Chart with Anime/Genre Toggle",

  autosize: { type: "fit-x", contains: "padding", resize: true },
  width: "container",
  height: 450,
  background: "#008ef3",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },


  params: [
    {
      name: "viewMode",     
      value: "anime",     
      bind: {
        input: "select",
        options: ["anime", "genre"],
        labels: ["Anime Chart", "Genre Chart"], 
        name: "Chart Type Selection"    
      }
    },

    {
      name: "animeSearch", 
      value: "Trigun",
      bind: {
        input: "text",
        placeholder: "Anime Search",
        name: "Search Anime"  
      }
    },

    {
      name: "selectedGenre", 
      value: "Action",       
      bind: {
        input: "select",
        options: [
          "Action","Adventure","Sci-Fi","Comedy","Drama","Fantasy","Gourmet","Horror","Mystery","Romance","Slice of Life","Sports","Supernatural","Suspense"
        ],
        labels: [
          "Action","Adventure","Sci-Fi","Comedy","Drama","Fantasy","Gourmet","Horror","Mystery","Romance","Slice of Life","Sports","Supernatural","Suspense"
        ],            
        name: "Select Genre"
      }
    }
  ],


  transform: [
    { calculate: "split(replace(datum.Genres, '\"', ''), ',')", as: "GenreArray" },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },
    {
      calculate: `viewMode === "anime"
        ? trim(lower(datum.Name)) === trim(lower(animeSearch))
        : datum.OneGenre === selectedGenre`,
      as: "isSelected"
    },
    { filter: "datum.isSelected" },
    {
      aggregate: [
        { op: "sum", field: "number_of_male_reviewers", as: "Male" },
        { op: "sum", field: "number_of_female_reviewers", as: "Female" }
      ]
    },
    { fold: ["Male", "Female"], as: ["Gender", "Count"] },
    { filter: "datum.Count > 0" },
    { window: [{ op: "sum", field: "Count", as: "Total" }], frame: [null, null] },
    { calculate: "datum.Count / datum.Total * 100", as: "Percent" }
  ],

  mark: { type: "arc", tooltip: true },

  encoding: {
    theta: { field: "Count", type: "quantitative" },
    color: {
      field: "Gender",
      type: "nominal",
      scale: { domain: ["Male","Female"], range: ["#003c71","orange"] },
      legend: null
    },
    tooltip: [
      { field: "Gender", type: "nominal", title: "Gender" },
      { field: "Count", type: "quantitative", title: "Reviewers" },
      { field: "Percent", type: "quantitative", format: ".1f", title: "Percentage (%)" }
    ]
  }
};

vegaEmbed("#animePieChart", searchPieSpec, { actions: false });