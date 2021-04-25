const { Entry } = require('./components/Entry');
const { GuiServer } = require('./components/GuiServer');
var fs = require("fs");
const ldsh = require('lodash')

new Vue({
        el:'#app',
        data:{
        heaps:[],
        chunks: [],
        struct: {},
        zoom:100,
        range: [0,16],
        shift: 0,
        lastScroll: null,
        updateRows: 0,
        chunkColors: {},
        factCanvas: 0,
        canvasInitialized: false,
        currIdCanvas: 0,
        guiServer: null,
        usage: "",
        sumBins: {}
    },
    created:function() {
    	
        fetch('file:./data/struct.json')
                .then(res => {
                 return res.json()
                })
                .then(res => {
                  this.struct = res;
                })

        this.chunkColors["fast"]     = "#c6ff44"
        this.chunkColors["large"]    = "#44b0ff"
        this.chunkColors["small"]    = "#ad44ff"
        this.chunkColors["tcache"]   = "#ff4493"
        this.chunkColors["unsorted"] = "#ffbb44"
        this.chunkColors["allocated"] = "#d8d8d8"

        this.guiServer = new GuiServer(this)
    },
    methods:{
	isLastChunk(id){
		console.log("test")
		console.log(id)
		console.log(this.chunks.length -1)
		if(id == this.chunks.length -1)
			return true
		return false
	},
    handleScroll(event) {
      //event.deltaY>0 ? this.zoom-=30 : this.zoom+=30
      var date = new Date();
  	  var time = date.getTime();
      var scrollFast = 1
      if(this.lastScroll != null){
      	scrollFast = 1 -Math.round(100/(this.lastScroll-time))
      }
	  this.lastScroll = time
      event.deltaY>0?this.shift+=scrollFast:this.shift-=scrollFast

      if(this.shift < 0)
      	this.shift = 0
      if(this.shift + this.range[1] > this.heaps[0].top)
      	this.shift = this.heaps[0].top - this.range[1]

      this.updateCanvas()
    },
    initCanvas(){
    	var canvas = document.getElementById("colorBar");
    	if(canvas == null)
			return
    	this.canvasInitialized = true
    	var lastCId = this.chunks.length - 1
		
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, 700, 50);
		ctx.imageSmoothingEnabled= false
		ctx.lineWidth = 3;
		var keys = Object.keys(this.chunks[lastCId]);

		var rangeSize = keys[keys.length -1] - this.heaps[0].bot
		this.factCanvas = canvas.width / rangeSize

		for(var k in this.chunks[lastCId]){
			var x = (k - this.heaps[0].bot) * this.factCanvas
			var colorChunk = this.chunkColors[this.chunks[lastCId][k]]
			ctx.beginPath();
			ctx.strokeStyle = colorChunk
			ctx.moveTo(x,2);
			ctx.lineTo(x,48);
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.strokeStyle = "#FF00FF"
		ctx.moveTo(0, 0); ctx.lineTo(25, 0); ctx.stroke();
		ctx.moveTo(0, 50); ctx.lineTo(25, 50); ctx.stroke();
    },
    updateCanvas(){
    	if(this.currIdCanvas != this.chunks.length 
    		&& this.chunks.length !=0
    	 	&& !this.canvasInitialized){
    			this.initCanvas()
    	}
    	var keys = Object.keys(this.chunks);
		var rangeSize = keys[keys.length -1] - this.heaps[0].bot
    	
    	var canvas = document.getElementById("colorBar");
    	if(canvas == null)
    		return
    	var ctx = canvas.getContext("2d");
    	ctx.imageSmoothingEnabled= false
		ctx.lineWidth = 5;

		ctx.beginPath();
		ctx.strokeStyle = "#FFFFFF"
		ctx.moveTo(0,0); ctx.lineTo(700,0);	ctx.stroke();
		ctx.moveTo(0,50); ctx.lineTo(700,50); ctx.stroke();

		var x = this.shift * this.factCanvas * 8

		ctx.beginPath();
		ctx.strokeStyle = "#FF00FF"
		var barSize = (this.range[1]*8) * this.factCanvas

		ctx.moveTo(x,0); ctx.lineTo(x + barSize,0); ctx.stroke();
		ctx.moveTo(x,50); ctx.lineTo(x + barSize,50); ctx.stroke();

    },
    canvasClick(event){
    	var rect = event.target.getBoundingClientRect();
    	var fact = 700 / (rect.right - rect.left)
    	var barSize = (16*8) * this.factCanvas
        var x = ((event.clientX - rect.left) * fact) - (barSize/2)
        if(x < 0)
        	x = 0
        this.shift = Math.round((x / this.factCanvas) / 8)
        this.updateCanvas()
    },
    takeSnapshot(){
    	var clonedHeap = ldsh.cloneDeep(this.heaps[this.heaps.length-1])
    	var clonedChunks = ldsh.cloneDeep(this.chunks[this.chunks.length-1])

    	this.heaps.push(clonedHeap)
    	this.chunks.push(clonedChunks)

    	this.updateCanvas()
    },
    updateSnapshot(){
    	this.guiServer.updateSnap()
    },
    colorChunks(){
    	for(var id=0; id < this.heaps.length;id++){
    		for (let addr in this.chunks[id]){
    			address = parseInt(addr)
    			type = this.chunks[id][address]
    			color = this.chunkColors[type]
    			//console.log(address, type, color)

    			switch(type){
    				case "allocated": 
    						if(!(address in this.heaps[id].data))
								this.heaps[id].data[address] = new Entry(0)
							this.heaps[id].data[address].color = color
							this.heaps[id].data[address].type = type
							break
						case "tcache": 
							if(!(address in this.heaps[id].data))
								this.heaps[id].data[address] = new Entry(0)
							if(!(address+8 in this.heaps[id].data))
								this.heaps[id].data[address+8] = new Entry(0)

							this.heaps[id].data[address].color = color
							this.heaps[id].data[address+8].color = color

							this.heaps[id].data[address].tag = this.struct[type][0] // "next"
							this.heaps[id].data[address+8].tag = this.struct[type][1] // "key"

							this.heaps[id].data[address].type = type
							this.heaps[id].data[address+8].type = type
							break
						case "fast":
						case "small":
						case "large":
						case "unsorted": 
							for(var c=0; c<this.struct[type].length; c++){
								var idx = c-2
								if(!(address+(idx*8) in this.heaps[id].data))
									this.heaps[id].data[address+(idx*8)] = new Entry(0)
								this.heaps[id].data[address+(idx*8)].color = color
								this.heaps[id].data[address+(idx*8)].tag = this.struct[type][c]
								this.heaps[id].data[address+(idx*8)].type = type
							}
							break

    			}
    		}

    	}
    },
	*idMaker(){
		for(var i = this.range[0] + this.shift; i < this.range[1] + this.shift; i++){
			var entries = []
			for(var id=0; id < this.heaps.length;id++){
				var address = this.heaps[id].bot + (i*8)
				var entry = {}

				if(this.heaps[id].data[address] == undefined){
					this.heaps[id].data[address] = new Entry(0)
				}

				entry["address"] = "0x" + address.toString(16)
				entry["value"] = this.heaps[id].data[address].toString()
				entry["repr"] = this.heaps[id].data[address].representation
				entry["type"] = this.heaps[id].data[address].type
				entry["field"] = this.heaps[id].data[address].tag
				entry["comment"] = this.heaps[id].data[address].comment
				entry["color"] = this.heaps[id].data[address].color
				entry["id"] = id

				if(id>0 && this.heaps[id].data[address].value != this.heaps[id-1].data[address].value)
					entry["isChanged"] = true

				if(id < this.heaps.length -1)
					entry["readonly"] = true
				entries.push(entry)
			}
			yield entries
		}
	},
	changeRepr(event){
		var b = event.target
		var id = parseInt(b.getAttribute("heapid"))

		var address = b.id.split(":")[1]
		var action = "h"
		if(b.innerText == "h"){
			action = "d"
		}else if(b.innerText == "d"){
			action = "a"
		}
		this.heaps[id].data[parseInt(address,16)].representation = action
		
		this.tableUpdate()
	},
	valueChanged(event){
		var addr = parseInt(event.target.parentElement.id, 16)
		var newVal = event.target.value
		var id = parseInt(event.target.getAttribute("heapid"))

		this.heaps[id].data[addr].changeValue(newVal)
		this.guiServer.updateValue(addr, this.heaps[id].data[addr].toInt())
		this.tableUpdate()
	},
	searchChanged(id, event){
		var value = event.target.value	
		var select = document.getElementById("searchType:" + id)

		switch(select.value){
			case "h":
			case "d":
				if( !isNaN(value)){
					var intVal = BigInt(value)
					for(var address in this.heaps[id].data ){
						if(( event.key != "Enter" || address > this.heaps[id].bot + (this.shift*8)) &&
							 this.heaps[id].data[address].value == intVal){
							this.shift = (address - this.heaps[id].bot)/8
							break
						}
					}
				}
			break
			case "s":
				var strVal = value.split("").reverse().join("")
				for(var address in this.heaps[id].data ){
					if(( event.key != "Enter" || address > this.heaps[id].bot + (this.shift*8)) &&
						 this.heaps[id].data[address].toAscii().includes(strVal) ){
						this.shift = (address - this.heaps[id].bot)/8
						break
					}
				}
			break
		}
		this.updateCanvas()
	},
	arrowHandler(id, event){
		// Per andare direttamente al prossimo chunk
		if(event.key == "ArrowDown"){
			console.log("ArrowDown pressed")
			console.log(this.shift + this.heaps[id].bot)
		}else if (event.key == "ArrowUp"){
			console.log("ArrowUp pressed")
		}
	},
	commentChanged(event){
		var addr = parseInt(event.target.parentElement.id, 16)
		var newVal = event.target.value
		this.heaps[0].data[addr].comment = newVal
		console.log("commented")
	},
	tableUpdate(){
		this.updateRows += 1
	},
	deleteSnap(id, event){
		console.log(id)
		if(id == this.heaps.length-1)
			return
		console.log("delete row:", id)
		//this.heaps.pop()
		this.heaps.splice(id, 1);
		this.chunks.splice(id, 1);
		this.canvasInitialized = false
		this.initCanvas()
		this.updateCanvas()
	},
	changeRows(val){
		this.range[1] += val
		this.tableUpdate()
		this.updateCanvas()
		console.log(val)
	},
	changeZoom(inout){
		this.zoom += inout
        document.getElementById("mainTable").style.zoom = this.zoom+"%"
    },
    binsUpdate(){
    	this.sumBins = {
        	"fast": 0,
        	"large": 0,
        	"small": 0,
        	"tcache": 0,
        	"unsorted": 0,
        	"allocated": 0
        }
    	var lastId = this.chunks.length-1
    	for(var k in this.chunks[lastId]){
    			this.sumBins[this.chunks[lastId][k]] += 1
    	}
    },
    clean(){
    	window.location.reload(false); 
    }
  }
})