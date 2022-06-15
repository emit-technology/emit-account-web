import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonModal, IonLabel,
    IonMenuToggle,
    IonItem,
    IonAlert,
    IonIcon, IonRow, IonCol, IonButton, IonToast
} from '@ionic/react';

import AccountContainer from '../components/AccountContainer';
import './Home.css';
import walletWorker from "../worker/walletWorker";
import {config} from "../common/config";
import {AccountDetail} from "../components/AccountDetail";
import {
    informationCircleOutline,
    list,
    settingsOutline
} from "ionicons/icons";
import url from "../common/url";
import selfStorage from "../common/storage";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import {AccountListModal} from "../components/AccountListModal";
interface State {
    account: AccountModel,
    showAccountDetail: boolean,
    showAccessedWebsite: boolean,
    selectChainId: ChainType,
    showPhaseProtectModal: boolean
    accounts: Array<AccountModel>,
    showAlert:boolean
    showToast:boolean
    toastMsg?:string
    showAccountsModal:boolean
}


interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number;
    op?:string;
}

class Home extends React.Component<Props, State> {

    state: State = {
        account: {name: ""},
        showAccountDetail: false,
        showAccessedWebsite: false,
        selectChainId: ChainType._,
        showPhaseProtectModal: false,
        showAlert:false,
        showToast:false,
        accounts: [],
        showAccountsModal:false
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
        const {op} = this.props;
        if(op && op == "backup"){
            this.setState({showAlert:true})
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh || prevState.account.accountId != this.state.account.accountId) {
            this.init().then((act) => {
            }).catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {

        await this.initAccount()
    }

    initAccount = async () => {
        const acct = await walletWorker.accountInfoAsync();
        const accounts = await walletWorker.accounts();
        let readProtectTips = true;
        if (acct.accountId) {
            const isLocked = await walletWorker.isLocked();
            if (!isLocked) {
                readProtectTips = selfStorage.getItem(`readPhaseTip_${acct.accountId}`);
            }
        }
        this.setState({
            account: acct,
            accounts: accounts,
            showPhaseProtectModal: !readProtectTips
        })
        return acct
    }

    viewAccountInExplorer = (chainId: ChainType) => {
        const {account} = this.state;
        window.open(`${config.EXPLORER.ADDRESS[ChainType[chainId]]}${account.addresses[chainId]}`)
    }

    showAccountDetail = (chainId: ChainType) => {
        this.setState({
            selectChainId: chainId,
            showAccountDetail: true
        })
    }

    showAccessedWebsite = (chainId: ChainType) => {
        this.setState({
            selectChainId: chainId,
            showAccessedWebsite: true
        })
    }

    setAccount = async (acct: AccountModel) => {
        const {account} = this.state;
        if (account.accountId != acct.accountId) {
            selfStorage.setItem("accountId", acct.accountId)
            this.setState({
                account: acct
            })
        }
    }
    setShowAlert = (f:boolean)=>{
        this.setState({
            showAlert:f
        })
    }

    setShowToast = (f:boolean,msg?:string)=>{
        this.setState({
            showToast:f,
            toastMsg:msg
        })
    }

    render() {
        const {account, selectChainId, showAccountDetail,toastMsg,showToast, accounts,showAlert,showAccountsModal, showPhaseProtectModal} = this.state;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon slot="start" icon={list} size="large" onClick={()=>{
                            this.setState({showAccountsModal:true})
                        }}/>
                        <IonTitle>EMIT Account</IonTitle>
                        <IonMenuToggle slot="end">
                            <IonIcon icon={list} size="large"/>
                        </IonMenuToggle>
                        <IonIcon slot="end" icon={settingsOutline} size="large" onClick={()=>{
                            url.setting()
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    {
                        account &&
                        <AccountContainer account={account} viewAccountInExplorer={this.viewAccountInExplorer}
                                          showAccessedWebsite={this.showAccessedWebsite}
                                          showAccountDetail={this.showAccountDetail}/>
                    }
                    <div style={{padding: "24px 12px"}}>
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap" color="medium">
                                <IonIcon src={informationCircleOutline}/> <b>EMIT Account</b> is a decentralized multi-chain account component of EMIT CORE.
                                It is your Web3 identity that integrates the features of multi-account, multi-chain, message signature,
                                and transaction signature. You can also use <a href="https://assets.emit.technology" target="_blank"><b>EMIT Assets</b></a> to manage your digital assets and cross-chain transactions.
                                <b>
                                    EMIT CORE will open up new ways of interacting with the Metaverse.
                                </b>
                            </IonLabel>
                        </IonItem>
                    </div>
                </IonContent>
                <IonModal isOpen={showAccountDetail} className="common-modal" swipeToClose onDidDismiss={() =>
                    this.setState({showAccountDetail: false})}>
                    {
                        account && <AccountDetail account={account} onBackup={()=>{
                            this.setState({showAccountDetail: false})
                            this.setShowAlert(true)
                        }} showChainId={selectChainId} onClose={() => {
                            this.setState({showAccountDetail: false})
                        }}/>
                    }
                </IonModal>
                <IonModal isOpen={showPhaseProtectModal} className="common-modal" swipeToClose onDidDismiss={() =>
                    this.setState({showPhaseProtectModal: false})}
                >
                    <div style={{lineHeight: "1.8", padding: '12px 24px'}}>
                        <h3 style={{textAlign: "center"}}>Protect your funds</h3>
                        <div>
                            <p>
                                Your Secret Recovery Phrase controls your current account.
                            </p>
                            <ul>
                                <li><b>Never share your Secret Recovery Phrase with anyone</b></li>
                                <li>The EMIT team will never ask for you Secret Recovery Phrase</li>
                                <li>Always keep your Secret Recovery Phrase in a secure and secret place</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{position:"relative"}}>
                        <div className="btn-bottom">
                            <IonRow>
                                <IonCol size="3"></IonCol>
                                <IonCol size="6">
                                    <IonButton expand="block" onClick={() => {
                                        selfStorage.setItem(`readPhaseTip_${account.accountId}`, true);
                                        this.setState({showPhaseProtectModal: false})
                                    }}>Got it</IonButton>
                                </IonCol>
                                <IonCol size="3"></IonCol>
                            </IonRow>
                        </div>
                    </div>
                </IonModal>
                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => this.setShowAlert(false)}
                    cssClass='my-custom-class'
                    header={'Backup account'}
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
                                walletWorker.unlockWallet(d["password"]).then(()=>{
                                    const accountId = selfStorage.getItem("accountId");
                                    walletWorker.exportMnemonic(accountId, "").then((rest: any) => {
                                        config.TMP.MNEMONIC = rest;
                                        url.accountBackup("/#/")
                                    }).catch(e=>{
                                        const err = typeof e == 'string'?e:e.message;
                                        this.setShowToast(true,err);
                                        console.error(e)
                                    })
                                }).catch(e=>{
                                    const err = typeof e == 'string'?e:e.message;
                                    this.setShowToast(true,err);
                                    console.error(e)
                                })
                            }
                        }
                    ]}
                />

                <AccountListModal showModal={showAccountsModal}
                                  onCancel={() => {
                                      this.setState({showAccountsModal: false})
                                  }}
                                  onOk={(account) => {
                                      this.setState({showAccountsModal: false})
                                      this.setAccount(account).catch(e => {
                                          console.error(e)
                                      })
                                  }}
                                  onReject={() => {
                                      this.setState({showAccountsModal: false})
                                  }}
                                  accounts={accounts}
                                  selected={account}
                                  router={this.props.router}
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

            </IonPage>
        );
    }
};

export default Home;
