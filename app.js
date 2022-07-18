Vue.createApp({
  data() {
    return {
      BetterTTV:
        "chrome-extension://bhplkbgoehhhddaoolmakpocnenplmhf/player.html?channel=",
      accessToken: "",
      newChannel: "",
      client_id: "glyuelrdyfb5jf5qejh4mwsucwrqhq",
      client_secret: "ap0ztr6db1wt4cn5fvipcf8q4wi7km",
      channels: [
        "Lirik",
        "sodakite",
        "mizkif",
        "Harry",
        "dwjft",
        "buddha",
        "anthonyz",
        "ray__c",
        "sykkuno",
        "blaustoise",
        "nidas",
        "pokimane",
        "xqcow",
        "jakenbakeLIVE",
        "waterlynn",
        "igumdrop",
        "ariasaki",
        "seolahh",
      ],
      statuses: null,
    };
  },
  mounted() {
    this.storeChannels();
    (async () => {
      await this.display();
    })();
  },
  methods: {
    storeChannels() {
      const currChannels = localStorage.getItem("channels");
      if (currChannels) {
        this.channels = JSON.parse(currChannels);
      } else localStorage.setItem("channels", JSON.stringify(this.channels));
    },
    addNewChannel() {
      this.channels.push(this.newChannel);
      localStorage.removeItem("channels");
      localStorage.setItem("channels", JSON.stringify(this.channels));
      this.newChannel = "";
      this.display();
    },
    openChannel(channel) {
      window.open(this.BetterTTV + (channel.display_name || channel.channel));
    },
    async display() {
      try {
        // let token = localStorage.getItem("access_token");
        // if (true) {
        //   this.accessToken = (await this.getOauthToken()).access_token;
        //   localStorage.setItem("access_token", this.accessToken);
        //   console.log("Stored access token", this.accessToken);
        // }
        const promises = this.channels.map(async (channel) => {
          const { data } = await this.getChannelData(
            "ny12m10uyo2d93ladc67dmvo0wb626",
            channel
          );
          const isLive = this.checkIfLive(data, channel);
          return isLive ? { ...isLive } : { is_live: isLive, channel };
        });
        // channel statuses
        this.statuses = await Promise.all(promises).then((status) => status);
      } catch (error) {
        console.error(error);
      }
    },
    async getOauthToken() {
      const url = `https://id.twitch.tv/oauth2/token?client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=client_credentials`;
      return fetch(url, { method: "POST" }).then((res) =>
        res.json().then((data) => {
          return data;
        })
      );
    },
    async getChannelData(token, user) {
      const H = new Headers();
      H.append("Authorization", `Bearer ${token}`);
      H.append("Client-Id", this.client_id);

      const requestOptions = {
        method: "GET",
        headers: H,
        redirect: "follow",
      };

      return fetch(
        `https://api.twitch.tv/helix/search/channels?query=${user}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          return result;
        })
        .catch((error) => console.log("error", error));
    },
    checkIfLive(channels, user) {
      for (let channel of channels) {
        if (channel.broadcaster_login.toLowerCase() === user.toLowerCase()) {
          if (channel.is_live) return channel;
        }
      }
      return false;
    },
  },
}).mount("#app");
