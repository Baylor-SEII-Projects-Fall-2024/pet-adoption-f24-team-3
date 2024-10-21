
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
    const formatSex = (text) => {
        switch (text) {
            case 'MALE':
                return 'Male';
            case 'FEMALE':
                return 'Female';
            case 'NEUTERED_MALE':
                return 'Neutered Male';
            case 'SPAYED_FEMALE':
                return 'Spayed Female';
            default:
                return text; // Return the original text if no match is found
        }
    };

    return {
        camelCaseToReadable,
        formatSize,
        formatSex,
    };
}

export default formatter;