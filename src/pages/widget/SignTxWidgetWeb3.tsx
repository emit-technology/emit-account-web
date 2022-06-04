import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonChip,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,
    IonToolbar
} from '@ionic/react'
import {arrowForwardCircleOutline, close, linkOutline,} from "ionicons/icons";
import Avatar from "react-avatar";
import "./index.css";
import {IConfig} from "@emit-technology/emit-account-node-sdk";
import {AccountModel, ChainType} from "@emit-technology/emit-types";
import {getParentUrl, utils} from "../../common/utils";
import {Transaction} from "web3-core";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;
    router: HTMLIonRouterOutletElement | null;

    transaction: Transaction;
    config: IConfig;
    account: AccountModel
}

export const SignTxWidgetWeb3: React.FC<Props> = ({
                                                  showModal,
                                                  onReject,
                                                  onCancel,
                                                  onOk,
                                                  transaction,
                                                  account,
                                                  config,
                                                  router,
                                              }) => {
    const [segment,setSegment] = React.useState("info");
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
                            <IonTitle>Sign Transaction</IonTitle>
                            <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                onCancel()
                            }}/>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen scrollY>
                        <div style={{position: "relative", maxHeight: '100vh', overflowY: "scroll"}}>
                            <div style={{marginTop: "5px", borderBottom: "1px solid #ddd"}}>
                                <IonRow>
                                    <IonCol size="5">
                                        <IonItem lines="none">
                                            <IonAvatar>
                                                <Avatar name={"Test"} round size="30"/>
                                            </IonAvatar>
                                            <IonLabel>{account.name}</IonLabel>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="2">
                                        <IonItem lines="none">
                                            <IonLabel><IonIcon src={arrowForwardCircleOutline}/></IonLabel>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="5">
                                        <IonItem lines="none">
                                            <IonAvatar>
                                                <Avatar name={"aaa"} round size="30"/>
                                            </IonAvatar>
                                            <IonLabel>{
                                               transaction.to
                                            }</IonLabel>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <div style={{padding: "12px"}}>
                                <IonItem lines="none">
                                    <IonIcon src={linkOutline} slot="start"/>
                                    <IonLabel className="ion-text-wrap">
                                        <div className="text-primary"><IonText
                                            color="dark">{getParentUrl()}</IonText></div>
                                        <div>
                                            <IonChip outline color="medium">{config.dapp.name}</IonChip>
                                        </div>
                                    </IonLabel>
                                </IonItem>
                            </div>
                            <div style={{
                                fontSize: '32px',
                                borderBottom: "1px solid #ddd",
                                fontWeight: 600,
                                padding: "12px 36px 24px",
                                color: "#4d4d4d"
                            }}>
                                {utils.fromValue(transaction.value,18).toString(10)} BNB
                            </div>
                            <div>
                                <IonSegment mode="md" value={segment}
                                            onIonChange={e => {
                                                console.log('Segment selected', e.detail.value);
                                                setSegment(e.detail.value)
                                            }}>
                                    <IonSegmentButton value="info">
                                        <IonLabel>Info</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value="data">
                                        <IonLabel>Data</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </div>
                            {
                                segment == 'info' &&
                                <div style={{marginTop: "12px"}}>
                                    {/*<IonItem>*/}
                                    {/*    <IonLabel>Value</IonLabel>*/}
                                    {/*    <IonLabel className="ion-text-wrap">*/}
                                    {/*        <div className="text-primary ion-text-right">{utils.fromValue(transaction.value,18).toString(10)} BNB</div>*/}
                                    {/*    </IonLabel>*/}
                                    {/*</IonItem>*/}
                                    <IonItem>
                                        <IonLabel>Estimated Gas</IonLabel>
                                        <IonLabel className="ion-text-wrap">
                                            <div className="ion-text-right"><IonText color="primary">Edit</IonText></div>
                                            <div className="text-secondary ion-text-right">{utils.fromValue(transaction.gas,0).toString(10)} * {utils.fromValue(transaction.gasPrice,9).toString(10)} GWei</div>
                                            <div className="text-primary ion-text-right">{utils.fromValue(transaction.gas,0).multipliedBy(utils.fromValue(transaction.gasPrice,18)).toString(10)}BNB</div>
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Total</IonLabel>
                                        <IonLabel className="ion-text-wrap">
                                            {/*<div className="text-secondary ion-text-right">11</div>*/}
                                            <div className="text-primary ion-text-right">{utils.fromValue(transaction.value,18).plus(utils.fromValue(transaction.gas,0).multipliedBy(utils.fromValue(transaction.gasPrice,18))).toString(10)} BNB</div>
                                        </IonLabel>
                                    </IonItem>
                                </div>
                            }
                            {
                                segment == 'data' &&
                                <div className="pre-data">
                                    {
                                        JSON.stringify(transaction["data"],undefined,2)
                                    }
                                </div>
                            }
                            <div>
                                <IonRow>
                                    <IonCol size="5">
                                        <IonButton expand="block" fill="outline" onClick={() => {
                                            onReject();
                                        }}>Reject</IonButton>
                                    </IonCol>
                                    <IonCol size="7">
                                        <IonButton expand="block" onClick={() => {
                                            onOk();
                                        }}>Confirm</IonButton>
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