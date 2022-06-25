/**
 * Copyright 2020 EMIT Foundation.
 This file is part of E.M.I.T. .

 E.M.I.T. is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 E.M.I.T. is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with E.M.I.T. . If not, see <http://www.gnu.org/licenses/>.
 */
import * as React from "react";
import {
    IonButton,
    IonCol,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonRadio,
    IonRadioGroup,
    IonRow
} from "@ionic/react";
import i18n from "../locales/i18n";
import BigNumber from "bignumber.js";
// import './gasPrice.css'
import {ChainType} from "@emit-technology/emit-lib";


interface GasPriceLevel {
    SafeGasPrice?: costTime
    ProposeGasPrice?: costTime
    FastGasPrice?: costTime
    AvgGasPrice?: costTime
}

interface costTime {
    gasPrice: string
    second: number
}

interface Props {
    onClose: () => void;
    onSelect: (gasPrice: string) => void;
    isOpen: boolean
    chain: ChainType
    gasLimit: string
    gasLevel: GasPriceLevel
}

export const GasPriceActionSheet: React.FC<Props> = ({
                                                         onClose, onSelect,gasLimit,gasLevel, isOpen, chain
                                                     }) => {

    const sort = (a: any, b: any) =>{
        return new BigNumber(a.gasPrice).comparedTo(new BigNumber(b.gasPrice))
    }
    const [gasPrice,setGasPrice] = React.useState("5");

    const radioItems = (): Array<any> => {
        const options: Array<any> = [];
        const keys = Object.keys(gasLevel);
        const arr: Array<any> = [];
        const trimKey: any = [];
        for (let key of keys) {
            // @ts-ignore
            const gasTracker = gasLevel[key];
            if (trimKey.indexOf(gasTracker.gasPrice) == -1) {
                trimKey.push(gasTracker.gasPrice)
                arr.push(gasTracker);
            }
        }
        arr.sort(sort);
        const desc = [i18n.t("slow"), i18n.t("general"), i18n.t("fast"), i18n.t("fastest")];
        for (let i = arr.length - 1; i >= 0; i--) {
            const a = arr[i];
            options.push(
                <IonItem key={i}>
                    <IonLabel>{`${desc[i]},${a.gasPrice}GWei , ${Math.floor(a.second / 60)}m ${a.second % 60}s`}</IonLabel>
                    <IonRadio slot="start" value={a.gasPrice}/>
                </IonItem>
            )
        }
        return options;
    }

    return <>
        <IonModal
            mode="ios"
            isOpen={isOpen}
            swipeToClose={true}
            onDidDismiss={() => onClose()}>
            <IonList style={{overflowY: "scroll"}}>
                <IonRadioGroup value={gasPrice} onIonChange={e => setGasPrice(e.detail.value)}>
                    <IonListHeader>
                        <IonLabel>{i18n.t("selectGasPrice")}</IonLabel>
                    </IonListHeader>
                    {radioItems()}
                </IonRadioGroup>
                <IonListHeader>
                    <IonLabel>{i18n.t("custom")}</IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonInput type="number" min="1" value={gasPrice} onIonChange={e => {
                       setGasPrice(e.detail.value)
                    }}/>
                </IonItem>
            </IonList>
            <IonRow>
                <IonCol size="4">
                    <IonButton expand="block" fill="outline" onClick={() => {
                        onClose();
                    }}>{i18n.t("cancel")}</IonButton>
                </IonCol>
                <IonCol size="8">
                    <IonButton expand="block" onClick={() => {
                        onSelect(gasPrice)
                    }}>{i18n.t('ok')}</IonButton>
                </IonCol>
            </IonRow>
        </IonModal>
    </>;
}
