import { countryCodes } from './languages';

export default class Dictionary {
    private endpoint: string = "https://api.dictionaryapi.dev/api/v2/entries"
    private fullEndpoint: string;
    private _preferredLanguage: string = "en";

    constructor() {
        this.fullEndpoint = `${this.endpoint}/${this.preferredLanguage}`;
    }

    /**
     * Permit the user to choose a preferred language so long as it is
     * supported and available in the list of supported languages.
     * 
     * @param {string} language - The user's preferred language.
     */
    public set preferredLanguage(language: string) {
        const existing = countryCodes.includes(language);
        
        if (existing) {
            this.fullEndpoint = `${this.endpoint}/${existing}`;
        } else {
            throw new Error(
                `Language ${language} is not supported.
                Please refer to 'countryCodes' for available languages.
                If you are a user seeing this error, please contact us.`
            );
        }
    }

    public get preferredLanguage(): string {
        return this._preferredLanguage;
    }

    /**
     * Retrieve the JSON payload for a given entry. Parse the entry and break it
     * down into its constituent parts. The process of breaking down into its
     * constituent parts is handled by the `parseEntry` function, and it should
     * reduce the coupling between the API JSON payload structure and the data
     * structure used by the application.
     * 
     * @param {string} word - The word to search for when retrieving the definition. 
     */
    async get(word: string): Promise<any> {
        const response = await fetch(`${this.fullEndpoint}/${word}`);
        const entry = await response.json();

        return this.parseEntry(entry[0]);
    }

    /**
     * Parse the JSON payload for a given entry. Break down the entry to only
     * the parts that are relevant to the application.
     * 
     * NOTE: Should the provider be changed in the future, this function will
     * serve to reduce the coupling between the API JSON payload structure and
     * the data structure used by the application.
     * 
     * @param {any} entry - The JSON payload to parse for the current entry.
     */
    private parseEntry(entry: any): object {
        const word = entry.word;
        const phonetic = entry.phonetic;
        const sourceUrls = entry.sourceUrls;
        const meanings = this.parseMeanings(entry.meanings);
        
        const audio = entry.phonetics.filter((item: any) => {
            if (item.audio.length > 0) return item;
        })[0].audio;

        return {
            word,
            phonetic,
            audio,
            sourceUrls,
            meanings
        }
    }

    /**
     * Parse the meanings for a given entry. Break down the entry to only
     * the parts that are relevant to the application.
     * 
     * NOTE: It's important to note that the Free Dictionary API seems to
     * return the parts of speech and definitions in the following order:
     * `noun`, `verb`. Try to preserve this order if the provider is changed
     * in the future.
     * 
     * @param {any} meanings - The meanings to parse for the current entry.
     */
    private parseMeanings(meanings: any): Array<object> {
        const definitions = meanings.map((meaning: any) => {
            const values = {
                speechPart: meaning.partOfSpeech,
                definitions: meaning.definitions.map((definition: any) => {
                    return {
                        details: definition.definition,
                        synonyms: definition.synonyms,
                        antonyms: definition.antonyms,
                        examples: definition.example ? definition.example : undefined
                    }
                }),
                synonyms: meaning.synonyms, 
                antonyms: meaning.antonyms
            }
            return values;
        })
        return definitions
    }
}