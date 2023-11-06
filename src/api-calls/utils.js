/**
 * Builds out the url to call the api
 * @param url {String} the api url
 * @param path {String} the api route
 * @param pathParams {Array[String]} an array of strings, each element
 * is a different path param
 * @returns {String} the constructed url for the api call
 */export const urlBuilder = (
    url,
    path = '',
    pathParams = []
) => {
    return `${url}${path === '/' ? '' : path}/${pathParams.length === 0 ? '' : `${pathParams.join(
        '/' )}`}`;
}