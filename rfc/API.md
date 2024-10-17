# API Univer Presets RFC

How to use the presets package? Here's an example:

```ts
import { createUniver, defaultTheme, LocaleType, LogLevel } from '@univerjs/presets'; // Some identifiers are re-exported from the presets package.
import { univerSheetsBasicPreset } from '@univerjs/presets/sheets-basic';
import { univerSheetsAdvancedPresets } from '@univerjs/presets/sheets-advanced';
// Import i18n configurations.
import basicZhCN from '@univerjs/presets/sheets-basic/zhCN'; // @univerjs/presets/sheets-basic/enUS
import advancedZhCN from '@univerjs/presets/sheets-advanced/zhCN';

const { univer, univerAPI } = createUniver({
    locale: LocaleType.ZH_CN, // Required configuration.
    theme: defaultTheme, // Required configuration.
    presets: [
        // Presets are provided as factory functions. User can pass configurations into it and get completion suggestions.
        univerSheetsBasicPreset({
            locale: [basicZhCN],
            // other configurations
        }),
        univerSheetsAdvancedPresets({
            locale: [advancedZhCN],
        })
    ],
    plugins: (univer: Univer) => { // Additional plugins that are not included in presets
        univer.registerPlugin(Plugin, configuration); // To support LSP autocompletions.
    },
}
```


1. Some identifiers would be re-exported by the presets package so use can have zero knowledge of the underlying packages.
1. I18n files are bundled independent of presets for package size reason.

