// var searchPieSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "Anime Reviewer Gender Pie Chart with Anime/Genre Toggle",

//   autosize: { type: "fit-x", contains: "padding", resize: true },
//   width: "container",

//   data: { url: "./data/anime-dataset-2023-user-gender.csv" },

//   params: [
//     // Toggle mode
//     {
//       name: "viewMode",
//       value: "anime",
//       bind: {
//         input: "radio",
//         options: ["anime", "genre"],
//         labels: ["Anime Search", "Genre Breakdown"]
//       }
//     },

//     // Anime search
//     {
//       name: "animeSearch",
//       value: "Trigun",
//       bind: { input: "text", placeholder: "Type exact anime title..." }
//     },

//     // Genre list (static; editable)
//     {
//       name: "selectedGenre",
//       value: "Action",
//       bind: {
//         input: "select",
//         options: [
//           "Action", "Adventure", "Sci-Fi", "Comedy","Drama", "Fantasy", "Gourmet", "Horror","Mystery","Romance",
//           "Sci-Fi","Slice of Life","Sports","Supernatural","Suspense"
//         ]
//       }
//     }
//   ],

//   transform: [
//     //---------------------------------------------------------
//     // Split → Flatten → Trim Genres
//     //---------------------------------------------------------
//     { calculate: "split(replace(datum.Genres, '\"', ''), ',')", as: "GenreArray" },
//     { flatten: ["GenreArray"] },
//     { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
//     { filter: "datum.OneGenre != ''" },

//     //---------------------------------------------------------
//     // MODE SWITCH
//     //---------------------------------------------------------
//     {
//       calculate: `
//         viewMode === "anime"
//         ? trim(lower(datum.Name)) === trim(lower(animeSearch))
//         : datum.OneGenre === selectedGenre
//       `,
//       as: "isSelected"
//     },
//     { filter: "datum.isSelected" },

//     //---------------------------------------------------------
//     // If genre mode → aggregate all anime in the genre
//     //---------------------------------------------------------
//     {
//       aggregate: [
//         { op: "sum", field: "number_of_male_reviewers", as: "Male" },
//         { op: "sum", field: "number_of_female_reviewers", as: "Female" }
//       ]
//     },

//     //---------------------------------------------------------
//     // Fold → Pie format
//     //---------------------------------------------------------
//     { fold: ["Male", "Female"], as: ["Gender", "Count"] },
//     { filter: "datum.Count > 0" }
//   ],

//   mark: "arc",

//   encoding: {
//     theta: { field: "Count", type: "quantitative" },
//     color: {
//       field: "Gender",
//       type: "nominal",
//       scale: { range: ["#1f77b4", "#ff7f0e"] }
//     },
//     tooltip: [
//       { field: "Gender", type: "nominal", title: "Gender" },
//       { field: "Count", type: "quantitative", title: "Reviewers" }
//     ]
//   }
// };

// vegaEmbed("#animePieChart", searchPieSpec, { actions: false });

// animePieChart.js
// Make sure your HTML has:
// <div id="controls"></div>
// <div id="animePieChart"></div>

(async function() {
  // --- Load CSV & extract titles ---
  let animeTitles = [];
  const response = await fetch("./data/anime-dataset-2023-user-gender.csv");
  const csvText = await response.text();
  const lines = csvText.split("\n");
  const header = lines[0].split(",");
  const nameIndex = header.indexOf("Name");
  animeTitles = lines.slice(1)
    .map(line => line.split(",")[nameIndex])
    .filter(v => v);
  animeTitles = [...new Set(animeTitles)];

  // --- Create controls dynamically ---
  const controlsDiv = document.getElementById("controls");
  controlsDiv.innerHTML = `
    <label>
      Search Anime:
      <input type="text" id="animeSearchInput" list="animeList" placeholder="Type anime title..." value="Trigun" />
      <datalist id="animeList"></datalist>
    </label>
    <br>
    <label>
      Mode:
      <select id="viewModeSelect">
        <option value="anime">Anime Search</option>
        <option value="genre">Genre Breakdown</option>
      </select>
    </label>
    <br>
    <label>
      Genre:
      <select id="genreSelect">
        ${["Action","Adventure","Sci-Fi","Comedy","Drama","Fantasy","Gourmet","Horror","Mystery","Romance","Slice of Life","Sports","Supernatural","Suspense"]
          .map(g => `<option>${g}</option>`).join("")}
      </select>
    </label>
  `;

  // Fill datalist for autocomplete
  const datalist = document.getElementById("animeList");
  animeTitles.forEach(title => {
    const option = document.createElement("option");
    option.value = title;
    datalist.appendChild(option);
  });

  const animeInput = document.getElementById("animeSearchInput");
  const viewModeSelect = document.getElementById("viewModeSelect");
  const genreSelect = document.getElementById("genreSelect");

  // --- Vega-Lite pie chart spec ---
  const searchPieSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 450,
    background: "#008ef3",
    data: { url: "./data/anime-dataset-2023-user-gender.csv" },
    params: [
      { name: "viewMode", value: "anime" },
      { name: "animeSearch", value: "Trigun" },
      { name: "selectedGenre", value: "Action" }
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
      { calculate: "datum.Count / datum.Total * 100", as: "Percent" },
      { calculate: "datum.Gender + ': ' + round(datum.Percent,1) + '%'", as: "GenderLabel" }
    ],
    layer: [
      // Pie slices
      {
        mark: { type: "arc", tooltip: true },
        encoding: {
          theta: { field: "Count", type: "quantitative" },
          color: { field: "Gender", type: "nominal", scale: { domain: ["Male","Female"], range: ["#003c71","orange"] }, legend: null },
          tooltip: [
            { field: "Gender", type: "nominal", title: "Gender" },
            { field: "Count", type: "quantitative", title: "Reviewers" },
            { field: "Percent", type: "quantitative", format: ".1f", title: "Percentage (%)" }
          ]
        }
      },
      // Slice labels raised further outside and horizontally offset
      {
        mark: { type: "text", radius: 265, color: "white", fontWeight: "bold", align: "center", baseline: "middle" },
        encoding: {
          text: { field: "GenderLabel", type: "nominal" },
          theta: { field: "Count", type: "quantitative" },
          dx: {
            condition: [
              { test: "datum.Gender === 'Male'", value: -60 },   // move Male left
              { test: "datum.Gender === 'Female'", value: 60 }  // move Female right
            ],
            value: 0
          }
        }
      }
    ]
  };

  // --- Embed chart ---
  const { view } = await vegaEmbed("#animePieChart", searchPieSpec, { actions: false });

  // --- Update chart on input changes ---
  function updatePie() {
    view.signal("viewMode", viewModeSelect.value).run();
    view.signal("animeSearch", animeInput.value).run();
    view.signal("selectedGenre", genreSelect.value).run();
  }

  animeInput.addEventListener("change", updatePie);
  animeInput.addEventListener("blur", () => {
    const val = animeInput.value.toLowerCase();
    if (!animeTitles.includes(animeInput.value)) {
      const match = animeTitles.find(title => title.toLowerCase().startsWith(val));
      if (match) animeInput.value = match;
    }
    updatePie();
  });

  viewModeSelect.addEventListener("change", updatePie);
  genreSelect.addEventListener("change", updatePie);

})();
