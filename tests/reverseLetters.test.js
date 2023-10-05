const { reverseWords, reverseLetters, avg } = require("../utils/testing");

test('reverseLetters of thx', () => { 
    const result = reverseLetters("thx");
    
    expect(result).toBe("xht");
});

test('reverseWords of meu deus q isso', () => { 
    const result = reverseWords("meu deus q isso");
    
    expect(result).toBe("isso q deus meu");
});

describe("average func", () => {

    test("of avg of one value === itself", () => {
        expect(avg([1])).toBe(1);
    });

    test("of avg of many is calculated right", () => {
        expect(avg([1, 2, 3, 4, 5])).toBe(3);
    });

    test("of avg of zero values === 0", () => {
        expect(avg([])).toBe(0);
    });
    
    
    test("of avg of undefined === 0", () => {
        expect(avg()).toBe(0);
    });
});