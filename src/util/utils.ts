

export default class Utils {


    static properCase (string: string ) {
        return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;
    }


}