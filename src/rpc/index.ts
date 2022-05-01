import {IPayload} from "@emit-technology/emit-account-node-sdk";
import axios from 'axios';

export const jsonRpc = async (node:string,payload:IPayload) => {
    return new Promise((resolve, reject) => {
        axios.post(node, payload).then((resp: any) => {
            if (resp.data.error) {
                reject(typeof resp.data.error === "string" ? resp.data.error : resp.data.error.message);
            } else {
                resolve(resp.data.result);
            }
        }).catch((e: any) => {
            reject(e)
        })
    })
}