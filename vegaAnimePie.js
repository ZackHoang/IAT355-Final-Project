(async function() {
  let animeTitles = [];
  const response = await fetch("./data/anime-dataset-2023-user-gender-none-removed.csv");
  const csvText = await response.text();
  const lines = csvText.split("\n");
  const header = lines[0].split(",");
  const nameIndex = header.indexOf("Name");
  animeTitles = lines.slice(1)
    .map(line => line.split(",")[nameIndex])
    .filter(v => v);
  animeTitles = [...new Set(animeTitles)];

  const allowedGenres = [
    "Action","Adventure","Sci-Fi","Comedy","Drama","Fantasy",
    "Horror","Mystery","Romance","Slice of Life","Sports"
  ];

  const controlsDiv = document.getElementById("controls");
  controlsDiv.innerHTML = `
    <label>
      Anime Search:
      <input type="text" id="animeSearchInput" list="animeList" placeholder="Type anime title..." value="Trigun" />
      <datalist id="animeList"></datalist>
    </label>
    <br>
    <label>
      Mode:
      <select id="viewModeSelect">
        <option value="anime">Search</option>
        <option value="genre">Genre</option>
      </select>
    </label>
    <br>
    <label>
      Genre:
      <select id="genreSelect">
        ${allowedGenres.map(g => `<option>${g}</option>`).join("")}
      </select>
    </label>
  `;

  const datalist = document.getElementById("animeList");
  animeTitles.forEach(title => {
    const option = document.createElement("option");
    option.value = title;
    datalist.appendChild(option);
  });

  const animeInput = document.getElementById("animeSearchInput");
  const viewModeSelect = document.getElementById("viewModeSelect");
  const genreSelect = document.getElementById("genreSelect");

  const chartDiv = document.getElementById("animePieChart");
  chartDiv.insertAdjacentHTML(
    "beforebegin",
    `
    <div id="chartTitle" style="
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        color: white;
        margin-bottom: 0.5rem;
    ">
      Anime: Trigun
    </div>    
    <div id="pieLegend" style="
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 1rem;
        color: white;
    ">
        <span id="maleLegend" style="display:flex; align-items:center; gap:0.25rem;">
          Male (<span id="malePercent">26.5%</span>)
          <span style="width:1rem; height:1rem; background:#008ef3; display:inline-block;"></span>
        </span>
        <span id="femaleLegend" style="display:flex; align-items:center; gap:0.25rem;">
          Female (<span id="femalePercent">26.5%</span>)
          <span style="width:1rem; height:1rem; background:#ff5e00; display:inline-block;"></span>
        </span>
    </div>
    `
  );

  const searchPieSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    width: "container",
    height: 375,
    background: "#075AA8",
    data: { url: "./data/anime-dataset-2023-user-gender.csv" },
    params: [
      { name: "viewMode", value: "anime" },
      { name: "animeSearch", value: "Trigun" },
      { name: "selectedGenre", value: allowedGenres[0] }
    ],
    transform: [
      { calculate: "split(replace(datum.Genres, '\"', ''), ',')", as: "GenreArray" },
      { flatten: ["GenreArray"] },
      { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
      { filter: "datum.OneGenre != ''" },
      { filter: "datum.OneGenre != 'Suspense' && datum.OneGenre != 'Supernatural' && datum.OneGenre != 'Gourmet' && datum.OneGenre != 'Avant Garde' && datum.OneGenre != 'Award Winning' && datum.OneGenre != 'UNKNOWN' && datum.OneGenre != 'Girls Love' && datum.OneGenre != 'Boys Love'"  },
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
    mark: "arc",
    encoding: {
      theta: { field: "Count", type: "quantitative" },
      color: { field: "Gender", type: "nominal", scale: { domain: ["Male","Female"], range: ["#008ef3","#ff5e00"] }, legend: null },
      tooltip: [
        { field: "Gender", type: "nominal", title: "Gender" },
        { field: "Count", type: "quantitative", title: "Reviewers" },
        { field: "Percent", type: "quantitative", format: ".1f", title: "Percentage (%)" }
      ]
    }
  };

  async function updateLegendPercent() {
    const data = await view.data("source_0"); // get transformed data from Vega view
    let male = 0, female = 0;

    if (data && data.length) {
      data.forEach(d => {
        if (d.Gender === "Male") male = d.Percent;
        if (d.Gender === "Female") female = d.Percent;
      });
    }

    document.getElementById("malePercent").textContent = male ? male.toFixed(1) + "%" : "0%";
    document.getElementById("femalePercent").textContent = female ? female.toFixed(1) + "%" : "0%";
  }

  function updateChartTitle() {
    const titleDiv = document.getElementById("chartTitle");
    if (viewModeSelect.value === "anime") {
      titleDiv.textContent = `Anime: ${animeInput.value}`;
    } else {
      titleDiv.textContent = `Genre: ${genreSelect.value}`;
    }
  }

  const { view } = await vegaEmbed("#animePieChart", searchPieSpec, { actions: false });

  function updatePie() {
    view.signal("viewMode", viewModeSelect.value).run();
    view.signal("animeSearch", animeInput.value).run();
    view.signal("selectedGenre", genreSelect.value).run();
    updateLegendPercent();
    updateChartTitle();
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



// var searchPieSpec = {
//   $schema: "https://vega.github.io/schema/vega-lite/v5.json",
//   description: "Anime Reviewer Gender Pie Chart with Anime/Genre Toggle",

//   autosize: { type: "fit-x", contains: "padding", resize: true },
//   width: "container",
//   height: 450,
//   background: "#008ef3",

//   data: { url: "./data/anime-dataset-2023-user-gender.csv" },


//   params: [
//     // Toggle mode
//     {
//       name: "viewMode",       // internal signal name
//       value: "anime",         // default
//       bind: {
//         input: "select",
//         options: ["anime", "genre"],
//         labels: ["Anime Chart", "Genre Chart"], // dropdown options text
//         name: "Chart Type Selection"           // label next to dropdown
//       }
//     },

//     // Anime search
//     {
//       name: "animeSearch",    // internal signal name
//       value: "Trigun",
//       bind: {
//         input: "text",
//         placeholder: "Anime Search",
//         name: "Search Anime"   // label next to text input
//       }
//     },

//     // Genre selection
//     {
//       name: "selectedGenre",  // internal signal name
//       value: "Action",        // default selection
//       bind: {
//         input: "select",
//         options: [
//           "Action","Adventure","Sci-Fi","Comedy","Drama","Fantasy","Gourmet","Horror",
//           "Mystery","Romance","Slice of Life","Sports","Supernatural","Suspense"
//         ],
//         labels: [
//           "Action","Adventure","Sci-Fi","Comedy","Drama","Fantasy","Gourmet","Horror",
//           "Mystery","Romance","Slice of Life","Sports","Supernatural","Suspense"
//         ],             // dropdown option texts
//         name: "Select Genre" // label next to dropdown
//       }
//     }
//   ],


//   transform: [
//     { calculate: "split(replace(datum.Genres, '\"', ''), ',')", as: "GenreArray" },
//     { flatten: ["GenreArray"] },
//     { calculate: "trim(datum.GenreArray)", as: "OneGenre" },
//     { filter: "datum.OneGenre != ''" },
//     {
//       calculate: `viewMode === "anime"
//         ? trim(lower(datum.Name)) === trim(lower(animeSearch))
//         : datum.OneGenre === selectedGenre`,
//       as: "isSelected"
//     },
//     { filter: "datum.isSelected" },
//     {
//       aggregate: [
//         { op: "sum", field: "number_of_male_reviewers", as: "Male" },
//         { op: "sum", field: "number_of_female_reviewers", as: "Female" }
//       ]
//     },
//     { fold: ["Male", "Female"], as: ["Gender", "Count"] },
//     { filter: "datum.Count > 0" },
//     { window: [{ op: "sum", field: "Count", as: "Total" }], frame: [null, null] },
//     { calculate: "datum.Count / datum.Total * 100", as: "Percent" }
//   ],

//   mark: { type: "arc", tooltip: true },

//   encoding: {
//     theta: { field: "Count", type: "quantitative" },
//     color: {
//       field: "Gender",
//       type: "nominal",
//       scale: { domain: ["Male","Female"], range: ["#003c71","orange"] },
//       legend: null
//     },
//     tooltip: [
//       { field: "Gender", type: "nominal", title: "Gender" },
//       { field: "Count", type: "quantitative", title: "Reviewers" },
//       { field: "Percent", type: "quantitative", format: ".1f", title: "Percentage (%)" }
//     ]
//   }
// };

// vegaEmbed("#animePieChart", searchPieSpec, { actions: false });