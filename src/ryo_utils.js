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
"use strict"
//

const fn_names = [
    "is_subaddress",
    "is_integrated_address",
    "new_payment_id",
    "new_int_addr_from_addr_and_short_pid",
    "decode_address",
    "newly_created_wallet",
    "are_equal_mnemonics",
    "mnemonic_from_seed",
    "seed_and_keys_from_mnemonic",
    "validate_components_for_login",
    // "address_and_keys_from_seed",
    "secret_key_to_public_key",
    "generate_key_image",
    "generate_key_derivation",
    "derive_public_key",
    "derive_subaddress_public_key",
    "decodeRct",
    "estimate_rct_tx_size",
    "calculate_fee",
    "create_signed_transaction",
    "convert_blob",
    "construct_block_blob",
    "get_block_id",
]

const ryoUtils_promise = new Promise((resolve, reject) => {
    require("./RyoCoreBridge").default({}).then(coreBridge_instance => {
        if(coreBridge_instance == null) {
            throw "Unable to make coreBridge_instance"
        }
        const local_fns = {}
        for(const i in fn_names) {
            const name = fn_names[i]
            local_fns[name] = function() {
                const retVal = coreBridge_instance[name].apply(coreBridge_instance, arguments) // called on the cached value
                if(typeof retVal === "object") {
                    const err_msg = retVal.err_msg
                    if(typeof err_msg !== "undefined" && err_msg) {
                        throw err_msg
                    }
                }
                return retVal
            }
        }
        local_fns.Module = coreBridge_instance.Module
        resolve(local_fns)
    }).catch(e => {
        console.error("Error: ", e)
        reject(e)
    })
})

export default ryoUtils_promise
