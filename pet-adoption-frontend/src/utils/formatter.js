
const formatter = () => {
    // Used to parse JSON so words are pretty
    const camelCaseToReadable = (text) => {
    return text
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    };

    const formatSize = (text) => {
        switch (text) {
            case 'EXTRA_SMALL':
                return 'Extra Small';
            case 'SMALL':
                return 'Small';
            case 'MEDIUM':
                return 'Medium';
            case 'LARGE':
                return 'Large';
            case 'EXTRA_LARGE':
                return 'Extra Large';
            default:
                return text; // Return the original text if no match is found
        }
    };

    return {
        camelCaseToReadable,
        formatSize,
    };
}

export default formatter;