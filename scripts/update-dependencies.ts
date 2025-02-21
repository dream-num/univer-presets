/**
 * Dependencies Version Update Script
 *
 * Purpose: Automatically updates the version of all @univerjs and @univerjs-pro
 * related dependencies across all packages.
 *
 * Usage:
 * 1. Basic usage (will use latest version from @univerjs/core latest tag):
 *    pnpm tsx scripts/update-dependencies.ts
 *
 * 2. Specify release channel:
 *    SDK_RELEASE_CHANNEL=nightly pnpm tsx scripts/update-dependencies.ts
 *
 * 3. Specify exact version:
 *    NEW_VERSION=1.0.0 pnpm tsx scripts/update-dependencies.ts
 *
 * Environment Variables:
 * - SDK_RELEASE_CHANNEL: Release channel to use, defaults to 'latest'.
 *                   Can be 'beta', 'alpha', etc.
 * - NEW_VERSION: Target version to update to. If not specified,
 *                will fetch latest version from specified SDK_RELEASE_CHANNEL
 *
 * Notes:
 * - Excluded packages: ${EXCLUDED_PACKAGES}
 * - Excluded versions: ${EXCLUDED_VERSIONS}
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

const SDK_RELEASE_CHANNEL = process.env.SDK_RELEASE_CHANNEL || 'latest';
const NEW_VERSION = process.env.NEW_VERSION || getLatestTagVersion('@univerjs/core', SDK_RELEASE_CHANNEL);

if (!NEW_VERSION) {
    console.error('Failed to get version');
    process.exit(1);
}

const EXCLUDED_PACKAGES = ['@univerjs/protocol', '@univerjs/icons'];
const EXCLUDED_VERSIONS = ['workspace:*'];

function getLatestTagVersion(packageName: string, tag: string = 'latest') {
    try {
        const version = execSync(`npm view ${packageName}@${tag} version`, { encoding: 'utf-8' }).trim();
        return version;
    }
    catch (error) {
        console.error(`Failed to get version for ${packageName}@${tag}`);
        throw error;
    }
}

function updateObjVersion(obj: Record<string, string>): string[] {
    const changeLogs: string[] = [];
    Object.entries(obj).forEach(([pkg, version]) => {
        if (
            (pkg.startsWith('@univerjs/') || pkg.startsWith('@univerjs-pro/'))
            && !EXCLUDED_PACKAGES.includes(pkg)
            && !EXCLUDED_VERSIONS.find(rule => version.startsWith(rule))
            && obj[pkg] !== NEW_VERSION
        ) {
            obj[pkg] = NEW_VERSION;
            changeLogs.push(`Updated ${pkg} to ${NEW_VERSION}`);
        }
    });
    return changeLogs;
}

function updateDependency(packageDir: string, dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies']) {
    const packageJsonPath = path.join(packageDir, 'package.json');

    if (!fs.existsSync(packageJsonPath)) {
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    let hasUpdates = false;

    dependencyTypes.forEach((depType) => {
        if (!packageJson[depType]) {
            return;
        }

        updateObjVersion(packageJson[depType])
            .forEach((log) => {
                console.log(log);
                hasUpdates = true;
            });
    });

    if (hasUpdates) {
        fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 4, EOL: '\n' });
    }
}

const ROOT_DIR = path.resolve(__dirname, '../');
const PACKAGES_DIR = path.resolve(__dirname, '../packages');
function updateDependencies() {
    const packages = fs.readdirSync(PACKAGES_DIR).filter(file =>
        fs.statSync(path.join(PACKAGES_DIR, file)).isDirectory(),
    );
    packages.forEach((packageDir) => {
        updateDependency(path.join(PACKAGES_DIR, packageDir));
    });

    updateDependency(path.join(ROOT_DIR, 'examples'));
    updateDependency(path.join(ROOT_DIR, 'examples-node'));

    console.log('Running pnpm install to update lock file...');
    execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });

    console.log('Dependencies update completed!');
}

updateDependencies();
