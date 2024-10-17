import { PluginCtor, Plugin } from "@univerjs/core";

/**
 * A collection of plugins and their default configs.
 */
export interface IPreset {
    plugins: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
}

export interface IPresetOptions {
    lazy?: boolean;
}

