import {ISequence, ISequenceData} from "./sequence";

export interface IPresentation {
    id: string
    index: number;
    name: string
    type: string // zip | pdf
    totalSlides: number
    sequences: ISequence[]
}

export interface IPresentationData {
    id: string,
    name: string,
    sequences: ISequenceData[]
}
