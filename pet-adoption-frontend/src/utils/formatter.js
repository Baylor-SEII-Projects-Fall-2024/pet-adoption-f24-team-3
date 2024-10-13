
const formatter = () => {
    // Used to parse JSON so words are pretty
    const camelCaseToReadable = (text) => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    };

    return {
        camelCaseToReadable,
    };
}

export default formatter;