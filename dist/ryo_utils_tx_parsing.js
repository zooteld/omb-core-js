// Copyright (c) 2019, Ryo-currency
// Copyright (c) 2014-2018, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IsTransactionConfirmed = IsTransactionConfirmed;
exports.IsTransactionUnlocked = IsTransactionUnlocked;
exports.TransactionLockedReason = TransactionLockedReason;

var _ryo_config = require("./ryo_config");

var _ryo_config2 = _interopRequireDefault(_ryo_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function IsTransactionConfirmed(tx, blockchain_height) {
    // TODO: check tx.mempool here?
    if (tx.height === null || typeof tx.height == 'undefined') {
        return false; // supposing it hasn't made it into a block yet
    }
    return blockchain_height - tx.height > _ryo_config2.default.txMinConfirms;
}

function IsTransactionUnlocked(tx, blockchain_height) {
    var unlock_time = tx.unlock_time || 0;
    return blockchain_height >= unlock_time;
}

function TransactionLockedReason(tx, blockchain_height) {
    var unlock_time = tx.unlock_time || 0;
    var numBlocks = unlock_time - blockchain_height;
    if (numBlocks <= 0) {
        return "Transaction is unlocked";
    }
    var unlock_prediction = moment().add(numBlocks * _ryo_config2.default.avgBlockTime, "seconds");
    return "Will be unlocked in " + numBlocks + " blocks, ~" + unlock_prediction.fromNow(true) + ", " + unlock_prediction.calendar();
}