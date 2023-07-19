import {
    copyFile,
    lstat,
    mkdir,
    readdir,
    readFile,
    writeFile,
} from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { spawn } from 'child_process';

/**
 * Copies a file or directory recursively. Creates directories if they dont exist in destination. Overwrites existing files.
 * @param source Source file or directory to copy
 * @param destination Destination file or directory
 */
async function copyRecursively(
    source: string,
    destination: string
): Promise<void> {
    // Figure out if we're copying a file or directory
    if ((await lstat(source)).isDirectory()) {
        const fileContents = await readdir(source);
        for (const file of fileContents) {
            await copyRecursively(join(source, file), join(destination, file));
        }
    } else {
        await mkdir(dirname(destination), { recursive: true });
        await copyFile(source, destination);
    }
}

/**
 * Updates the package.json file to represent the built version.
 * Replaces all scripts with a single start script and removes all devDependencies.
 * @param packageJsonPath Target package.json file to update
 */
async function updatePackageJson(packageJsonPath: string): Promise<void> {
    const contents = await readFile(packageJsonPath, 'utf8');
    const jsonContents = JSON.parse(contents);
    jsonContents.scripts = {
        start: 'node backend/loernwerkServer.js',
    };
    delete jsonContents.devDependencies;
    await writeFile(
        packageJsonPath,
        JSON.stringify(jsonContents, null, 4),
        'utf8'
    );
}

/**
 * Asynchronously executes command on the commandline and sens output to stdout/stderr.
 * @param command Command to execute
 * @param parameters Parameters for the command
 * @param cwd Current working directory of the command.
 */
async function executeCommand(
    command: string,
    parameters: string[],
    cwd?: string
): Promise<void> {
    await new Promise((resolve, reject) => {
        const child = spawn(command, parameters, { cwd: cwd, shell: true });
        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });
        child.stderr.on('data', (data) => {
            process.stderr.write(data);
        });
        child.on('error', reject);
        child.on('exit', resolve);
    });
}

/**
 * Main post-build script. Copies necessary files, updates package.json and package-lock.json.
 */
async function main(): Promise<void> {
    console.log('Copying additional necessary files...');
    await copyRecursively('assets', 'build/assets');
    await copyRecursively('package.json', 'build/package.json');
    await copyRecursively('package-lock.json', 'build/package-lock.json');
    console.log('Updating package.json...');
    await updatePackageJson('build/package.json');
    console.log('Updating package-lock.json...');
    await executeCommand('npm', ['i', '--package-lock-only'], resolve('build'));
}

void main();
