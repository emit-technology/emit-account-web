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
    IonIcon, IonButton
} from '@ionic/react';

import ExploreContainer from '../components/ExploreContainer';
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
import {AccountModel, ChainType} from "../types";
import {connectToParent} from "penpal";
import {IConfig, IPayload, SignWrapped} from "@emit-technology/emit-account-node-sdk";
import {SignTxWidget} from "./widget/SignTxWidget";
import {ApproveWidget, SignMessageWidget} from "./widget";
import {getParentUrl, utils} from "../common/utils";
import {dappData} from "../data";
import {jsonRpc} from "../rpc";
import * as web3Utils from 'web3-utils';

interface State {
    account: AccountModel,
    showAccountDetail: boolean,
    showAccessedWebsite: boolean,
    selectChainId: ChainType,
    accounts: Array<AccountModel>,

    showSignMessageModal: boolean;
    showTransactionModal: boolean;
    showApproveModal: boolean;

    connection: any,
    refer: string,
    config?: IConfig,
    op: Operation,
    msg?: any,
    tx?: any
}

enum Operation {
    _ = "none",
    cancel = "cancel",
    reject = "reject",
    confirm = "confirm"
}

interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number;
}

const BOX_HEIGHT = 750;

class Home extends React.Component<Props, State> {

