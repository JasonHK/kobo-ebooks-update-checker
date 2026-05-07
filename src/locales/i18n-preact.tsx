import { useContext } from "preact/hooks";

import { initI18nPreact, type I18nContextType } from "./adapter-preact.js";
import { loadedFormatters, loadedLocales } from './i18n-util.js'
import type { Formatters, Locales, TranslationFunctions, Translations } from './i18n-types.js'

const { component: TypesafeI18n, context: I18nContext } = initI18nPreact<Locales, Translations, TranslationFunctions, Formatters>(loadedLocales, loadedFormatters)

const useI18nContext = (): I18nContextType<Locales, Translations, TranslationFunctions> => useContext(I18nContext)

export { I18nContext, useI18nContext }

export default TypesafeI18n
