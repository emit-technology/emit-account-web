import * as React from "react";
import {connectToParent} from "penpal";
import {IConfig, IPayload, SignWrapped} from "@emit-technology/emit-account-node-sdk";
import {AccountModel, ChainType} from "@emit-technology/emit-lib";
import {getParentUrl, utils} from "../../common/utils";
import * as web3Utils from "web3-utils";
import walletWorker from "../../worker/walletWorker";
import url from "../../common/url";
import selfStorage from "../../common/storage";
import {dappData} from "../../data";
import {jsonRpc} from "../../rpc";
import {SignTxWidgetWeb3} from "./SignTxWidgetWeb3";
import {SignTxWidgetEmit} from './SignTxWidgetEmit'
import {SignMessageWidget} from "./SignMessageWidget";
import {ApproveWidget} from "./ApproveWidget";
import {UnlockModal} from "./UnlockModal";
import {IonToast} from "@ionic/react";
import {AccountListModal} from "../../components/AccountListModal";
import {BackupModal} from "./BackupModal";
import {GasPriceActionSheet} from "../../components/GasPriceActionSheet";
import BigNumber from "bignumber.js";
import {config} from "../../common/config";
import i18n from "i18next";

interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number
}

interface State {
    account: AccountModel,
    accounts: Array<AccountModel>,

    showSignMessageModal: boolean;
    showTransactionModal: boolean;
    showApproveModal: boolean;
    showUnlockModal: boolean;
    showToast: boolean;
    showAccountsModal: boolean;
    showBackupModal: boolean;
    toastMessage?: string

    connection?: any,
    refer: string,
    config?: IConfig,
    msg?: any,
    tx?: any
    opCode: Operation

    showGasTrackerModal: boolean;
    gasChain: ChainType,
    gasPrice: string
    gasLimitHex: string
    gasLevel?: any

    dappAccountId?: string
}

const BOX_HEIGHT = '100%';

enum Operation {
    _ = "none",
    cancel = "cancel",
    reject = "reject",
    confirm = "confirm"
}

export class WidgetPage extends React.Component<Props, State> {

