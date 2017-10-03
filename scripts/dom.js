const sectionTitles = document.querySelectorAll('.section-titles');
const all = document.querySelector('.streams-content');
const online = document.querySelector('.online-content');
const offline = document.querySelector('.offline-content');
const removeButton = document.querySelector('.remove-button');
const removeAllButton = document.querySelector('.remove-all-button');
const form = document.querySelector('.add-form');
const inputField = document.querySelector('.input-field');
const formMessage = document.querySelector('.form-message');
const addButton = document.querySelector('.add-button');
const allBoxesNL = document.getElementsByClassName('dummy');
function createOfflineBox(streamer) {
  const div = document.createElement('div');
  div.classList.add('dummy');
  const { name, display_name, logo, bio } = streamer;
  div.dataset.name = name;
  div.innerHTML = `
          <span class="title">${display_name}</span>
          <a href=https://www.twitch.tv/${name} target="_blank" data-link="https://www.twitch.tv/${name}">
            <img class="logo" src="${logo || 'prof.svg'}" data-logo="${logo || 'prof.svg'}" data-name=${name} />
          </a>
          <span class="bio">${bio || ''}</span>
      `;
  return div;
}
function createOnlineBox(streamer) {
  const div = document.createElement('div');
  div.classList.add('dummy');
  const { display_name, name } = streamer;
  const { preview, logo, game } = streamer.stream;
  div.dataset.name = name;
  div.innerHTML = `
            <span class="title">${display_name}</span>
            <a href=https://www.twitch.tv/${name} target="_blank">
              <img class="screenshot" src="${preview.medium}" data-logo="${logo}" />
            </a>
            <span class="bio"> Playing: ${game}</span>
        `;
  return div;
}
function appendBoxes(boxes, parent) {
  boxes.forEach(box => {
    parent.appendChild(box);
  })
}
function removeAllStreamerBoxes() {
  while (allBoxesNL.length > 0) allBoxesNL[0].remove();
}
function createAndAppend(streamers) {
  const allBoxes = [];
  const onlineBoxes = [];
  const offlineBoxes = [];
  Object.values(streamers).forEach(streamer => {
    if (streamer.stream) {
      onlineBoxes.push(createOnlineBox(streamer));
    } else {
      offlineBoxes.push(createOfflineBox(streamer));
    }
    allBoxes.push(createOfflineBox(streamer));
    streamer.stream
  });
  removeAllStreamerBoxes();
  appendBoxes(allBoxes, all);
  appendBoxes(onlineBoxes, online);
  appendBoxes(offlineBoxes, offline);
}