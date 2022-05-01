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
        unlock: "account/unlock"
    }

    private transaction = {
        tunnel:"tunnel",
        tunnelNFT:"tunnel-nft",
        transfer: "transfer",
        transferNft: "transfer-nft",
        list: "transaction/list",
        info: "transaction/info",
    }

    private settings = {
        setting: "tabs/settings",
        about:"manage/about",
    }

    private epoch = {
        index : "tabs/epoch",
        altar : "epoch/altar",
        chaos : "epoch/chaos",
        deviceRank : "epoch/device/rank",
        driverRank : "epoch/driver/rank",
        poolHashRate: "epoch/pool/hashrate",
        poolInfo: "epoch/pool/info",
        freeze: "epoch/freeze",
        unfreeze: "epoch/unfreeze",
        stargrid: "epoch/starGrid",
    }
    private browserBase = "browser"

    private chartBase = "chart"

    private nftTabs = "tabs/nft"

    private scan = "scan";

    private swapWEth = "swap/eth";

    private exchange = {
        market:"trade/market",
        swap:"trade/swap",
        marketSearch:"trade/market/search",
        marketStatics: "trade/market/statics"
    }

    constructor() {
    }

    path_settings = () => {
        return [this.base, this.settings.setting].join("/")
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
            const pre = pathArr.pop();
            sessionStorage.setItem("history", JSON.stringify(pathArr));
            window.location.href = pre;
            // window.location.reload();
        } else {
            this.home();
        }
    }


    home() {
        this.goTo(this.base, "/");
        return
    }

    accountCreate(pre?:string) {
        this.goTo([this.base, this.account.create].join("/"), pre?pre:"");
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
        this.goTo([this.base, this.account.export].join("/"), [this.base, this.settings].join("/"));
    }

    accountUnlock() {
        console.log("unlock account")
        // if (process.env.NODE_ENV == "development"){
        //     walletWorker.unlockWallet("12345678")
        // }else{
            this.goTo([this.base, this.account.unlock].join("/"), "");
        // }
    }
}

const url = new Url();
export default url;