const { createClient } = require('@sanity/client');
const client = createClient({
    projectId: 'n0mbi7p9',
    dataset: 'production',
    token: 'skRjSYKCGPJptT2sZLwEYEMyfIAuaKCq4ys56Gp3UlQ6pPYSX1ghD2XgedMN7g8xPWpcFrrZTvlVDePaCFcNDSmbY04840P6C6inuyIsZseTE2n6mnSpsWKjHSM4VB3ELp0J3xNmlcBdDvbZzRutwguKu7oDb6RipAabp8SRX3aXx51N7YuS',
    useCdn: false,
    apiVersion: '2024-01-01'
});

async function run() {
    const doc = await client.fetch('*[_type == "lesson"][0]');
    console.log(JSON.stringify(doc, null, 2));
}

run();
