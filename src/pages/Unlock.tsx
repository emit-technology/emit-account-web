import * as React from 'react';
import {
    IonButton,
    IonContent,
    IonHeader, IonInput,
    IonItem, IonLabel,
    IonList, IonPage,
    IonProgressBar, IonSpinner,
    IonText,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import i18n from "../locales/i18n";
import url from "../common/url";
import walletWorker from "../worker/walletWorker";
import {widgetInterVar} from "../common/interval";
import selfStorage from "../common/storage";

interface State {
    password:string
    showToast:boolean;
    toastMessage?:string
    showProgress:boolean
    showPasswordTips:boolean

    accountId: string|undefined;
}

class Unlock extends React.Component<any, State>{

    state: State = {
        password:"",
        showToast:false,
        toastMessage:"",
        showProgress:false,
        showPasswordTips:false,
        accountId:selfStorage.getItem("accountId")
    }

    componentDidMount() {
        const {accountId} = this.state;
        // walletWorker.accountInfo().then(account=>{
        //     if(account && account.accountId){
        //     }else {
        //         url.accountCreate()
        //     }
        // })
        if (!accountId){
            if(window.parent){
                widgetInterVar.start(()=>{
                   const actId = selfStorage.getItem('accountId');
                   this.setState({
                       accountId:actId
                   })
                },1000,true,30 * 60 * 1000)
            }
        }else{

        }
    }

    setShowToast = (f:boolean,m?:string) =>{
        this.setState({
            showToast:f,
            toastMessage:m
        })
    }

    confirm = async ()=>{
        const {password} = this.state;
        if(!password){
            this.setShowToast(true,"Please Input Password!");
            return;
        }
        this.setState({
            showProgress:true
        })
        const rest = await walletWorker.unlockWallet(password)
        if(rest){
            this.setState({
                password:"",
                showProgress:false
            })
            return Promise.resolve()
        }
    }

    render() {
        const {showToast,toastMessage,showProgress,password,accountId} = this.state;

        return <>
            <IonPage>
                <IonContent fullscreen>
                    <IonHeader  collapse="fade">
                        <IonToolbar mode="ios">
                            <IonTitle>
                                <IonText>{i18n.t("unlock")} {i18n.t("wallet")}</IonText>
                            </IonTitle>
                        </IonToolbar>
                        {showProgress && <IonProgressBar type="indeterminate"/>}
                    </IonHeader>
                    <div style={{padding:"15px 15px 0",textAlign:"center"}}>
                        <img src={"./assets/img/logo/EMIT.png"} style={{width:"200px"}}/>
                        <h1>{i18n.t("welcome")}</h1>
                        <p><IonText color="medium">The decentralized word waits</IonText></p>
                    </div>
                    <div style={{padding:"0 24px"}}>
                        <IonList>
                            <IonItem mode="ios">
                                <IonLabel position="floating"><IonText color="medium">{i18n.t("wallet")} {i18n.t("password")}</IonText></IonLabel>
                                <IonInput disabled={!accountId} mode="ios" type="password" value={password} onIonChange={(e: any) => {
                                    this.setState({
                                        password:e.target.value!
                                    })
                                }}/>
                            </IonItem>
                        </IonList>
                    </div>
                    <div style={{padding:"12px 24px 0"}}>
                        <IonButton mode="ios" expand="block" size="large" disabled={!password || showProgress} onClick={()=>{
                            this.confirm().then(()=>{
                                url.home()
                            }).catch(e=>{
                                console.error(e)
                                this.setState({
                                    showProgress:false
                                })
                                const err = typeof e=="string"?e:e.message;
                                this.setShowToast(true,err)
                            });
                        }}>{showProgress&&<IonSpinner name="bubbles" />}{i18n.t("unlock")}</IonButton>
                    </div>
                    <IonToast
                        mode="ios"
                        isOpen={showToast}
                        color="warning"
                        position="top"
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMessage}
                        duration={2000}
                    />
                </IonContent>
            </IonPage>
        </>;
    }
}

export default Unlock