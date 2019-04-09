"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Copyright (c) 2019, Ryo-currency
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

exports.default = function (options) {
    options = options || {};

    return new Promise(function (resolve, reject) {
        var Module_template = {
            locateFile: function locateFile(base, dir) {
                if (base.endsWith(".wasm")) {
                    if (process && process.versions) {
                        return require("path").format({ dir: dir, base: base });
                    } else {
                        return RyoCoreCppModule;
                    }
                }
            }
        };

        (0, _RyoCoreCpp2.default)(Module_template).ready.then(function (thisModule) {
            var instance = new RyoCoreBridge(thisModule);
            resolve(instance);
        }).catch(function (e) {
            console.error("Error loading RyoCoreCpp:", e);
            reject(e);
        });
    });
};

var _RyoCoreCpp = require("./RyoCoreCpp");

var _RyoCoreCpp2 = _interopRequireDefault(_RyoCoreCpp);

var _ryo_utils_nettype = require("./ryo_utils_nettype");

var nettype_utils = _interopRequireWildcard(_ryo_utils_nettype);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!process || !process.versions) {
    require("./RyoCoreCpp.wasm");
}

var BigInt = require("big-integer");

function ret_val_boolstring_to_bool(boolstring) {
    if (typeof boolstring !== "string") throw "ret_val_boolstring_to_bool expected string input";
    if (boolstring === "true") return true;else if (boolstring === "false") return false;
    throw "ret_val_boolstring_to_bool given illegal input";
}

function api_safe_wordset_name(wordset_name) {
    switch (wordset_name.toLowerCase()) {
        case "english":
            return "English";
        case "spanish":
            return "Español";
        case "portuguese":
            return "Português";
        case "japanese":
            return "日本語";
        default:
            return wordset_name;
    }
}

