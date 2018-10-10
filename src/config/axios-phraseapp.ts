import axios from 'axios';

axios.defaults.baseURL = 'https://api.phraseapp.com/api/v2/';
axios.defaults.headers.common['User-Agent'] = 'PhraseJobs (derek@penandpillow.com)';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;