"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var CalculatorComponent = (function () {
    function CalculatorComponent() {
        this.resultValue = '';
        this.resultInteger = 0.0;
        this.operatorsUsed = [];
        this.numbers = [];
    }
    CalculatorComponent.prototype.appendValue = function (value) {
        if (this.checkLastEntered(value)) {
            this.resultValue = this.resultValue + value;
            this.evaluate(value);
        }
    };
    CalculatorComponent.prototype.checkLastEntered = function (value) {
        return ((this.resultValue == '' && (value != '+' && value != '%' && value != 'x')) // first value incoming
            || (value == '.' && (this.numbers[this.numbers.length - 1].indexOf(".") == -1)) // decimals are allowed anytime unless the number already has a decimal
            || (value != '.' && (!isNaN(parseInt(value)) || (isNaN(parseInt(value)) && !isNaN(parseInt(this.resultValue.charAt(this.resultValue.length - 1)))))) // Any number or non succeeding operators
        );
    };
    CalculatorComponent.prototype.clearValue = function () { this.resultValue = ''; this.numbers = []; this.operatorsUsed = []; };
    CalculatorComponent.prototype.evaluate = function (value) {
        if (isNaN(parseInt(value)) && value != '.') {
            if (this.resultValue == value) {
                // could start with -
                this.numbers.push('0');
            }
            this.operatorsUsed.push(value);
        }
        else if (value == '.') {
            if (this.numbers.length > 0) {
                var storedVal = this.numbers[this.numbers.length - 1];
                this.numbers[this.numbers.length - 1] = storedVal + value;
            }
            else {
                // user starting the calculation with decimal itself
                this.numbers.push("0.");
            }
        }
        else {
            // numbers
            if (this.numbers.length > 0) {
                if ((this.numbers[this.numbers.length - 1].indexOf(".") != -1 && this.numbers.length > this.operatorsUsed.length)
                    || !isNaN(parseInt(this.resultValue.charAt(this.resultValue.length - 2)))) {
                    // last value was also an integer or a decimal point
                    var storedVal = this.numbers[this.numbers.length - 1];
                    this.numbers[this.numbers.length - 1] = storedVal + value;
                }
                else {
                    // was a number
                    this.numbers.push(value);
                }
            }
            else {
                this.numbers.push(value);
            }
        }
    };
    CalculatorComponent.prototype.calculateValue = function () {
        var resultNumber = 0.0;
        if (!isNaN(parseInt(this.resultValue.charAt(this.resultValue.length - 1)))) {
            // will not calculate if the expression ends in an operator
            if (this.numbers.length > 0 && this.operatorsUsed.length > 0 && (this.numbers.length > this.operatorsUsed.length)) {
                resultNumber = parseFloat(this.numbers[0]);
                var j = 0;
                for (var i = 1; i < this.numbers.length; i++) {
                    if (j < this.operatorsUsed.length) {
                        switch (this.operatorsUsed[j]) {
                            case '+':
                                resultNumber = resultNumber + parseFloat(this.numbers[i]);
                                j++;
                                break;
                            case '-':
                                resultNumber = resultNumber - parseFloat(this.numbers[i]);
                                j++;
                                break;
                            case '%':
                                resultNumber = resultNumber / parseFloat(this.numbers[i]);
                                j++;
                                break;
                            case 'x':
                                resultNumber = resultNumber * parseFloat(this.numbers[i]);
                                j++;
                                break;
                            default:
                                break;
                        }
                    }
                }
                this.resultValue = String(resultNumber);
                this.numbers = [this.resultValue];
                this.operatorsUsed = [];
            }
        }
    };
    CalculatorComponent = __decorate([
        core_1.Component({
            selector: 'calculator',
            templateUrl: 'templates/calculatorTemplate.html'
        }), 
        __metadata('design:paramtypes', [])
    ], CalculatorComponent);
    return CalculatorComponent;
}());
exports.CalculatorComponent = CalculatorComponent;
//# sourceMappingURL=calculator.component.js.map