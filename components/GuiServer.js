class GuiServer extends WebSocket {
    context = null

    constructor(context){
      super('ws://localhost:9884/')
      this.context = context
      this.onopen = this.onOpen
      this.onmessage = this.onMessage

      //this.context.heaps = heaps
      //this.context.chunks = chunks

    }
    onOpen(event){
      console.log('WebSocket Client Connected');
      
      this.send('{"method":"snap"}'); 
    }
    onMessage(event){
      var msg = JSON.parse(event.data);
      for(var key in msg.heap.data){
        msg.heap.data[key] = new Entry(msg.heap.data[key])
      }
      if(this.context.heaps.length == 0){
        this.context.heaps.push(msg.heap)
        this.context.chunks.push(msg.chunks)
      }else{
        this.context.heaps[this.context.heaps.length-1] = msg.heap
        this.context.chunks[this.context.chunks.length-1] = msg.chunks
      }
      this.context.colorChunks()
      this.context.initCanvas()
      this.context.updateCanvas()
      this.context.tableUpdate()
      this.context.binsUpdate()
    }
    updateSnap(){
      this.send('{"method":"snap"}');
    }
    updateValue(address, value){
      var data = JSON.stringify({
          address: address.toString(16),
          value: value.toString(16)
        })
      this.send('{"method":"update", "data":'+data+'}');
    }

}
module.exports = { GuiServer }