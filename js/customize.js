let pageNum;
let selectedCategory;
let selectedSubcategory;

let content_tags = {
  Fiction: {
    Classics: ["Victorian", "Elizabethan", "Romanticism"],
    Fantasy: ["Epic Fantasy", "Urban Fantasy", "Dark Fantasy"],
    "Science Fiction": ["Space Opera", "Cyberpunk", "Dystopian"],
    Mystery: ["Crime", "Detective", "Thriller"],
  },
  "Non-Fiction": {
    Biographies: ["Historical Figures", "Celebrities", "Scientists"],
    "Self-Help": ["Personal Development", "Health & Wellness", "Productivity"],
    History: ["Ancient History", "Modern History", "World Wars"],
    "Science & Technology": [
      "Artificial Intelligence",
      "Space Exploration",
      "Medicine",
    ],
  },
  "Staff Picks": {
    "Must-Reads": ["Award Winners", "Critically Acclaimed", "Bestsellers"],
    Contemporary: ["Modern Classics", "New Releases", "Popular Authors"],
    "World Literature": [
      "African Literature",
      "Asian Literature",
      "European Literature",
    ],
    "Cultural & Social": ["Social Justice", "Memoirs", "Cultural Studies"],
  },
};

// Start Btn
$(document).ready(function () {
  pageNum = 0;

  $("#startBttn").click(function (event) {
    event.preventDefault(); // Prevent default link behavior
    UpdatePage("Next");
  });

  $("#backBttn").click(function () {
    UpdatePage("Back");
  });

  $("#nextBttn").click(function () {
    UpdatePage("Next");
  });

  $("#exitBttn").click(() => {
    location.reload(true);
  });

  // ! Tag Page
  generateCategories(content_tags);
  generateTags(content_tags);

  $("#categoriesContainer").on("change", ".tab-check", function () {
    handleCategoryChange(this);
  });

  $("#subcategoriesContainer").on("change", ".tab-check", function () {
    handleSubategoryChange(this);
  });

  $("#checkbox-tags").on("change", ".checkbox-input", () => {
    let checkedTags = $("#checkbox-tags .checkbox-input:checked")
      .map((_, el) => el.value)
      .get();
    console.log("Checked Tags:", checkedTags);
  });

  // Manually trigger the event for the default checked radio button
  $("#categoriesContainer .tab-check:checked").each(function () {
    handleCategoryChange(this);
  });

  //  !Puzzle Page
  $("#checkbox-puzzle").on("change", ".checkbox-input", () => {
    let checkedPuzzles = $("#checkbox-puzzle .checkbox-input:checked")
      .map((_, el) => el.value)
      .get();
    console.log("Checked Puzzles:", checkedPuzzles);
  });
});

function handleCategoryChange(radioElement) {
  selectedCategory = $(radioElement).next("label").text();
  console.log("Selected Category:", selectedCategory);
  // Additional logic for the selected category
  updateSubcategories();
  selectedSubcategory = null;
  updateTags();
}

function UpdatePage(navDir) {
  $("#page" + pageNum).addClass("d-none");

  if (navDir === "Next") {
    pageNum++;
  } else if (navDir === "Back") {
    pageNum--;
  }
  if (pageNum === 1) {
    $("#customScreen").removeClass("d-none");
  } else if (pageNum === 0) {
    $("#customScreen").addClass("d-none");
  } else if (pageNum === 5) {
    window.location.href = "receipt.html";
  }

  $("#page" + pageNum).removeClass("d-none");

  $("#pagination").text(pageNum + " of 4");

  $("#progressBar").css("width", (pageNum / 4) * 100 + "%");
}

function generateCategories(obj) {
  let $container = $("#categoriesContainer");
  let categoryIndex = 1;

  $.each(obj, function (category) {
    let $div = $("<div></div>");

    let $input = $("<input>", {
      type: "radio",
      class: "tab-check",
      name: "tab-genre",
      id: "tab-genre" + categoryIndex,
      autocomplete: "off",
    });
    if (categoryIndex === 1) $input.prop("checked", true);

    let $label = $("<label>", {
      class: "tab tab-horizontal text-end px-4 py-2",
      style: "width: 100%",
      for: "tab-genre" + categoryIndex,
      text: category,
    });

    $div.append($input).append($label);
    $container.append($div);

    categoryIndex++;
  });
}

function updateSubcategories() {
  let $container = $("#subcategoriesContainer");
  $container.empty(); // Clear existing content

  $.each(content_tags[selectedCategory], function (subCategory, items) {
    // key, value

    let $div = $("<div></div>");
    let $input = $("<input>", {
      type: "radio",
      class: "tab-check",
      name: "tab-" + selectedCategory.toLowerCase().replace(/\s+/g, ""),
      id:
        "tab-" +
        selectedCategory.toLowerCase().replace(/\s+/g, "") +
        "-" +
        subCategory,
      autocomplete: "off",
    });
    let $label = $("<label>", {
      class: "tab text-end px-4 py-2",
      style: "width: 100%",
      for:
        "tab-" +
        selectedCategory.toLowerCase().replace(/\s+/g, "") +
        "-" +
        subCategory,
      text: subCategory,
    });

    $div.append($input).append($label);
    $container.append($div);
  });
}

function handleSubategoryChange(radioElement) {
  selectedSubcategory = $(radioElement).next("label").text();
  console.log("Selected Subategory:", selectedSubcategory);
  updateTags();
}

function generateTags(obj) {
  let $tagContainer = $("#tagContainer");
  $tagContainer.empty();

  let queue = [obj];
  while (queue.length > 0) {
    let current = queue.shift();

    $.each(current, function (key, value) {
      if ($.isArray(value)) {
        $.each(value, function (index, item) {
          //console.log(item);

          // Create the div element
          let $div = $("<div>", { class: "m-2 checkbox-tag" });

          // Create the input element
          let $input = $("<input>", {
            class: "checkbox-input",
            type: "checkbox",
            value: item,
            id: item.toLowerCase().replace(/\s+/g, ""),
          });

          // Create the label element
          let $label = $("<label>", {
            class: "checkbox-label border border-primary",
            for: item.toLowerCase().replace(/\s+/g, ""),
          }).text(item);

          // Append input and label to the div
          $div.append($input).append($label);

          // Append the div to the body or another container element
          // Change 'body' to your desired container if needed
          $tagContainer.append($div);
        });
      } else if (typeof value === "object") {
        queue.push(value);
      }
    });
  }
}

function updateTags() {
  let tagArray = [];
  if (selectedSubcategory === null) {
    // Display all tags under the bigger Category

    $.each(content_tags[selectedCategory], function (subcategory, tags) {
      // Concatenate the tags of the subcategory to the tagsArray
      tagArray = tagArray.concat(tags);
    });
  } else {
    tagArray = content_tags[selectedCategory][selectedSubcategory];
  }

  if ($.isArray(tagArray)) {
    $.each(tagArray, function (index, value) {
      //console.log(value);
    });

    // Hide other tags
    $(".checkbox-tag").each(function () {
      // Get the text content of the associated label element
      let labelText = $(this).find("label").text();

      // Check if the label's text is in the tagArray
      if (tagArray.includes(labelText)) {
        // If yes, remove the 'd-none' class
        $(this).removeClass("d-none");
      } else {
        // If no, add the 'd-none' class
        $(this).addClass("d-none");
      }
    });
  }
}
