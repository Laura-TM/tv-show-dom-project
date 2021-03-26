// One of the teachers said we shouldn't have global variables created through the DOM
// I had some guidance to create functions and avoid having those global variables

let allEpisodes = [];

function setup() {
  let headerElement = document.getElementsByTagName("header")[0];
  headerElement.innerHTML = "";
  createSearchInput();
  createEpisodesSelectionList(allEpisodes);
  makePageForEpisodes(allEpisodes);
  const allShows = getAllShows();
  createShowsSelectionList(allShows);
}

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

// Level 100

function makePageForEpisodes(episodeList) {
  let episodes = [];
  let rootElem = document.getElementById("root");
  // I had help on the next line to understand I needed to clear the list first
  rootElem.innerHTML = "";
  rootElem.style.backgroundColor = "#ADADC9";

  for (let episode of episodeList) {
    let parentContainer = document.createElement("div");
    parentContainer.classList.add("parentWrapper");
    rootElem.appendChild(parentContainer);

    let nameContainer = document.createElement("div");
    nameContainer.classList.add("nameWrapper");
    parentContainer.appendChild(nameContainer);
    nameContainer.innerHTML = formattedEpisode(episode, true);

    let imageContainer = document.createElement("img");
    imageContainer.classList.add("imageWrapper");
    let usedImage = episode.image.medium;
    imageContainer.src = usedImage;
    parentContainer.appendChild(imageContainer);

    let textContainer = document.createElement("span");
    textContainer.classList.add("textWrapper");
    textContainer.innerHTML = `${episode.summary}`;
    parentContainer.appendChild(textContainer);

    episodes.push(episode);
  }
}

// Level 200

function createSearchInput() {
  let headerElement = document.getElementsByTagName("header")[0];
  let inputElement = document.createElement("input");
  inputElement.classList.add("input");
  inputElement.setAttribute("placeholder", "Search an episode");
  let displayElement = document.createElement("div");
  displayElement.classList.add("display");
  let paragraphElement = document.createElement("p");
  paragraphElement.classList.add("paragraph");
  paragraphElement.setAttribute("data-placeholder", "Full catalogue");
  headerElement.appendChild(inputElement);
  headerElement.appendChild(displayElement);
  displayElement.appendChild(paragraphElement);
  inputElement.addEventListener("input", searchEpisodes);
}

function searchEpisodes() {
  // I had some guidance at this point to understand I needed to retrieve all episodeList again and declare an empty array
  let filteredEpisodes = [];
  let episodeList = allEpisodes;

  let word = document.getElementsByTagName("input")[0].value;
  word = word.toLowerCase();

  let counter = 0;
  for (let episode of episodeList) {
    if (
      episode.name.toLowerCase().match(word) ||
      episode.summary.toLowerCase().match(word) ||
      episode.name.toLowerCase().match(parseInt(word)) ||
      episode.summary.toLowerCase().match(parseInt(word))
    ) {
      filteredEpisodes.push(episode);
      counter++;
    }
  }
  let paragraphElement = document.getElementsByClassName("paragraph")[0];
  paragraphElement.innerHTML = `Displaying ${counter} / ${episodeList.length} episode(s)`;
  makePageForEpisodes(filteredEpisodes);
  let selectList = document.getElementsByClassName("select")[0];
  selectList.value = "Select/Reset an option";
}

// Level 300

function createEpisodesSelectionList(listOfEpisodes) {
  let selectList = document.createElement("select");
  selectList.classList.add("select");
  let headerElement = document.getElementsByTagName("header")[0];
  headerElement.appendChild(selectList);

  // I had some help with getting a default option
  let option = document.createElement("option");
  option.classList.add("option");
  option.textContent = "Select/Reset an option";
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

function selectOneEpisode() {
  let listOfEpisodes = allEpisodes;
  let inputElement = document.getElementsByClassName("input")[0];
  inputElement.value = "";
  let paragraphElement = document.getElementsByClassName("paragraph")[0];
  paragraphElement.innerHTML = `Displaying your selection`;
  let selectList = document.getElementsByClassName("select")[0];
  if (selectList.value === "Select/Reset an option") {
    paragraphElement.innerHTML = `Full catalogue`;
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

// Level 400

function createShowsSelectionList() {
  let listOfShows = getAllShows();
  listOfShows.sort((a, b) => (a.name > b.name ? 1 : -1));

  let selectList = document.createElement("select");
  selectList.classList.add("select");
  let headerElement = document.getElementsByTagName("header")[0];
  headerElement.appendChild(selectList);

  let option = document.createElement("option");
  option.classList.add("option");
  option.textContent = "Select/Reset a show";
  selectList.appendChild(option);

  for (let show of listOfShows) {
    let option = document.createElement("option");
    option.text = show.name;
    option.value = listOfShows.indexOf(show);
    selectList.appendChild(option);
  }
  selectList.addEventListener("change", selectOneShow);
}

function selectOneShow() {
  let listOfShows = getAllShows();
  // I had help to understand I needed to sort the data again as it was giving the wrong episodes
  listOfShows.sort((a, b) => (a.name > b.name ? 1 : -1));
  let inputElement = document.getElementsByClassName("input")[0];
  inputElement.value = "";
  let paragraphElement = document.getElementsByClassName("paragraph")[0];
  paragraphElement.innerHTML = `Displaying your selection`;
  let selectList = document.getElementsByClassName("select")[1];
  if (selectList.value === "Select/Reset a show") {
    paragraphElement.innerHTML = `Full catalogue`;
    makePageForEpisodes(listOfShows);
  } else {
    let selectedShow = [];
    let index = selectList.value;
    let episodeObject = listOfShows[index];
    selectedShow.push(episodeObject);
    // I had helped here to understand I needed to grab the show's ID and fetch through it
    let id = selectedShow[0].id;
    fetchData(id);
  }
}

// Level 350

const fetchData = (showID) => {
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

window.onload = fetchData(82);
