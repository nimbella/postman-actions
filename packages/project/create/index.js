const { resolve, join } = require('path');
const { readdir, readFile } = require('fs').promises;
const axios = require('axios');
const Generate = require("@nimbella/postman-api/lib/invoker");
const { sanitizeName } = require("@nimbella/postman-api/lib/utils");
const {
    doLogin,
    fileSystemPersister,
    initializeAPI,
} = require("nimbella-deployer");


async function main(args) {
    try {
        const pm_api_key = args.__ow_headers["pm-api-key"];
        const nim_auth_token = args.__ow_headers["nim-auth-token"];
        const gh_access_token = args.__ow_headers["gh-access-token"];

        if (args.collection && pm_api_key && gh_access_token) {

            let cred = { namespace: undefined }
            if (nim_auth_token) {
                initializeAPI("Postman-action-create/1.0.0");
                cred = await doLogin(
                    nim_auth_token,
                    fileSystemPersister
                ).catch((error) => {
                    throw new Error(error.message);
                });
            }

            await nimProjectGenerate(args.collection, pm_api_key, cred.namespace || '-');
            const repoName = sanitizeName(args.collection, "-")
            const { data: repoData } = await createRepo(repoName, gh_access_token)
            await addFiles(join(process.cwd(), repoName), repoData.full_name, repoName, gh_access_token)
            return {
                body: `${repoData.name} created at ${repoData.owner.html_url}!`,
            };
        } else {
            return {
                body: `Missing required parameters`,
            };
        }
    } catch (error) {
        // console.error(error);
        return {
            body: error.message,
        };
    }
}


async function createRepo(repoName, githubToken) {
    try {
        const req = JSON.stringify({
            "name": repoName
        });
        return axios({
            method: 'POST',
            url: `https://api.github.com/user/repos`,
            data: req,
            headers: {
                Authorization: `Bearer ${githubToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        // console.error(error);
        throw new Error(error.message)
    }
}

async function addFileContent(repoName, path, content, githubToken) {
console.log(path);
    try {
        var req = JSON.stringify({
            "message": "initial commit",
            "content": content,
        });
        return await axios({
            method: 'PUT',
            url: `https://api.github.com/repos/${repoName}/contents${path}`,
            data: req,
            headers: {
                Authorization: `Bearer ${githubToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        // console.error(error);
        throw new Error(error.message)
    }
}


async function nimProjectGenerate(
    collection,
    pm_api_key,
    targetNamespace
) {
    const generator = new Generate["default"]({
        id: collection,
        key: pm_api_key,
        language: "js",
        overwrite: true,
        deploy: false,
        deployForce: false,
        updateSource: true,
        clientCode: false,
        update: false,
        init: false,
        targetNamespace,
    });

    return generator.generate().catch((error) => {
        throw new Error(error.message);
    });
}


async function addFiles(dir, full_repo_name, repo_name, gh_access_token) {
    try {
        const cwd = process.cwd()
        const rootPath = join(cwd, repo_name)
        const files = await readdir(dir, { withFileTypes: true });
        return Promise.all(files.map(async (file) => {
            const res = resolve(dir, file.name);
            if (file.isDirectory())
                {
                    await addFiles(res, full_repo_name, repo_name, gh_access_token)
                }
            else {
                const fileData = await readFile(res, 'base64')
                await addFileContent(full_repo_name, `${res.replace(rootPath, '')}`, fileData, gh_access_token)
            }
        }));

    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { main }
