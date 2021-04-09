// One of the teachers said we shouldn't have global variables created through the DOM; I had some guidance to create functions and avoid having those global variables

let defaultShowID = 82;
let defaultShowName = "Select/Reset a show";
let allEpisodes = [];
let loadingHomePage = true;
let showMode = true;

// Clears all header searching features and starts the page

function setup() {
  let headerElement = document.getElementsByTagName("header")[0];
  headerElement.innerHTML = "";
  createSearchInput();
  makePageForEpisodes(allEpisodes);
  const allShows = getAllShows();
  let homeButton = document.getElementsByClassName("floatHomeButton")[0];
  homeButton.addEventListener("click", goHome);

  // Determines whether to hide or show the show or episode list;
  if (loadingHomePage) {
    makePageForShows(allShows);
    createShowsSelectionList(allShows);
    loadingHomePage = false;
    showMode = true;
  } else {
    createEpisodesSelectionList(allEpisodes);
    showMode = false;
  }
}

// Allows you to return to the main page with all shows at any time

function goHome() {
  loadingHomePage = true;
  defaultShowName = "Select/Reset a show";
  setup();
}

// Scroll to bottom or top of the page buttons

function scrollFunction() {
  let scrollToTopButton = document.getElementById("scrollToTopButton");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
  scrollToTopButton.addEventListener("click", scrollToTop);

  let scrollToBottomButton = document.getElementById("scrollToBottomButton");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollToBottomButton.style.display = "block";
  } else {
    scrollToBottomButton.style.display = "none";
  }
  scrollToBottomButton.addEventListener("click", scrollToBottom);
}

