import {ISlide} from "./slide";

export interface ISequenceFile {
    name: string,
    extension: string,
    fileName: string,
    timestamp: number
}

export interface ISequence {
    file: ISequenceFile;
    id: string;
    key: string;
    fileId: string;
    externalId: string;
    isMandatory?: boolean;
    slides?: ISlide[];
}

export interface ISequenceData {
    fileId: string;
    key: string;
    id: string;
    externalId: string;
    is_mandatory?: boolean;
}

