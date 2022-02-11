import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
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

setupIonicReact({
  mode:"ios"
});

const App: React.FC = () => (
  <IonApp>
    <IonReactHashRouter>
      <IonRouterOutlet>
        <Route exact path="/home" component={Home}/>
        <Route path="/account/create" component={CreateAccount} exact={true}/>
        <Route path="/account/backup" component={Backup} exact={true}/>
        <Route path="/account/confirm" component={Confirm} exact={true}/>
        <Route path="/account/import" component={ImportAccount} exact={true}/>
        <Route path="/account/unlock" component={Unlock} exact={true}/>

        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactHashRouter>
  </IonApp>
);

export default App;
