import {Browser} from "@capacitor/browser";

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

class Url {
    private base = "#"

    private account = {
        create: "account/create",
        confirm: "account/confirm",
        backup: "account/backup",
        import: "account/import",
        export: "account/export",
        receive: "account/receive",
        unlock: "account/unlock",

        list: "account/list",
    }

    private settings = {
        setting: "settings",
    }

    constructor() {
    }

    _win: Window | null;

    path_settings = () => {
        return [this.base, this.settings.setting].join("/")
    }

    path_accounts = () => {
        return [this.base, this.account.list].join("/")
    }

    /**
     * go to page
     * @param path
     * @param delay seconds
     */
    goTo(path: string, pre: string, delay?: number) {
        if (pre) {
            const data: any = sessionStorage.getItem("history");
            const pathArr = data && JSON.parse(data);
            if (pathArr && pathArr.length > 0) {
                pathArr.push(pre);
                sessionStorage.setItem("history", JSON.stringify(pathArr))
            } else {
                sessionStorage.setItem("history", JSON.stringify([pre]))
            }
        }
        if (delay) {
            setTimeout(() => {
                window.location.href = path
            })
            return
        }
        window.location.href = path
        return;
    }

    back() {
        const data: any = sessionStorage.getItem("history");
        const pathArr = data && JSON.parse(data)
        if (pathArr && pathArr.length > 0) {
            let pre = pathArr.pop();
            sessionStorage.setItem("history", JSON.stringify(pathArr));
            if(!pre || pre=="/"){
               this.home()
            }else{
                window.location.href = pre;
            }
            // window.location.reload();
        } else {
            this.home();
        }
    }


    home() {
        this.goTo(this.base,"");
        return
    }

    closeTopWindow = () => {
        if (this._win) {
            this._win.close();
        }
    }

    accountCreate(pre?: string) {
        this.goTo([this.base, this.account.create].join("/"), pre ? pre : "");
    }

    accountOpenCreate() {
        const i = Math.max((window.screen.width - 427) / 2, 20);
        const a = "popup=1,height=780,width=427,top=" + Math.max((window.screen.height - 780) / 2, 20) + ",left=" + i;
        const url = [this.base, this.account.create].join("/");
        this._win = window.open(url, "account_popup_win_" + Date.now(), a) || window.open(url);
        return !!this._win;

    }

    accountOpenBackup() {
        const i = Math.max((window.screen.width - 427) / 2, 20);
        const a = "popup=1,height=780,width=427,top=" + Math.max((window.screen.height - 780) / 2, 20) + ",left=" + i;
        const url = [this.base, "home/backup"].join("/");
        this._win = window.open(url, "account_popup_win_" + Date.now(), a) || window.open(url);
        return !!this._win;

    }

    accountBackup(pre?: string) {
        this.goTo([this.base, this.account.backup].join("/"), pre ? pre : [this.base, this.account.create].join("/"));
    }

    accountConfirm() {
        this.goTo([this.base, this.account.confirm].join("/"), [this.base, this.account.backup].join("/"));
    }

    accountImport() {
        this.goTo([this.base, this.account.import].join("/"), [this.base, this.account.create].join("/"));
    }

    accountExport() {
        this.goTo([this.base, this.account.export].join("/"), [this.base, this.settings.setting].join("/"));
    }

    accountList() {
        this.goTo([this.base, this.account.list].join("/"), [this.base, this.settings.setting].join("/"));
    }

    accountUnlock() {
        console.log("unlock account")
        // if (process.env.NODE_ENV == "development"){
        //     walletWorker.unlockWallet("12345678")
        // }else{
        this.goTo([this.base, this.account.unlock].join("/"), "");
        // }
    }

    setting() {
        this.goTo([this.base, this.settings.setting].join("/"), this.base);
    }
}

const url = new Url();
export default url;