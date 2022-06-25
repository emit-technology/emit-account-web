import * as React from 'react';
import {
    IonModal, IonContent,
    IonButton, IonPage
} from '@ionic/react'
import "./index.css";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import i18n from "../../locales/i18n";

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
                            <h3 style={{textAlign:"center"}}>{i18n.t("protectYourFunds")}</h3>
                            <div><p>{i18n.t("protectTip1")}</p>
                                <ul>
                                    <li><b>{i18n.t("protectTip2")}</b></li>
                                    <li>{i18n.t("protectTip3")}</li>
                                    <li>{i18n.t("protectTip4")}</li>
                                </ul>
                            </div>
                            <div style={{textAlign:"center"}}>
                               <IonButton expand="block" onClick={()=>{
                                   onOk()
                               }}>{i18n.t("ok")}</IonButton>
                            </div>
                        </div>
                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}