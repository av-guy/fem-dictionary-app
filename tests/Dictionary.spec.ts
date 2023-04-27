import Dictionary from "src/services/dictionary";

import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "fs";

global.fetch = vi.fn();

/**
 * Open the file and produce an object with key and value pairs
 * 
 * NOTE: This payload sample should be taken directly from the response data
 * issued by the provider. Do not modify the payload and do any preprocessing;
 * that is the responsibility of the `Dictionary` class.
 * 
 * @param {string} filename - The name of the file used for the mock data.
 * @returns {string} - The raw string data from the file.
 */
function getMockResponse(filename: string): { json: () => Promise<unknown> } {
  const contents = readFileSync(filename, "utf8");
  const parsed = JSON.parse(contents);

  return { json: () => new Promise((resolve) => resolve(parsed)) }
}

describe("The dictionary service", () => {
  it("should parse the response correctly", async () => {
    const mockResponse = getMockResponse('tests/data/sample.json');
    const mockFetch: any = fetch;
    
    // I am mocking the response coming from the fetch method here.
    // A big thank you to the folks at `runthatline` for providing me
    // with this information. The URL will is listed just below.
    // https://runthatline.com/how-to-mock-fetch-api-with-vitest/

    mockFetch.mockResolvedValue(mockResponse);

    const dictionary = new Dictionary();
    const result = await dictionary.get("keyboard");
    
    const url = "https://api.dictionaryapi.dev/media/pronunciations/en/keyboard-us.mp3"

    // Check the core information, ensure the proper areas are being returned
    // from the available payload.

    expect(result.word).toEqual("keyboard");
    expect(result.phonetic).toEqual("/ˈkiːbɔːd/");
    expect(result.audio).toEqual(url);
    expect(result.sourceUrls).toEqual(["https://en.wiktionary.org/wiki/keyboard"])

    // Validate the noun is parsed correctly. Avoiding directly checking each value.
    // For the sake of simplicity, we're only validating the length of each part.
  
    expect(result.meanings[0].speechPart).toEqual("noun");
    expect(result.meanings[0].definitions.length).toEqual(3);
    expect(result.meanings[0].definitions[0].example).toBeUndefined();
    expect(result.meanings[0].synonyms.length).toEqual(1);
    expect(result.meanings[0].antonyms.length).toEqual(0);
    
    // I am doing the same sort of validation as above. I am not going to do a
    // string-by-string comparison here, because I feel like there is diminishing
    // returns on that type of approach.

    expect(result.meanings[1].speechPart).toEqual("verb");
    expect(result.meanings[1].definitions.length).toEqual(1);
    expect(result.meanings[1].definitions[0].examples.length).toEqual(52);
    expect(result.meanings[1].synonyms.length).toEqual(0);
    expect(result.meanings[1].antonyms.length).toEqual(0);
  })

  it("should throw an error for an unsupported language", async () => {
    const dictionary = new Dictionary();
    const wrapper = () => dictionary.preferredLanguage = "ABDKFDJFL";

    expect(wrapper).toThrowError();
  })

  it("should not throw an error for a supported language", async () => {
    const dictionary = new Dictionary();
    const wrapper = () => dictionary.preferredLanguage = "en";
    
    expect(wrapper).not.toThrowError();
  })
});