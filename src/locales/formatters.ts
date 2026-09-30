import type { FormattersInitializer } from 'typesafe-i18n'
import type { Locales, Formatters } from './i18n-types.js'
import { date, time } from 'typesafe-i18n/formatters'

export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) =>
{
	const formatters: Formatters = {
		date: date(locale, { dateStyle: "long" }),
		time: time(locale, { timeStyle: "medium", hourCycle: "h23" }),
	};

	return formatters;
}
