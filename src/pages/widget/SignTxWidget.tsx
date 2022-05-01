import * as React from 'react';
import {
    IonModal, IonContent, IonHeader, IonToolbar, IonSegment,
    IonSegmentButton, IonButton,
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

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;
    router: HTMLIonRouterOutletElement | null;

    transaction?: any
}

export const SignTxWidget: React.FC<Props> = ({
                                                  showModal,
                                                  onReject,
                                                  onCancel,
                                                  onOk,
                                                  transaction,
                                                  router,
                                              }) => {

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
                        <div style={{position: "relative", maxHeight: '100vh', overflowY: "scroll"}}>
                            <div style={{marginTop: "5px", borderBottom: "1px solid #ddd"}}>
                                <IonRow>
                                    <IonCol size="5">
                                        <IonItem lines="none">
                                            <IonAvatar>
                                                <Avatar name={"Test"} round size="30"/>
                                            </IonAvatar>
                                            <IonLabel>Account3</IonLabel>
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
                                            <IonLabel>0xaaa</IonLabel>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </div>
                            <div style={{padding: "12px"}}>
                                <IonItem lines="none">
                                    <IonIcon src={linkOutline} slot="start"/>
                                    <IonLabel className="ion-text-wrap">
                                        <div className="text-primary"><IonText
                                            color="dark">https://localhost:3000</IonText></div>
                                        <div>
                                            <IonChip outline color="medium">EMIT Cross</IonChip>
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
                            }}>0.0001
                            </div>
                            <div>
                                <IonSegment mode="md" value={"friends"}
                                            onIonChange={e => console.log('Segment selected', e.detail.value)}>
                                    <IonSegmentButton value="friends">
                                        <IonLabel>Info</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton value="enemies">
                                        <IonLabel>Data</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </div>
                            <div style={{marginTop: "12px"}}>
                                <IonItem>
                                    <IonLabel>Estimated Gas</IonLabel>
                                    <IonLabel className="ion-text-wrap">
                                        <div className="ion-text-right"><IonText color="primary">Edit</IonText></div>
                                        <div className="text-secondary ion-text-right">11</div>
                                        <div className="text-primary ion-text-right">0.11111BNB</div>
                                    </IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Total</IonLabel>
                                    <IonLabel className="ion-text-wrap">
                                        <div className="text-secondary ion-text-right">11</div>
                                        <div className="text-primary ion-text-right">0.11111BNB</div>
                                    </IonLabel>
                                </IonItem>
                            </div>
                            <div className="btn-bottom">
                                <IonRow>
                                    <IonCol size="5">
                                        <IonButton expand="block" fill="outline" onClick={()=>{
                                            onReject();
                                        }}>Reject</IonButton>
                                    </IonCol>
                                    <IonCol size="7">
                                        <IonButton expand="block" onClick={()=>{
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