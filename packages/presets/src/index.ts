import type { Plugin, PluginCtor } from '@univerjs/core';
import type { IUniverConfig } from '@univerjs/core/lib/types/univer.js';
import { Univer } from '@univerjs/core';
import { FUniver } from '@univerjs/facade';

/**
 * A collection of plugins and their default configs.
 */
interface IPreset {
    plugins: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
}

interface IPresetOptions {
    lazy?: boolean;
}

type CreateUniverOptions = Partial<IUniverConfig & {
    presets: Array<IPreset | [IPreset, IPresetOptions]>;
    plugins: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
}>;

export function createUniver(options: CreateUniverOptions) {
    const { presets, plugins, ...univerOptions } = options;

    const univer = new Univer(univerOptions);
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
