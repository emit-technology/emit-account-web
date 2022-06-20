import * as React from 'react';

import './ExploreContainer.css';
import {IonAvatar, IonIcon,IonBadge, IonItem, IonLabel, IonList, IonListHeader, IonText} from '@ionic/react'
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import {addCircleOutline, lockOpenOutline, personAddOutline, qrCode} from "ionicons/icons";
import {config} from "../common/config";
import {utils} from "../common/utils";
import walletWorker from "../worker/walletWorker";
import url from "../common/url";

interface ContainerProps {
  account?:AccountModel
  showAccountDetail?:(chainId:ChainType)=>void;
  showAccessedWebsite?:(chainId:ChainType)=>void;
  viewAccountInExplorer?:(chainId:ChainType)=>void;
}

const AccountContainer: React.FC<ContainerProps> = ({account,showAccessedWebsite,showAccountDetail,viewAccountInExplorer}) => {
  const sortAddress = [ChainType.EMIT,ChainType.ETH,ChainType.BSC];
  return (
    <>
      <IonList>
        <IonListHeader color="light" mode="ios">
          <IonLabel><IonText color="medium">Hello, </IonText>{account.name} </IonLabel>
          <div style={{padding: "6px 12px"}} onClick={()=>{
            walletWorker.lockWallet().then(()=>{
              url.accountUnlock()
            })
          }}><IonBadge><IonIcon src={lockOpenOutline}/> Lock</IonBadge></div>
        </IonListHeader>
        {
            account && account.addresses && sortAddress.map((chainId,i) => {
                return <IonItem key={i} onClick={(e)=>{
                  e.persist()
                  showAccountDetail(chainId)
                }}>
                  <IonAvatar slot="start">
                    <img src={`./assets/img/logo/${ChainType[chainId]}.png`}/>
                  </IonAvatar>
                    <IonLabel className="ion-text-wrap">
                     <div>
                       <h1><IonText color={"dark"}>{config.CHAIN_DESCRIPTION[ChainType[chainId]]}</IonText></h1>
                       <IonText color="medium">{utils.ellipsisStr(account.addresses[chainId],10)}</IonText>
                     </div>
                    </IonLabel>
                  {
                    showAccessedWebsite && showAccessedWebsite && viewAccountInExplorer &&
                    <IonIcon slot="end" icon={qrCode} id={`acct-detail-${chainId}`} color="medium"/>
                  }
                  {/*<>*/}
                  {/*  <IonPopover trigger={`acct-detail-${chainId}`} dismissOnSelect>*/}
                  {/*    {*/}
                  {/*      viewAccountInExplorer && <IonItem onClick={(e)=>{*/}
                  {/*        e.persist()*/}
                  {/*        viewAccountInExplorer(chainId)*/}
                  {/*      }}>*/}
                  {/*        <IonIcon icon={openOutline} size="small" slot="start"/>*/}
                  {/*        <IonLabel className="ion-text-wrap">*/}
                  {/*          <IonText>View Account</IonText>*/}
                  {/*          <p><IonText color="medium"><small>{config.VIEW_WEBSITE[ChainType[chainId]]}</small></IonText></p>*/}
                  {/*        </IonLabel>*/}
                  {/*      </IonItem>*/}
                  {/*    }*/}
                  {/*    {*/}
                  {/*      showAccountDetail && <IonItem onClick={(e)=>{*/}
                  {/*        e.persist()*/}
                  {/*        showAccountDetail(chainId)*/}
                  {/*      }}>*/}
                  {/*        <IonIcon icon={qrCode} size="small" slot="start"/>*/}
                  {/*        <IonLabel className="ion-text-wrap">*/}
                  {/*          <IonText>Account Detail</IonText>*/}
                  {/*        </IonLabel>*/}
                  {/*      </IonItem>*/}
                  {/*    }*/}
                  {/*    {*/}
                  {/*      showAccessedWebsite && <IonItem lines="none" onClick={(e)=>{*/}
                  {/*        e.persist()*/}
                  {/*        showAccessedWebsite(chainId)*/}
                  {/*      }}>*/}
                  {/*        <IonIcon icon={radioButtonOnOutline} size="small" slot="start"/>*/}
                  {/*        <IonLabel className="ion-text-wrap">*/}
                  {/*          <IonText>Accessed Website</IonText>*/}
                  {/*        </IonLabel>*/}
                  {/*      </IonItem>*/}
                  {/*    }*/}
                  {/*  </IonPopover>*/}
                  {/*</>*/}
                </IonItem>
            })
        }
      </IonList>
    </>
  );
};

export default AccountContainer;
