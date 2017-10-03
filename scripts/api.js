class TwitchApi {
  constructor(apiKey, ls) {
    this.cachedData = {};
    this.apiKey = apiKey;
    this.baseEndPoint = `https://api.twitch.tv/kraken/`;
    // this.update = this.update.bind(this);
  }
  hydrate() {
    const stored = ls.getStreamers();
    if (ls.hasRemovedAll() && stored === null) {
      return Promise.reject(undefined);
    }
    if (stored === null) {
      return Promise.all([
        this.getUserName('vanguardstv'),
        this.getUserName('etup'),
        this.getUserName('shroud'),
        this.getUserName('DreadzTV'),
        this.getUserName('Kolento'),
        this.getUserName('trumpsc')])
        .then(() => {
          return this.update();
        })
    } else {
      this.cachedData = stored;
      return this.update();
    }
  }
  getUserName(userName) {
    const endpoint = `${this.baseEndPoint}users?login=${userName}`;
    return fetch(endpoint, {
      headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': this.apiKey
      }
    })
      .then(data => {
        return data.json();
      })
      .then(parsedData => {
        if (parsedData.users.length < 1) return Promise.reject('invalid user name');
        else {
          const obj = parsedData.users[0];
          this.cachedData[userName] = obj;
          ls.saveStreamers(JSON.stringify(this.cachedData));
          return parsedData
        }
      })
  }

  update() {
    const entries = Object.entries(this.cachedData);
    const baseEndpoint = this.baseEndPoint;
    return Promise.all(entries.map(entry => {
      const endpoint = `${baseEndpoint}streams/${entry[1]._id}`;
      return fetch(endpoint, {
        headers: {
          'Accept': 'application/vnd.twitchtv.v5+json',
          'Client-ID': this.apiKey
        }
      })
        .then(data => {
          return data.json();
        })
        .then(parsedData => {
          this.cachedData[entry[1].name].stream = parsedData.stream;
          return parsedData;
        })
        .catch(error => {
          console.log(error);
        })
    }))
      .then(promises => {
        return this.cachedData;
      })
      .catch(error => {
        console.log(error);
      })
  }
  removeUser(name) {
    delete this.cachedData[name];
    ls.saveStreamers(JSON.stringify(this.cachedData));
  }
  getAllCachedNames() {
    return Object.keys(this.cachedData);
  }
  deleteCachedData() {
    this.cachedData = {};
    ls.clear();
  }
}

class LocalStore {
  saveStreamers(cachedData) {
    localStorage.setItem('streamers', cachedData);
  }
  getStreamers() {
    return JSON.parse(localStorage.getItem('streamers'));
  }
  clear() {
    localStorage.clear();
    localStorage.setItem('hasRemovedAll', 'true');
  }
  hasRemovedAll() {
    return JSON.parse(localStorage.getItem('hasRemovedAll')) === true;
  }
}