function scrollToTop() {
  // Scroll to top logic
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function scrollToBottom() {
  // Scroll to bottom logic
  document.documentElement.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}

// Formats episode / show number

function formattedEpisode(episode, nameAtStart) {
  let rootSeason = `${episode.season}`;
  let rootEpisode = `${episode.number}`;
  let paddedSeason = rootSeason.padStart(2, "0");
  let paddedEpisode = rootEpisode.padStart(2, "0");
  if (nameAtStart) {
    return `${episode.name} - S${paddedSeason}E${paddedEpisode}`;
  } else {
    return `S${paddedSeason}E${paddedEpisode} - ${episode.name}`;
  }
}

// Level 100 - produces the episodes' page

function makePageForEpisodes(episodeList) {
  let episodes = [];
  let rootElem = document.getElementById("root");
  // I had help on the next line to understand I needed to clear the list first
  rootElem.innerHTML = "";
  rootElem.style.backgroundColor = "#ADADC9";

  for (let episode of episodeList) {
    let parentContainer = document.createElement("div");
    parentContainer.classList.add("episodeContainer");
    rootElem.appendChild(parentContainer);

    let nameContainer = document.createElement("div");
    nameContainer.classList.add("nameContainer");
    parentContainer.appendChild(nameContainer);
    nameContainer.innerHTML = formattedEpisode(episode, true);

    let imageContainer = document.createElement("img");
    imageContainer.classList.add("episodeImageContainer");

    // Taking account of those episodes with no image available

    if (episode.image != null) {
      let usedImage = episode.image.medium;
      imageContainer.src = usedImage;
      parentContainer.appendChild(imageContainer);
      parentContainer.style.height = "480px";
    } else {
      imageContainer.setAttribute(
        "src",
        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      );
      parentContainer.appendChild(imageContainer);
      imageContainer.style.height = "280px";
    }

    let textContainer = document.createElement("div");
    textContainer.classList.add("textContainer");
    textContainer.style.height = "170px";

    // Taking account of those episodes with no summary

    let shortenedEpisodeSummary = episode.summary
      ? episode.summary.substring(0, 90)
      : "<em>No description found.</em>";

    textContainer.innerHTML = shortenedEpisodeSummary;
    parentContainer.appendChild(textContainer);

    // Like and Read more section

    let moreDetailsSection = document.createElement("section");
    moreDetailsSection.classList.add("moreDetailsSide");
    parentContainer.appendChild(moreDetailsSection);

    // Read more feature

    let readMoreButton = document.createElement("button");
    readMoreButton.classList.add("button", "readMoreButton");
    readMoreButton.innerHTML = "Read more";
    moreDetailsSection.appendChild(readMoreButton);

    if (episode.summary.length < 80) {
      readMoreButton.disabled = "true";
    } else {
      readMoreButton.addEventListener("click", () => {
        if (readMoreButton.innerHTML === "Read more") {
          readMoreButton.innerHTML = "Read less";
          readMoreButton.classList.add("button", "readLessButton");
          textContainer.innerHTML = episode.summary;
          textContainer.style.fontSize = "15px";
          textContainer.style.height = "170px";
          imageContainer.style.width = "140px";
          imageContainer.style.height = "140px";
          imageContainer.style.alignSelf = "center";
        } else {
          readMoreButton.innerHTML = "Read more";
          textContainer.innerHTML = shortenedEpisodeSummary;
          readMoreButton.classList.remove("readLessButton");
          textContainer.style.height = "50px";
          textContainer.style.fontSize = "16px";
          imageContainer.style.width = "100%";
          imageContainer.style.height = "auto";
          textContainer.style.height = "170px";
        }
      });
    }

    // Like button

    let like = 0;
    let likesButton = document.createElement("button");
    likesButton.classList.add("button", "likesButton");
    likesButton.innerHTML = `Like | ${like}`;
    moreDetailsSection.appendChild(likesButton);

    likesButton.addEventListener("click", function () {
      if (like == 0) {
        like++;
        likesButton.textContent = `Like | ${like}`;
      } else {
        like = like - 1;
        likesButton.textContent = `Like | ${like}`;
      }
    });

    episodes.push(episode);
  }
}

// Level 200 - creates a search bar on the header

function createSearchInput() {
  let headerElement = document.getElementsByTagName("header")[0];
  let inputElement = document.createElement("input");
  inputElement.classList.add("input");
  inputElement.setAttribute("placeholder", "Search an episode");
  let displayElement = document.createElement("div");
  displayElement.classList.add("display");
  let paragraphElement = document.createElement("p");
  paragraphElement.classList.add("paragraph");

  // Allows to show a message to the user: full catalogue or displaying...

  let displayMessage = loadingHomePage
    ? "Full catalogue"
    : `Displaying ${defaultShowName}`;

  paragraphElement.setAttribute("data-placeholder", displayMessage);
  headerElement.appendChild(inputElement);
  headerElement.appendChild(displayElement);
  displayElement.appendChild(paragraphElement);
  inputElement.addEventListener("input", searchEpisodesOrShows);
}

// Searches the content as the user types in

function searchEpisodesOrShows() {
  // I had some guidance at this point to understand I needed to retrieve all episodeList again and declare an empty array
  let filteredEpisodes = [];
  let filteredShows = [];
  let episodeList = allEpisodes;

  let word = document.getElementsByTagName("input")[0].value;
  word = word.toLowerCase();

  let counter = 0;
  if (!showMode) {
    for (let episode of episodeList) {
      let { name, summary } = episode;
      if (
        name.toLowerCase().match(word) ||
        summary.toLowerCase().match(word) ||
        name.toLowerCase().match(parseInt(word)) ||
        summary.toLowerCase().match(parseInt(word))
      ) {
        filteredEpisodes.push(episode);
        counter++;
      }
    }
    let paragraphElement = document.getElementsByClassName("paragraph")[0];
    paragraphElement.innerHTML = `Displaying ${counter} / ${episodeList.length} episode(s)`;
    makePageForEpisodes(filteredEpisodes);
    let selectList = document.getElementsByClassName("select")[0];
    selectList.value = "Select/Reset an episode";
  } else {
    let listOfShows = getAllShows();
    for (let show of listOfShows) {
      let { name, genres, summary } = show;
      if (
        name.toLowerCase().match(word) ||
        summary.toLowerCase().match(word) ||
        genres.toString().toLowerCase().match(word) ||
        name.toLowerCase().match(parseInt(word)) ||
        summary.toLowerCase().match(parseInt(word)) ||
        genres.toString().toLowerCase().match(parseInt(word))
      ) {
        filteredShows.push(show);
        counter++;
      }
    }
    let paragraphElement = document.getElementsByClassName("paragraph")[0];
    paragraphElement.innerHTML = `Displaying ${counter} / ${listOfShows.length} show(s)`;
    makePageForShows(filteredShows);
    let selectList = document.getElementsByClassName("select")[0];
    selectList.value = "Select/Reset an episode";
    showMode = true;
  }
}

// Level 300 - creates a dropdown list with all episodes for a given show

function createEpisodesSelectionList(listOfEpisodes) {
  let selectList = document.createElement("select");
  selectList.classList.add("select");
  let headerElement = document.getElementsByTagName("header")[0];
  headerElement.appendChild(selectList);

  // I had some help with getting a default option
  let option = document.createElement("option");
  option.classList.add("option");
  option.textContent = "Select/Reset an episode";
  selectList.appendChild(option);

  for (let episode of listOfEpisodes) {
    let option = document.createElement("option");
    option.text = formattedEpisode(episode, false);
    // I had help on the next line to understand that getting the indexOf was going to be useful
    option.value = listOfEpisodes.indexOf(episode);
    selectList.appendChild(option);
  }
  selectList.addEventListener("change", selectOneEpisode);
}

// Allows the user to pick one episode from the dropdown list

function selectOneEpisode() {
  let listOfEpisodes = allEpisodes;
  let inputElement = document.getElementsByClassName("input")[0];
  inputElement.value = "";
  let paragraphElement = document.getElementsByClassName("paragraph")[0];
  paragraphElement.innerHTML = `Displaying ${defaultShowName}`;
  let selectList = document.getElementsByClassName("select")[0];
  if (selectList.value === "Select/Reset an episode") {
    paragraphElement.innerHTML = "Full catalogue";
    makePageForEpisodes(listOfEpisodes);
  } else {
    let selectedEpisode = [];
    let index = selectList.value;
    // I had help on the next line
    let episodeObject = listOfEpisodes[index];
    selectedEpisode.push(episodeObject);
    makePageForEpisodes(selectedEpisode);
  }
}

// Level 400 - creates a dropdown list with all shows

function createShowsSelectionList() {
  let listOfShows = getAllShows();
  listOfShows.sort((a, b) => (a.name > b.name ? 1 : -1));

  let selectList = document.createElement("select");
  selectList.classList.add("select");
  let headerElement = document.getElementsByTagName("header")[0];
  headerElement.appendChild(selectList);

  let selectAllOption = document.createElement("option");
  selectAllOption.classList.add("option");
  selectAllOption.textContent = "Select/Reset a show";
  selectList.appendChild(selectAllOption);

  for (let show of listOfShows) {
    let { name } = show;
    let option = document.createElement("option");
    option.text = name;
    option.value = listOfShows.indexOf(show);
    selectList.appendChild(option);
    if (name == defaultShowName) {
      selectList.value = option.value;
    }
  }
  selectList.addEventListener("change", selectOneShow);
}

// Allows the user to pick one show from the dropdown list

function selectOneShow(event) {
  let listOfShows = getAllShows();
  // I had help to understand I needed to sort the data again as it was delivering the wrong episodes
  listOfShows.sort((a, b) => (a.name > b.name ? 1 : -1));
  let inputElement = document.getElementsByClassName("input")[0];
  inputElement.value = "";
  let paragraphElement = document.getElementsByClassName("paragraph")[0];
  paragraphElement.innerHTML = `Displaying your selection`;
  let selectList = document.getElementsByClassName("select")[0];
  // I had help on the next two lines of code
  if (event.currentTarget.id != "") {
    defaultShowName = event.currentTarget.getAttribute("name");
    fetchShow(event.currentTarget.id);
    paragraphElement.innerHTML = `Displaying ${defaultShowName}`;
  } else {
    let selectedShow = [];
    let index = selectList.value;
    let episodeObject = listOfShows[index];
    selectedShow.push(episodeObject);
    // I had help here to understand I needed to grab the show's ID and fetch through it
    let id = selectedShow[0].id;
    defaultShowName = selectedShow[0].name;
    paragraphElement.innerHTML = `Displaying ${defaultShowName}`;
    fetchShow(id);
  }
}

// Level 500 - produces the shows' page

function makePageForShows(showList) {
  let shows = [];
  let rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  for (let show of showList) {
    let {
      id,
      name,
      genres,
      status,
      runtime,
      rating: { average },
      summary,
    } = show;

    let parentContainer = document.createElement("div");
    parentContainer.classList.add("showContainer");
    rootElem.appendChild(parentContainer);

    let nameContainer = document.createElement("div");
    nameContainer.classList.add("nameContainer", "nameShowHover");
    nameContainer.setAttribute("id", id);
    nameContainer.setAttribute("name", name);
    nameContainer.innerHTML = name;
    parentContainer.appendChild(nameContainer);

    nameContainer.addEventListener("click", selectOneShow);

    let imageContainer = document.createElement("img");
    imageContainer.classList.add("showImageContainer");
    imageContainer.setAttribute("id", id);
    imageContainer.setAttribute("name", name);

    // Taking into account of any shows that might not have an image to display

    if (show.image != null) {
      let usedImage = show.image.medium;
      imageContainer.src = usedImage;
      parentContainer.appendChild(imageContainer);
      parentContainer.style.height = "600px";
    } else {
      imageContainer.setAttribute(
        "src",
        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
      );
      imageContainer.style.height = "300px";
      parentContainer.appendChild(imageContainer);
      parentContainer.style.height = "480px";
    }

    imageContainer.addEventListener("click", selectOneShow);

    // Making a box for extras: rating, genre, status and runtime

    let extrasContainer = document.createElement("div");
    extrasContainer.classList.add("extrasFlexContainer");
    parentContainer.appendChild(extrasContainer);

    let averageContainer = document.createElement("div");
    averageContainer.classList.add("flexboxItemsContainer");
    averageContainer.innerHTML = `Rated: ${average}`;
    extrasContainer.appendChild(averageContainer);

    let genresContainer = document.createElement("div");
    genresContainer.classList.add("flexboxItemsContainer");
    genresContainer.innerHTML = `Genres: ${genres}`;
    extrasContainer.appendChild(genresContainer);

    let statusContainer = document.createElement("div");
    statusContainer.classList.add("flexboxItemsContainer");
    statusContainer.innerHTML = `Status: ${status}`;
    extrasContainer.appendChild(statusContainer);

    let runtimeContainer = document.createElement("div");
    runtimeContainer.classList.add("flexboxItemsContainer");
    runtimeContainer.innerHTML = `Runtime: ${runtime}`;
    extrasContainer.appendChild(runtimeContainer);

    // Taking account of any shows that might not have a summary

    let shortenedSummary = summary.substring(0, 80);

    let textContainer = document.createElement("div");
    textContainer.classList.add("textContainer");
    textContainer.innerHTML = summary
      ? `${shortenedSummary} ...`
      : "<em>No description found.</em>";
    parentContainer.appendChild(textContainer);

    // Like and Read more section

    let moreDetailsSection = document.createElement("section");
    moreDetailsSection.classList.add("moreDetailsSide");
    parentContainer.appendChild(moreDetailsSection);

    // Read more feature

    let readMoreButton = document.createElement("button");
    readMoreButton.classList.add("button", "readMoreButton");
    readMoreButton.innerHTML = "Read more";
    moreDetailsSection.appendChild(readMoreButton);
    if (summary.length < 80) {
      readMoreButton.disabled = "true";
    } else {
      readMoreButton.addEventListener("click", () => {
        if (readMoreButton.innerHTML === "Read more") {
          readMoreButton.innerHTML = "Read less";
          readMoreButton.classList.add("button", "readLessButton");
          textContainer.innerHTML = summary;
          textContainer.style.fontSize = "14px";
          textContainer.style.height = "230px";
          imageContainer.style.width = "150px";
          imageContainer.style.height = "150px";
          imageContainer.style.alignSelf = "center";
        } else {
          readMoreButton.innerHTML = "Read more";
          textContainer.innerHTML = shortenedSummary;
          readMoreButton.classList.remove("readLessButton");
          textContainer.style.height = "50px";
          imageContainer.style.height = "330px";
          imageContainer.style.width = "100%";
          textContainer.style.fontSize = "16px";
        }
      });
    }

    // Like button

    let like = 0;
    let likesButton = document.createElement("button");
    likesButton.classList.add("button", "likesButton");
    likesButton.innerHTML = `Like | ${like}`;
    moreDetailsSection.appendChild(likesButton);

    likesButton.addEventListener("click", function () {
      if (like == 0) {
        like++;
        likesButton.textContent = `Like | ${like}`;
      } else {
        like = like - 1;
        likesButton.textContent = `Like | ${like}`;
      }
    });

    shows.push(show);
  }
}

// Level 350 - fetches the data from the API

const fetchShow = (showID) => {
  const URL = `https://api.tvmaze.com/shows/${showID}/episodes`;
  fetch(URL)
    .then(function (response) {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        throw `Error: ${response.statusText}`;
      }
    })
    .then(function (episodeList) {
      // I had help at this point, so I could have the data for the select and search functions
      allEpisodes = episodeList;
      setup();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Fetches the data

window.onload = fetchShow(defaultShowID);

// Delivers the scroll up and down

window.onscroll = function () {
  scrollFunction();
};
