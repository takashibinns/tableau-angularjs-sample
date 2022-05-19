/*  Define the Tableau authentication model     */
export interface Auth {
    encryptedUserId: string,
    tableauUserId: string,
    apiToken: string,
    siteId: string,
    tableauBaseUrl: string,
    expiry: Date,
    expired:boolean
}