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

// Original Author: Lucas Jones
// Modified to remove jQuery dep and support modular inclusion of deps by Paul Shapiro (2016)
// Modified to add RingCT support by luigi1111 (2017)
//

import RyoCoreCpp from "../dist/RyoCoreCpp"
if(!process || !process.versions) {
    require("../dist/RyoCoreCpp.wasm")
}

import * as nettype_utils from "./ryo_utils_nettype"

const BigInt = require("big-integer")

function ret_val_boolstring_to_bool(boolstring) {
    if(typeof boolstring !== "string")
        throw "ret_val_boolstring_to_bool expected string input"
    if(boolstring === "true")
        return true
    else if(boolstring === "false")
        return false
    throw "ret_val_boolstring_to_bool given illegal input"
}

function api_safe_wordset_name(wordset_name) {
    switch(wordset_name.toLowerCase()) {
        case "english":
            return "English"
        case "spanish":
            return "Español"
        case "portuguese":
            return "Português"
        case "japanese":
            return "日本語"
        default:
            return wordset_name
    }
}

class RyoCoreBridge {
    constructor(this_Module) {
        this.Module = this_Module
    }

    is_subaddress(addr, nettype) {
        const args = {
            address: addr,
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.is_subaddress(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret_val_boolstring_to_bool(ret.retVal)
    }

    is_integrated_address(addr, nettype) {
        const args = {
            address: addr,
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.is_integrated_address(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret_val_boolstring_to_bool(ret.retVal)
    }

    new_payment_id() {
        const args = {}
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.new_payment_id(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret.retVal
    }

    new_int_addr_from_addr_and_short_pid(address, short_pid, nettype) {
        if(!short_pid || short_pid.length != 16) {
            return { err_msg: "expected valid short_pid" }
        }
        const args = {
            address: address,
            short_pid: short_pid,
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.new_integrated_address(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret.retVal
    }

    decode_address(address, nettype) {
        const args = {
            address: address,
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.decode_address(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return {
            spend: ret.pub_spendKey_string,
            view: ret.pub_viewKey_string,
            intPaymentId: ret.paymentID_string, // may be undefined
            isSubaddress: ret_val_boolstring_to_bool(ret.isSubaddress)
        }
    }

    newly_created_wallet(is_kurz, locale_language_code, nettype) {
        const args = {
            is_kurz: is_kurz,
            locale_language_code: locale_language_code, // NOTE: this function takes the locale, not the wordset name
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.newly_created_wallet(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return {
            mnemonic_string: ret.mnemonic_string,
            mnemonic_language: ret.mnemonic_language,
            sec_seed_string: ret.sec_seed_string,
            address_string: ret.address_string,
            pub_viewKey_string: ret.pub_viewKey_string,
            sec_viewKey_string: ret.sec_viewKey_string,
            pub_spendKey_string: ret.pub_spendKey_string,
            sec_spendKey_string: ret.sec_spendKey_string
        }
    }

    are_equal_mnemonics(a, b) {
        const args = {a, b}
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.are_equal_mnemonics(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret_val_boolstring_to_bool(ret.retVal)
    }

    mnemonic_from_seed(seed_string, wordset_name) {
        const args = {
            seed_string: seed_string,
            wordset_name: api_safe_wordset_name(wordset_name)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.mnemonic_from_seed(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg } // TODO: maybe return this somehow
        }
        return ret.retVal
    }

    seed_and_keys_from_mnemonic(mnemonic_string, nettype) {
        const args = {
            mnemonic_string: mnemonic_string,
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.seed_and_keys_from_mnemonic(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return {
            sec_seed_string: ret.sec_seed_string,
            mnemonic_language: ret.mnemonic_language,
            address_string: ret.address_string,
            pub_viewKey_string: ret.pub_viewKey_string,
            sec_viewKey_string: ret.sec_viewKey_string,
            pub_spendKey_string: ret.pub_spendKey_string,
            sec_spendKey_string: ret.sec_spendKey_string
        }
    }

    validate_components_for_login(address_string, sec_viewKey_string, sec_spendKey_string, seed_string, nettype) {
        const args = {
            address_string: address_string,
            sec_viewKey_string: sec_viewKey_string,
            sec_spendKey_string: sec_spendKey_string,
            seed_string: seed_string,
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.validate_components_for_login(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return {
            isValid: ret_val_boolstring_to_bool(ret.isValid),
            isInViewOnlyMode: ret_val_boolstring_to_bool(ret.isInViewOnlyMode),
            pub_viewKey_string: ret.pub_viewKey_string,
            pub_spendKey_string: ret.pub_spendKey_string
        }
    }

    // address_and_keys_from_seed(seed_string, nettype) {
    //     const args = {
    //         seed_string: seed_string,
    //         nettype_string: nettype_utils.nettype_to_API_string(nettype)
    //     }
    //     const args_str = JSON.stringify(args)
    //     const ret_string = this.Module.address_and_keys_from_seed(args_str)
    //     const ret = JSON.parse(ret_string)
    //     if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
    //         return { err_msg: ret.err_msg }
    //     }
    //     return {
    //         address_string: ret.address_string,
    //         pub_viewKey_string: ret.pub_viewKey_string,
    //         sec_viewKey_string: ret.sec_viewKey_string,
    //         pub_spendKey_string: ret.pub_spendKey_string,
    //         sec_spendKey_string: ret.sec_spendKey_string
    //     }
    // }

    generate_key_image(tx_pub, view_sec, spend_pub, spend_sec, output_index) {
        if(tx_pub.length !== 64)
            return { err_msg: "Invalid tx_pub length" }
        if(view_sec.length !== 64)
            return { err_msg: "Invalid view_sec length" }
        if(spend_pub.length !== 64)
            return { err_msg: "Invalid spend_pub length" }
        if(spend_sec.length !== 64)
            return { err_msg: "Invalid spend_sec length" }

        const args = {
            sec_viewKey_string: view_sec,
            sec_spendKey_string: spend_sec,
            pub_spendKey_string: spend_pub,
            tx_pub_key: tx_pub,
            out_index: "" + output_index
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.generate_key_image(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret.retVal
    }

    generate_key_derivation(pub, sec) {
        const args = {pub, sec}
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.generate_key_derivation(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret.retVal
    }

    derive_public_key(derivation, out_index, pub) {
        const args = {pub, derivation, out_index}
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.derive_public_key(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret.retVal
    }

    derive_subaddress_public_key(output_key, derivation, out_index) {
        const args = {
            output_key: output_key,
            derivation: derivation,
            out_index: "" + out_index,
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.derive_subaddress_public_key(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return ret.retVal
    }

    decodeRct(rv, sk, i) {
        const ecdhInfo = [] // should obvs be plural but just keeping exact names in-tact
        for(var j = 0; j < rv.outPk.length; j++) {
            var this_ecdhInfo = rv.ecdhInfo[j]
            ecdhInfo.push({
                mask: this_ecdhInfo.mask,
                amount: this_ecdhInfo.amount
            })
        }
        const outPk = []
        for(let j = 0; j < rv.outPk.length; j++) {
            let this_outPk_mask = null
            let this_outPk = rv.outPk[j]
            if(typeof this_outPk === "string") {
                this_outPk_mask = this_outPk
            } else if(typeof this_outPk === "object") {
                this_outPk_mask = this_outPk.mask
            }
            if(this_outPk_mask == null) {
                return { err_msg: "Couldn't locate outPk mask value" }
            }
            outPk.push({
                mask: this_outPk_mask
            })
        }
        const args = {
            i: "" + i,  // must be passed as string
            sk: sk,
            rv: {
                type: "" + rv.type, // must be string e.g. 1, 3 ... corresponding to rct::RCTType* in rctSigs.cpp
                ecdhInfo: ecdhInfo,
                outPk: outPk
            }
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.decodeRct(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return {
            amount: ret.amount, // string
            mask: ret.mask,
        }
    }

    estimate_rct_tx_size(n_inputs, mixin, n_outputs, optl__extra_size, optl__bulletproof) {
        const args = {
            n_inputs: "" + n_inputs,
            mixin: "" + mixin,
            n_outputs: "" + n_outputs,
            extra_size: "" + (typeof optl__extra_size !== "undefined" && optl__extra_size ? optl__extra_size : 0),
            bulletproof: "" + (optl__bulletproof == true ? true : false) /* if undefined, false */,
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.estimate_rct_tx_size(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg } // TODO: maybe return this somehow
        }
        return parseInt(ret.retVal) // small enough to parse
    }

    calculate_fee(num_bytes, ring_size) {
        const args = {
            tx_size: num_bytes,
            ring_size: ring_size
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.calculate_fee(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg } // TODO: maybe return this somehow
        }
        return ret.retVal // this is a string - pass it to new JSBigInt(…)
    }

    create_signed_transaction(
        from_address_string,
        sec_viewKey_string,
        sec_spendKey_string,
        to_address_string,
        outputs,
        mix_outs,
        fake_outputs_count,
        sending_amount,
        change_amount,
        fee_amount,
        payment_id,
        unlock_time,
        nettype
    ) {
        unlock_time = unlock_time || 0
        mix_outs = mix_outs || []

        if(mix_outs.length !== outputs.length && fake_outputs_count !== 0) {
            return { err_msg: `Wrong number of mix outs provided (${outputs.length} outputs, ${mix_outs.length} mix outs)` }
        }
        for(let i = 0; i < mix_outs.length; i++) {
            if((mix_outs[i].outputs || []).length < fake_outputs_count) {
                return { err_msg: "Not enough outputs to mix with" }
            }
        }

        let sanitary__outputs = []
        for(let i in outputs) {
            const sanitary__output = {
                amount: outputs[i].amount.toString(),
                public_key: outputs[i].public_key,
                global_index: "" + outputs[i].global_index,
                index: "" + outputs[i].index,
                tx_pub_key: outputs[i].tx_pub_key
            }
            if(outputs[i].rct && typeof outputs[i].rct !== "undefined") {
                sanitary__output.rct = outputs[i].rct
            }
            sanitary__outputs.push(sanitary__output)
        }
        let sanitary__mix_outs = []
        for(let i in mix_outs) {
            const sanitary__mix_outs_and_amount = {
                amount: "" + mix_outs[i].amount,
                outputs: []
            }
            if(mix_outs[i].outputs && typeof mix_outs[i].outputs !== "undefined") {
                for(let j in mix_outs[i].outputs) {
                    const sanitary__mix_out = {
                        global_index: "" + mix_outs[i].outputs[j].global_index,
                        public_key: mix_outs[i].outputs[j].public_key
                    }
                    if(mix_outs[i].outputs[j].rct && typeof mix_outs[i].outputs[j].rct !== "undefined") {
                        sanitary__mix_out.rct = mix_outs[i].outputs[j].rct
                    }
                    sanitary__mix_outs_and_amount.outputs.push(sanitary__mix_out)
                }
            }
            sanitary__mix_outs.push(sanitary__mix_outs_and_amount)
        }
        const args = {
            from_address_string: from_address_string,
            sec_viewKey_string: sec_viewKey_string,
            sec_spendKey_string: sec_spendKey_string,
            to_address_string: to_address_string,
            sending_amount: sending_amount.toString(),
            change_amount: change_amount.toString(),
            fee_amount: fee_amount.toString(),
            outputs: sanitary__outputs,
            mix_outs: sanitary__mix_outs,
            fake_outputs_count: fake_outputs_count,
            unlock_time: "" + unlock_time, // bridge is expecting a string
            nettype_string: nettype_utils.nettype_to_API_string(nettype)
        }
        if(typeof payment_id !== "undefined" && payment_id) {
            args.payment_id_string = payment_id
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.create_transaction(args_str)
        const ret = JSON.parse(ret_string)

        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg }
        }
        return {
            signed_serialized_tx: ret.serialized_signed_tx,
            tx_hash: ret.tx_hash,
            tx_key: ret.tx_key
        }
    }

    convert_blob(input) {
        const args = {
            input: "" + input
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.convert_blob(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg } // TODO: maybe return this somehow
        }
        return ret.retVal
    }

    construct_block_blob(input, nonce) {
        const args = {
            input: "" + input,
            nonce: nonce
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.construct_block_blob(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg } // TODO: maybe return this somehow
        }
        return ret.retVal
    }

    get_block_id(input) {
        const args = {
            input: "" + input
        }
        const args_str = JSON.stringify(args)
        const ret_string = this.Module.get_block_id(args_str)
        const ret = JSON.parse(ret_string)
        if(typeof ret.err_msg !== "undefined" && ret.err_msg) {
            return { err_msg: ret.err_msg } // TODO: maybe return this somehow
        }
        return ret.retVal
    }

}

export default function(options) {
    options = options || {}

    return new Promise((resolve, reject) => {
        let Module_template = {
            locateFile: function(base, dir) {
                if(base.endsWith(".wasm")) {
                    if(process && process.versions) {
                        return require("path").format({ dir, base })
                    } else {
                        return RyoCoreCppModule
                    }
                }
            }
        }

        RyoCoreCpp(Module_template).ready.then((thisModule) => {
            const instance = new RyoCoreBridge(thisModule)
            resolve(instance)
        }).catch(function(e) {
            console.error("Error loading RyoCoreCpp:", e)
            reject(e)
        })
    })
}
