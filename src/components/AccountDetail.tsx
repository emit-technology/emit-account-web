import * as React from 'react';
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import {IonButton, IonChip, IonCol, IonIcon, IonRow, IonText, useIonToast} from '@ionic/react'
import {config} from "../common/config";
import copy from 'copy-to-clipboard';
import {copyOutline} from "ionicons/icons";
import i18n from "../locales/i18n";

const QRCode = require('qrcode.react');

interface Props{
    account:AccountModel
    showChainId:ChainType;
    onClose:()=>void;
    onBackup:()=>void;
    onExportPrivateKey?:()=>void;
}

export const AccountDetail :React.FC<Props> = ({account,onExportPrivateKey,onClose,onBackup,showChainId})=>{
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
                    const data:any = {
                        // buttons: [{ text: 'Close', handler: () => dismiss() }],
                        message: i18n.t("copied"),
                        duration: 600,
                        position: 'top',
                        color: 'primary',
                        cssClass:'toast-default',
                        animated: true,
                        onDidDismiss: () => console.log('dismissed'),
                        onWillDismiss: () => console.log('will dismiss'),
                    }
                    present(data).catch(e=>console.error(e))

                }}>{account.addresses[showChainId]} <IonIcon src={copyOutline} color="medium" /></IonChip>
            </div>
        </div>
        <div>
            {
                showChainId != ChainType.EMIT && <IonRow>
                    <IonCol>
                        <IonButton expand="block" fill="outline" onClick={()=>{
                            const url = config.EXPLORER.ADDRESS[ChainType[showChainId]]+account.addresses[showChainId];
                            window.open(url,"_blank")
                        }}>{i18n.t("viewOnExplorer")}</IonButton>

                    </IonCol>
                </IonRow>
            }
            <IonRow>
                <IonCol>
                    <IonButton expand="block" fill="outline" onClick={()=>{
                        onBackup()
                    }}>{i18n.t("backupAccount")}</IonButton>
                </IonCol>
            </IonRow>
            {
                onExportPrivateKey && <IonRow>
                    <IonCol>
                        <IonButton expand="block" fill="outline" onClick={()=>{
                            onExportPrivateKey()
                        }}>{i18n.t("exportPrivateKey")}</IonButton>
                    </IonCol>
                </IonRow>
            }

        </div>
    </div>
}