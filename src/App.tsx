import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {IonApp, IonRouterOutlet, setupIonicReact, IonRow, IonCol, IonSplitPane} from '@ionic/react';
import {IonReactHashRouter} from '@ionic/react-router';
import Home from './pages/Home';
import Backup from "./pages/Backup";
import Confirm from "./pages/Confirm";
import CreateAccount from "./pages/Create";
import ImportAccount from "./pages/Import";
import Unlock from "./pages/Unlock";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {SignTxWidgetWeb3, SignMessageWidget, ApproveWidget, WidgetPage} from "./pages/widget";
import {Settings} from "./pages/Settings";
import {AccountList} from "./pages/AccountList";
import ResetAccount from "./pages/Reset";
// import {AccountMenu} from "./components/AccountMenu";

setupIonicReact({
    mode: "ios"
});

const App: React.FC = () => {
    const routerRef = React.useRef<HTMLIonRouterOutletElement | null>(null);
    const [freshNum, setFreshNum] = React.useState(0)
    const width = window.location.hash == '#/widget' ? "100%" : "";
    return (
        <div className="page" style={{width: width, height: width}}>
            <div className="page-inner">
                <IonApp>
                    <IonReactHashRouter>
                        {/*<IonSplitPane contentId="main">*/}
                        {/*<AccountMenu/>*/}
                        <Switch>
                            {/*<IonRouterOutlet id="main">*/}
                            <Route exact path="/home/:op"
                                   render={(props) => <Home op={props.match.params.op} router={routerRef.current}
                                                            refresh={Math.floor(Date.now() / 1000)}/>}/>
                            <Route exact path="/home" render={() => <Home router={routerRef.current}
                                                                          refresh={Math.floor(Date.now() / 1000)}/>}/>
                            <Route path="/account/create" component={CreateAccount} exact={true}/>
                            <Route path="/account/backup" component={Backup} exact={true}/>
                            <Route path="/account/confirm" component={Confirm} exact={true}/>
                            <Route path="/account/import" component={ImportAccount} exact={true}/>
                            <Route path="/account/reset" component={ResetAccount} exact={true}/>
                            <Route path="/account/unlock" component={Unlock} exact={true}/>
                            <Route path="/account/list/2" render={() => <AccountList version={2}/>} exact/>
                            <Route path="/account/list" component={AccountList} exact={true}/>
                            <Route path="/settings" render={() =>
                                <Settings onRefresh={() => setFreshNum(freshNum + 1)}/>} exact
                            />
                            <Route path="/widget/sign/tx" component={SignTxWidgetWeb3} exact={true}/>
                            <Route path="/widget/sign/msg" component={SignMessageWidget} exact={true}/>
                            <Route path="/widget/approve" component={ApproveWidget} exact={true}/>
                            <Route path="/widget" render={() => <WidgetPage router={routerRef.current}
                                                                            refresh={Math.floor(Date.now() / 1000)}/>}
                                   exact={true}/>

                            <Route exact path="/">
                                <Redirect to="/home"/>
                            </Route>
                            {/*</IonRouterOutlet>*/}
                        </Switch>
                        {/*</IonSplitPane>*/}

                    </IonReactHashRouter>
                </IonApp>
            </div>
        </div>
    )
}

export default App;
