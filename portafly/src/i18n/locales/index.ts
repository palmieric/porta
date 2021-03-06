import { ISupportedLanguages } from 'i18n'
import * as en from 'i18n/locales/en'

export type ITranslationsPages = keyof typeof en
export type ITranslations = { [P in ITranslationsPages]: any }

const Translations: Record<ISupportedLanguages, ITranslations> = {
  en
}

export { Translations }
