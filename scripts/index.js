const ls = new LocalStore();
const twitch = new TwitchApi('dll0wzapy7w7ich3dmaqpc0w1yopkc', ls);

twitch.hydrate()
  .then(streamers => {
    createAndAppend(streamers);
  })
  .catch(error => {
    //user hasRemovedAll; don't hydrate, don't print error;
    if (error === undefined) return;

    else console.log(error);
  })
