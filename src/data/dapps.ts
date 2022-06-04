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

    remove = (host:string) =>{
        selfStorage.removeItem(this._key(host))
    }

    all = ()=>{
        const keys:Array<string> = selfStorage.keys(PREFIX);
        return keys.map(value => {
            return value.replace(value,PREFIX);
        })
    }

    _key = (k:string)=>{
        return `${PREFIX}${k.replace(":","_")}`
    }
}

export const dappData = new Dapps();