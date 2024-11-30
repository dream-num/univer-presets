import type { DependencyOverride, IUniverConfig, Plugin, PluginCtor } from '@univerjs/core';
import { FUniver, IAuthzIoService, IMentionIOService, IUndoRedoService, LogLevel, Univer } from '@univerjs/core';

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
    /**
     * Overrides the dependencies defined in the plugin. Only dependencies that are identified by `IdentifierDecorator` can be overridden.
     * If you override a dependency with `null`, the original dependency will be removed.
     */
    override?: DependencyOverride;
    collaboration?: true;
};

export function createUniver(options: CreateUniverOptions) {
    const { presets, plugins, collaboration, override = [], ...univerOptions } = options;

    if (collaboration) {
        override.push([IUndoRedoService, null]);
        override.push([IAuthzIoService, null]);
        override.push([IMentionIOService, null]);
    }

    const univer = new Univer({
        logLevel: LogLevel.WARN,
        ...univerOptions,
        override,
    });

    const pluginsMap = new Map<string, {
        plugin: PluginCtor<Plugin>;
        options: any;
    }>();

    presets?.forEach((preset) => {
        const realPreset = Array.isArray(preset) ? preset[0] : preset;

        const { plugins } = realPreset;

        plugins.forEach((p) => {
            const [realPlugin, pluginConfig] = Array.isArray(p) ? [p[0], p[1]] : [p];

            if (pluginsMap.has(realPlugin.pluginName)) {
                pluginsMap.delete(realPlugin.pluginName);
            }

            pluginsMap.set(realPlugin.pluginName, { plugin: realPlugin, options: pluginConfig });
        });
    });

    plugins?.forEach((plugin) => {
        const [realPlugin, pluginConfig] = Array.isArray(plugin) ? [plugin[0], plugin[1]] : [plugin];

        pluginsMap.set(realPlugin.pluginName, { plugin: realPlugin, options: pluginConfig });
    });

    pluginsMap.forEach(({ plugin, options }) => {
        univer.registerPlugin(plugin, options);
    });

    // Finally we wrap all plugins into a Facade API to make it for convenient usage.
    const univerAPI = FUniver.newAPI(univer);
    return {
        univer,
        univerAPI,
    };
}

// #region auto-exports-generated
export * from './preset-docs-collaboration';
export * from './preset-docs-core';
export * from './preset-docs-drawing';
export * from './preset-docs-hyper-link';
export * from './preset-docs-thread-comment';
export * from './preset-sheets-advanced';
export * from './preset-sheets-advanced/worker';
export * from './preset-sheets-collaboration';
export * from './preset-sheets-conditional-formatting';
export * from './preset-sheets-core';
export * from './preset-sheets-core/worker';
export * from './preset-sheets-data-validation';
export * from './preset-sheets-drawing';
export * from './preset-sheets-filter';
export * from './preset-sheets-find-replace';
export * from './preset-sheets-hyper-link';
// export * from './preset-sheets-node-core';
// export * from './preset-sheets-node-core/worker';
export * from './preset-sheets-sort';
export * from './preset-sheets-thread-comment';
// #endregion

export * from '@univerjs/core';
export * from '@univerjs/design';
