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
 *    RELEASE_CHANNEL=beta pnpm tsx scripts/update-dependencies.ts
 *
 * 3. Specify exact version:
 *    NEW_VERSION=1.0.0 pnpm tsx scripts/update-dependencies.ts
 *
 * Environment Variables:
 * - RELEASE_CHANNEL: Release channel to use, defaults to 'latest'.
 *                   Can be 'beta', 'alpha', etc.
 * - NEW_VERSION: Target version to update to. If not specified,
 *                will fetch latest version from specified RELEASE_CHANNEL
 *
 * Notes:
 * - Excluded packages: ${EXCLUDED_PACKAGES}
 * - Excluded versions: ${EXCLUDED_VERSIONS}
 */

import { execSync } from 'node:child_process';
import * as path from 'node:path';
import process from 'node:process';
import fs from 'fs-extra';

const RELEASE_CHANNEL = process.env.RELEASE_CHANNEL || 'latest';
const NEW_VERSION = process.env.NEW_VERSION || getLatestTagVersion('@univerjs/core', RELEASE_CHANNEL);

if (!NEW_VERSION) {
    console.error('Failed to get version');
    process.exit(1);
}

const PACKAGES_DIR = path.resolve(__dirname, '../packages');

const EXCLUDED_PACKAGES = ['@univerjs/protocol'];
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

function updateDependencies() {
    const packages = fs.readdirSync(PACKAGES_DIR).filter(file =>
        fs.statSync(path.join(PACKAGES_DIR, file)).isDirectory(),
    );

    packages.forEach((packageDir) => {
        const packageJsonPath = path.join(PACKAGES_DIR, packageDir, 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
            return;
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        let hasUpdates = false;

        const dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies'];

        dependencyTypes.forEach((depType) => {
            if (!packageJson[depType])
                return;

            Object.entries(packageJson[depType] as [string, string]).forEach(([pkg, version]) => {
                if (
                    (pkg.startsWith('@univerjs/') || pkg.startsWith('@univerjs-pro/'))
                    && !EXCLUDED_PACKAGES.includes(pkg)
                    && !EXCLUDED_VERSIONS.includes(version)
                ) {
                    packageJson[depType][pkg] = NEW_VERSION;
                    hasUpdates = true;
                    console.log(`Updated ${pkg} to ${NEW_VERSION} in ${packageDir}`);
                }
            });
        });

        if (hasUpdates) {
            fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 4 });
        }
    });

    console.log('Running pnpm install to update lock file...');
    execSync('pnpm install', { stdio: 'inherit' });

    console.log('Dependencies update completed!');
}

updateDependencies();
