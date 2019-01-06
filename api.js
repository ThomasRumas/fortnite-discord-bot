const axios = require('axios');
const apiEndPoint = 'https://fortnite-public-api.theapinetwork.com/prod09'

module.exports = class Api {
    constructor() {

    }

    get getStoreItems() {
        return axios.get(`${apiEndPoint}/store/get?language=en`)
    }

    get getUpcomingItems() {
        return axios.get(`${apiEndPoint}/upcoming/get`)
    }

    get getAllItems() {
        return axios.get(`${apiEndPoint}/items/list`)
    }

    get getCurrentChallenge() {
        return axios.get(`${apiEndPoint}/challenges/get?season=current`)
    }

    getItemInfos(prmId){
        return axios.get(`${apiEndPoint}/item/get`, {
            params: {
                ids: prmId
            }
        })
    }

    getUserId(prmName) {
        return axios.get(`${apiEndPoint}/users/id`, {
            params: {
                username: prmName
            }
        })
    }

    getUserStats(prmId, prmPlatform) {
        return axios.get(`${apiEndPoint}/users/public/br_stats`, {
            params: {
                user_id: prmId,
                platform : prmPlatform
            }
        })
    }
}
