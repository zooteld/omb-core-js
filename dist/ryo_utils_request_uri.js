// Copyright (c) 2019, Ryo-currency
// Copyright (c) 2014-2018, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//of conditions and the following disclaimer in the documentation and/or other
//materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//used to endorse or promote products derived from this software without specific
//prior written permission.
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
exports.URITypes = undefined;
exports.New_RequestFunds_URI = New_RequestFunds_URI;
exports.New_ParsedPayload_FromPossibleRequestURIString = New_ParsedPayload_FromPossibleRequestURIString;

var _ryo_config = require("./ryo_config");

var _ryo_config2 = _interopRequireDefault(_ryo_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var URITypes = exports.URITypes = {
    addressAsFirstPathComponent: 1,
    addressAsAuthority: 2
};

function New_RequestFunds_URI(args) {
    var address = args.address;
    if (!address) {
        throw "missing address";
    }
    var mutable_uri = "";
    mutable_uri += _ryo_config2.default.coinUriPrefix;

    var uriType = args.uriType;
    if (uriType === URITypes.addressAsAuthority) {
        mutable_uri += "//"; // use for inserting a // so data detectors pick it up…
    } else if (uriType === URITypes.addressAsFirstPathComponent) {
        // nothing to do
    } else {
        throw "Illegal args.uriType";
    }

    mutable_uri += address;

    var isAppendingParam0 = true;
    function addParam(parameterName, value) {
        if (value == null || value == "" || typeof value === "undefined") return;
        var conjunctionStr = "&";
        if (isAppendingParam0 === true) {
            isAppendingParam0 = false;
            conjunctionStr = "?";
        }
        mutable_uri += conjunctionStr;
        mutable_uri += parameterName + "=" + encodeURIComponent(value);
    }

    addParam("tx_amount", args.amount);
    if ((args.amountCcySymbol || "").toLowerCase() != _ryo_config2.default.coinSymbol.toLowerCase()) {
        addParam("tx_amount_ccy", args.amountCcySymbol);
    }
    addParam("tx_description", args.description);
    addParam("tx_payment_id", args.payment_id);
    addParam("tx_message", args.message);

    return mutable_uri;
}

function New_ParsedPayload_FromPossibleRequestURIString(string, nettype, ryo_utils) {

    // Check if we have address only
    if (string.indexOf(_ryo_config2.default.coinUriPrefix) !== 0) {
        if (string.indexOf("?") !== -1) {
            throw "Unrecognized URI format";
        }
        try {
            ryo_utils.decode_address(string, nettype);
        } catch (e) {
            throw "No Ryo request info";
        }
        return {
            address: string
        };
    }

    var uriString = string;
    var url = new URL(uriString);
    var protocol = url.protocol;
    if (protocol !== _ryo_config2.default.coinUriPrefix) {
        throw "Request URI has non-Ryo protocol";
    }
    var target_address = url.pathname;
    if (target_address === "" || typeof target_address === "undefined" || !target_address) {
        target_address = url.host || url.hostname;
    }
    if (target_address.indexOf("//") == 0) {
        // strip prefixing "//" in case URL had protocol:// instead of protocol:
        target_address = target_address.slice(0 + "//".length, target_address.length);
    }
    var searchParams = url.searchParams; // needs to be parsed it seems
    var payload = {
        address: target_address
    };
    var keyPrefixToTrim = "tx_";
    var lengthOf_keyPrefixToTrim = keyPrefixToTrim.length;
    searchParams.forEach(function (value, key) {
        var storeAt_key = key;
        if (key.indexOf(keyPrefixToTrim) === 0) {
            storeAt_key = key.slice(lengthOf_keyPrefixToTrim, key.length);
        }
        payload["" + storeAt_key] = value;
    });
    return payload;
}