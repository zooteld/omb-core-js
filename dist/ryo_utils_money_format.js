"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
//

var _ryo_config = require("./ryo_config");

var _ryo_config2 = _interopRequireDefault(_ryo_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BigInt = require("big-integer");

function padLeft(str, len, char) {
    while (str.length < len) {
        str = char + str;
    }return str;
}
function trimRight(str, char) {
    while (str[str.length - 1] == char) {
        str = str.slice(0, -1);
    }return str;
}

var MoneyFormat = function () {
    function MoneyFormat(currencyConfig) {
        _classCallCheck(this, MoneyFormat);

        // `currencyConfig` needs coinUnitPlaces, and coinSymbol
        this.config = {}; // shallow copy of initConfig
        for (var key in currencyConfig) {
            this.config[key] = currencyConfig[key];
        }
        this.config.coinUnits = BigInt(10).pow(this.config.coinUnitPlaces);
    }

    _createClass(MoneyFormat, [{
        key: "formatMoneyFull",
        value: function formatMoneyFull(units) {
            units = units.toString();
            var symbol = units[0] === "-" ? "-" : "";
            if (symbol === "-") {
                units = units.slice(1);
            }
            var decimal;
            if (units.length >= this.config.coinUnitPlaces) {
                decimal = units.substr(units.length - this.config.coinUnitPlaces, this.config.coinUnitPlaces);
            } else {
                decimal = padLeft(units, this.config.coinUnitPlaces, "0");
            }
            return symbol + (units.substr(0, units.length - this.config.coinUnitPlaces) || "0") + "." + decimal;
        }
    }, {
        key: "formatMoneyFullSymbol",
        value: function formatMoneyFullSymbol(units) {
            return this.formatMoneyFull(units) + " " + this.config.coinSymbol;
        }
    }, {
        key: "formatMoney",
        value: function formatMoney(units) {
            var f = trimRight(this.formatMoneyFull(units), "0");
            if (f[f.length - 1] === ".") {
                return f.slice(0, f.length - 1);
            }
            return f;
        }
    }, {
        key: "formatMoneySymbol",
        value: function formatMoneySymbol(units) {
            return this.formatMoney(units) + " " + this.config.coinSymbol;
        }
    }, {
        key: "parseMoney",
        value: function parseMoney(str) {
            if (!str) return BigInt.zero;
            var negative = str[0] === "-";
            if (negative) {
                str = str.slice(1);
            }
            var decimalIndex = str.indexOf(".");
            if (decimalIndex == -1) {
                if (negative) {
                    return BigInt(str).multiply(this.config.coinUnits).multiply(-1);
                }
                return BigInt(str).multiply(this.config.coinUnits);
            }
            if (decimalIndex + this.config.coinUnitPlaces + 1 < str.length) {
                str = str.substr(0, decimalIndex + this.config.coinUnitPlaces + 1);
            }
            if (negative) {
                return BigInt(str.substr(0, decimalIndex)).multiply(this.config.coinUnits).add(JSBigInt(str.substr(decimalIndex + 1)).multiply(BigInt(10).pow(decimalIndex + this.config.coinUnitPlaces - str.length + 1))).multiply(-1);
            }
            return BigInt(str.substr(0, decimalIndex)).multiply(this.config.coinUnits).add(JSBigInt(str.substr(decimalIndex + 1)).multiply(BigInt(10).pow(decimalIndex + this.config.coinUnitPlaces - str.length + 1)));
        }
    }]);

    return MoneyFormat;
}();

var instance = new MoneyFormat(_ryo_config2.default);

exports.default = instance;