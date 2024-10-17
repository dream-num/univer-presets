import type { IUniverConfig, Plugin, PluginCtor } from '@univerjs/core';
import { LocaleType, Tools, Univer } from '@univerjs/core';
import { FUniver } from '@univerjs/facade';

/**
 * A collection of plugins and their default configs.
 */
interface IPreset {
    locales?: IUniverConfig['locales'];
    plugins: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
}

interface IPresetOptions {
    lazy?: boolean;
}

type CreateUniverOptions = Partial<IUniverConfig> & {
    presets: Array<IPreset | [IPreset, IPresetOptions]>;
    plugins?: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
};

export function createUniver(options: CreateUniverOptions) {
    const { presets, plugins, ...univerOptions } = options;

    let locales: IUniverConfig['locales'] = {};
    presets.forEach((preset) => {
        const l = Array.isArray(preset) ? preset[0].locales : preset.locales;
        if (l) {
            locales = Tools.deepMerge(l);
        }
    });

    const univer = new Univer({
        ...univerOptions,
        locales,
    });

    presets?.forEach((preset) => {
        const plugins = Array.isArray(preset) ? preset[0].plugins : preset.plugins;
        plugins.forEach((p) => {
            if (Array.isArray(p)) {
                univer.registerPlugin(p[0], p[1]);
            }
            else {
                univer.registerPlugin(p);
            }
        });
    });

    // Finally we wrap all plugins into a Facade API to make it for convenient usage.
    const univerAPI = FUniver.newAPI(univer);
    return {
        univer,
        univerAPI,
    };
}
