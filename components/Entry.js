class Entry {
    value = null;
    representation = null; //d: decimal, h: hex, a: ascii
    color = null;
    tag = null; // field of bin
    type = null; // type of bin
    comment = null;
 
    constructor(value, representation="h", color=null, tag=null, type=null, comment=null){
      this.value = BigInt(value)
      this.representation = representation
      this.color = color
      this.tag = tag
      this.type = type
      this.comment = comment
    }    

    isPrintable(){
      return false
    }

    toHex(){
      return "0x"+this.value.toString(16)
    }

    toInt(){
      return this.value
    }

    toAscii(){
      var hex = this.value.toString(16)
      if(hex.length%2 != 0)
        hex = "0"+hex
      var str = '';
      for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2){
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    }

    toString(){
      switch(this.representation){
        case "d": 
          return this.toInt()
          break
        case "h": 
          return this.toHex()
          break
        case "a": 
          return this.toAscii()
          break
      }
    }

    changeValue(newValue){
      switch(this.representation){
        case "d": 
          this.value = BigInt(newValue)
          break
        case "h": 
          this.value = BigInt(newValue, 16)
          break
        case "a": 
          var arr1 = [];
          for (var n = 0, l = newValue.length; n < l; n ++){
            var hex = Number(newValue.charCodeAt(n)).toString(16);
            arr1.push(hex);
          }
          this.value = BigInt("0x"+arr1.join(''), 16);
          break
      }
    }

}
module.exports = { Entry }