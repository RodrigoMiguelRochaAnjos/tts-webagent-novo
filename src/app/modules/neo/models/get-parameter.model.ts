export class GetParameter {
    private name: string;
    private value: string | number;
  
    constructor(parameterName: string, parameterValue: string | number) {
      this.name = parameterName;
      this.value = parameterValue;
    }
  
    toParamString(includeAnd: boolean): string {
      const andSymbol = includeAnd ? '&' : '';
      return andSymbol + this.name + '=' + this.value;
    }
}
