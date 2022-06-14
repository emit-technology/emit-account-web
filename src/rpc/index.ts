import {IPayload} from "@emit-technology/emit-account-node-sdk";
import axios from 'axios';
import {ChainType} from "@emit-technology/emit-lib";
import {config} from "../common/config";

export const jsonRpc = async (node:string,payload:IPayload,chain?:ChainType):Promise<any> => {
    return new Promise((resolve, reject) => {
        if(chain){
            axios.defaults.headers.post['chain'] = chain;
        }else{
            delete axios.defaults.headers.post['chain']
        }
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

export const getGasLevel = async (chain:ChainType):Promise<any> =>{
    if(chain == ChainType.ETH){
        const rest = await jsonRpc(config.ACCOUNT_NODE,{
            id: 1,
            method:"eth_gasTracker",
            params:[],
            jsonrpc: "2.0"
        },ChainType.ETH)
        return rest;
    }
    return {}
}