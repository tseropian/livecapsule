const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

// const basic = btoa(`${client_id}:${client_secret}`);
const basic = new Buffer.from(client_id + ':' + client_secret).toString('base64')
const FOLLOWING_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/following?type=artist&limit=50`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async ({refresh_token}) => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(r => r.json());

  return response;
};

const getFollowedArtists = async (account, nextUrl = null) => {
    const { access_token } = await getAccessToken(account);
    const endpoint = nextUrl ? nextUrl : FOLLOWING_ARTISTS_ENDPOINT;
    const result = await fetch(endpoint, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    }).then(res => res.json());
  return result.artists;

};

module.exports = { getFollowedArtists };