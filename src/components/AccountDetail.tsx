import * as React from 'react';
import {AccountModel, ChainType} from "@emit-technology/emit-types";
import {IonChip, IonRow, IonCol, IonButton, IonText, useIonToast} from '@ionic/react'
import {config} from "../common/config";
import copy from 'copy-to-clipboard';

const QRCode = require('qrcode.react');

interface Props{
    account:AccountModel
    showChainId:ChainType;
    onClose:()=>void;
}

export const AccountDetail :React.FC<Props> = ({account,onClose,showChainId})=>{
    const [present, dismiss] = useIonToast();

    return <div className="account-box">
        <div className="account-detail">
            <h1><span><IonText color="primary">{config.CHAIN_DESCRIPTION[ChainType[showChainId]]}</IonText></span>
                <div style={{position:"absolute",right:"20px",top:"6px",color:"#4d4d4d"}} onClick={()=>{
                    onClose()
                }}>x</div>
            </h1>
            <QRCode value={account.addresses[showChainId]} level="L"/>
            <div className="acct-addr">
                <IonChip color="dark" id="copied" className="addr-chip" onClick={()=>{
                    // @ts-ignore
                    copy(account.addresses[showChainId]);

                    present({
                        // buttons: [{ text: 'Close', handler: () => dismiss() }],
                        message: 'Copied to clipboard !',
                        duration: 600,
                        position: 'top',
                        color: 'primary',
                        cssClass:'toast-default',
                        animated: true,
                        onDidDismiss: () => console.log('dismissed'),
                        onWillDismiss: () => console.log('will dismiss'),
                    }).catch(e=>console.error(e))

                }}>{account.addresses[showChainId]}</IonChip>
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
        </div>
    </div>
}