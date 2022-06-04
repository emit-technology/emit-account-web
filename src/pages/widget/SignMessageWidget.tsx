import * as React from 'react';
import {
    IonModal, IonContent, IonHeader, IonToolbar, IonSegment,
    IonSegmentButton, IonButton,
    IonChip, IonText, IonTitle, IonMenuToggle, IonAvatar, IonLabel, IonItem,
    IonItemDivider, IonRow, IonCol, IonIcon, IonPage
} from '@ionic/react'
import {
    close, linkOutline,
} from "ionicons/icons";
import Avatar from "react-avatar";
import "./index.css";
import {IConfig} from "@emit-technology/emit-account-node-sdk";
import {AccountModel, ChainType} from "@emit-technology/emit-types";
import {getParentUrl} from "../../common/utils";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;

    router: HTMLIonRouterOutletElement | null;

    msg: any
    config: IConfig
    account:AccountModel
}

export const SignMessageWidget: React.FC<Props> = ({
                                                       showModal,
                                                       onReject,
                                                       onCancel,
                                                       onOk,
                                                       msg,config,account,
                                                       router,
                                                   }) => {
    const refer = getParentUrl();

    return (
        <>
            {/* Card Modal */}
            <IonModal
                isOpen={!!showModal}
                swipeToClose={true}
                presentingElement={router || undefined}
                onDidDismiss={() => onCancel()}
            >

                <IonPage>
                    <IonHeader>
                        <IonToolbar color="white">
                            <IonTitle>EMIT Notification</IonTitle>
                            <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                onCancel()
                            }}/>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen scrollY>
                        <div style={{position: "relative", height: "auto", overflowY: "scroll"}}>
                            <div style={{
                                background: "#eaedf0",
                                fontWeight: 600,
                                color: "#5b5d66",
                                padding: "6px",
                                textAlign: "center"
                            }}>
                                <h1 style={{fontSize: "24px"}}>Sign Message</h1>
                            </div>
                            <div style={{marginTop: "5px", borderBottom: "1px solid #ddd"}}>
                                {
                                    account &&
                                    <IonRow>
                                        <IonCol size="5">
                                            <IonItem lines="none">
                                                <IonAvatar>
                                                    <Avatar name={account.name} round size="30"/>
                                                </IonAvatar>
                                                <IonLabel>{account.name}</IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                }
                            </div>
                            <div style={{padding: "12px"}}>
                                {
                                    config &&
                                    <IonItem lines="none">
                                        <IonIcon src={linkOutline} slot="start"/>
                                        <IonLabel className="ion-text-wrap">
                                            <div className="text-primary"><IonText
                                                color="dark">{refer}</IonText></div>
                                            <div>
                                                <IonChip outline color="medium">{config.dapp.name}</IonChip>
                                            </div>
                                        </IonLabel>
                                    </IonItem>
                                }
                            </div>
                            <div style={{
                                fontSize: '24px',
                                borderBottom: "2px solid #ddd",
                                fontWeight: 600,
                                padding: "0px 24px 6px",
                                color: "#4d4d4d"
                            }}>
                                Signing Message
                            </div>
                            <div  className="pre-data">
                                <pre>
                                                {JSON.stringify(msg,undefined,2)}
                                            </pre>
                            </div>
                            <div className="btn-bottom">
                                <IonRow>
                                    <IonCol size="5">
                                        <IonButton expand="block" fill="outline" onClick={() => {
                                            onReject();
                                        }}>Reject</IonButton>
                                    </IonCol>
                                    <IonCol size="7">
                                        <IonButton expand="block" onClick={() => {
                                            onOk()
                                        }}>Sign</IonButton>
                                    </IonCol>
                                </IonRow>
                            </div>
                        </div>

                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}