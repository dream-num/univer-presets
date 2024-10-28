import type { DependencyOverride, IUniverConfig, Plugin, PluginCtor } from '@univerjs/core';
import { FUniver, IAuthzIoService, IUndoRedoService, LogLevel, Univer } from '@univerjs/core';

/**
 * A collection of plugins and their default configs.
 */
interface IPreset {
    plugins: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
}

interface IPresetOptions {
    lazy?: boolean;
}

type CreateUniverOptions = Partial<IUniverConfig> & {
    presets: Array<IPreset | [IPreset, IPresetOptions]>;
    plugins?: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;

    collaboration?: true;
};

export function createUniver(options: CreateUniverOptions) {
    const { presets, plugins, collaboration, ...univerOptions } = options;

    const override: DependencyOverride = [];
    if (collaboration) {
        override.push([IUndoRedoService, null]);
        override.push([IAuthzIoService, null]);
    }

    const univer = new Univer({
        logLevel: LogLevel.WARN,

        ...univerOptions,
        override,
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

    plugins?.forEach((plugin) => {
        if (Array.isArray(plugin)) {
            univer.registerPlugin(plugin[0], plugin[1]);
        }
        else {
            univer.registerPlugin(plugin);
        }
    });

    // Finally we wrap all plugins into a Facade API to make it for convenient usage.
    const univerAPI = FUniver.newAPI(univer);
    return {
        univer,
        univerAPI,
    };
}

export { type IWorkbookData, LocaleType, LogLevel, Tools } from '@univerjs/core';

export { defaultTheme, greenTheme } from '@univerjs/design';