    state: State = {
        account: {name: ""},
        showAccountDetail: false,
        showAccessedWebsite: false,
        selectChainId: ChainType._,
        showApproveModal: false,
        showTransactionModal: false,
        accounts: [],
        showSignMessageModal: false,
        connection: {},
        refer: "",
        op: Operation._,
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh || prevState.account.accountId != this.state.account.accountId) {
            const {connection, config} = this.state;
            this.initAccount().then((act) => {
                if(connection){
                    if (config) {
                        connection.promise.then(parent => {
                            parent.onActiveWalletChanged(act.addresses[config.network.chainType])
                        });
                    }
                    connection.promise.then(parent => {
                        parent.onActiveAccountChanged(act)
                    });
                }

            }).catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {

        const connection = connectToParent({
            // Methods child is exposing to parent.
            methods: {
                getAccounts: (config) => {
                    try {
                        return this.getAccounts(config)
                    } catch (e) {
                        const err = typeof e == 'string' ? e : e.message;
                        return Promise.resolve({error: err, result: []})
                    }
                },
                signTransaction: (txParams, config) => {
                    try {
                        return this.signTransaction(txParams, config)
                    } catch (e) {
                        const err = typeof e == 'string' ? e : e.message;
                        return Promise.resolve({error: err, result: ""})
                    }
                },
                signMessage: (msgParams: any, config: IConfig) => {
                    try {
                        return this.signMessage(msgParams, config)
                    } catch (e) {
                        const err = typeof e == 'string' ? e : e.message;
                        return Promise.resolve({error: err, result: ""})
                    }
                },
                relay: this.relay,
                showWidget: this.showWidget,
                setConfig: this.setConfig,
                batchSignMessage:  this.batchSignMsg,
                requestAccount: this.requestAccount,
            },
        });

        this.setState({
            connection: connection,
            refer: getParentUrl()
        })

        // await this.initAccount()
    }

    batchSignMsg = async (signArr:Array<SignWrapped>) : Promise<{error:string;result:Array<SignWrapped>}> =>{
        let err = "";
        const ret:Array<SignWrapped> = [];
        try{
            await this.checkAccountExist();
            await this.checkIsLocked();
            await this.checkApprove()
            this.setShowSignMessageModal(true)
            await this._showWidget();
            await this.waitOperation();
            const {account} = this.state;
            for(let msg of signArr){
                const message = typeof msg.msg == 'string' && !web3Utils.isHexStrict(msg.msg) ?{
                    from: account.addresses[msg.chain],
                    data:  web3Utils.utf8ToHex(msg.msg),
                    messageStandard: 'signPersonalMessage'
                } :msg.msg
                msg.result  = await walletWorker.personSignMsg(msg.chain,message )
                ret.push(msg)
            }
            await this._hideWidget()
        }catch(e){
            err = typeof e == 'string'?e:e.message;
        }
        if(err){
            return {error: err, result:[]}
        }
        console.log(err,ret,"sign ret::")
        return {error:"",result:ret}
    }

    requestAccount = async (config: IConfig) : Promise<{error:string;result:AccountModel}> =>{
        let err = "";
        let ret:AccountModel = {name:""};
        try{
            await this.checkAccountExist();
            await this.checkIsLocked();
            await this.checkApprove()
            await this._hideWidget()
            ret = await walletWorker.accountInfo();
        }catch(e){
            err = typeof e == 'string'?e:e.message;
        }
        if(err){
            return {error: err, result:ret}
        }
        console.log(err,ret,"sign ret::")
        return {error:"",result:ret}
    }

    initAccount = async () => {
        const acct = await walletWorker.accountInfoAsync();
        const accounts = await walletWorker.accounts();
        this.setState({
            account: acct,
            accounts: accounts
        })
        await this.checkApprove()
        return acct
    }

    checkIsLocked = async () => {
        const isLocked = await walletWorker.isLocked();
        if (isLocked) {
            await this._showWidget()
            url.accountUnlock();
            await this.waitUnlock();
        }
        return Promise.resolve(true);
    }

    checkApprove = async (config?: IConfig) => {
        // const {account} = this.state;
        const refer = getParentUrl();
        if (config) {
            this.setState({config: config})
        }
        if (refer) {
            const oHash = window.location.hash;
            if (oHash && oHash.indexOf("home") > -1) {
                const accountId = selfStorage.getItem("accountId")
                let host = refer.replace("http://", "").replace("https://", "");
                host = host.substr(0, host.indexOf("/"));
                if (!dappData.get(host) || dappData.get(host).indexOf(accountId) == -1) {
                    this.setShowApproveDAppModal(true)
                    await this.waitOperation();
                    dappData.set(host, accountId);
                }
            }
        } else {
            return Promise.reject("Invalid Refer parent")
        }
    }

    waitUnlock = async (): Promise<boolean> => {
        for (let i = 0; i < 240; i++) {
            await this.waitTime();
            const f = await walletWorker.isLocked()
            if (!f) {
                return true;
            }
        }
        return false;
    }

    waitOperation = async () => {
        let latestOp:Operation = Operation._;
        for (let i = 0; i < 240; i++) {
            await this.waitTime();
            const {op} = this.state;
            if (op !== Operation._) {
                latestOp = op;
                break;
            }
        }
        this.setState({
            op: Operation._,
            showTransactionModal: false,
            showSignMessageModal: false,
            showApproveModal: false
        })
        if(latestOp == Operation.confirm){
            return Promise.resolve(Operation[latestOp]);
        }
        return Promise.reject(Operation[latestOp])
    }

    waitTime = async (defaultSecond = 0.5) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true)
            }, defaultSecond * 1000)
        })
    }


    checkAccountExist = async (): Promise<boolean> => {
        const accountId = selfStorage.getItem("accountId");
        if (!accountId) {
            url.accountOpenCreate();
            await this.waitAccountCreate();
        }
        return Promise.resolve(true);
    }

    waitAccountCreate = async () => {
        for (let i = 0; i < 240; i++) {
            await this.waitTime(1);
            if(this.getStorageAccountId()){
                break;
            }
        }
        return Promise.resolve(true);
    }

    getStorageAccountId = ()=>{
        return selfStorage.getItem("accountId");
    }

    getAccounts = async (config: IConfig): Promise<{ error: string, result: Array<string> }> => {
        let err = "";
        // check account exist?waitAccountCreate
        // check lock status and show widget
        // check approve status
        // TODO do something
        // hide widget?
        try {
            await this.checkAccountExist();
            await this.checkIsLocked();
            await this.checkApprove(config)
        } catch (e) {
            err = typeof e == "string" ? e : e.message;
            console.error(e)
        }
        if (err) {
            return {error: err, result: []}
        } else {
            const result: any = await walletWorker.accountInfo()
            await this._hideWidget()
            return {error: "", result: [result.addresses[config.network.chainType]]}
        }
    }

    signTransaction = async (txParams: any, config: IConfig): Promise<{ error: string, result: string }> => {
        if (!txParams.nonce) {
            //TODO for test
            txParams.nonce = 1;
        }
        if (!txParams.from) {
            return {error: "from address is required! ", result: ""}
        }
        const {account, accounts} = this.state;
        if (txParams.from.toLowerCase() !== account.addresses[config.network.chainType].toLowerCase()) {
            const ret = accounts.find((v) => {
                return v.addresses[config.network.chainType].toLowerCase() === txParams.from.toLowerCase();
            })
            if (ret) {
                await this.setAccount(ret);
            } else {
                url.accountOpenCreate()
                await this.waitAccountCreate();
                return {error: "Can not find account with from address ! ", result: ""}
            }
        }
        try {
            await this.checkIsLocked();
            await this.checkApprove(config)
            this.setState({config: config, tx: txParams, showTransactionModal: true})
            await this.waitOperation();
            let chainParams: any;
            if (config.network.chainType == ChainType.ETH || config.network.chainType == ChainType.BSC) {
                chainParams = {
                    baseChain: "mainnet",
                    customer: {name: "mainnet", networkId: 1, chainId: 1,},
                    hardfork: "byzantium"
                }
            }
            const ret = await walletWorker.signTx("", "", config.network.chainType, txParams, chainParams)
            await this._hideWidget();
            return {error: "", result: `0x${ret}`}
        } catch (e) {
            const err = typeof e == 'string' ? e : e.message;
            return {error: err, result: ""}
        }
    }

    signMessage = async (msgParams: any, config: IConfig): Promise<{ error: string, result: string }> => {
        if (config) {
            this.setState({config: config, msg: msgParams})
        }
        await this.checkAccountExist();
        await this.checkIsLocked();
        await this.checkApprove(config)
        this.setState({showSignMessageModal: true})
        await this._showWidget();
        await this.waitOperation();
        console.log(msgParams,"msgParams");
        const ret = await walletWorker.personSignMsg(config.network.chainType, msgParams)
        await this._hideWidget()
        return {error: null, result: ret}
    }

    _showWidget = async () => {
        const {connection} = this.state;
        const parent = await connection.promise;
        parent.setHeight(BOX_HEIGHT);
    }

    _hideWidget = async () => {
        const {connection} = this.state;
        const parent = await connection.promise;
        parent.setHeight(0);
    }

    // TODO ADD RPC PROXY
    relay = async (payload: IPayload, config: IConfig): Promise<{ error: string, result: any }> => {
        try {
            const rest = await jsonRpc(config.network.nodeUrl, payload);
            return {error: "", result: rest}
        } catch (e) {
            console.error(e)
            const err = typeof e == 'string' ? e : e.message;
            return {error: err, result: ""}
        }
    }

    showWidget = async (config: IConfig) => {
        // await this.checkAndSetConfig(config)
        const {connection} = this.state;
        const parent = await connection.promise;
        console.log(config,"showWidget");
        parent.setHeight(BOX_HEIGHT)
    }

    setConfig = (config: IConfig): Promise<void> => {
        // this.checkApprove(config)
        return
    }

    setShowSignMessageModal = (f: boolean) => {
        this.setState({
            op: Operation._,
            showSignMessageModal: f
        })
    }

    setShowTransactionDAppModal = (f: boolean) => {
        this.setState({
            op: Operation._,
            showTransactionModal: f
        })
    }

    setShowApproveDAppModal = (f: boolean) => {
        this.setState({
            op: Operation._,
            showApproveModal: f
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
            walletWorker.accountInfo(acct.accountId).then(account => {
                walletWorker.lockWallet()
                selfStorage.setItem("accountId", acct.accountId)
                url.accountUnlock();
            }).catch(e => {
                console.error(e)
            })
        }
    }

    render() {
        const {account, selectChainId, showTransactionModal, config, msg, tx, showApproveModal, showAccessedWebsite, showSignMessageModal, showAccountDetail, accounts} = this.state;
        console.log(showSignMessageModal,"render");
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
                    {
                        tx &&
                        <SignTxWidget showModal={showTransactionModal}
                                      onCancel={() => {
                                          this.setState({showTransactionModal: false})
                                      }}
                                      onOk={() => {
                                          this.setState({showTransactionModal: false, op: Operation.confirm})
                                      }}
                                      onReject={() => {
                                          this.setState({showTransactionModal: false, op: Operation.reject})
                                      }}
                                      router={this.props.router} transaction={tx}/>
                    }

                    {
                        <SignMessageWidget showModal={showSignMessageModal}
                                           onCancel={() => {
                                               this.setState({showSignMessageModal: false})
                                           }}
                                           onOk={() => {
                                               this.setState({showSignMessageModal: false, op: Operation.confirm})
                                           }}
                                           onReject={() => {
                                               this.setState({showSignMessageModal: false, op: Operation.reject})
                                           }}
                                           router={this.props.router} msg={"1111"} account={account} config={config}/>

                    }

                    {
                        account && config &&
                        <ApproveWidget showModal={showApproveModal}
                                       onCancel={() => {
                                           this.setState({showApproveModal: false})
                                       }}
                                       onOk={() => {
                                           this.setState({showApproveModal: false, op: Operation.confirm})
                                       }}
                                       onReject={() => {
                                           this.setState({showApproveModal: false, op: Operation.reject})
                                       }}
                                       router={this.props.router} config={config} account={account}
                        />
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
                            {/*<IonItem>*/}
                            {/*    <IonIcon icon={settingsOutline} slot="start"/>*/}
                            {/*    <IonLabel>Settings</IonLabel>*/}
                            {/*</IonItem>*/}
                        </IonList>
                    </IonContent>
                </IonPopover>

            </IonPage>
        );
    }
};

export default Home;
