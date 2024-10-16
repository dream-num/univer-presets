import type { Plugin, PluginCtor } from '@univerjs/core';
import type { IUniverConfig } from '@univerjs/core/lib/types/univer.js';
import { Univer } from '@univerjs/core';
import { FUniver } from '@univerjs/facade';

interface IPreset {

}

interface IPresetOptions {
    lazy?: boolean;
}

type Options = Partial<IUniverConfig & {
    presets: Array<IPreset | [IPreset, IPresetOptions]>;
    plugins: Array<PluginCtor<Plugin> | [PluginCtor<Plugin>, ConstructorParameters<PluginCtor<Plugin>>[0]]>;
}>;

export function createUniver(options: Options) {
    const { presets, plugins, ...univerOptions } = options;

    const univer = new Univer(univerOptions);

    const univerAPI = FUniver.newAPI(univer);

    return {
        univer,
        univerAPI,
    };
}
