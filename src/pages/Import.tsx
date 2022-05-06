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
    IonItem,
    IonLabel,IonSegment,IonSegmentButton,
    IonInput, IonText, IonButton, IonToast, IonProgressBar, IonIcon, IonTextarea, IonSpinner
} from "@ionic/react";
import './style.css';
import walletWorker from "../worker/walletWorker";
import selfStorage from "../common/storage";
import url from "../common/url";
import i18n from '../locales/i18n'
import {config} from "../common/config";

interface State {
    mnemonic:string
    name: string;
    password: string;
    rePassword: string;
    tips: string;
    showToast:boolean;
    toastMessage?:string
    showProgress:boolean
    showPasswordTips:boolean
    segment:string
}

class ImportAccount extends React.Component<any, State> {

    state: State = {
        mnemonic:"",
        name: "",
        password: "",
        rePassword: "",
        tips: "",
        showToast:false,
        toastMessage:"",
        showProgress:false,
        showPasswordTips:false,
        segment:"mnemonic"
    }

    componentDidMount() {
    }

    confirm = ()=>{
        const {name,password,rePassword,tips,mnemonic,segment} = this.state;
        if(!name){
            this.setShowToast(true,"Please Input Name!");
            return;
        }
        if(!password){
            this.setShowToast(true,"Please Input Password!");
            return;
        }else{
            if(password.length<8){
                this.setShowToast(true,i18n.t("passwordTip"));
                return;
            }
        }
        if(!rePassword){
            this.setShowToast(true,"Please Input Repeat Password!");
            return;
        }
        if(password != rePassword){
            this.setShowToast(true,"Password do not match");
            return;
        }
        this.setState({
            showProgress:true,
        })
        if(segment == "mnemonic"){
            walletWorker.importMnemonic(mnemonic, name, password, tips, "").then(((accountId:any) => {
                if(accountId){
                    sessionStorage.removeItem("tmpMnemonic");
                    config.TMP.MNEMONIC = "";
                    sessionStorage.removeItem("tmpAccount");
                    selfStorage.setItem("accountId",accountId)
                    // window.location.href = "/#/"
                    // window.location.reload();
                    selfStorage.setItem("viewedSlide",true);
                    url.home();
                    window.location.reload();
                }
            })).catch((e)=>{
                const err = typeof e === "string"?e:e.message;
                this.setShowToast(true,err)
                this.setState({
                    showProgress:false,
                })
            })

        }else{
            walletWorker.importPrivateKey(mnemonic, name, password, tips, "").then(((accountId:any) => {
                if(accountId){
                    sessionStorage.removeItem("tmpMnemonic");
                    config.TMP.MNEMONIC = "";
                    sessionStorage.removeItem("tmpAccount");
                    selfStorage.setItem("accountId",accountId)
                    // window.location.href = "/#/"
                    // window.location.reload();
                    selfStorage.setItem("viewedSlide",true);
                    url.home();
                    window.location.reload();
                }
            })).catch((e)=>{
                const err = typeof e === "string"?e:e.message;
                this.setShowToast(true,err)
                this.setState({
                    showProgress:false,
                })
            })

        }

    }

    setShowToast = (f:boolean,m?:string) =>{
        this.setState({
            showToast:f,
            toastMessage:m
        })
    }

    setSegment = (e:any)=>{
        this.setState({
            segment:e.detail.value
        })
    }

