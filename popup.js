const client_id = "glyuelrdyfb5jf5qejh4mwsucwrqhq";
const client_secret = "ap0ztr6db1wt4cn5fvipcf8q4wi7km";
const channels = [
  "Harry",
  "dwjft",
  "buddha",
  "anthonyz",
  "nidas",
  "pokimane",
  "xqc",
  "jakenbakeLIVE",
  "waterlynn",
  "igumdrop",
  "ariasaki",
];

async function getOauthToken() {
  const url = `https://id.twitch.tv/oauth2/token?client_id=${this.client_id}&client_secret=${this.client_secret}&grant_type=client_credentials`;
  return fetch(url, { method: "POST" }).then((res) =>
    res.json().then((data) => {
      return data;
    })
  );
}
(async () => {
  // getting Oauth token
  let accessToken = localStorage.getItem("access_token");
  if (!accessToken) {
    accessToken = (await getOauthToken()).access_token;
    localStorage.setItem("access_token", accessToken);
    console.log("Stored access token ");
  }
  const liveChannels = this.channels.map(async (channel) => {
    const { data } = await getChannelData(accessToken, channel);
    const isLive = checkIfLive(data, channel);
    return isLive ? { ...isLive } : { is_live: isLive, channel };
  });
  // channel statuses
  let statuses = await Promise.all(liveChannels).then((status) => status);
  console.log(statuses);
})();

async function getChannelData(token, user) {
  const H = new Headers();
  H.append("Authorization", `Bearer ${token}`);
  H.append("Client-Id", client_id);

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
}

function checkIfLive(channels, user) {
  try {
    for (let channel of channels) {
      if (channel.broadcaster_login.toLowerCase() === user.toLowerCase()) {
        console.log(channel);
        if (channel.is_live) return channel;
      }
    }
  } catch (error) {}
  return false;
}
