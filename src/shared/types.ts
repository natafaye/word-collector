export type Word = {
    id: string;
    word: string;
    emotion: string;
    type: string;
    partOfSpeech: string;
}

export type FilterSettings = {
    type: string;
    emotion: string;
    partOfSpeech: string;
}