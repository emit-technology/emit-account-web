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

import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem, IonText, IonButton, IonGrid, IonRow, IonCol, IonIcon, IonProgressBar
} from "@ionic/react";
import './style.css';
import url from "../common/url";
import {chevronBack} from "ionicons/icons";
import i18n from "../locales/i18n"
import {config} from "../common/config";
import walletWorker from "../worker/walletWorker";
import selfStorage from "../common/storage";
import {AccountModel, ChainType} from "@emit-technology/emit-types";

interface State {
    // mnemonic: Array<string>;
    showProgress: boolean
}

class Backup extends React.Component<any, State> {

    state: State = {
        // mnemonic: [],
        showProgress: false
    }

    componentDidMount() {
        const tmpMnemonic: any = config.TMP.MNEMONIC;
        if (!tmpMnemonic) {
            // window.location.href = "/#/account/create";
            url.accountCreate();
            return
        }
        // this.setState({
        //     mnemonic: tmpMnemonic.split(" ")
        // })
    }

    create = async () => {
        const account: AccountModel = config.TMP.Account; //sessionStorage.getItem("tmpAccount")
        if (account) {
            const accountId = await walletWorker.importMnemonic(config.TMP.MNEMONIC, account.name, account.password ? account.password : "", account.passwordHint, "");
            if(accountId){
                sessionStorage.removeItem("tmpMnemonic");
                config.TMP.MNEMONIC = ""
                config.TMP.Account = {}
                sessionStorage.removeItem("tmpAccount");
                selfStorage.setItem("accountId", accountId)
                // window.location.href = "/#/"
                // window.location.reload();
                selfStorage.setItem("viewedSlide", true);
                url.home();
            }
            // window.location.reload();
        }
    }

    render() {
        const {showProgress} = this.state;
        let mnemonic = config.TMP.MNEMONIC.split(" ");
        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonIcon src={chevronBack} slot="start" size="large" onClick={() => {
                                config.TMP.MNEMONIC = ""
                                url.back()
                            }}/>
                            <IonTitle>{i18n.t("backupMnemonic")}</IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <IonList>
                        <IonItem lines="none">
                            <IonText color="medium">
                                <p>
                                    {i18n.t("backupMnemonicTip1")}
                                </p>
                            </IonText>
                        </IonItem>
                        <IonItem lines={"none"}>
                            <IonGrid className="grid-c">
                                <IonRow className="border-bottom">
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[0]}</IonText>
                                        <div className="col-num">1</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[1]}</IonText>
                                        <div className="col-num">2</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[2]}</IonText>
                                        <div className="col-num">3</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="border-bottom">
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[3]}</IonText>
                                        <div className="col-num">4</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[4]}</IonText>
                                        <div className="col-num">5</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[5]}</IonText>
                                        <div className="col-num">6</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow className="border-bottom">
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[6]}</IonText>
                                        <div className="col-num">7</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[7]}</IonText>
                                        <div className="col-num">8</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[8]}</IonText>
                                        <div className="col-num">9</div>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[9]}</IonText>
                                        <div className="col-num">10</div>
                                    </IonCol>
                                    <IonCol className="grid-col border-right">
                                        <IonText>{mnemonic[10]}</IonText>
                                        <div className="col-num">11</div>
                                    </IonCol>
                                    <IonCol className="grid-col">
                                        <IonText>{mnemonic[11]}</IonText>
                                        <div className="col-num">12</div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItem>
                        <IonItem lines={"none"}>
                            <IonText color="medium">
                                <ul>
                                    <li>{i18n.t("backupMnemonicTip2")}</li>
                                    <li>{i18n.t("backupMnemonicTip3")}</li>
                                </ul>
                            </IonText>
                        </IonItem>

                    </IonList>
                    <div className="button-bottom">
                        <IonRow>
                            <IonCol size="5">
                                <IonButton disabled={showProgress} mode="ios" fill="outline" expand="block"
                                           onClick={() => {
                                               if(config.TMP.Account["name"]){
                                                   this.setState({
                                                       showProgress: true,
                                                   })
                                                   this.create().then(() => {
                                                       this.setState({
                                                           showProgress: false,
                                                       })
                                                   }).catch(e => {
                                                       console.error(e)
                                                       const err = typeof e == 'string' ? e : e.message;
                                                       this.setState({
                                                           showProgress: false,
                                                       })
                                                   })
                                               }else{
                                                   config.TMP.MNEMONIC = "" ;
                                                   url.back();
                                               }
                                           }}> Later Backup</IonButton>
                            </IonCol>
                            <IonCol size="7">
                                <IonButton disabled={showProgress} mode="ios" expand="block" onClick={() => {
                                    // window.location.href = "/#/account/confirm"
                                    url.accountConfirm();
                                }}> {i18n.t("confirmBackup")}</IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </IonContent>
            </IonPage>
        </>
    }
}

export default Backup;