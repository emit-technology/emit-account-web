import * as React from 'react';
import {
    IonAlert,
    IonAvatar,
    IonButton,
    IonCard,IonText,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonTitle,
    IonToast,
    IonToolbar
} from "@ionic/react";
import {arrowBackOutline, chevronForwardOutline, closeOutline, personAddOutline} from "ionicons/icons";
import url from "../common/url";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import walletWorker from "../worker/walletWorker";
import Avatar from 'react-avatar';
import {utils} from "../common/utils";
import {AccountDetail} from "../components/AccountDetail";
import {config} from "../common/config";
import {dappData} from '../data'
import {NoneData} from "../components/None";
import selfStorage from "../common/storage";
import i18n from "../locales/i18n"

interface Props{

}
interface State{
    accounts: Array<AccountModel>
    showAccountDetail: boolean
    account?: AccountModel
    showChain: ChainType
    showAlert:boolean
    showToast:boolean
    toastMsg:string
    showAlertRemove: boolean
    data: Array<string>
    showConnectedSitesModal:boolean
}
export class AccountList extends React.Component<Props, State> {

    state:State = {
        accounts: [],
        showAccountDetail:false,
        showAlertRemove: false,
        showAlert: false,
        showToast:false,
        toastMsg: "",
        showChain: ChainType._,
        data:[],
        showConnectedSitesModal:false
    }

    componentDidMount() {
       this.init().catch(e=>console.error(e))
    }

