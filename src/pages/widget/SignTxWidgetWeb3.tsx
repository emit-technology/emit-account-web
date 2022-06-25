import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonChip,
    IonCol,
    IonContent,
    IonHeader,
    IonBadge,IonAlert,
    IonIcon,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,IonRouterLink,
    IonToolbar
} from '@ionic/react'
import {arrowForwardCircleOutline, close, informationCircleOutline, linkOutline,} from "ionicons/icons";
import Avatar from "react-avatar";
import "./index.css";
import {IConfig} from "@emit-technology/emit-account-node-sdk";
import {AccountModel} from "@emit-technology/emit-lib";
import {getParentUrl, utils} from "../../common/utils";
import {Transaction} from "web3-core";
import {GasPriceActionSheet} from "../../components/GasPriceActionSheet";
import {getGasLevel} from "../../rpc";
import i18n from "../../locales/i18n";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;
    router: HTMLIonRouterOutletElement | null;

    transaction: Transaction;
    config: IConfig;
    account: AccountModel;
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
    const [showGasPriceModal,setShowGasPriceModal] = React.useState(false);

    const [gasLevel,setGasLevel] = React.useState({});

    const [showAddressDetail,setShowAddressDetail] = React.useState(false);
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
                    <IonHeader  collapse="fade">
                        <IonToolbar color="white">
                            <IonTitle>
                                {i18n.t("signTx")}
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
                    <IonContent fullscreen scrollY>
                        <div style={{position: "relative", maxHeight: '100vh', overflowY: "scroll"}}>
                            <div style={{marginTop: "5px", borderBottom: "1px solid #ddd"}}>
                                <IonRow>
                                    <IonCol size="5">
                                        <IonItem lines="none">
                                            <IonAvatar slot="start">
                                                <Avatar name={account.name} round size="30"/>
                                            </IonAvatar>
                                            <IonLabel className="ion-text-wrap">
                                                FROM <b>[{account.name}]</b>
                                                <div>{utils.ellipsisStr(transaction.from,5)}</div>
                                            </IonLabel>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="2">
                                        <IonItem lines="none">
                                            <IonLabel><IonIcon src={arrowForwardCircleOutline}/></IonLabel>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="5">
                                        <IonItem lines="none">
                                            <IonAvatar slot="start">
                                                <Avatar name={transaction && transaction.to && transaction.to.slice(2)} round size="30"/>
                                            </IonAvatar>
                                            <IonLabel className="ion-text-wrap">
                                                TO
                                                <div>
                                                    <IonRouterLink onClick={()=>{
                                                        setShowAddressDetail(true);
                                                    }}>
                                                        {utils.ellipsisStr(transaction.to,5)}
                                                    </IonRouterLink>
                                                </div>
                                            </IonLabel>
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
                                    <IonLabel className="ion-text-wrap">
                                        <IonText color="medium"><IonIcon src={informationCircleOutline} style={{transform: "translateY(2px)"}}/>INTERACTION: Make sure you trust this host url.</IonText>
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
                                {utils.fromValue(transaction.value,18).toString(10)} {utils.defaultFeeCy(config.network.chainType.valueOf())}
                            </div>
                            <div>
                                <IonSegment mode="md" value={segment}
                                            onIonChange={e => {
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
                                            <div className="ion-text-right" onClick={()=>{
                                                getGasLevel(config.network.chainType.valueOf()).then(rest=>{
                                                    if(rest){
                                                        setGasLevel(rest);
                                                        setShowGasPriceModal(true);
                                                    }
                                                })
                                            }}><IonText color="secondary">{i18n.t("edit")}</IonText></div>
                                            <div className="text-secondary ion-text-right">{utils.fromValue(transaction.gas,0).toString(10)} * {utils.fromValue(transaction.gasPrice,9).toString(10)} GWei</div>
                                            <div className="text-primary ion-text-right">{utils.fromValue(transaction.gas,0).multipliedBy(utils.fromValue(transaction.gasPrice,18)).toString(10)} {utils.defaultFeeCy(config.network.chainType.valueOf())}</div>
                                        </IonLabel>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Total</IonLabel>
                                        <IonLabel className="ion-text-wrap">
                                            {/*<div className="text-secondary ion-text-right">11</div>*/}
                                            <div className="text-primary ion-text-right">{utils.fromValue(transaction.value,18).plus(utils.fromValue(transaction.gas,0).multipliedBy(utils.fromValue(transaction.gasPrice,18))).toString(10)}  {utils.defaultFeeCy(config.network.chainType.valueOf())}</div>
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
                                        }}>{i18n.t("reject")}</IonButton>
                                    </IonCol>
                                    <IonCol size="7">
                                        <IonButton expand="block" onClick={() => {
                                            onOk();
                                        }}>{i18n.t("ok")}</IonButton>
                                    </IonCol>
                                </IonRow>
                            </div>
                        </div>

                        {
                            gasLevel && <GasPriceActionSheet onClose={()=>{
                                setShowGasPriceModal(false)
                            }} onSelect={(gasPrice)=>{
                                transaction.gasPrice = utils.toHex(utils.toValue(gasPrice,9))
                                setShowGasPriceModal(false);
                            }} isOpen={showGasPriceModal} chain={config.network.chainType} gasLimit={utils.toHex(transaction.gas)} gasLevel={gasLevel}/>
                        }

                        <IonAlert
                            isOpen={showAddressDetail}
                            onDidDismiss={() => setShowAddressDetail(false)}
                            cssClass='my-custom-class'
                            header={'To'}
                            subHeader={i18n.t("trustTip")}
                            message={transaction && transaction.to}
                            buttons={[
                                {
                                    text: i18n.t("cancel"),
                                    role: 'cancel',
                                    cssClass: 'secondary',
                                    id: 'cancel-button',
                                    handler: blah => {
                                        console.log('Confirm Cancel: blah');
                                    }
                                },
                                {
                                    text: i18n.t("viewOnExplorer"),
                                    id: 'confirm-button',
                                    handler: () => {
                                      utils.openExplorer(transaction.to,config.network.chainType.valueOf());
                                    }
                                }
                            ]}
                        />
                    </IonContent>
                </IonPage>
            </IonModal>
        </>
    )
}