    render() {
        const {name,password,rePassword,tips,showToast,showPasswordTips,toastMessage,showProgress,mnemonic,segment} = this.state;
        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader>
                        <IonToolbar mode="ios" color="primary">
                            <IonTitle>
                                <IonText>{i18n.t("import")} {i18n.t("wallet")}</IonText>
                            </IonTitle>
                            {/*<IonIcon slot="end" src={downloadOutline} color="primary" size="large"/>*/}
                            <IonButton fill="outline" color="warning" size="small"  slot="end" onClick={()=>{
                                // window.location.href="/#/account/create"
                                url.accountCreate();
                            }}>{i18n.t("create")}</IonButton>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <div className="import-segment">
                        <IonSegment mode="ios" value={segment} onIonChange={(e:any) => {
                            this.setSegment(e)
                        }}>
                            <IonSegmentButton value="mnemonic">
                                <IonLabel>{i18n.t("mnemonicPhrase")}</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="privateKey">
                                <IonLabel>{i18n.t("privateKey")}</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </div>
                    {segment === "mnemonic"?
                        <IonList>
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("mnemonicPhrase")}</IonText></IonLabel>
                                <IonTextarea placeholder={i18n.t("mnemonicTip")} rows={3} mode="ios" clearOnEdit autofocus value={mnemonic} onIonChange={(e:any) => {
                                    this.setState({
                                        mnemonic:e.target.value!
                                    })
                                }}/>
                            </IonItem>

                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("wallet")} {i18n.t("name")}</IonText></IonLabel>
                                <IonInput mode="ios" autocomplete="off"  value={name} onIonChange={(e:any) => {
                                    this.setState({
                                        name:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("wallet")} {i18n.t("password")}</IonText></IonLabel>
                                <IonInput mode="ios" autocomplete="new-password"  type="password" value={password} onIonChange={(e: any) => {
                                    this.setState({
                                        password:e.target.value!
                                    })
                                }} onIonFocus={()=>{
                                    this.setState({showPasswordTips:true})
                                }} onIonBlur={()=>{
                                    this.setState({showPasswordTips:false})
                                }}/>
                            </IonItem>
                            {showPasswordTips && <div className="password-tips">
                                {i18n.t("passwordTip")}
                            </div>}
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("repeat")} {i18n.t("password")}</IonText></IonLabel>
                                <IonInput mode="ios" autocomplete="new-password"  type="password" value={rePassword} onIonChange={(e: any) => {
                                    this.setState({
                                        rePassword:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("password")} {i18n.t("hint")}({i18n.t("optional")})</IonText></IonLabel>
                                <IonInput mode="ios" value={tips} onIonChange={(e: any) => {
                                    this.setState({
                                        tips:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                        </IonList>

                        :<IonList>
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("privateKey")}</IonText></IonLabel>
                                <IonTextarea placeholder={i18n.t("privateKeyTip")} rows={3} mode="ios" clearOnEdit autofocus value={mnemonic} onIonChange={(e:any) => {
                                    this.setState({
                                        mnemonic:e.target.value!
                                    })
                                }}/>
                            </IonItem>

                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("wallet")} {i18n.t("name")}</IonText></IonLabel>
                                <IonInput mode="ios" value={name} onIonChange={(e:any) => {
                                    this.setState({
                                        name:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("wallet")} {i18n.t("password")}</IonText></IonLabel>
                                <IonInput mode="ios" type="password" value={password} onIonChange={(e: any) => {
                                    this.setState({
                                        password:e.target.value!
                                    })
                                }} onIonFocus={()=>{
                                    this.setState({showPasswordTips:true})
                                }} onIonBlur={()=>{
                                    this.setState({showPasswordTips:false})
                                }}/>
                            </IonItem>
                            {showPasswordTips && <div className="password-tips">
                                {i18n.t("passwordTip")}
                            </div>}
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("repeat")} {i18n.t("password")}</IonText></IonLabel>
                                <IonInput mode="ios" type="password" value={rePassword} onIonChange={(e: any) => {
                                    this.setState({
                                        rePassword:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel position="stacked"><IonText color="medium">{i18n.t("password")} {i18n.t("hint")}({i18n.t("optional")})</IonText></IonLabel>
                                <IonInput mode="ios" value={tips} onIonChange={(e: any) => {
                                    this.setState({
                                        tips:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                        </IonList>
                    }

                    <div className="button-bottom">
                        <IonButton mode="ios" expand="block" disabled={showProgress || !mnemonic || !name || !password || !rePassword} onClick={()=>{
                            this.confirm();
                        }}>{showProgress&&<IonSpinner name="bubbles" />}{i18n.t("next")}</IonButton>
                    </div>

                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="warning"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMessage}
                        duration={1500}
                    />
                </IonContent>
            </IonPage>
        </>
    }
}

export default ImportAccount;