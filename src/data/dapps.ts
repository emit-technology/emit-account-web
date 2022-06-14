import selfStorage from "../common/storage";

const PREFIX = "trust_dapp_"

class Dapps {

    set = (host:string, accountId:string) =>{
        let arr = selfStorage.getItem(this._key(host));
        if(!arr){
           arr = [accountId];
        }else{
            arr.push(accountId);
        }
        selfStorage.setItem(this._key(host),arr);
    }

    get = (host:string) =>{
        const _key = this._key(host);
        const rest = selfStorage.getItem(_key);
        return rest;
    }

    remove = (host:string,actId:string) =>{
        const accountIds = selfStorage.getItem(this._key(host));
        const arr:Array<string> = accountIds;
        const index = arr.indexOf(actId);
        arr.splice(index,1)
        selfStorage.setItem(this._key(host),arr);
    }

    all = (accountId:string)=>{
        const keys:Array<string> = selfStorage.keys(PREFIX);
        const rest:Array<string> = [];
        for(let key of keys){
           const k = key.replace(PREFIX,"");
           const value = selfStorage.getItem(key);
           if (value && value.indexOf(accountId)>-1){
               rest.push(k)
           }
        }
        return rest;
    }

    _key = (k:string)=>{
        return `${PREFIX}${k}`
    }
}

export const dappData = new Dapps();