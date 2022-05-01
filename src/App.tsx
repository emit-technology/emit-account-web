import * as React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact,IonRow,IonCol,IonSplitPane } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
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
import {SignTxWidget} from "./pages/widget/SignTxWidget";
import {SignMessageWidget} from "./pages/widget/SignMessageWidget";
import {ApproveWidget} from "./pages/widget/ApproveWidget";
import {AccountMenu} from "./components/AccountMenu";

setupIonicReact({
  mode:"ios"
});

const App: React.FC = () => {
  const routerRef = React.useRef<HTMLIonRouterOutletElement | null>(null);
  return (
      <div className="page">
        <div className="page-inner">
        <IonApp>
          <IonReactHashRouter>
            {/*<IonSplitPane contentId="main">*/}
            {/*<AccountMenu/>*/}
            <IonRouterOutlet id="main">
              <Route exact path="/home" render={() => <Home router={routerRef.current} refresh={Math.floor(Date.now()/1000)}/>}/>
              <Route path="/account/create" component={CreateAccount} exact={true}/>
              <Route path="/account/backup" component={Backup} exact={true}/>
              <Route path="/account/confirm" component={Confirm} exact={true}/>
              <Route path="/account/import" component={ImportAccount} exact={true}/>
              <Route path="/account/unlock" component={Unlock} exact={true}/>

              <Route path="/widget/sign/tx" component={SignTxWidget} exact={true}/>
              <Route path="/widget/sign/msg" component={SignMessageWidget} exact={true}/>
              <Route path="/widget/approve" component={ApproveWidget} exact={true}/>

              <Route exact path="/">
                <Redirect to="/home"/>
              </Route>
            </IonRouterOutlet>
            {/*</IonSplitPane>*/}

          </IonReactHashRouter>
        </IonApp>
        </div>
      </div>
  )
}

export default App;
