import * as React from 'react';
import {
    IonModal, IonContent, IonHeader, IonToolbar, IonSegment,
    IonSegmentButton, IonButton, IonCheckbox,
    IonChip, IonText, IonTitle, IonMenuToggle, IonAvatar, IonLabel, IonItem,
    IonItemDivider, IonRow, IonCol, IonIcon, IonPage
} from '@ionic/react'
import {
    arrowForwardCircleOutline,
    chevronForward,
    chevronForwardCircle,
    chevronForwardCircleOutline,
    chevronForwardOutline,
    close, linkOutline,
    list
} from "ionicons/icons";
import Avatar from "react-avatar";
import "./index.css";
import {IConfig} from "@emit-technology/emit-account-node-sdk";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import {getParentUrl, utils} from "../../common/utils";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;

    router: HTMLIonRouterOutletElement | null;
    config: IConfig
    account: AccountModel
}

export const ApproveWidget: React.FC<Props> = ({
       showModal, onCancel, router,
       onOk, config, account,
       onReject
   }) => {

    const host = getParentUrl();
    return (
        <>
            {/* Card Modal */}
            <IonModal
                isOpen={showModal}
                swipeToClose={true}
                presentingElement={router || undefined}
                className="approve-modal"
                onDidDismiss={() => onCancel()}
            >

                <IonPage>
                    <IonHeader  collapse="fade">
                        <IonToolbar color="white">
                            <IonTitle>
                                EMIT Notification
                                <div className="powered-by">
                                    <img src="./assets/icon/icon.png"/>
                                    <small>powered by emit technology</small>
                                </div>
                            </IonTitle>
                            <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                onCancel()
                            }}/>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <div>
                            <div style={{padding: "12px 12px 0"}}>
                                <IonItem lines="none">
                                    <IonIcon src={linkOutline} slot="start"/>
                                    <IonLabel className="ion-text-wrap">
                                        <div className="text-primary"><IonText color="dark">{host}</IonText></div>
                                        <div>
                                            <IonChip outline color="medium">{config &&config.dapp && config.dapp.name}</IonChip>
                                        </div>
                                    </IonLabel>
                                </IonItem>
                            </div>
                            <div style={{
                                borderBottom: "1px solid #ddd", fontWeight: 500,
                                padding: "12px 36px 24px", color: "#4d4d4d"
                            }}>
                                Your current account is not connected
                            </div>
                            <div style={{minHeight: "100px", overflowY: "scroll"}}>
                                <div style={{padding: "12px 0", borderBottom: "1px solid #ddd"}}>
                                    {
                                        account && account.addresses && config && config.network && <IonItem lines="none" color="warning">
                                            <IonAvatar slot="start">
                                                <Avatar name={account.name} round size="45"/>
                                            </IonAvatar>
                                            <IonLabel className="ion-text-wrap">
                                                <div><b>{account.name}</b></div>
                                                <p>({utils.ellipsisStr(account.addresses[config.network.chainType], 7)})</p>
                                                <p></p>
                                            </IonLabel>
                                        </IonItem>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="btn-bottom">
                            <IonRow>
                                <IonCol size="5">
                                    <IonButton expand="block" fill="outline" onClick={() => {
                                        onReject()
                                    }}>Reject</IonButton>
                                </IonCol>
                                <IonCol size="7">
                                    <IonButton expand="block" onClick={() => {
                                        onOk();
                                    }}>Connect</IonButton>
                                </IonCol>
                            </IonRow>
                        </div>
                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}