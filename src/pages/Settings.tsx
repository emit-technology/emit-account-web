import * as React from "react";
import {IonPage,IonContent,IonHeader,IonTitle,IonToolbar,IonItemDivider,IonItem,
    IonLabel,IonIcon} from '@ionic/react';
import {
    chevronForwardOutline,
    logoFacebook,
    logoReddit,
    logoTwitter,
    personCircle,
    arrowForwardOutline,
    readerSharp,
    paperPlaneSharp,
    arrowBackOutline,
    globe,
    logoGithub,
    logoMedium,
    languageSharp
} from "ionicons/icons";
import url from "../common/url";
import {AccountModel} from "@emit-technology/emit-lib";
import walletWorker from "../worker/walletWorker";
import {Browser} from "@capacitor/browser";

interface Props{
}

interface State{
    account?:AccountModel
    showOperatorModal:boolean
}

const items = [
    {logo: globe,name: "Website", url: "https://emit.technology", value: "https://emit.technology"},
    {logo: globe,name: "Blog", url: "https://blog.emit.technology", value: "https://blog.emit.technology"},
    {logo: globe,name: "Community", url: "https://community.emit.technology", value: "https://community.emit.technology"},
    {logo: globe,name: "Documents", url: "https://docs.emit.technology", value: "https://docs.emit.technology"},
    {logo: paperPlaneSharp,name: "Telegram", url: "https://t.me/emit_protocol", value: "https://t.me/emit_protocol"},
    {logo: logoGithub,name: "Github", url: "https://github.com/emit-technology", value: "https://github.com/emit-technology"},
    {logo: logoFacebook,name: "Facebook", url: "https://www.facebook.com/EMITProtocolc", value: "https://www.facebook.com/EMITProtocol"},
    {logo: logoTwitter,name: "Twitter", url: "https://twitter.com/emit_protocol", value: "https://twitter.com/emit_protocol"},
    {logo: logoMedium,name: "Medium", url: "https://emitprotocol.medium.com", value: "https://emitprotocol.medium.com"},
    {logo: logoReddit,name: "Reddit", url: "https://www.reddit.com/r/emit_protocol/", value: "https://www.reddit.com/r/emit_protocol/"},

]
export class Settings extends React.Component<Props, State> {
    state: State = {
        showOperatorModal:false
    };

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const account = await walletWorker.accountInfo();
        this.setState({
            account: account
        })
    }

    showOperatorModal = (f:boolean) =>{
        this.setState({
            showOperatorModal:f
        })
    }

    render() {
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={()=>url.back()}/>
                        <IonTitle>Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <IonItemDivider mode="md">Identity</IonItemDivider>
                    <div>
                        <IonItem lines="none" onClick={()=>{
                            url.accountList();
                        }}>
                            <IonIcon src={personCircle} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Accounts
                            </IonLabel>
                            <IonIcon size="small" src={arrowForwardOutline}/>
                        </IonItem>
                    </div>
                    <IonItemDivider mode="md">General</IonItemDivider>
                    <div>
                        <IonItem lines="none">
                            <IonIcon src={languageSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                               Language
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                    </div>

                    <IonItemDivider mode="md">Community</IonItemDivider>
                    <div>
                        {
                            items.map((v,i)=>{
                                return <IonItem lines="none" onClick={()=>{
                                   Browser.open({url: v.url}).catch(e=>console.error(e))
                                }}>
                                    <IonIcon src={v.logo} slot="start" size="small"/>
                                    <IonLabel className="ion-text-wrap">
                                        {v.name}
                                    </IonLabel>
                                    <IonIcon size="small" src={chevronForwardOutline}/>
                                </IonItem>
                            })
                        }
                    </div>

                    <IonItemDivider mode="md">Others</IonItemDivider>
                    <div>

                        <IonItem lines="none" onClick={()=>{
                            Browser.open({url:"https://emit.technology/wallet/terms-of-service.html"})
                        }}>
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Term of Use
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none" onClick={()=>{
                            Browser.open({url:"https://emit.technology/wallet/privacy-policy.html"})
                        }}>
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                Service of Policy
                            </IonLabel>
                            <IonIcon size="small" src={chevronForwardOutline}/>
                        </IonItem>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}