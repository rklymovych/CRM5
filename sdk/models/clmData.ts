import {IPresentationData} from "./presentation";

export interface ICLMData {
    clmViewerDataId?: string
    call?: ICall
    account: IAccount
    attendees?: IAccount[]
    presentations: IPresentationData[]
    user?: IUser
    settings?: ISetting
    labels?: ILabel[]
}

interface ISetting {
    showSequenceNames: boolean | string
    trainingModeEnabled: boolean | string
}

interface ILabel {
    name: string
    label: string
}

interface IAccount {
    id: string
    user_name: string
    email: string
    lastname: string
    firstname: string
    customertype: string
    salutation: string
    onekeyid: string
    nationality: string
    specialty: string
    account_type: string
    middle_name: string
    suffix_name: string
    addresses: IAccountAddress[]
}

interface IAccountAddress {
    addressid: string
    state: string
    city: string
    postalarea: string
    line1: string
}

interface ICall {
    id: string
    name: string
}

interface IUser {
    employee_name: string
    employee_firstrname: string
    employee_lastname: string
}