    state: State = {
        account: {name: ""},
        accounts: [],

        showSignMessageModal: false,
        showTransactionModal: false,
        showApproveModal: false,
        showUnlockModal: false,
        showToast: false,
        showAccountsModal: false,
        showBackupModal: false,

        opCode: Operation._,
        refer: "",

        showGasTrackerModal: false,
        gasChain: ChainType.ETH,
        gasPrice: "5",
        gasLimitHex: new BigNumber(25000).toString(16)
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    // componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    // if (prevProps.refresh != this.props.refresh ) {
    //     const {connection, config} = this.state;
    //     this.initAccount().then((act) => {
    //         if (connection && this.isApproved()) {
    //             if (config) {
    //                 connection.promise.then(parent => {
    //                     parent.onActiveWalletChanged(act.addresses[config.network.chainType])
    //                 });
    //             }
    //             connection.promise.then(parent => {
    //                 parent.onActiveAccountChanged(act)
    //             });
    //         }
    //     }).catch(e => {
    //         console.error(e)
    //     })
    // }
    // }

    init = async () => {

        const connection = connectToParent({
            parentOrigin: "*",
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
                        return Promise.resolve({error: err, result: null})
                    }
                },
                relay: this.relay,
                showWidget: this.showWidget,
                setConfig: this.setConfig,
                batchSignMessage: this.batchSignMsg,
                requestAccount: this.requestAccount,
                calcGasPrice: this.calcGasPrice,
                setLanguage: this.setLanguage,
                checkAccess: this.checkAccess
            },
        });

        this.setState({
            connection: connection,
            refer: getParentUrl()
        })

        await this.initAccount()
    }

    checkAccess = async ()=>{
        const accessFlag = selfStorage.getItem("accessFlag");
        alert(accessFlag);
        if (!!accessFlag) {
            if (document && document.hasStorageAccess && document.requestStorageAccess) {
                const hasAccess = await document.hasStorageAccess()
                if (hasAccess) {
                    return true
                }
            }else{
                return true
            }
        }
        return false;
    }

    batchSignMsg = async (config: IConfig, signArr: Array<SignWrapped>): Promise<{ error: string; result: Array<SignWrapped> }> => {
        let err = null;
        const ret: Array<SignWrapped> = [];
        try {
            await this._showWidget();
            await this.checkWalletStates(config);
            // this.setShowSignMessageModal(true)

            let account: AccountModel;
            for (let msg of signArr) {
                const iAccount = await walletWorker.getAccountByAddressAndChainId(msg.address, msg.chain.valueOf())
                if (!account) {
                    account = iAccount;
                } else {
                    if (iAccount.accountId != account.accountId) {
                        return Promise.reject("Batch signing does not support multiple accounts.")
                    }
                }
            }
            if (!account) {
                return Promise.reject("Account not found!")
            }

            setTimeout(() => {
                this.setState({
                    showSignMessageModal: true,
                    msg: signArr,
                    account: account
                })
            }, 200)
            await this.waitOperation("showSignMessageModal");

            // const {account} = this.state;
            for (let msg of signArr) {
                let message = msg.msg;
                if (msg.chain != ChainType.EMIT) {
                    const message = {
                        from: msg.address,
                        data: msg.msg,
                        messageStandard: 'signPersonalMessage'
                    }
                    if (typeof msg.msg == 'string' && !web3Utils.isHexStrict(msg.msg)) {
                        message.data = web3Utils.utf8ToHex(msg.msg)
                    }
                }

                msg.result = await walletWorker.personSignMsg(msg.chain.valueOf(), message, account.accountId)
                ret.push(msg)
            }

        } catch (e) {
            err = typeof e == 'string' ? e : e.message;
        } finally {
            await this._hideWidget()
        }
        console.log(ret, "batchSignMsg");
        return {error: err, result: ret}
    }

    private async checkWalletStates(config: IConfig) {
        if (config) {
            this.setState({config: config})
        }
        await this.checkStorageAccess();
        await this.checkAccountExist();
        await this.checkIsLocked();
    }

    private checkStorageAccess = async () => {
        return new Promise((resolve, reject) => {
            console.log("----> document && document.hasStorageAccess: ", document && !!document.hasStorageAccess && document.requestStorageAccess)
            //@ts-ignore
            if (document && document.hasStorageAccess && document.requestStorageAccess) {
                document.hasStorageAccess().then(hasAccess => {
                    console.log("----> document && document.hasAccess: ", hasAccess)
                    if (hasAccess) {
                        resolve(true)
                        // storage access has been granted already.
                    } else {
                        document.requestStorageAccess().then(
                            () => resolve(true),
                            () => reject("User reject storage access!")
                        )
                        // storage access hasn't been granted already;
                        // you may want to call requestStorageAccess().
                    }
                });
            } else {
                resolve(true)
            }
        })
    }

    requestAccount = async (config: IConfig, accountId?: string): Promise<{ error: string; result: AccountModel }> => {
        let err = null;
        let ret: AccountModel = {name: ""};
        try {
            await this._showWidget()
            await this.checkWalletStates(config);
            await this.initAccount();
            this.setState({showAccountsModal: true, dappAccountId: accountId});
            await this.waitOperation("showAccountsModal");
            ret = this.state.account;
            await this.checkApprove(ret.accountId)
            // ret = await walletWorker.accountInfoAsync();
        } catch (e) {
            console.error(e)
            err = typeof e == 'string' ? e : e.message;
        } finally {
            await this._hideWidget()
        }

        return {error: err, result: ret}
    }

    calcGasPrice = async (gasLimitHex: string, gasChain: ChainType, config: IConfig): Promise<{ error: string; result: string }> => {
        let err = null;
        let ret: string = null;
        console.log("calc gas price", gasLimitHex)
        try {
            await this._showWidget()
            await this.checkWalletStates(config);
            const gasLevel = await this.getGasLevel(gasChain);
            this.setState({
                showGasTrackerModal: true,
                gasLimitHex: gasLimitHex,
                gasChain: gasChain,
                gasLevel: gasLevel
            });
            await this.waitOperation("showGasTrackerModal");
            // await this.checkApprove()
            ret = this.state.gasPrice;
            // ret = await walletWorker.accountInfoAsync();
        } catch (e) {
            err = typeof e == 'string' ? e : e.message;
        } finally {
            await this._hideWidget()
        }
        return {error: err, result: ret}
    }

    getGasLevel = async (chain: ChainType) => {
        if (chain == ChainType.ETH) {
            return await jsonRpc(config.ACCOUNT_NODE, {id: 0, method: "eth_gasTracker", params: [], jsonrpc: "2.0"})
        } else if (chain == ChainType.BSC) {
            const gasPrice = await jsonRpc(config.ACCOUNT_NODE, {
                id: 0,
                method: "eth_gasPrice",
                params: [],
                jsonrpc: "2.0"
            }, chain)
            return {
                AvgGasPrice: {gasPrice: gasPrice, second: 5}
            }
        } else if (chain == ChainType.SERO) {
            const gasPrice = await jsonRpc(config.ACCOUNT_NODE, {
                id: 0,
                method: "sero_gasPrice",
                params: [],
                jsonrpc: "2.0"
            }, chain)
            return {
                AvgGasPrice: {gasPrice: gasPrice, second: 5}
            }
        }
    }

    initAccount = async () => {
        // const acct = await walletWorker.accountInfoAsync();
        const accounts = await walletWorker.accounts();
        this.setState({
            // account: acct,
            accounts: accounts
        })
    }

    setShowUnLockModal = (f: boolean) => {
        this.setState({
            showUnlockModal: f
        })
    }

    checkIsLocked = async () => {
        const isLocked = await walletWorker.isLocked();
        if (isLocked) {
            this.setShowUnLockModal(true);
            await this.waitUnlock();
        }
        return Promise.resolve(true);
    }

    isApproved = (accountId: string) => {
        const refer = getParentUrl();
        // const accountId = selfStorage.getItem("accountId")
        let host = refer.replace("http://", "").replace("https://", "");
        // host = host.substr(0, host.indexOf("/"));
        // console.log(dappData.get(host).indexOf(accountId) ,dappData.get(host));
        return !(!dappData.get(host) || dappData.get(host).indexOf(accountId) == -1);

    }

    checkApprove = async (accountId) => {
        // const {account} = this.state;
        const refer = getParentUrl();
        if (refer) {
            if (!this.isApproved(accountId)) {
                this.setShowApproveDAppModal(true)
                await this.waitOperation("showApproveModal");
                // const accountId = selfStorage.getItem("accountId")
                let host = refer.replace("http://", "").replace("https://", "");
                dappData.set(host, accountId);
            }
            return Promise.resolve(true);
        } else {
            return Promise.reject("Invalid Refer parent")
        }
    }

    checkBackup = async (account: AccountModel) => {
        // const account = await walletWorker.accountInfoAsync();
        if (account && account.name) {
            if (!account["backedUp"]) {
                // selfStorage.setItem("accountId", account.accountId);
                // selfStorage.setItem(account.accountId, account);
                this.setShowBackupModal(true)
                await this.waitOperation("showBackupModal")
                if (!url.accountOpenBackup()) {
                    return Promise.reject("The popup window has been blocked.")
                }
                await this.waitAccountBackup(account.accountId)
            }
            return Promise.resolve(true);
        } else {
            return Promise.reject("No account found!")
        }
    }

    waitUnlock = async (): Promise<boolean> => {
        for (let i = 0; i < 240; i++) {
            await this.waitTime();
            if (!this.state.showUnlockModal) {
                break
            }
        }
        const f = await walletWorker.isLocked()
        if (f) {
            return Promise.reject("Wallet is locked !")
        }
        return Promise.resolve(true);
    }

    waitOperation = async (item: string) => {
        this.setState({opCode: Operation._})
        for (let i = 0; i < 240; i++) {
            await this.waitTime();
            const f: boolean = this.state[item];
            if (!f) {
                break;
            }
        }
        const opCode = this.state.opCode;

        if (opCode == Operation.confirm) {
            this.setState({opCode: Operation._})
            return Promise.resolve(true);
        }
        if (opCode == Operation.cancel) {
            this.setState({opCode: Operation._})
            return Promise.reject(i18n.t("userCancel"));
        }
        if (opCode == Operation.reject) {
            this.setState({opCode: Operation._})
            return Promise.reject(i18n.t("userReject"));
        }
        this.setState({opCode: Operation._})
        return Promise.reject(i18n.t("operationTimeout"));
    }

    waitTime = async (defaultSecond = 0.5) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true)
            }, defaultSecond * 1000)
        })
    }


    checkAccountExist = async (): Promise<boolean> => {
        const accounts = await walletWorker.accounts();
        if (!accounts || accounts.length == 0) {
            await this._hideWidget();
            if (!url.accountOpenCreate()) {
                return Promise.reject("The popup window has been blocked.")
            }
            //
            await this.waitAccountCreate();
            await this._showWidget();
        }
        return Promise.resolve(true);
    }

    waitAccountCreate = async () => {
        // if( utils.isIos()){

        // window.location.href = ""
        //    technology.emit.wallet
        // }else{
        for (let i = 0; i < 600; i++) {
            await this.waitTime(1);
            if (this.getStorageAccountId()) {
                url.closeTopWindow();
                break;
            }
        }
        // }
        return Promise.resolve(true);
    }

    waitAccountBackup = async (accountId: string) => {
        for (let i = 0; i < 600; i++) {
            await this.waitTime(1);
            const account = await walletWorker.accountInfoAsync(accountId)
            if (account["backedUp"] && account["backedUp"] == true) {
                url.closeTopWindow();
                break;
            }
        }
        return Promise.resolve(true);
    }

    getStorageAccountId = () => {
        return selfStorage.getItem("accountId");
    }

    getAccounts = async (config: IConfig): Promise<{ error: string, result: Array<string> }> => {
        let err = null;
        let result: Array<AccountModel>;
        try {
            await this._showWidget();
            await this.checkWalletStates(config);
            // await this.checkApprove()
            result = await walletWorker.accounts()
        } catch (e) {
            err = typeof e == "string" ? e : e.message;
            console.error(e)
        } finally {
            await this._hideWidget()
        }
        if (err) {
            return {error: err, result: []}
        } else {
            const accounts: Array<string> = [];
            for (let act of result) {
                accounts.push(act.addresses[config.network.chainType])
            }
            return {error: err, result: accounts}
        }

    }


    signTransaction = async (txParams: any, config: IConfig): Promise<{ error: string, result: string }> => {
        let chainParams, err = null, ret = null, from;
        if (utils.isWeb3Chain(config.network.chainType.valueOf())) {
            if (!txParams.nonce) {
                return {error: "tx nonce is required! ", result: ""}
            }
            if (!txParams.from) {
                return {error: "from address is required! ", result: ""}
            }
            chainParams = txParams.common;
            if (!txParams.common) {
                chainParams = {
                    baseChain: "mainnet",
                    customer: {name: "mainnet", networkId: 1, chainId: 1,},
                    hardfork: "byzantium"
                }
            }
            from = txParams.from;
        } else if (config.network.chainType == ChainType.EMIT) {
            from = txParams["address"];
        }
        try {
            await this._showWidget();
            await this.checkWalletStates(config)
            const account = await walletWorker.getAccountByAddressAndChainId(from, config.network.chainType.valueOf());
            await this.checkApprove(account.accountId)
            await this.checkBackup(account);
            this.setState({tx: txParams, showTransactionModal: true, account: account})
            await this.waitOperation("showTransactionModal");
            // const {account} = this.state;


            ret = await walletWorker.signTx(account.accountId, "", config.network.chainType, txParams, chainParams)
            if (utils.isWeb3Chain(config.network.chainType.valueOf())) {
                ret = "0x" + web3Utils.stripHexPrefix(ret)
            }
        } catch (e) {
            err = typeof e == 'string' ? e : e.message;
        } finally {
            await this._hideWidget();
        }
        return {error: err, result: ret}
    }

    signMessage = async (msgParams: any, config: IConfig): Promise<{ error: string, result: string }> => {
        let ret = null, err = null;
        try {
            if (config) {
                this.setState({config: config, msg: msgParams})
            }
            await this._showWidget();
            await this.checkWalletStates(config);
            const account = await walletWorker.getAccountByAddressAndChainId(msgParams.from, config.network.chainType.valueOf());
            this.setState({showSignMessageModal: true, account: account})
            await this.waitOperation("showSignMessageModal");
            const standard = msgParams["messageStandard"];
            // const {account} = this.state;

            if (standard == 'signMessage' || standard == 'signPersonalMessage') {
                ret = await walletWorker.personSignMsg(config.network.chainType, msgParams, account.accountId)
            } else if (standard == 'signTypedMessage') {
                ret = await walletWorker.signTypedMessage(config.network.chainType, msgParams, "V1", account.accountId)
            } else if (standard == 'signTypedMessageV3') {
                // ret = await walletWorker.signTypedMessage(config.network.chainType, msgParams,"V3")
                // }else if(standard == 'signTypedMessageV4'){
                ret = await walletWorker.signTypedMessage(config.network.chainType, msgParams, "V4", account.accountId)
            }
        } catch (e) {
            err = e;
        } finally {
            await this._hideWidget()
        }
        return {error: err, result: ret}
    }

    _showWidget = async () => {
        const {connection} = this.state;
        const parent = await connection.promise;
        parent.setHeight(BOX_HEIGHT);
    }

    _hideWidget = async () => {
        const {connection} = this.state;
        const parent = await connection.promise;
        parent.setHeight();
    }

    // TODO ADD RPC PROXY
    relay = async (payload: IPayload, config: IConfig): Promise<{ error: string, result: any }> => {
        try {
            const rest = await jsonRpc(config.network.nodeUrl, payload);
            return {error: null, result: rest}
        } catch (e) {
            console.error(e)
            const err = typeof e == 'string' ? e : e.message;
            return {error: err, result: ""}
        }
    }

    showWidget = async (config: IConfig) => {
        // await this.checkAndSetConfig(config)
        try {
            await this._showWidget();
            await this.checkWalletStates(config);
            await this.setState({showAccountsModal: true})
            await this.waitOperation("showAccountsModal");
        } catch (e) {
            console.error(e)
        } finally {
            await this._hideWidget();
        }
    }

    setConfig = (config: IConfig): Promise<void> => {
        // this.checkApprove(config)
        return
    }

    setLanguage = (code: string): Promise<void> => {
        selfStorage.setItem("language", code);
        i18n.changeLanguage(code).then(() => {
        }).catch((e: any) => {
            console.error(e)
        })
        return
    }

    setShowSignMessageModal = (f: boolean) => {
        this.setState({
            showSignMessageModal: f
        })
    }

    setShowTransactionDAppModal = (f: boolean) => {
        this.setState({
            showTransactionModal: f
        })
    }

    setShowApproveDAppModal = (f: boolean) => {
        this.setState({
            showApproveModal: f
        })
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMessage: msg
        })
    }

    unlockWallet = async (password: string) => {
        if (!password) {
            this.setShowToast(true, i18n.t("inputPassword"));
            return;
        }
        await walletWorker.unlockWallet(password)
    }

    setShowBackupModal = (f: boolean) => {
        this.setState({showBackupModal: f})
    }

    render() {
        const {
            account, showTransactionModal, showToast, toastMessage, config, msg, showAccountsModal
            , showUnlockModal, tx, showApproveModal, showSignMessageModal, accounts, showBackupModal,
            gasChain, showGasTrackerModal, gasLimitHex, gasLevel, dappAccountId
        } = this.state;
        return (
            <div>
                {
                    tx && config && account && utils.isWeb3Chain(config.network.chainType) &&
                    <SignTxWidgetWeb3 showModal={showTransactionModal}
                                      onCancel={() => {
                                          // this._hideWidget()
                                          this.setState({showTransactionModal: false, opCode: Operation.cancel})
                                      }}
                                      onOk={() => {
                                          this.setState({showTransactionModal: false, opCode: Operation.confirm})
                                      }}
                                      onReject={() => {
                                          this.setState({showTransactionModal: false, opCode: Operation.reject})
                                      }}
                                      router={this.props.router}
                                      transaction={tx}
                                      config={config}
                                      account={account}
                    />
                }

                {
                    tx && config && account && config.network.chainType == ChainType.EMIT &&
                    <SignTxWidgetEmit showModal={showTransactionModal}
                                      onCancel={() => {
                                          // this._hideWidget()
                                          this.setState({showTransactionModal: false, opCode: Operation.cancel})
                                      }}
                                      onOk={() => {
                                          this.setState({showTransactionModal: false, opCode: Operation.confirm})
                                      }}
                                      onReject={() => {
                                          this.setState({showTransactionModal: false, opCode: Operation.reject})
                                      }}
                                      router={this.props.router}
                                      transaction={tx}
                                      config={config}
                                      account={account}
                    />
                }

                <SignMessageWidget showModal={showSignMessageModal}
                                   onCancel={() => {
                                       // this._hideWidget()
                                       this.setState({showSignMessageModal: false, opCode: Operation.cancel})
                                   }}
                                   onOk={() => {
                                       this.setState({showSignMessageModal: false, opCode: Operation.confirm})
                                   }}
                                   onReject={() => {
                                       this.setState({showSignMessageModal: false, opCode: Operation.reject})
                                   }}
                                   router={this.props.router} msg={msg} account={account} config={config}/>


                {
                    <ApproveWidget showModal={showApproveModal}
                                   onCancel={() => {
                                       // this._hideWidget()
                                       this.setState({showApproveModal: false, opCode: Operation.cancel})
                                   }}
                                   onOk={() => {
                                       this.setState({showApproveModal: false, opCode: Operation.confirm})
                                   }}
                                   onReject={() => {
                                       this.setState({showApproveModal: false, opCode: Operation.reject})
                                   }}
                                   router={this.props.router} config={config} account={account}
                    />
                }

                {
                    <UnlockModal showModal={showUnlockModal}
                                 config={config}
                                 onCancel={() => {
                                     // this._hideWidget()
                                     this.setState({showUnlockModal: false})
                                 }}
                                 onOk={(password) => {
                                     this.unlockWallet(password).then(() => {
                                         this.setState({showUnlockModal: false})
                                     }).catch(e => {
                                         const err = typeof e == 'string' ? e : e.message;
                                         this.setShowToast(true, err);
                                     });
                                 }}

                                 onReject={() => {
                                     this.setState({showUnlockModal: false})
                                 }}
                                 router={this.props.router}
                    />
                }

                {
                    <AccountListModal showModal={showAccountsModal}
                                      onCancel={() => {
                                          // this._hideWidget()
                                          this.setState({showAccountsModal: false, opCode: Operation.cancel})
                                      }}
                                      onOk={(account) => {
                                          // selfStorage.setItem("accountId", account.accountId);
                                          this.setState({
                                              showAccountsModal: false,
                                              account: account,
                                              opCode: Operation.confirm
                                          })
                                      }}

                                      onReject={() => {
                                          this.setState({showAccountsModal: false, opCode: Operation.reject})
                                      }}
                                      accounts={accounts}
                                      selectedAccountId={dappAccountId}
                                      router={this.props.router}
                    />
                }

                {
                    <BackupModal showModal={showBackupModal}
                                 onCancel={() => {
                                     // this._hideWidget()
                                     this.setState({showBackupModal: false, opCode: Operation.cancel})
                                 }}
                                 onOk={() => {
                                     this.setState({showBackupModal: false, opCode: Operation.confirm})
                                 }}
                                 onReject={() => {
                                     this.setState({showBackupModal: false, opCode: Operation.reject})
                                 }}
                                 selected={account}
                                 router={this.props.router}
                    />
                }

                <IonToast
                    mode="ios"
                    isOpen={showToast}
                    color="primary"
                    position="top"
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />

                {
                    gasLevel && <GasPriceActionSheet gasLimit={gasLimitHex} gasLevel={gasLevel} onClose={() => {
                        this.setState({
                            showGasTrackerModal: false,
                            opCode: Operation.cancel
                        })
                    }} onSelect={(gasPrice) => {
                        this.setState({
                            showGasTrackerModal: false,
                            opCode: Operation.confirm,
                            gasPrice: gasPrice
                        })
                    }} isOpen={showGasTrackerModal} chain={gasChain}/>
                }
            </div>
        );
    }
}