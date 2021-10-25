export interface ISlide {
    id: number
    title: string
    path: string
    thumbnail: string
    presentationId: string
    presentationIndex: number
    presentationName: string
    sequenceId: string
    sequenceIndex: number
    sequenceName: string
    sequencePath: string
    isMandatory: boolean
    isViewed?: boolean,
    numberOfSlides?: string
}
