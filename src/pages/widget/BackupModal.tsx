import * as React from 'react';
import {
    IonModal, IonContent,
    IonButton, IonPage
} from '@ionic/react'
import "./index.css";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;
    selected: AccountModel;

    router: HTMLIonRouterOutletElement | null;
}

export const BackupModal: React.FC<Props> = ({
                                                      showModal, selected, onCancel, router,
                                                      onOk,
                                                      onReject
                                                  }) => {

    return (
        <>
            {/* Card Modal */}
            <IonModal
                isOpen={showModal}
                initialBreakpoint={0.5}
                breakpoints={[0, 0.5]}
                onDidDismiss={(e) => {
                    onCancel()
                }}>
                <IonPage>
                    <IonContent >
                        <div className="backup-modal">
                            <h3 style={{textAlign:"center"}}>Protect your funds</h3>
                            <div><p>Your Secret Recovery Phrase controls your current account.</p>
                                <ul>
                                    <li><b>Never share your Secret Recovery Phrase with anyone</b></li>
                                    <li>The EMIT team will never ask for you Secret Recovery Phrase</li>
                                    <li>Always keep your Secret Recovery Phrase in a secure and secret place</li>
                                </ul>
                            </div>
                            <div style={{textAlign:"center"}}>
                               <IonButton expand="block" onClick={()=>{
                                   onOk()
                               }}>Back up</IonButton>
                            </div>
                        </div>
                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}