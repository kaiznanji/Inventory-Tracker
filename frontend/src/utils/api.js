import axios from 'axios'
import axiosRetry from 'axios-retry'

// Set up the retry mechanism for requests
const retryDelay = (retryNumber = 0) => {
    const seconds = Math.pow(2, retryNumber) * 500
    const randomMs = 1000 * Math.random()
    return seconds + randomMs
}

axiosRetry(axios, {
    retries: 2,
    retryDelay,
    // retry on Network Error & 5xx responses
    retryCondition: axiosRetry.isRetryableError,
})

export function axiosRequest(url, method, data) {
    let headers = { "Content-Type": "application/json" }
    const options = {
        method: method,
        url: url,
        data: JSON.stringify(data),
        headers: headers
    }
    return axios(options)
}