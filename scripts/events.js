sectionTitles.forEach(section => {
  section.addEventListener('click', toggleSubsections)
});
function toggleSubsections() {
  (this.nextElementSibling.style.display === "none") ?
    (this.nextElementSibling.style.display = "flex") :
    (this.nextElementSibling.style.display = "none")
}
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const formValue = inputField.value;

  if (streamerInCachedData(formValue)) {
    displayMessage(formMessage, `${formValue} has already been added`);
    inputField.value = '';
    return;
  } else {
    twitch.getUserName(formValue)
      .then(data => {
        return twitch.update();
      })
      .then(updatedStreamers => {
        displayMessage(formMessage, '');
        inputField.value = '';
        createAndAppend(updatedStreamers);
      })
      .catch(error => {
        console.log(error);
        displayMessage(formMessage, `User "${formValue}" could not be found.`);
      })
  }

});
removeButton.addEventListener('click', function () {
  const imgs = all.querySelectorAll('img');
  if (this.innerHTML === "Remove a stream") {
    this.innerHTML = "Done";
    imgs.forEach(img => {
      img.src = './can.png';
      img.parentNode.href = "javascript:function() { return false; }";
      img.addEventListener('click', removeStreamer);
    })
  } else if (this.innerHTML === "Done") {
    this.innerHTML = "Remove a stream";
    imgs.forEach(img => {
      img.src = img.dataset.logo;
      img.parentNode.href = img.parentNode.dataset.link;
      img.removeEventListener('click', removeStreamer);
    });
  }
});
function displayMessage(div, message) {
  div.textContent = message;
}
// streamerInCachedData :: String -> Bool
function streamerInCachedData(name) {
  nameLowerCased = name.toLowerCase();
  const names = Object.keys(twitch.cachedData).map(name => name.toLowerCase());
  return names.includes(nameLowerCased);
}
function removeStreamer(event) {
  deleteFromAllSections(this.dataset.name);
  twitch.removeUser(this.dataset.name);
}
function deleteFromAllSections(streamerName) {
  const nodeListLength = allBoxesNL.length;
  for (let i = 0; i < nodeListLength; i++) {
    if (allBoxesNL[i] && allBoxesNL[i].dataset.name === streamerName) {
      allBoxesNL[i].remove();
    }
  }
}
removeAllButton.addEventListener('click', () => {
  const names = twitch.getAllCachedNames();
  twitch.deleteCachedData();
  while (allBoxesNL.length > 0) allBoxesNL[0].remove();
})