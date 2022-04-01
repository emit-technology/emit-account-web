import * as React from 'react';
import {IonMenu,IonHeader,IonToolbar,IonTitle,IonContent,IonList,IonItem} from '@ionic/react'

export const AccountMenu:React.FC = ()=>{
    return <>
        <IonMenu side="start" contentId="main" menuId="account-menu" className="my-custom-menu">
            <IonHeader>
                <IonToolbar color="tertiary">
                    <IonTitle>Custom Menu</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                </IonList>
            </IonContent>
        </IonMenu>

    </>
}