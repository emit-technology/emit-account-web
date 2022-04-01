import * as React from 'react';
import {AccountModel, ChainType} from "emit-types";
import {IonChip,IonRow,IonCol,IonButton,IonText} from '@ionic/react'
import {config} from "../common/config";
const QRCode = require('qrcode.react');

interface Props{
    account:AccountModel
    showChainId:ChainType
}

export const AccountDetail :React.FC<Props> = ({account,showChainId})=>{
    return <div className="account-box">
        <div className="account-detail">
            <h1><IonText color="primary">{config.CHAIN_DESCRIPTION[ChainType[showChainId]]}</IonText></h1>
            <QRCode value={account.addresses[showChainId]} level="L"/>
            <div className="acct-addr">
                <IonChip color="dark" className="addr-chip">{account.addresses[showChainId]}</IonChip>
            </div>
        </div>
        <div>
            <IonRow>
                <IonCol>
                    <IonButton expand="block" fill="outline" onClick={()=>{
                       const url = config.EXPLORER.ADDRESS[ChainType[showChainId]]+account.addresses[showChainId];
                       window.open(url,"_blank")
                    }}>View Detail in Explorer</IonButton>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol>
                    <IonButton expand="block" fill="outline">Export Private Key</IonButton>
                </IonCol>
            </IonRow>
        </div>
    </div>
}