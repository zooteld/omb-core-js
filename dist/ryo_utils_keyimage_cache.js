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
exports.Lazy_KeyImage = Lazy_KeyImage;
exports.Lazy_KeyImageCacheForWalletWith = Lazy_KeyImageCacheForWalletWith;
exports.DeleteManagedKeyImagesForWalletWith = DeleteManagedKeyImagesForWalletWith;
function Lazy_KeyImage(mutable_keyImagesByCacheKey, // pass a mutable JS dictionary
tx_pub_key, out_index, public_address, view_key__private, spend_key__public, spend_key__private, ryo_utils // must pass this so this fn can remain synchronous
) {

    var cache_index = tx_pub_key + ":" + public_address + ":" + out_index;
    var cached__key_image = mutable_keyImagesByCacheKey[cache_index];

    if (typeof cached__key_image !== "undefined" && cached__key_image !== null) {
        return cached__key_image;
    }
    var key_image = ryo_utils.generate_key_image(tx_pub_key, view_key__private, spend_key__public, spend_key__private, out_index);

    mutable_keyImagesByCacheKey[cache_index] = key_image;

    return key_image;
}

// Managed caches - Can be used by apps which can't send a mutable_keyImagesByCacheKey
var __global_managed_keyImageCaches_by_walletId = {};
function _managedKeyImageCacheWalletIdForWalletWith(public_address) {
    // NOTE: making the assumption that public_address is unique enough to identify a wallet for caching....
    // FIXME: with subaddresses, is that still the case? would we need to split them up by subaddr anyway?
    if (public_address == "" || !public_address || typeof public_address == "undefined") {
        throw "managedKeyImageCacheIdentifierForWalletWith: Illegal public_address";
    }
    return "" + public_address;
}

function Lazy_KeyImageCacheForWalletWith(public_address) {
    var cacheId = _managedKeyImageCacheWalletIdForWalletWith(public_address);
    var cache = __global_managed_keyImageCaches_by_walletId[cacheId];
    if (typeof cache === "undefined" || !cache) {
        cache = {};
        __global_managed_keyImageCaches_by_walletId[cacheId] = cache;
    }
    return cache;
}

function DeleteManagedKeyImagesForWalletWith(public_address) {
    // IMPORTANT: Ensure you call this method when you want to clear your wallet from
    // memory or delete it, or else you could leak key images and public addresses.
    var cacheId = _managedKeyImageCacheWalletIdForWalletWith(public_address);
    delete __global_managed_keyImageCaches_by_walletId[cacheId];

    // sanity check
    var cache = __global_managed_keyImageCaches_by_walletId[cacheId];
    if (typeof cache !== "undefined") {
        throw "Key image cache still exists after deletion";
    }
}