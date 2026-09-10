import { htmlLangAttributeDetector } from "typesafe-i18n/detectors";
import { detectLocale, i18nObject } from "./i18n-util";
import { loadLocale } from "./i18n-util.sync";

export const locale = detectLocale(htmlLangAttributeDetector);
loadLocale(locale);

export const LL = i18nObject(locale);
