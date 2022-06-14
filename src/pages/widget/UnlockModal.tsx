import * as React from 'react';
import {
    IonModal, IonContent, IonHeader, IonToolbar,
    IonButton, IonInput,
    IonChip, IonText, IonTitle, IonLabel, IonItem,
    IonRow, IonCol, IonIcon, IonPage
} from '@ionic/react'
import {
    close, linkOutline,
} from "ionicons/icons";
import "./index.css";
import {getParentUrl} from "../../common/utils";
import {IConfig} from "@emit-technology/emit-account-node-sdk";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: (password) => void;
    onReject?: () => void;
    config: IConfig

    router: HTMLIonRouterOutletElement | null;
}

export const UnlockModal: React.FC<Props> = ({
       showModal, onCancel, router,
       onOk,
       onReject,config
   }) => {

    const [password,setPassword] = React.useState("");
    const host = getParentUrl();
    return (
        <>
            {/* Card Modal */}
            <IonModal
                isOpen={showModal}
                swipeToClose={true}
                presentingElement={router || undefined}
                className="unlock-modal"
                onDidDismiss={() => onCancel()}
            >

                <IonPage>
                    <IonHeader  collapse="fade">
                        <IonToolbar color="white">
                            <IonTitle>Unlock Account</IonTitle>
                            <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                onCancel()
                            }}/>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen scrollY>
                        <div style={{position:"relative"}}>
                            <div >
                                <IonItem lines="none">
                                    <IonIcon src={linkOutline} slot="start"/>
                                    <IonLabel className="ion-text-wrap">
                                        <div className="text-primary"><IonText color="dark">{host}</IonText></div>
                                        <div>
                                            <IonChip outline color="primary">{config && config.dapp.name}</IonChip>
                                        </div>
                                    </IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel position="floating">Please enter your account password</IonLabel>
                                    <IonInput type="password" onIonChange={(e)=>{
                                        setPassword(e.detail.value);
                                    }}/>
                                </IonItem>
                            </div>
                            <div className="btn-bottom">
                                <IonRow>
                                    {/*<IonCol size="5">*/}
                                    {/*    <IonButton size="small" expand="block" fill="outline" onClick={() => {*/}
                                    {/*        onReject()*/}
                                    {/*    }}>Reject</IonButton>*/}
                                    {/*</IonCol>*/}
                                    <IonCol>
                                        <IonButton color="primary" expand="block" onClick={() => {
                                            onOk(password);
                                        }}>Unlock</IonButton>
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCol>
                                        <div className="powered-by">
                                            <img src="./assets/icon/icon.png"/>
                                            <small>powered by emit technology</small>
                                        </div>
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