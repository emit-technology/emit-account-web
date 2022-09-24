import * as React from 'react';
import {
    IonModal, IonContent, IonHeader, IonToolbar, IonAvatar,IonText,IonBadge,
    IonRadio,IonFab,IonFabButton, IonTitle, IonLabel, IonItem, IonIcon, IonPage, IonCol, IonRow,
} from '@ionic/react'
import {
    checkmarkCircleOutline,
    close, openOutline, personAddOutline,
} from "ionicons/icons";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import Avatar from "react-avatar";
import {getParentUrl, utils} from "../common/utils";
import i18n from "../locales/i18n";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: (account: AccountModel) => void;
    onReject?: () => void;
    accounts: Array<AccountModel>;
    selectedAccountId?: string ;

    router: HTMLIonRouterOutletElement | null;
}

export const AccountListModal: React.FC<Props> = ({
                                                      showModal,selectedAccountId,  accounts, onCancel, router,
                                                      onOk,
                                                      onReject
                                                  }) => {

    return (
        <>
            {/* Card Modal */}
            <IonModal
                className="modal-common"
                isOpen={showModal}
                initialBreakpoint={0.6}
                breakpoints={[0, 0.6, 1]}
                onDidDismiss={(e) => {
                    onCancel()
                }}>
                <IonPage>
                    <IonHeader  collapse="fade">
                        <IonToolbar color="white">
                            <IonTitle>
                                {i18n.t("selectAccount")}
                                <div className="powered-by">
                                    <img src="./assets/icon/icon.png"/>
                                    <small>{i18n.t("poweredByEmit")}</small>
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
                                        selectedAccountId && selectedAccountId == v.accountId && <IonBadge>{i18n.t("current")}</IonBadge>
                                    }
                                </IonItem>
                            })
                        }
                        {
                            getParentUrl() && <IonFab vertical="center" horizontal="end" slot="fixed">
                                <IonFabButton onClick={()=>{
                                    window.open("./#/")
                                }}>
                                    <IonIcon icon={openOutline} />
                                </IonFabButton>
                            </IonFab>
                        }

                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}