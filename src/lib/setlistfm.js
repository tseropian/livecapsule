const axios = require('axios');

const apiKey = process.env.SETLISTFM_API_KEY;
const SETLIST_SEARCH_ENDPOINT = `https://api.setlist.fm/rest/1.0/search/setlists/`;

const searchSetlist = async (bandName, setlistDate) => {
    const endpoint = `${SETLIST_SEARCH_ENDPOINT}?artistName=${bandName}&date=${setlistDate}`;
    console.log('ENDPOINT: ', endpoint)
    const result = await axios.get(endpoint, {
        headers: {
            'x-api-key': `${apiKey}`,
            'Accept': 'application/json'
        }
    }).then(res => res.data)
    .catch(err => console.log(err.statusCode));
    // let result = 1234;
  return result;

};

module.exports = { searchSetlist };