var RyoCoreBridge = function () {
    function RyoCoreBridge(this_Module) {
        _classCallCheck(this, RyoCoreBridge);

        this.Module = this_Module;
    }

    _createClass(RyoCoreBridge, [{
        key: "is_subaddress",
        value: function is_subaddress(addr, nettype) {
            var args = {
                address: addr,
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.is_subaddress(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret_val_boolstring_to_bool(ret.retVal);
        }
    }, {
        key: "is_integrated_address",
        value: function is_integrated_address(addr, nettype) {
            var args = {
                address: addr,
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.is_integrated_address(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret_val_boolstring_to_bool(ret.retVal);
        }
    }, {
        key: "new_payment_id",
        value: function new_payment_id() {
            var args = {};
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.new_payment_id(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret.retVal;
        }
    }, {
        key: "new_int_addr_from_addr_and_short_pid",
        value: function new_int_addr_from_addr_and_short_pid(address, short_pid, nettype) {
            if (!short_pid || short_pid.length != 16) {
                return { err_msg: "expected valid short_pid" };
            }
            var args = {
                address: address,
                short_pid: short_pid,
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.new_integrated_address(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret.retVal;
        }
    }, {
        key: "decode_address",
        value: function decode_address(address, nettype) {
            var args = {
                address: address,
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.decode_address(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return {
                spend: ret.pub_spendKey_string,
                view: ret.pub_viewKey_string,
                intPaymentId: ret.paymentID_string, // may be undefined
                isSubaddress: ret_val_boolstring_to_bool(ret.isSubaddress)
            };
        }
    }, {
        key: "newly_created_wallet",
        value: function newly_created_wallet(is_kurz, locale_language_code, nettype) {
            var args = {
                is_kurz: is_kurz,
                locale_language_code: locale_language_code, // NOTE: this function takes the locale, not the wordset name
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.newly_created_wallet(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
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
            };
        }
    }, {
        key: "are_equal_mnemonics",
        value: function are_equal_mnemonics(a, b) {
            var args = { a: a, b: b };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.are_equal_mnemonics(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret_val_boolstring_to_bool(ret.retVal);
        }
    }, {
        key: "mnemonic_from_seed",
        value: function mnemonic_from_seed(seed_string, wordset_name) {
            var args = {
                seed_string: seed_string,
                wordset_name: api_safe_wordset_name(wordset_name)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.mnemonic_from_seed(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg // TODO: maybe return this somehow
                };
            }
            return ret.retVal;
        }
    }, {
        key: "seed_and_keys_from_mnemonic",
        value: function seed_and_keys_from_mnemonic(mnemonic_string, nettype) {
            var args = {
                mnemonic_string: mnemonic_string,
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.seed_and_keys_from_mnemonic(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return {
                sec_seed_string: ret.sec_seed_string,
                mnemonic_language: ret.mnemonic_language,
                address_string: ret.address_string,
                pub_viewKey_string: ret.pub_viewKey_string,
                sec_viewKey_string: ret.sec_viewKey_string,
                pub_spendKey_string: ret.pub_spendKey_string,
                sec_spendKey_string: ret.sec_spendKey_string
            };
        }
    }, {
        key: "validate_components_for_login",
        value: function validate_components_for_login(address_string, sec_viewKey_string, sec_spendKey_string, seed_string, nettype) {
            var args = {
                address_string: address_string,
                sec_viewKey_string: sec_viewKey_string,
                sec_spendKey_string: sec_spendKey_string,
                seed_string: seed_string,
                nettype_string: nettype_utils.nettype_to_API_string(nettype)
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.validate_components_for_login(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return {
                isValid: ret_val_boolstring_to_bool(ret.isValid),
                isInViewOnlyMode: ret_val_boolstring_to_bool(ret.isInViewOnlyMode),
                pub_viewKey_string: ret.pub_viewKey_string,
                pub_spendKey_string: ret.pub_spendKey_string
            };
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

    }, {
        key: "generate_key_image",
        value: function generate_key_image(tx_pub, view_sec, spend_pub, spend_sec, output_index) {
            if (tx_pub.length !== 64) return { err_msg: "Invalid tx_pub length" };
            if (view_sec.length !== 64) return { err_msg: "Invalid view_sec length" };
            if (spend_pub.length !== 64) return { err_msg: "Invalid spend_pub length" };
            if (spend_sec.length !== 64) return { err_msg: "Invalid spend_sec length" };

            var args = {
                sec_viewKey_string: view_sec,
                sec_spendKey_string: spend_sec,
                pub_spendKey_string: spend_pub,
                tx_pub_key: tx_pub,
                out_index: "" + output_index
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.generate_key_image(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret.retVal;
        }
    }, {
        key: "generate_key_derivation",
        value: function generate_key_derivation(pub, sec) {
            var args = { pub: pub, sec: sec };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.generate_key_derivation(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret.retVal;
        }
    }, {
        key: "derive_public_key",
        value: function derive_public_key(derivation, out_index, pub) {
            var args = { pub: pub, derivation: derivation, out_index: out_index };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.derive_public_key(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret.retVal;
        }
    }, {
        key: "derive_subaddress_public_key",
        value: function derive_subaddress_public_key(output_key, derivation, out_index) {
            var args = {
                output_key: output_key,
                derivation: derivation,
                out_index: "" + out_index
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.derive_subaddress_public_key(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return ret.retVal;
        }
    }, {
        key: "decodeRct",
        value: function decodeRct(rv, sk, i) {
            var ecdhInfo = []; // should obvs be plural but just keeping exact names in-tact
            for (var j = 0; j < rv.outPk.length; j++) {
                var this_ecdhInfo = rv.ecdhInfo[j];
                ecdhInfo.push({
                    mask: this_ecdhInfo.mask,
                    amount: this_ecdhInfo.amount
                });
            }
            var outPk = [];
            for (var _j = 0; _j < rv.outPk.length; _j++) {
                var this_outPk_mask = null;
                var this_outPk = rv.outPk[_j];
                if (typeof this_outPk === "string") {
                    this_outPk_mask = this_outPk;
                } else if ((typeof this_outPk === "undefined" ? "undefined" : _typeof(this_outPk)) === "object") {
                    this_outPk_mask = this_outPk.mask;
                }
                if (this_outPk_mask == null) {
                    return { err_msg: "Couldn't locate outPk mask value" };
                }
                outPk.push({
                    mask: this_outPk_mask
                });
            }
            var args = {
                i: "" + i, // must be passed as string
                sk: sk,
                rv: {
                    type: "" + rv.type, // must be string e.g. 1, 3 ... corresponding to rct::RCTType* in rctSigs.cpp
                    ecdhInfo: ecdhInfo,
                    outPk: outPk
                }
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.decodeRct(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return {
                amount: ret.amount, // string
                mask: ret.mask
            };
        }
    }, {
        key: "estimate_rct_tx_size",
        value: function estimate_rct_tx_size(n_inputs, mixin, n_outputs, optl__extra_size, optl__bulletproof) {
            var args = {
                n_inputs: "" + n_inputs,
                mixin: "" + mixin,
                n_outputs: "" + n_outputs,
                extra_size: "" + (typeof optl__extra_size !== "undefined" && optl__extra_size ? optl__extra_size : 0),
                bulletproof: "" + (optl__bulletproof == true ? true : false) /* if undefined, false */
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.estimate_rct_tx_size(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg // TODO: maybe return this somehow
                };
            }
            return parseInt(ret.retVal); // small enough to parse
        }
    }, {
        key: "calculate_fee",
        value: function calculate_fee(num_bytes, ring_size) {
            var args = {
                tx_size: num_bytes,
                ring_size: ring_size
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.calculate_fee(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg // TODO: maybe return this somehow
                };
            }
            return ret.retVal; // this is a string - pass it to new JSBigInt(…)
        }
    }, {
        key: "create_signed_transaction",
        value: function create_signed_transaction(from_address_string, sec_viewKey_string, sec_spendKey_string, to_address_string, outputs, mix_outs, fake_outputs_count, sending_amount, change_amount, fee_amount, payment_id, unlock_time, nettype) {
            unlock_time = unlock_time || 0;
            mix_outs = mix_outs || [];

            if (mix_outs.length !== outputs.length && fake_outputs_count !== 0) {
                return { err_msg: "Wrong number of mix outs provided (" + outputs.length + " outputs, " + mix_outs.length + " mix outs)" };
            }
            for (var i = 0; i < mix_outs.length; i++) {
                if ((mix_outs[i].outputs || []).length < fake_outputs_count) {
                    return { err_msg: "Not enough outputs to mix with" };
                }
            }

            var sanitary__outputs = [];
            for (var _i in outputs) {
                var sanitary__output = {
                    amount: outputs[_i].amount.toString(),
                    public_key: outputs[_i].public_key,
                    global_index: "" + outputs[_i].global_index,
                    index: "" + outputs[_i].index,
                    tx_pub_key: outputs[_i].tx_pub_key
                };
                if (outputs[_i].rct && typeof outputs[_i].rct !== "undefined") {
                    sanitary__output.rct = outputs[_i].rct;
                }
                sanitary__outputs.push(sanitary__output);
            }
            var sanitary__mix_outs = [];
            for (var _i2 in mix_outs) {
                var sanitary__mix_outs_and_amount = {
                    amount: "" + mix_outs[_i2].amount,
                    outputs: []
                };
                if (mix_outs[_i2].outputs && typeof mix_outs[_i2].outputs !== "undefined") {
                    for (var j in mix_outs[_i2].outputs) {
                        var sanitary__mix_out = {
                            global_index: "" + mix_outs[_i2].outputs[j].global_index,
                            public_key: mix_outs[_i2].outputs[j].public_key
                        };
                        if (mix_outs[_i2].outputs[j].rct && typeof mix_outs[_i2].outputs[j].rct !== "undefined") {
                            sanitary__mix_out.rct = mix_outs[_i2].outputs[j].rct;
                        }
                        sanitary__mix_outs_and_amount.outputs.push(sanitary__mix_out);
                    }
                }
                sanitary__mix_outs.push(sanitary__mix_outs_and_amount);
            }
            var args = {
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
            };
            if (typeof payment_id !== "undefined" && payment_id) {
                args.payment_id_string = payment_id;
            }
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.create_transaction(args_str);
            var ret = JSON.parse(ret_string);

            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg };
            }
            return {
                signed_serialized_tx: ret.serialized_signed_tx,
                tx_hash: ret.tx_hash,
                tx_key: ret.tx_key
            };
        }
    }, {
        key: "convert_blob",
        value: function convert_blob(input) {
            var args = {
                input: "" + input
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.convert_blob(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg // TODO: maybe return this somehow
                };
            }
            return ret.retVal;
        }
    }, {
        key: "construct_block_blob",
        value: function construct_block_blob(input, nonce) {
            var args = {
                input: "" + input,
                nonce: nonce
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.construct_block_blob(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg // TODO: maybe return this somehow
                };
            }
            return ret.retVal;
        }
    }, {
        key: "get_block_id",
        value: function get_block_id(input) {
            var args = {
                input: "" + input
            };
            var args_str = JSON.stringify(args);
            var ret_string = this.Module.get_block_id(args_str);
            var ret = JSON.parse(ret_string);
            if (typeof ret.err_msg !== "undefined" && ret.err_msg) {
                return { err_msg: ret.err_msg // TODO: maybe return this somehow
                };
            }
            return ret.retVal;
        }
    }]);

    return RyoCoreBridge;
}();