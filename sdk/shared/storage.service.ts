import {IPresentation} from "../models/presentation";
import {ISlide} from "../models/slide";
import {ICLMData} from "../models/clmData";
import {isObjectEmpty} from "./helpers.service";
import { ICollectData } from "../models/collectData";

class StorageSvc {
    private _presentations: IPresentation[] = [];
    private _currentPresentation: number = 0;
    private _listSlides: ISlide[] = [];
    private _currentSlide: number;
    private _clmData: ICLMData;
    private _cloudFrontURL: string;
    private _clickStreamData: ICollectData[];
    private _labels: { [key: string]: string; } = {};
    public isDev = process.env.NODE_ENV === 'development';

    constructor() {
    }

    setCLMData(data: ICLMData) {
        this._clmData = data;
    }

    getCLMData() {
        return this._clmData;
    }

    setCloudFrontURL(data: string){
        this._cloudFrontURL = data;
    }

    getCloudFrontURL() {
        return this._cloudFrontURL;
    }

    getClmDataSetting(setting: string): boolean {
        const settings = this._clmData?.settings;
        if (!settings || !settings[setting]) return false;
        return settings[setting] === 'true' || settings[setting] === true;
    }

    getClmDataSettingValue(setting: string): string | boolean {
        const settings = this._clmData?.settings;
        if (!settings || !settings[setting]) return false;
        return settings[setting];
    }

    isTrainingModeEnabled() {
        return this.getClmDataSetting('trainingModeEnabled')
    }

    isShowingSequenceNamesEnabled() {
        return this.getClmDataSetting('showSequenceNames')
    }

    isRemoteMode() {
        return this.getClmDataSettingValue('mode') === 'remote'
    }

    setPresentations(data: IPresentation[]) {
        this._presentations = data;
    }

    addPresentationSlides(presentationIndex: number, presentationSlides: any[]) {
        let index: number = 0;
        presentationSlides.forEach((seqSlides, i) => {
            this._presentations[presentationIndex].sequences[i].slides = seqSlides.map((slide: any): ISlide => ({
                id: index++,
                title: slide.title,
                path: slide.path,
                thumbnail: slide.thumbnail,
                presentationId: this._presentations[presentationIndex].id,
                presentationIndex: presentationIndex,
                presentationName: this._presentations[presentationIndex].name,
                sequenceId: this._presentations[presentationIndex].sequences[i].id,
                sequenceIndex: i,
                sequenceName: this._presentations[presentationIndex].sequences[i].externalId || '',
                sequencePath: this._presentations[presentationIndex].sequences[i].file.fileName,
                isMandatory: this._presentations[presentationIndex].sequences[i].isMandatory && !this.isViewerData()
            }));
        });
        this._presentations[presentationIndex].totalSlides = index;
    }

    getPresentations() {
        return this._presentations;
    }

    setCurrentPresentation(data: number) {
        this._currentPresentation = data;
    }

    getCurrentPresentation() {
        return this._currentPresentation;
    }

    setListSlides(slides: ISlide[]) {
        this._listSlides = slides;
    }

    setSlideViewed(slideIndex: number) {
        if (!this._listSlides || !this._listSlides.length) return;
        this._listSlides[slideIndex].isViewed = true;
    }

    checkSlideViewed(slideIndex: number) {
        if (!this._listSlides || !this._listSlides.length) return false;
        return !!this._listSlides[slideIndex].isViewed;
    }

    getMandatoryNotShowedSlide(): number {
        const slide = this._listSlides.find(el => el.isMandatory && !el.isViewed);
        return slide ? slide.id + 1 : 0;
    }

    getListSlides(): ISlide[] {
        return this._listSlides;
    }

    setCurrentSlide(slideIndex: number) {
        this._currentSlide = slideIndex;
    }

    getCurrentSlide(): number {
        return this._currentSlide;
    }

    getSlideByIndex(slideIndex: number) {
        return this._listSlides && this._listSlides.length && this._listSlides[slideIndex];
    }

    getSlideBySequenceAndName(params: { sequenceId: string, slideName: string }) {
        const {sequenceId, slideName} = params;
        if (!slideName) return;
        const currentSlide = this.getSlideByIndex(this.getCurrentSlide());
        const currentSequence = sequenceId || currentSlide.sequenceId;
        const slide = this._listSlides.find(el => el.sequenceId === currentSequence && el.path === slideName);
        return slide;
    }

    setClickStreamData(data: ICollectData[]) {
        this._clickStreamData = data;
    }

    getClickStreamData(): ICollectData[] {
        return this._clickStreamData || [];
    }

    isViewerData(): boolean {
        return !!this._clmData?.clmViewerDataId;
    }

    public getLabel(key: string = '', ...args: any[]) {
        if (!key) return '';
        const label = this._labels[key.toLowerCase()];
        if (!label) return key;
        if (!args.length) {
            return label;
        }
        return label.replace(/{(\d)}/gm, el => args[el[1]] || el);
    }

    public setLabels(labels: {} = {}) {
        if (isObjectEmpty(labels)) return;
        this._labels = Object.keys(labels).reduce(
            (acc, key) => ({
                ...acc,
                [key.toLowerCase()]: labels[key]
            }), {});
    }
}

export default new StorageSvc();
