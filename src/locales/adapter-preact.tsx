import { createContext } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { i18nObject } from "typesafe-i18n";
import type { BaseTranslation, BaseFormatters, Locale, TranslationFunctions } from "../../node_modules/typesafe-i18n/runtime/esm/runtime/src/core";
import { getFallbackProxy } from "../../node_modules/typesafe-i18n/runtime/esm/runtime/src/core-utils";

export type I18nContextType<
    L extends Locale = Locale,
    T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
    TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
    locale: L
    LL: TF
    setLocale: (locale: L) => void
}

export type TypesafeI18nProps<L extends string> = {
    locale: L
    children: React.ReactNode
}

export type PreactInit<
    L extends Locale = Locale,
    T extends BaseTranslation | BaseTranslation[] = BaseTranslation,
    TF extends TranslationFunctions<T> = TranslationFunctions<T>,
> = {
    component: React.FunctionComponent<TypesafeI18nProps<L>>
    context: React.Context<I18nContextType<L, T, TF>>
}

export const initI18nPreact = <
    L extends Locale = Locale,
    T extends BaseTranslation = BaseTranslation,
    TF extends TranslationFunctions<T> = TranslationFunctions<T>,
    F extends BaseFormatters = BaseFormatters,
>(
    translations: Record<L, T>,
    formatters: Record<L, F> = {} as Record<L, F>,
): PreactInit<L, T, TF> => {
    const context = createContext({} as I18nContextType<L, T, TF>)

    const component: React.FunctionComponent<TypesafeI18nProps<L>> = (props) => {
        const [locale, _setLocale] = useState<L>(props.locale)
        const [LL, setLL] = useState<TF>(() =>
            !locale ? getFallbackProxy<TF>() : i18nObject<L, T, TF, F>(locale, translations[locale], formatters[locale]),
        )

        const setLocale = useCallback((newLocale: L) => {
            _setLocale(newLocale)
            setLL(() => i18nObject<L, T, TF, F>(newLocale, translations[newLocale], formatters[newLocale]))
        }, [])

        const ctx = useMemo<I18nContextType<L, T, TF>>(
            () => ({
                setLocale,
                locale,
                LL,
            }),
            [setLocale, locale, LL],
        )

        return <context.Provider value={ctx}>{props.children}</context.Provider>
    }

    return { component, context }
}
