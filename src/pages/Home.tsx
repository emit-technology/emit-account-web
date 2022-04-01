import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonModal, IonLabel,
    IonMenuToggle, IonListHeader,
    IonList, IonItem, IonItemDivider,
    IonPopover, IonAvatar,
    IonIcon
} from '@ionic/react';

import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import walletWorker from "../worker/walletWorker";
import {AccountModel, ChainType} from "emit-types";
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
import {Widget} from "./widget";
import Avatar from 'react-avatar';

interface State {
    account: AccountModel,
    showAccountDetail: boolean,
    showAccessedWebsite: boolean,
    selectChainId: ChainType,
    accounts: Array<AccountModel>
}

class Home extends React.Component<any, State> {

    state: State = {
        account: {name: ""},
        showAccountDetail: false,
        showAccessedWebsite: false,
        selectChainId: ChainType._,
        accounts: []
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const acct = await walletWorker.accountInfo();
        const accounts = await walletWorker.accounts();
        this.setState({
            account: acct,
            accounts: accounts
        })
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
            await walletWorker.isLocked();
            selfStorage.setItem("accountId", acct.accountId)
            url.accountUnlock();
        }
    }

    render() {
        const {account, selectChainId, showAccessedWebsite, showAccountDetail, accounts} = this.state;
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
                        <ExploreContainer account={account} viewAccountInExplorer={this.viewAccountInExplorer}
                                          showAccessedWebsite={this.showAccessedWebsite}
                                          showAccountDetail={this.showAccountDetail}/>
                    }
                    <Widget/>
                </IonContent>
                <IonModal isOpen={showAccountDetail} className="common-modal" swipeToClose onDidDismiss={() =>
                    this.setState({showAccountDetail: false})}>
                    {
                        account && <AccountDetail account={account} showChainId={selectChainId}/>
                    }
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
                            <IonItem>
                                <IonIcon icon={settingsOutline} slot="start"/>
                                <IonLabel>Settings</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonPopover>

            </IonPage>
        );
    }
};

export default Home;
