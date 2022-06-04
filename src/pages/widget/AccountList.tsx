import * as React from 'react';
import {
    IonModal, IonContent, IonHeader, IonToolbar, IonAvatar,IonText,IonBadge,
    IonRadio, IonTitle, IonLabel, IonItem, IonIcon, IonPage, IonCol, IonRow,
} from '@ionic/react'
import {
    checkmarkCircleOutline,
    close,
} from "ionicons/icons";
import "./index.css";
import {AccountModel, ChainType} from "@emit-technology/emit-types";
import Avatar from "react-avatar";
import {utils} from "../../common/utils";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: (account: AccountModel) => void;
    onReject?: () => void;
    accounts: Array<AccountModel>;
    selected: AccountModel;

    router: HTMLIonRouterOutletElement | null;
}

export const AccountListModal: React.FC<Props> = ({
                                                      showModal, selected, accounts, onCancel, router,
                                                      onOk,
                                                      onReject
                                                  }) => {

    return (
        <>
            {/* Card Modal */}
            <IonModal
                isOpen={showModal}
                initialBreakpoint={0.5}
                breakpoints={[0, 0.5, 1]}
                onDidDismiss={(e) => {
                    onCancel()
                }}>
                <IonPage>
                    <IonHeader>
                        <IonToolbar color="white">
                            <IonTitle>
                                Select Account
                                <div className="powered-by">
                                    <img src="./assets/icon/icon.png"/>
                                    <small>powered by emit</small>
                                </div>
                            </IonTitle>
                            <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                onCancel()
                            }}/>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent scrollY>
                        {
                            accounts && accounts.map((v,i) => {
                                return <IonItem key={i} onClick={()=>{
                                    onOk(v)
                                }}>
                                    <IonAvatar slot="start">
                                        <Avatar name={v.name} round size="30"/>
                                    </IonAvatar>
                                    <IonLabel className="ion-text-wrap">
                                        <b>{v.name}</b>
                                        <div><IonText color="primary">
                                            <img src="./assets/img/logo/EMIT.png" width="20" style={{ transform: 'translateY(5px)'}}/> <small>{utils.ellipsisStr(v.addresses[ChainType.EMIT])}</small></IonText>
                                        </div>
                                        <div><IonText color="medium">
                                            <img src="./assets/img/logo/ETH.png" width="20" style={{ transform: 'translateY(5px)'}}/> <small>{utils.ellipsisStr(v.addresses[ChainType.ETH])}</small></IonText>
                                        </div>
                                    </IonLabel>
                                    {
                                        selected && selected.accountId == v.accountId && <IonBadge>Current</IonBadge>

                                    }

                                </IonItem>
                            })
                        }
                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}