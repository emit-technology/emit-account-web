import * as React from 'react';
import {IonModal} from "@ionic/react"

interface Props{
    isOpen:boolean
    onCancel: ()=>void;
    onOk: ()=>void;
}
const SelectAccount :React.FC<Props> = ({isOpen,onCancel,onOk}) =>{
    return (
        <div>
            <IonModal isOpen={isOpen} onDidDismiss={()=>onCancel()}>
                
            </IonModal>
        </div>
    )
}
export default SelectAccount