/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */

class Storage{

    getItem = (key:string)=>{
        const rest:any = localStorage.getItem(key);
        if(rest){
            try{
                return JSON.parse(rest);
            }catch (e){
                return rest
            }
        }
        return rest;
    }

    createCookie(name, value, days) {
        let expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toUTCString()
        }
        else {
            expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
    }


    setItem = (key:string,value:any)=>{
        if(key){
            const v = typeof value === "object"?JSON.stringify(value):value;
            localStorage.setItem(key,v)
        }
    }

    removeItem = (key:string)=>{
        localStorage.removeItem(key);
    }

    clear = ()=>{
        localStorage.clear();
    }

    keys = (prefix:string):Array<any> =>{
        //@ts-ignore
        const len = localStorage.length;
        const rest:Array<string> = [];
        for (let i=0;i<len;i++){
            //@ts-ignore
            const key:string = localStorage.key(i)
            if(key && key.startsWith(prefix)){
               rest.push(key )
            }
        }
        return rest;
    }

}
const selfStorage = new Storage()
export default selfStorage