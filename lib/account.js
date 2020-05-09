'use strict';

const uuidV1 = require('uuid/v1');
const mathjs = require('mathjs');
const assert = require('assert');
const atm = require('./atm');

const defaultRamQuant = '50.0000';
const defaultNetQuant = '50.0000';
const defaultCpuQuant = '50.0000';

/*
Limitation: Quality Name Distribution & Namespaces
https://github.com/EOSIO/eos/issues/3189
*/
const createAccount = async (
    creatorAccount, creatorPrivateKey, newAccount, newPublicKey, options
) => {
    assert(creatorAccount, 'Creator account is required.');
    assert(creatorPrivateKey, 'Creator private key is required.');
    assert(newAccount, 'New account is required.');
    assert(newPublicKey, 'New public key is required.');
    return await atm.transact(
        creatorAccount, creatorPrivateKey,
        ['eosio', 'eosio', 'eosio'], ['newaccount', 'buyram', 'delegatebw'],
        [
            {
                creator: creatorAccount,
                name: newAccount,
                owner: {
                    threshold: 1,
                    keys: [{ key: newPublicKey, weight: 1 }],
                    accounts: [],
                    waits: [],
                },
                active: {
                    threshold: 1,
                    keys: [{ key: newPublicKey, weight: 1 }],
                    accounts: [],
                    waits: [],
                }
            },
            {
                payer: creatorAccount,
                receiver: newAccount,
                quant: `${defaultRamQuant} ${atm.chainCurrency}`,
            },
            {
                from: creatorAccount,
                receiver: newAccount,
                stake_net_quantity: `${defaultNetQuant} ${atm.chainCurrency}`,
                stake_cpu_quantity: `${defaultCpuQuant} ${atm.chainCurrency}`,
                transfer: true,
            },
        ],
        options
    );
};

const openAccount = (account, publicKey, options) => {
    let [trace, memo, amount] = [
        uuidV1(), { action: 'newaccount', account, publicKey },
        atm.bigFormat(mathjs.add(
            mathjs.bignumber(defaultRamQuant),
            mathjs.bignumber(defaultNetQuant),
            mathjs.bignumber(defaultCpuQuant),
        ))
    ];
    const encMemo = JSON.stringify(memo);
    assert(account, 'New account is required.');
    assert(publicKey, 'New public key is required.');
    assert(encMemo.length <= 140, 'Memo too long.');
    return {
        trace, memo,
        ramQuant: `${defaultRamQuant} ${atm.chainCurrency}`,
        netQuant: `${defaultNetQuant} ${atm.chainCurrency}`,
        cpuQuant: `${defaultCpuQuant} ${atm.chainCurrency}`,
        amount: `${amount} ${atm.chainCurrency}`,
        paymentUrl: atm.createMixinPaymentUrlToSystemAccount(
            amount, trace, encMemo, options
        )
    };
};

module.exports = {
    createAccount,
    openAccount,
};