import * as React from 'react';
import {Factor} from "@emit-technology/emit-lib";
import emitUtils from "@emit-technology/emit-account-node-sdk/es/utils/emitUtils";
import {IonBadge} from '@ionic/react';

interface Props{
    factor: Factor,
    isOut: boolean
}
export const EmitFactor:React.FC<Props> = ({factor,isOut}) =>{
    return (<>
        {
            factor.category && factor.category.symbol && <div>
                <IonBadge color="dark">{isOut ?"-":"+"}{emitUtils.formatValue(factor.value,18)}</IonBadge>&nbsp;
                <IonBadge>{emitUtils.getCategoryName(factor.category)} [{emitUtils.ellipsisStr(factor.category.supplier,4)}]</IonBadge>
            </div>
        }

    </>)
}