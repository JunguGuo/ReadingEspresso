// Start Btn
$(document).ready(function () {
  let pageNum = 0;
  let selectedCategory;
  let selectedSubcategory;

  const contentTags = {
    Fiction: {
      Classics: ["Victorian", "Elizabethan", "Romanticism"],
      Fantasy: ["Epic Fantasy", "Urban Fantasy", "Dark Fantasy"],
      "Science Fiction": ["Space Opera", "Cyberpunk", "Dystopian"],
      Mystery: ["Crime", "Detective", "Thriller"],
    },
    "Non-Fiction": {
      Biographies: ["Historical Figures", "Celebrities", "Scientists"],
      "Self-Help": [
        "Personal Development",
        "Health & Wellness",
        "Productivity",
      ],
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

  bindEventHandlers();
  generateCategories(contentTags);
  generateTags(contentTags);

  function bindEventHandlers() {
    // ！ Nav Events
    $("#startBttn").click(function (event) {
      event.preventDefault(); // Prevent default link behavior
      updatePage("Next");
    });

    $("#backBttn").click(() => updatePage("Back"));
    $("#nextBttn").click(() => updatePage("Next"));
    $("#exitBttn").click(() => location.reload(true));

    // ! Tag Page

    $("#categoriesContainer").on("change", ".tab-check", function () {
      handleCategoryChange($(this));
    });
    $("#subcategoriesContainer").on("change", ".tab-check", function () {
      handleSubcategoryChange($(this));
    });
    $("#checkbox-tags").on("change", ".checkbox-input", handleTagChange);

    //! Puzzle Page
    $("#checkbox-puzzle").on("change", ".checkbox-input", handlePuzzleChange);
  }

  function initializeDefaultCategory() {
    const $defaultCategory = $(
      "#categoriesContainer .tab-check:checked"
    ).first();
    handleCategoryChange($defaultCategory);
  }

  function handleCategoryChange(radioElement) {
    selectedCategory = $(radioElement).next("label").text();
    console.log("Selected Category:", selectedCategory);
    // Additional logic for the selected category
    updateSubcategories(contentTags[selectedCategory]);
    selectedSubcategory = null;
    updateTags();
  }

  function updatePage(navDir) {
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
    $("#pagination").text(`${pageNum} of 4`);
    $("#progressBar").css("width", `${(pageNum / 4) * 100}%`);
  }

  function generateCategories(categories) {
    const $container = $("#categoriesContainer");
    $container.empty();
    let categoryIndex = 1; // Make the first category checked by default

    $.each(categories, function (categoryName) {
      const categoryId = categoryName.toLowerCase().replace(/\s+/g, "");
      const $input = $(
        `<input type="radio" class="tab-check" name="tab-genre" id="tab-genre-${categoryId}" autocomplete="off">`
      );
      if (categoryIndex === 1) $input.prop("checked", true);

      const $label = $(
        `<label class="tab tab-horizontal text-end px-4 py-2" for="tab-genre-${categoryId}">${categoryName}</label>`
      );

      const $div = $("<div></div>").append($input, $label);
      $container.append($div);

      categoryIndex++;
    });

    // Manually trigger the event for the default checked radio button
    $("#categoriesContainer .tab-check:checked").each(function () {
      handleCategoryChange(this);
    });
  }

  function updateSubcategories(subcategories) {
    const $container = $("#subcategoriesContainer");
    $container.empty();

    $.each(subcategories, function (subCategoryName) {
      const subCategoryId = `${selectedCategory
        .toLowerCase()
        .replace(/\s+/g, "")}-${subCategoryName
        .toLowerCase()
        .replace(/\s+/g, "")}`;
      const $input = $(
        `<input type="radio" class="tab-check" name="tab-${selectedCategory
          .toLowerCase()
          .replace(/\s+/g, "")}" id="tab-${subCategoryId}" autocomplete="off">`
      );
      const $label = $(
        `<label class="tab text-end px-4 py-2" for="tab-${subCategoryId}">${subCategoryName}</label>`
      );

      const $div = $("<div></div>").append($input, $label);
      $container.append($div);
    });
  }

  function handleSubcategoryChange(element) {
    selectedSubcategory = $(element).next("label").text();
    console.log("Selected Subategory:", selectedSubcategory);
    updateTags();
  }

  function handleTagChange() {
    const checkedTags = $("#checkbox-tags .checkbox-input:checked")
      .map((_, el) => $(el).val())
      .get();
    console.log("Checked Tags:", checkedTags);
  }

  function handlePuzzleChange() {
    const checkedPuzzles = $("#checkbox-puzzle .checkbox-input:checked")
      .map((_, el) => $(el).val())
      .get();
    console.log("Checked Puzzles:", checkedPuzzles);
  }

  function generateTags(obj) {
    // assumes that the structure of obj is consistent and that it only contains strings or objects. If obj can contain other types of values, you may need additional checks in your function.
    let $tagContainer = $("#tagContainer");
    $tagContainer.empty();

    let htmlContent = "";

    let queue = [obj];

    while (queue.length > 0) {
      let current = queue.shift();

      $.each(current, function (key, value) {
        if ($.isArray(value)) {
          //The forEach method is used instead of $.each for iterating over arrays, which is a bit more idiomatic in modern JavaScript.
          value.forEach((item) => {
            let itemId = item.toLowerCase().replace(/\s+/g, "");

            // In jQuery, each call to .append() can be costly in terms of performance, especially if it's inside a loop. A more efficient approach is to build up the entire HTML structure as a string or as a set of jQuery objects and append it to the DOM all at once.
            htmlContent += `<div class="m-2 checkbox-tag">
                                        <input class="checkbox-input" type="checkbox" value="${item}" id="${itemId}">
                                        <label class="checkbox-label border border-primary" for="${itemId}">${item}</label>
                                    </div>`;
          });
        } else if (typeof value === "object") {
          queue.push(value);
        }
      });
    }

    $tagContainer.append(htmlContent);
  }

  function updateTags() {
    const tags = selectedSubcategory
      ? contentTags[selectedCategory][selectedSubcategory]
      : [].concat(...Object.values(contentTags[selectedCategory]));

    if ($.isArray(tags)) {
      $.each(tags, function (index, value) {
        //console.log(value);
      });

      // Hide other tags
      $(".checkbox-tag").each(function () {
        // Get the text content of the associated label element
        let labelText = $(this).find("label").text();

        // Check if the label's text is in the tags
        if (tags.includes(labelText)) {
          // If yes, remove the 'd-none' class
          $(this).removeClass("d-none");
        } else {
          // If no, add the 'd-none' class
          $(this).addClass("d-none");
        }
      });
    }
  }
});
