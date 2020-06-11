'use strict';

const { wallet, etc } = require('../index');
const readline = require('readline-sync');

const func = async (argv) => {
    let repeat = argv.password;
    while (!argv.password || !repeat || argv.password !== repeat) {
        console.log('Input password to encrypt the keystore.');
        argv.password = readline.question(
            'New password: ', global.chainConfig.readlineConfig
        );
        repeat = readline.question(
            'Repeat password: ', global.chainConfig.readlineConfig
        );
        if (argv.password !== repeat) {
            console.log('Passwords do not match.');
        }
    }
    const result = await wallet.createKeystore(
        String(argv.password || ''), argv.pubkey, argv.pvtkey,
    );
    if (argv.dump) {
        await etc.dumpFile(argv.dump, JSON.stringify(cResult), {
            overwrite: global.chainConfig.overwrite,
        });
    }
    return result;
};

module.exports = {
    func,
    name: 'Create a new Keystore / Import keys to a new Keystore',
    help: [
        "    --action   Set as 'keystore'                 [STRING  / REQUIRED]",
        '    --password Use to encrypt the keystore       [STRING  / OPTIONAL]',
        '    --pubkey   Import existing public key        [STRING  / OPTIONAL]',
        '    --pvtkey   Import existing private key       [STRING  / OPTIONAL]',
        '    --dump     Save keystore to a JSON file      [STRING  / OPTIONAL]',
        '',
        '    > Example of creating a new keystore:',
        '    $ prs-atm --action=keystore \\',
        '              --dump=keystore.json',
        '',
        '    > Example of creating a keystore with existing keys:',
        '    $ prs-atm --action=keystore \\',
        '              --pubkey=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ \\',
        '              --pvtkey=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ \\',
        '              --dump=keystore.json',
    ],
};
