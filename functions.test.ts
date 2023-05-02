const {shuffleArray} = require("./utils.js")

describe("shuffleArray should", () => {
    
    const testArr = [1, 2, 3, 4,]

    test("shuffle returns an array", () => {
        expect(shuffleArray(testArr)).toBeTruthy()
    });

    test("returns an array of the same length as the argument sent in", () => {
        expect(shuffleArray(testArr).length).toBe(testArr.length)
    });

})