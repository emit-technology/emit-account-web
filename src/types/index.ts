
export interface AccountModel {
    accountId?: string
    name: string
    password?: string
    avatar?: string
    hint?: string
    addresses?: any
}

export enum ChainType {
    _,
    SERO,
    ETH,
    TRON,
    BSC,
    EMIT
}
