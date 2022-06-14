import * as React from 'react';
import {
    IonAvatar,IonItemDivider,
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
    IonTitle,IonBadge,
    IonToolbar
} from '@ionic/react'
import {arrowForwardCircleOutline, close, linkOutline,} from "ionicons/icons";
import Avatar from "react-avatar";
import "./index.css";
import {IConfig, PrepareBlock} from "@emit-technology/emit-account-node-sdk";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import {getParentUrl, utils} from "../../common/utils";
import {EmitFactor} from "../../components/EmitFactor";
import {Factor} from "@emit-technology/emit-lib";
import {NoneData} from "../../components/None";

interface Props {
    showModal?: boolean;
    onCancel?: () => void;
    onOk?: () => void;
    onReject?: () => void;
    router: HTMLIonRouterOutletElement | null;

    transaction: PrepareBlock;
    config: IConfig;
    account: AccountModel
}

export const SignTxWidgetEmit: React.FC<Props> = ({
                                                      showModal,
                                                      onReject,
                                                      onCancel,
                                                      onOk,
                                                      transaction,
                                                      account,
                                                      config,
                                                      router,
                                                  }) => {
    const [segment, setSegment] = React.useState("info");

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
                            <IonTitle>Sign Transaction</IonTitle>
                            <IonIcon slot="end" icon={close} size="large" onClick={() => {
                                onCancel()
                            }}/>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent fullscreen scrollY>
                        <div style={{position: "relative"}}>
                            {/*<div style={{marginTop: "5px", borderBottom: "1px solid #ddd"}}>*/}
                            {/*    <IonRow>*/}
                            {/*        <IonCol size="5">*/}
                            {/*            <IonItem lines="none">*/}
                            {/*                <IonAvatar>*/}
                            {/*                    <Avatar name={account.name} round size="30"/>*/}
                            {/*                </IonAvatar>*/}
                            {/*                <IonLabel>{account.name}</IonLabel>*/}
                            {/*            </IonItem>*/}
                            {/*        </IonCol>*/}
                            {/*        <IonCol size="2">*/}
                            {/*            <IonItem lines="none">*/}
                            {/*                <IonLabel><IonIcon src={arrowForwardCircleOutline}/></IonLabel>*/}
                            {/*            </IonItem>*/}
                            {/*        </IonCol>*/}
                            {/*        <IonCol size="5">*/}
                            {/*            <IonItem lines="none">*/}
                            {/*                <IonAvatar>*/}
                            {/*                    <Avatar name={toAddress} round size="30"/>*/}
                            {/*                </IonAvatar>*/}
                            {/*                <IonLabel>{*/}
                            {/*                    toAddress*/}
                            {/*                }</IonLabel>*/}
                            {/*            </IonItem>*/}
                            {/*        </IonCol>*/}
                            {/*    </IonRow>*/}
                            {/*</div>*/}
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
                                    <IonSegmentButton value="dataset">
                                        <IonLabel>Data Set</IonLabel>
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
                                    <IonItemDivider>Sender</IonItemDivider>
                                    <IonItem>
                                        <IonLabel className="ion-text-wrap">
                                            {transaction && transaction.address}
                                        </IonLabel>
                                    </IonItem>
                                    <IonItemDivider>Settles</IonItemDivider>
                                    {
                                        transaction && transaction.blk && transaction.blk.factor_set.settles.map((v,i)=>{
                                            return <IonItem key={i}>
                                                <IonLabel className="ion-text-wrap">
                                                    <IonRow>
                                                        <IonCol size="3">From</IonCol>
                                                        <IonCol size="9">{v.from}</IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size="3">Factor</IonCol>
                                                        <IonCol size="9"><EmitFactor factor={v.factor} isOut={false}/></IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size="3">Position</IonCol>
                                                        <IonCol size="9"><IonBadge color="primary">{v.num}</IonBadge> <IonBadge color="light">{v.index}</IonBadge></IonCol>
                                                    </IonRow>
                                                </IonLabel>
                                            </IonItem>
                                        })
                                    }
                                    {
                                        transaction && transaction.blk && transaction.blk.factor_set.outs.map((v,i)=>{
                                            return <IonItem key={i}>
                                                <IonLabel className="ion-text-wrap">
                                                    <IonRow>
                                                        <IonCol size="3">Target</IonCol>
                                                        <IonCol size="9">
                                                            {v.target}
                                                        </IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size="3">Factor</IonCol>
                                                        <IonCol size="9"><EmitFactor factor={v.factor} isOut={true}/></IonCol>
                                                    </IonRow>
                                                    <IonRow>
                                                        <IonCol size="3">Position</IonCol>
                                                        <IonCol size="9"><IonBadge>{transaction && transaction.blk.num}</IonBadge></IonCol>
                                                    </IonRow>
                                                </IonLabel>
                                            </IonItem>
                                        })
                                    }

                                </div>
                            }
                            {
                                segment == 'data' &&
                                <div className="pre-data">
                                    {transaction.blk.data ? <pre>{transaction.blk.data}</pre> :
                                        <NoneData desc={"No data"}/>}
                                </div>
                            }

                            {
                                segment == 'dataset' &&
                                <IonText color="medium">
                                    <div className="pre-data">
                                        {
                                            transaction.blk.data_sets && transaction.blk.data_sets.length > 0 ?
                                            <pre>
                                           {JSON.stringify(transaction.blk.data_sets,undefined,2)}
                                       </pre>:<NoneData desc={"No data sets"}/>
                                        }
                                    </div>
                                </IonText>
                            }
                            <div className="btn-bottom">
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