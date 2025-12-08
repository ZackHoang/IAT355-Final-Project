// var searchPieSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "Exact-match Anime Reviewer Gender Pie Chart",

//   autosize: { type: "fit-x", contains: "padding", resize: true },
//   width: "container",

//   data: { url: "./data/anime-dataset-2023-user-gender.csv" },

//   params: [
//     {
//       name: "animeSearch",
//       value: "",
//       bind: { input: "text", placeholder: "Type exact anime title..." }
//     }
//   ],

//   transform: [
//     { calculate: "trim(lower(datum.Name)) === trim(lower(animeSearch))", as: "isMatch" },
//     { filter: "datum.isMatch" },
//     { calculate: "datum.number_of_male_reviewers", as: "Male" },
//     { calculate: "datum.number_of_female_reviewers", as: "Female" },
//     { fold: ["Male", "Female"], as: ["Gender", "Count"] },
//     { filter: "datum.Count > 0" }
//   ],

//   mark: "arc",

//   encoding: {
//     theta: { field: "Count", type: "quantitative" },
//     color: { field: "Gender", type: "nominal", scale: { range: ["#1f77b4", "#ff7f0e"] } },
//     tooltip: [
//       { field: "Gender", type: "nominal", title: "Gender" },
//       { field: "Count", type: "quantitative", title: "Number of Reviewers" }
//     ]
//   }
// };

// vegaEmbed("#animePieChart", searchPieSpec, { actions: false });

var searchPieSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description: "Anime Reviewer Gender Pie Chart with Anime/Genre Toggle",

  // autosize: { type: "fit-x", contains: "padding", resize: true },
  // width: "container",

  data: { url: "./data/anime-dataset-2023-user-gender.csv" },

  params: [
    // Toggle mode
    {
      name: "viewMode",
      value: "anime",
      bind: {
        input: "radio",
        options: ["anime", "genre"],
        labels: ["Anime Search", "Genre Breakdown"],
      },
    },

    // Anime search
    {
      name: "animeSearch",
      value: "Trigun",
      bind: { input: "text", placeholder: "Type exact anime title..." },
    },

    // Genre list (static; editable)
    {
      name: "selectedGenre",
      value: "Action",
      bind: {
        input: "select",
        options: [
          "Action",
          "Adventure",
          "Sci-Fi",
          "Comedy",
          "Drama",
          "Fantasy",
          "Gourmet",
          "Horror",
          "Mystery",
          "Romance",
          "Sci-Fi",
          "Slice of Life",
          "Sports",
          "Supernatural",
          "Suspense",
        ],
      },
    },
  ],

  transform: [
    //---------------------------------------------------------
    // Split → Flatten → Trim Genres
    //---------------------------------------------------------
    {
      calculate: "split(replace(datum.Genres, '\"', ''), ',')",
      as: "GenreArray",
    },
    { flatten: ["GenreArray"] },
    { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
    { filter: "datum.OneGenre != ''" },

    //---------------------------------------------------------
    // MODE SWITCH
    //---------------------------------------------------------
    {
      calculate: `
        viewMode === "anime"
        ? trim(lower(datum.Name)) === trim(lower(animeSearch))
        : datum.OneGenre === selectedGenre
      `,
      as: "isSelected",
    },
    { filter: "datum.isSelected" },

    //---------------------------------------------------------
    // If genre mode → aggregate all anime in the genre
    //---------------------------------------------------------
    {
      aggregate: [
        { op: "sum", field: "number_of_male_reviewers", as: "Male" },
        { op: "sum", field: "number_of_female_reviewers", as: "Female" },
      ],
    },

    //---------------------------------------------------------
    // Fold → Pie format
    //---------------------------------------------------------
    { fold: ["Male", "Female"], as: ["Gender", "Count"] },
    { filter: "datum.Count > 0" },
  ],

  mark: "arc",

  encoding: {
    theta: { field: "Count", type: "quantitative" },
    color: {
      field: "Gender",
      type: "nominal",
      scale: { range: ["#1f77b4", "#ff7f0e"] },
    },
    tooltip: [
      { field: "Gender", type: "nominal", title: "Gender" },
      { field: "Count", type: "quantitative", title: "Reviewers" },
    ],
  },
};

vegaEmbed("#animePieChart", searchPieSpec, { actions: false });
