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

import ryo_config from "./ryo_config"

const BigInt = require("big-integer")

function padLeft(str, len, char) {
    while(str.length < len) str = char + str
    return str
}
function trimRight(str, char) {
    while(str[str.length - 1] == char) str = str.slice(0, -1)
    return str
}

class MoneyFormat
{

    constructor(currencyConfig)
    {
        // `currencyConfig` needs coinUnitPlaces, and coinSymbol
        this.config = {} // shallow copy of initConfig
        for(var key in currencyConfig) {
            this.config[key] = currencyConfig[key]
        }
        this.config.coinUnits = BigInt(10).pow(this.config.coinUnitPlaces)
    }

    formatMoneyFull(units) {
        units = units.toString()
        var symbol = units[0] === "-" ? "-" : ""
        if(symbol === "-") {
            units = units.slice(1)
        }
        var decimal
        if(units.length >= this.config.coinUnitPlaces) {
            decimal = units.substr(
                units.length - this.config.coinUnitPlaces,
                this.config.coinUnitPlaces
            )
        } else {
            decimal = padLeft(units, this.config.coinUnitPlaces, "0")
        }
        return symbol + (units.substr(0, units.length - this.config.coinUnitPlaces) || "0") + "." + decimal
    }

    formatMoneyFullSymbol(units) {
        return this.formatMoneyFull(units) + " " + this.config.coinSymbol
    }

    formatMoney(units) {
        var f = trimRight(this.formatMoneyFull(units), "0")
        if(f[f.length - 1] === ".") {
            return f.slice(0, f.length - 1)
        }
        return f
    }

    formatMoneySymbol(units) {
        return this.formatMoney(units) + " " + this.config.coinSymbol
    }

    parseMoney(str) {
        if(!str) return BigInt.zero
        var negative = str[0] === "-"
        if(negative) {
            str = str.slice(1)
        }
        var decimalIndex = str.indexOf(".")
        if(decimalIndex == -1) {
            if(negative) {
                return BigInt(str).multiply(this.config.coinUnits).multiply(-1)
            }
            return BigInt(str).multiply(this.config.coinUnits)
        }
        if(decimalIndex + this.config.coinUnitPlaces + 1 < str.length) {
            str = str.substr(0, decimalIndex + this.config.coinUnitPlaces + 1)
        }
        if(negative) {
            return BigInt(str.substr(0, decimalIndex))
                .multiply(this.config.coinUnits)
                .add(
                    JSBigInt(str.substr(decimalIndex + 1)).multiply(
                        BigInt(10).pow(decimalIndex + this.config.coinUnitPlaces - str.length + 1)
                    )
                ).multiply(-1)
        }
        return BigInt(str.substr(0, decimalIndex))
            .multiply(this.config.coinUnits)
            .add(
                JSBigInt(str.substr(decimalIndex + 1)).multiply(
                    BigInt(10).pow(decimalIndex + this.config.coinUnitPlaces - str.length + 1)
                )
            )
    }

}

const instance = new MoneyFormat(ryo_config)

export default instance
