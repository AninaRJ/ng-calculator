import {Component} from '@angular/core';

@Component({
    selector: 'calculator',
    templateUrl: 'templates/calculatorTemplate.html'
})

export class CalculatorComponent{
    resultValue: string = '';
    resultInteger: number = 0.0;
    operatorsUsed: string[] = [];
    numbers:string[] = [];
    
    appendValue(value:string){
        if(this.checkLastEntered(value)){
            this.resultValue = this.resultValue + value;
            
            this.evaluate(value);
         }
    }
    
    checkLastEntered(value:string){
        return (
                (this.resultValue == '' && (value != '+' && value != '%' && value != 'x')) // first value incoming
                || (value == '.' && (this.numbers[this.numbers.length -1].indexOf(".") == -1)) // decimals are allowed anytime unless the number already has a decimal
                || (value != '.' && (!isNaN(parseInt(value)) || (isNaN(parseInt(value)) && !isNaN(parseInt(this.resultValue.charAt(this.resultValue.length-1)))))) // Any number or non succeeding operators
                )
    }
    
    clearValue(){this.resultValue=''; this.numbers = []; this.operatorsUsed = [];}
    
    evaluate(value:string){
        if(isNaN(parseInt(value)) && value != '.'){
            
            if(this.resultValue == value){
                // could start with -
                this.numbers.push('0');
            }
            
            this.operatorsUsed.push(value);
        }
        else if(value == '.'){
            if(this.numbers.length > 0){
                let storedVal = this.numbers[this.numbers.length - 1];
                this.numbers[this.numbers.length - 1] = storedVal + value;
            }
            else{
                // user starting the calculation with decimal itself
                this.numbers.push("0.");
            }
        }
        else{
            // numbers
            if(this.numbers.length > 0){
                if((this.numbers[this.numbers.length - 1].indexOf(".") != -1 && this.numbers.length > this.operatorsUsed.length)
                 || !isNaN(parseInt(this.resultValue.charAt(this.resultValue.length - 2)))){
                    // last value was also an integer or a decimal point
                    let storedVal = this.numbers[this.numbers.length - 1];
                    this.numbers[this.numbers.length - 1] = storedVal + value;
                }else{
                    // was a number
                    this.numbers.push(value);
                }
            }else{
                this.numbers.push(value);
            }
        }
    }
    
    calculateValue(){
        let resultNumber:number = 0.0;
        if(!isNaN(parseInt(this.resultValue.charAt(this.resultValue.length - 1)))){
            // will not calculate if the expression ends in an operator
            if(this.numbers.length > 0 && this.operatorsUsed.length > 0 && (this.numbers.length > this.operatorsUsed.length)){
                resultNumber = parseFloat(this.numbers[0]);
                let j:number = 0;
                for(let i = 1; i < this.numbers.length; i++){
                     if( j < this.operatorsUsed.length){
                        switch(this.operatorsUsed[j]){
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
    }
}