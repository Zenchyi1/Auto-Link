export interface linkSettings {
    addAlias: boolean,
    ignoreCase: boolean
    scanning_mode: string,
}

export const DEFAULT_SETTINGS: linkSettings = {
    addAlias: true,
    ignoreCase: true,
    scanning_mode: "modify"
}
