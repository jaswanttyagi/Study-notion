import axios from "axios"

export const axiosInstance = axios.create({
    timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 20000),
});

export const apiConnector = (method , url , bodyData , headers , params)=>{
    return axiosInstance({
        method : `${method}`,
        url : `${url}`,
        data : bodyData ? bodyData : null,
        headers : headers ? headers : null,
        params : params ? params : null,
    })
}
