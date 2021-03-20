// I had some guidance to create this function and avoid having global variables

function initialiseElements() {
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

  let listOfEpisodes = getAllEpisodes();
  let selectList = document.createElement("select");
  selectList.classList.add("select");
  headerElement.appendChild(selectList);

  // I had some help with getting a default option
  let option = document.createElement("option");
  option.classList.add("option");
  option.textContent = "Select/Reset an option";
  selectList.appendChild(option);

  for (let episode of listOfEpisodes) {
    let option = document.createElement("option");
    let rootSeason = `${episode.season}`;
    let rootEpisode = `${episode.number}`;
    let paddedSeason = rootSeason.padStart(2, "0");
    let paddedEpisode = rootEpisode.padStart(2, "0");
    // I had help on the next line to understand that getting the indexOf was going to be useful
    option.value = listOfEpisodes.indexOf(episode);
    option.text = `S${paddedSeason}E${paddedEpisode} - ${episode.name}`;
    selectList.appendChild(option);
  }
  selectList.addEventListener("change", selectOneEpisode);
}

function setup() {
  initialiseElements();
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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
    let rootSeason = `${episode.season}`;
    let rootEpisode = `${episode.number}`;
    let paddedSeason = rootSeason.padStart(2, "0");
    let paddedEpisode = rootEpisode.padStart(2, "0");
    nameContainer.innerHTML = `${episode.name} - S${paddedSeason} E${paddedEpisode}`;

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

function searchEpisodes() {
  // I had some guidance at this point to understand I needed to retrieve all episodeList again and declare an empty array
  let filteredEpisodes = [];
  let episodeList = getAllEpisodes();

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

function selectOneEpisode() {
  let listOfEpisodes = getAllEpisodes();
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

window.onload = setup;
