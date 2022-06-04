import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonModal, IonLabel,
    IonMenuToggle, IonListHeader,
    IonList, IonItem,
    IonPopover, IonAvatar, IonAlert,
    IonIcon, IonRow, IonCol, IonButton, IonToast
} from '@ionic/react';

import AccountContainer from '../components/AccountContainer';
import './Home.css';
import walletWorker from "../worker/walletWorker";
import {config} from "../common/config";
import {AccountDetail} from "../components/AccountDetail";
import {
    createOutline,
    downloadOutline,
    list,
    settingsOutline
} from "ionicons/icons";
import url from "../common/url";
import selfStorage from "../common/storage";
import Avatar from 'react-avatar';
import {AccountModel, ChainType} from "@emit-technology/emit-types";
import {getParentUrl, utils} from "../common/utils";

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
}


interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number;
    op?:string;
}

const BOX_HEIGHT = 750;

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
        const {account, selectChainId, showAccountDetail,toastMsg,showToast, accounts,showAlert, showPhaseProtectModal} = this.state;
        console.log(showAlert)
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar color="primary">
                        <IonTitle>EMIT Account</IonTitle>
                        <IonMenuToggle slot="end">
                            <IonIcon icon={list} size="large"/>
                        </IonMenuToggle>
                        <IonIcon slot="end" icon={list} size="large" id="accounts"/>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    {
                        account &&
                        <AccountContainer account={account} viewAccountInExplorer={this.viewAccountInExplorer}
                                          showAccessedWebsite={this.showAccessedWebsite}
                                          showAccountDetail={this.showAccountDetail}/>
                    }


                </IonContent>
                <IonModal isOpen={showAccountDetail} className="common-modal" swipeToClose onDidDismiss={() =>
                    this.setState({showAccountDetail: false})}>
                    {
                        account && <AccountDetail account={account} showChainId={selectChainId} onClose={() => {
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
                <IonPopover trigger="accounts" className="accounts-popover" arrow={false} dismissOnSelect>
                    <IonContent>
                        <IonList>
                            <IonListHeader>My Account</IonListHeader>
                            <div className="account-list">
                                {
                                    accounts && accounts.length > 0 && accounts.map((v, i) => {
                                        return <IonItem key={i} onClick={() => {
                                            this.setAccount(v).catch(e => {
                                                console.error(e)
                                            })
                                        }}>
                                            <IonAvatar style={{padding: "5px"}} slot="start">
                                                <Avatar name={v.name} round size="30"/>
                                            </IonAvatar>
                                            <IonLabel className="ion-text-wrap">{v.name}</IonLabel>
                                        </IonItem>
                                    })
                                }
                            </div>
                            {
                                !getParentUrl() && <>
                                    <IonItem onClick={() => {
                                        url.accountCreate()
                                    }}>
                                        <IonIcon icon={createOutline} slot="start"/>
                                        <IonLabel>Create Account</IonLabel>
                                    </IonItem>
                                    <IonItem onClick={() => {
                                        url.accountImport()
                                    }}>
                                        <IonIcon icon={downloadOutline} slot="start"/>
                                        <IonLabel>Import Account</IonLabel>
                                    </IonItem>
                                </>
                            }
                            <IonItem onClick={() => {
                                this.setShowAlert(true);
                            }}>
                                <IonIcon icon={settingsOutline} slot="start"/>
                                <IonLabel>Backup Wallet</IonLabel>
                            </IonItem>

                        </IonList>

                    </IonContent>
                </IonPopover>
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
