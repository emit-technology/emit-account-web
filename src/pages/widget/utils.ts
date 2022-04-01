import {IConfig} from "@emit-technology/emit-account-node-sdk";
import selfStorage from "../../common/storage";

const AUTH_DAPP_PRE = "AUTH_DAPP_PRE";

export const setAuthDApp = (config: IConfig)=>{
    selfStorage.setItem(authKey(config.dapp.name,config.dapp.url),true)
}

export const isAuthDApp = (config: IConfig)=>{
    return selfStorage.getItem(authKey(config.dapp.name,config.dapp.url))
}

const authKey = (dappName:string,dappHost:string) =>{
    return `${AUTH_DAPP_PRE}_${dappName}_${dappHost}`
}