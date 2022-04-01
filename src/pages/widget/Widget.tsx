import * as React from 'react';
import {connectToParent} from 'penpal';
import {IConfig, IPayload} from '@emit-technology/emit-account-node-sdk';
import walletWorker from "../../worker/walletWorker";
import {AccountModel, ChainType} from "../../types";

enum OpCode {
    _,
    showAccount,
    authAccount,
    unlockAccount,
    signTx,
    signMsg
}

interface State {
    opCode: OpCode,
    connection: any,
    openId: any
}

interface Props {

}
export class Widget extends React.Component<Props, State> {

    state: State = {
        opCode: OpCode._,
        connection:null,
        openId:0
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const connection = connectToParent({
            // Methods child is exposing to parent.
            methods: {
                getAccounts: (config) => {
                    console.log("aa..a.");
                    return this.getAccounts(config)
                },
                signTransaction: this.signTransaction,
                signMessage: (msgParams: any, config: IConfig) => {
                    return this.signMessage(msgParams,config)
                },
                relay: this.relay,
                showWidget: this.showWidget,
                setConfig: this.setConfig
            },
        });
        this.setState({
            connection:connection
        })
    }

    checkIsLocked = async (config:IConfig) =>{
        let {connection} = this.state;
        const parent = await connection.promise;
        return new Promise((resolve, reject) => {
            walletWorker.isLocked().then(isLocked=>{
                if(isLocked){
                    parent.setHeight(600);
                    setTimeout(()=>{
                        this.checkIsLocked(config).catch(e=>{
                            reject(e)
                        })
                    },500)
                }else {
                    parent.setHeight(0)
                    resolve(true)
                }
            }).catch(e=>{
                reject(e)
            });
        })
    }

    getAccounts = async (config: IConfig): Promise<{error:string,result:Array<string>}> => {
        await this.checkIsLocked(config)
        const result:AccountModel =  await walletWorker.accountInfo()
        return {error:"",result:[result.addresses[config.network.chainType]]}
    }

    signTransaction = async (txParams: any, config: IConfig): Promise<{ error: string, result: string }> => {
        let chainParams:any;
        if(config.network.chainType == ChainType.ETH || config.network.chainType == ChainType.BSC){
            chainParams = { baseChain: "mainnet", customer: { name: "mainnet", networkId: 1, chainId: 1, }, hardfork: "byzantium" }
        }
        const ret = await walletWorker.signTx("","",config.network.chainType,txParams,chainParams)
        return {error:"",result:ret}
    }

    signMessage = async (msgParams: any, config: IConfig): Promise<{ error: string, result: string }> => {
        const ret = await walletWorker.personSignMsg(config.network.chainType,msgParams)
        console.log("ret",ret)
        return {error:null,result:ret}
    }

    relay = async (payload: IPayload, config: IConfig): Promise<{ error: string, result: any }> => {

        return {error:"",result:"sss"}
    }

    showWidget = async (config: IConfig) => {
        const {connection} = this.state;
        const parent = await connection.promise;
        parent.setHeight(600)
    }

    setConfig = (config: IConfig): Promise<void> => {

        return
    }


    render() {
        return (
            <div>

            </div>
        );
    }
}