    init = async () =>{
        const accounts = await walletWorker.accounts();
        let account = this.state.account;
        if(!account){
            account = await walletWorker.accountInfo();
        }
        const data = dappData.all(account.accountId);
        this.setState({
            accounts: accounts,
            data: data
        })
    }

    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert: f
        })
    }

    setShowToast = (f:boolean,msg?:string)=>{
        this.setState({
            showToast:f,
            toastMsg:msg
        })
    }

    setShowAlertRemove = (f:boolean)=>{
        this.setState({
            showAlertRemove: f
        })
    }

    render() {
        const {accounts,showAccountDetail,account,showToast,toastMsg,showAlert,showChain,showAlertRemove,data,showConnectedSitesModal} = this.state;

        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon slot="start" icon={arrowBackOutline} size="large" onClick={()=>{
                           url.back();
                        }}/>
                        <IonTitle>{i18n.t("accounts")}</IonTitle>
                        <IonIcon slot="end" style={{marginRight: "12px"}} icon={personAddOutline} size="large" onClick={()=>{
                            url.accountCreate(url.path_accounts());
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    {
                        accounts.map((v,i)=>{
                            const chains = [ChainType.EMIT,ChainType.ETH,ChainType.BSC];
                            return <IonCard key={i}>
                                <IonCardHeader>
                                    <IonCardTitle>
                                       <IonRow>
                                           <IonCol size="1">
                                               <IonAvatar>
                                                   <Avatar name={v.name} round size="30"/>
                                               </IonAvatar>
                                           </IonCol>
                                           <IonCol size="10">
                                               <IonLabel>{v.name}</IonLabel>
                                           </IonCol>
                                       </IonRow>
                                    </IonCardTitle>
                                    {v.timestamp && <IonCardSubtitle>{i18n.t("createdAt")} {utils.dateFormat(new Date(v.timestamp * 1000))}</IonCardSubtitle>}
                                </IonCardHeader>
                                <IonCardContent>
                                    {
                                        v.addresses && chains.map(chainId =>{
                                            return <IonItem key={chainId} detail detailIcon={chevronForwardOutline} onClick={()=>{
                                                this.setState({
                                                    account: v,
                                                    showAccountDetail: true,
                                                    showChain: chainId
                                                })
                                            }}>
                                                <IonAvatar slot="start">
                                                    <img src={`./assets/img/logo/${ChainType[chainId]}.png`}/>
                                                </IonAvatar>
                                                <IonLabel className="ion-text-wrap">
                                                    {v.addresses[chainId]}
                                                </IonLabel>
                                            </IonItem>
                                        })
                                    }
                                    <IonRow>
                                        <IonCol>
                                            <IonButton size="small" fill="outline" expand="block" color="danger" onClick={()=>{
                                                this.setState({
                                                    account: v,
                                                    showAlertRemove: true
                                                })
                                            }}>{i18n.t("removeAccount")}</IonButton>
                                        </IonCol>
                                        <IonCol>
                                            <IonButton size="small" fill="outline" expand="block" onClick={()=>{
                                                this.setState({
                                                    account: v,
                                                    showAlert: true
                                                })
                                            }}>{i18n.t("backupAccount")}</IonButton>
                                        </IonCol>
                                        <IonCol>
                                            <IonButton size="small" fill="outline" expand="block" onClick={()=>{
                                                const data = dappData.all(v.accountId);
                                                this.setState({
                                                    showConnectedSitesModal:true,
                                                    account: v,
                                                    data:data
                                                })
                                            }}>{i18n.t("connectedSites")}</IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonCardContent>
                            </IonCard>
                        })
                    }
                    <IonModal isOpen={showAccountDetail} className="common-modal" swipeToClose onDidDismiss={() =>
                        this.setState({showAccountDetail: false})}>
                        {
                            account && <AccountDetail account={account} onBackup={()=>{
                                this.setState({showAccountDetail: false})
                                this.setShowAlert(true)
                            }} showChainId={showChain} onClose={() => {
                                this.setState({showAccountDetail: false})
                            }}/>
                        }
                    </IonModal>
                    <IonAlert
                        isOpen={showAlertRemove}
                        onDidDismiss={() => this.setShowAlertRemove(false)}
                        cssClass='my-custom-class'
                        header={`Remove ${ account&& account.name}`}
                        message="Please make sure you have backed up the account!"
                        inputs={[
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: 'Input password'
                            }]}
                        buttons={[
                            {
                                text: 'Cancel',
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },
                            {
                                text: 'Ok',
                                handler: (d) => {
                                    if(!d["password"]){
                                        this.setShowToast(true,"Please input password")
                                        return;
                                    }
                                    const accountId = account.accountId;
                                    const accountIdLocal = selfStorage.getItem("accountId");
                                    walletWorker.removeAccount(accountId,d["password"]).then((rest: any) => {
                                        if(accountIdLocal == accountId){
                                            selfStorage.removeItem("accountId");
                                            selfStorage.removeItem(accountId);
                                            walletWorker.accounts().then(acts=>{
                                                if(acts && acts.length>0){
                                                    selfStorage.setItem("accountId",acts[0].accountId);
                                                    selfStorage.setItem(accountId,acts[0]);
                                                }
                                            })
                                        }
                                        this.setShowToast(true,`Removed ${account && account.name} successfully`)
                                        this.init().catch(e=>console.error(e))
                                    }).catch(e=>{
                                        const err = typeof e == 'string'?e:e.message;
                                        this.setShowToast(true,err);
                                        console.error(e)
                                    })
                                }
                            }
                        ]}
                    />
                    <IonAlert
                        isOpen={showAlert}
                        onDidDismiss={() => this.setShowAlert(false)}
                        cssClass='my-custom-class'
                        header={`Backup account ${account && account.name}`}
                        inputs={[
                            {
                                name: 'password',
                                type: 'password',
                                placeholder: i18n.t("inputPassword")
                            }]}
                        buttons={[
                            {
                                text: i18n.t("cancel"),
                                role: 'cancel',
                                cssClass: 'secondary',
                                handler: () => {
                                    console.log('Confirm Cancel');
                                }
                            },
                            {
                                text: 'Ok',
                                handler: (d) => {
                                    if(!d["password"]){
                                        this.setShowToast(true,i18n.t("inputPassword"))
                                        return;
                                    }
                                    const accountId = account.accountId;
                                    walletWorker.exportMnemonic(accountId, d["password"]).then((rest: any) => {
                                        config.TMP.MNEMONIC = rest;
                                        url.accountBackup(url.path_accounts())
                                    }).catch(e=>{
                                        const err = typeof e == 'string'?e:e.message;
                                        this.setShowToast(true,err);
                                        console.error(e)
                                    })
                                }
                            }
                        ]}
                    />
                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="primary"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={2000}
                    />

                    <IonModal isOpen={showConnectedSitesModal} className="common-modal" swipeToClose onDidDismiss={() =>
                        this.setState({showConnectedSitesModal: false})}>
                        <IonPage>
                            <IonHeader collapse="fade">
                                <IonToolbar>
                                    <IonTitle>Connected sites</IonTitle>
                                    <IonIcon slot="end" style={{marginRight: "12px"}} icon={closeOutline} size="large" onClick={()=>{
                                       this.setState({showConnectedSitesModal:false})
                                    }}/>
                                </IonToolbar>
                            </IonHeader>
                            <IonContent fullscreen scrollY>
                                <IonItem lines="none">
                                    <IonLabel color="medium" className="ion-text-wrap">
                                        Account <b><IonText color="primary">{account && account.name}</IonText></b> is connected to these sites. They can view your account address.
                                    </IonLabel>
                                </IonItem>
                                {
                                    data && data.length>0 ? data.map((v,i)=>{
                                        return <IonItem key={i}>
                                            <IonAvatar slot="start">
                                                <Avatar round name={v && v.replace("http://","").replace("https://","")} size="30"/>
                                            </IonAvatar>
                                            <IonLabel>
                                                {v}
                                            </IonLabel>
                                            <IonButton fill="outline" size="small" slot="end" onClick={()=>{
                                                dappData.remove(v,account && account.accountId)
                                                this.init().catch(e=>console.log(e))
                                            }}>Disconnect</IonButton>
                                        </IonItem>
                                    }):<NoneData desc="No data"/>
                                }
                            </IonContent>
                        </IonPage>
                    </IonModal>

                </IonContent>
            </IonPage>
        );
    }
}