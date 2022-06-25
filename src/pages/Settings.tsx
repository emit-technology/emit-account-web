import * as React from "react";
import {IonPage,IonContent,IonHeader,IonTitle,IonToolbar,IonItemDivider,IonItem,
    IonLabel,IonIcon,IonAlert} from '@ionic/react';
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
    languageSharp, logoDiscord, logoYoutube, logoInstagram
} from "ionicons/icons";
import url from "../common/url";
import {AccountModel} from "@emit-technology/emit-lib";
import walletWorker from "../worker/walletWorker";
import {Browser} from "@capacitor/browser";
import i18n from '../locales/i18n';

const items = [
    {logo: globe,name: "Website", url: "https://emit.technology", value: "https://emit.technology"},
    {logo: globe,name: "Documents", url: "https://docs.emit.technology", value: "https://docs.emit.technology"},
    {logo: paperPlaneSharp,name: "Telegram", url: "https://t.me/emit_protocol", value: "https://t.me/emit_protocol"},
    {logo: logoGithub,name: "Github", url: "https://github.com/emit-technology", value: "https://github.com/emit-technology"},
    {logo: logoFacebook,name: "Facebook", url: "https://www.facebook.com/EMITProtocolc", value: "https://www.facebook.com/EMITProtocol"},
    {logo: logoTwitter,name: "Twitter", url: "https://twitter.com/emit_protocol", value: "https://twitter.com/emit_protocol"},
    {logo: logoMedium,name: "Medium", url: "https://emitprotocol.medium.com", value: "https://emitprotocol.medium.com"},
    {logo: logoReddit,name: "Reddit", url: "https://www.reddit.com/r/emit_protocol/", value: "https://www.reddit.com/r/emit_protocol/"},
    {logo: logoDiscord,name: "Discord", url: "https://discord.gg/AMFnCJKkZ4", value: "https://https://discord.gg/AMFnCJKkZ4"},
    {logo: logoYoutube,name: "Youtube", url: "https://www.youtube.com/channel/UCKlH9YDE_ackvCbwu8Axu9A", value: "https://www.youtube.com/channel/UCKlH9YDE_ackvCbwu8Axu9A"},
    {logo: logoInstagram,name: "Instagram", url: "https://www.instagram.com/emit_herman/", value: "https://www.instagram.com/emit_herman/"},

]


const languages:Array<any> = [
    {
        name: 'language',
        type: 'radio',
        label: 'English',
        value: 'en_US',
        checked: "en_US" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '日本語',
        value: 'ja_JP',
        checked: "ja_JP" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'русский',
        value: 'be_BY',
        checked: "be_BY" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '한국어',
        value: 'ko_KR',
        checked: "ko_KR" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '繁體中文',
        value: 'zh_TW',
        checked: "zh_TW" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Français',
        value: 'fr_FR',
        checked: "fr_FR" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Italiano',
        value: 'it_IT',
        checked: "it_IT" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Nederlands',
        value: 'nl_NL',
        checked: "nl_NL" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Español',
        value: 'es_ES',
        checked: "es_ES" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Deutsch',
        value: 'de_DE',
        checked: "de_DE" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: 'Português',
        value: 'pt_BR',
        checked: "pt_BR" == localStorage.getItem("language")
    },
    {
        name: 'language',
        type: 'radio',
        label: '简体中文',
        value: 'zh_CN',
        checked: "zh_CN" == localStorage.getItem("language")
    },
]
interface Props{
    onRefresh:()=>void;
}

interface State{
    account?:AccountModel
    showOperatorModal:boolean
    showLanguageModal:boolean
    languages: Array<any>
}

export class Settings extends React.Component<Props, State> {
    state: State = {
        showOperatorModal:false,
        languages:languages,
        showLanguageModal:false
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

    setLan = (language:string) =>{
        const {languages} = this.state;
        localStorage.setItem("language",language);
        i18n.changeLanguage(language).then(()=>{
            // window.location.reload();
        }).catch(e=>{
            console.error(e)
        })
        this.props.onRefresh()
        const langs = [];
        for(let lan of languages){
            lan.checked = language == lan.value;
            langs.push(lan)
        }
        this.setState({languages:langs})
    }

    render() {
        const {showLanguageModal,languages} = this.state;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={()=>url.back()}/>
                        <IonTitle>{i18n.t("settings")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <IonItemDivider mode="md">{i18n.t("identity")}</IonItemDivider>
                    <div>
                        <IonItem lines="none" onClick={()=>{
                            url.accountList();
                        }}>
                            <IonIcon src={personCircle} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                {i18n.t("accounts")}
                            </IonLabel>
                            <IonIcon slot="end" size="small" src={arrowForwardOutline}/>
                        </IonItem>
                    </div>
                    <IonItemDivider mode="md">{i18n.t("general")}</IonItemDivider>
                    <div>
                        <IonItem lines="none" onClick={()=>{
                           this.setState({showLanguageModal:true})
                        }}>
                            <IonIcon src={languageSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                {i18n.t("language")}
                            </IonLabel>
                            <IonLabel slot="end" className="ion-text-wrap">
                                <p>{i18n.t("lang")}</p>
                            </IonLabel>
                            <IonIcon slot="end" size="small" src={chevronForwardOutline}/>
                        </IonItem>
                    </div>

                    <IonItemDivider mode="md">{i18n.t("community")}</IonItemDivider>
                    <div>
                        {
                            items.map((v,i)=>{
                                return <IonItem key={i} lines="none" onClick={()=>{
                                   Browser.open({url: v.url}).catch(e=>console.error(e))
                                }}>
                                    <IonIcon src={v.logo} slot="start" size="small"/>
                                    <IonLabel className="ion-text-wrap">
                                        {v.name}
                                    </IonLabel>
                                    <IonIcon slot="end" size="small" src={chevronForwardOutline}/>
                                </IonItem>
                            })
                        }
                    </div>

                    <IonItemDivider mode="md">{i18n.t("others")}</IonItemDivider>
                    <div>

                        <IonItem lines="none" onClick={()=>{
                            Browser.open({url:"https://emit.technology/wallet/terms-of-service.html"})
                        }}>
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                {i18n.t("termOfUse")}
                            </IonLabel>
                            <IonIcon slot="end" size="small" src={chevronForwardOutline}/>
                        </IonItem>
                        <IonItem lines="none" onClick={()=>{
                            Browser.open({url:"https://emit.technology/wallet/privacy-policy.html"})
                        }}>
                            <IonIcon src={readerSharp} slot="start" size="small"/>
                            <IonLabel className="ion-text-wrap">
                                {i18n.t("serviceOfPolicy")}
                            </IonLabel>
                            <IonIcon slot="end" size="small" src={chevronForwardOutline}/>
                        </IonItem>
                    </div>

                    <IonAlert
                        isOpen={showLanguageModal}
                        onDidDismiss={() => this.setState({
                            showLanguageModal:false
                        })}
                        header={i18n.t("language")}
                        inputs={languages}
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
                                text: i18n.t("ok"),
                                handler: (language) => {
                                    this.setLan(language);
                                }
                            }
                        ]}
                    />
                </IonContent>
            </IonPage>
        );
    }
}