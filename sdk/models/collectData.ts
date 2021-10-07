export interface ICollectClmData {
    accountId: string | null,
    callId: string,
    deviceType: string,
    deviceOS: string,
    deviceBrowser: string,
    guestAccountName: string | null,
    presentationId: string
    presentationName: string
    sequenceId: string
    sequenceName: string
    slide: string
    usageDuration: string
    usageStartTime: string
    usageEndTime: string
}

export interface ICollectViewerData {
    callPresentation: {
        Presentation__c: string
        Account__c: string
    }
    clickStreamMetrics: {
        CallPresentation__c: string
        Slide__c: string
        Account__c: string
        Presentation__c: string
        Presentationname__c: string
        Sequence__c: string
        Sequencename__c: string
        Thumbnailimage__c: string
        Usagestarttime__c: string
        Usageendtime__c: string
        Usageduration__c: number
        Call__c: string
        Meeting__c: string
        Productmessage__c: string
        Calldetail__c: string
        Callmessage__c: string
    }[]
}

export type ICollectData = ICollectClmData | ICollectViewerData;
