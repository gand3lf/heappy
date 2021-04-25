import gdb
from websock import WebSocketServer
import re
import threading
from collections import OrderedDict

GEF_PROMPT = "gef\u27a4  "
GEF_PROMPT_ON = "\001\033[1;32m\002{0:s}\001\033[0m\002".format(GEF_PROMPT)
GEF_PROMPT_OFF = "\001\033[1;31m\002{0:s}\001\033[0m\002".format(GEF_PROMPT)

class Heap():
    def __init__(self, pid):
        self.pid = pid
        with open("/proc/"+str(self.pid)+"/maps") as maps:
            tmp = list(filter(lambda x: ("[heap]" in x), maps.readlines()))
            tmp = [int(x,16) for x in tmp[0].split(' ')[0].split('-')]
            self.bot, self.top = tmp[0], tmp[1]
            self.__read()
        self.data = self.__read()
    def __read(self):
        with open("/proc/"+str(self.pid)+"/mem", "r+b", 0) as mem:
            mem.seek(self.bot)
            data = mem.read(self.top - self.bot)
            return data
    def toDic(self):
        d = {}
        d["bot"] = self.bot
        d["top"] = self.top
        d["data"] = OrderedDict()
        for i in range(0, len(self.data), 8):
            entry = self.data[i:i+8]
            val = int.from_bytes(entry, byteorder='little')
            if val!=0:
                d["data"][i+self.bot] = str(val)
        return d
    def toChunkDic(self, onlyFreeChunks = False):
        d = {"bins":{}, "chunks":{} }
        addr_r = r"(?<=addr=)0x.+?(?=,)"
        for t in ["fast", "large", "small", "tcache", "unsorted"]:
            raw_string = gdb.execute("heap bins "+t, True, True)
            matches = re.findall(addr_r, raw_string)
            d["bins"][t] = [int(x,16) for x in matches]
        
        if(onlyFreeChunks == False):
            raw_string = gdb.execute("heap chunks", True, True)
            matches = re.findall(addr_r, raw_string)
            d["chunks"] = [int(x,16) for x in matches]
        else:
            d["chunks"] = []
            for t in d["bins"]:
                    d["chunks"] += [k for k in d["bins"][t]]
        # Convert to another representation
        dd = {}
        for addr in d["chunks"]:
            dd[addr] = "allocated"
            for key in d["bins"]:
                if addr in d["bins"][key]:
                    dd[addr] = key
        return dd
    def __str__(self):
        return str(self.pid)


class Snapper():
    def __init__(self, ws, client, type_):
    	self.ws = ws
    	self.client = client
    	self.type = type_
    def __call__(self):
    	h = Heap(gdb.selected_inferior().pid)
    	if(self.type == "heap"):
    		heap_snap = h.toDic()
    		msg = {"type":"heap","data":heap_snap}
    		self.ws.send(self.client, json.dumps(msg))
    	elif(self.type == "chunks"):
    		chunk_snap = h.toChunkDic()
    		msg = {"type":"chunks","data":chunk_snap}
    		self.ws.send(self.client, json.dumps(msg))
    	elif(self.type == "total"):
    		heap_snap = h.toDic()
    		chunk_snap = h.toChunkDic()
    		msg = {"type":"total","heap":heap_snap,"chunks":chunk_snap}
    		self.ws.send(self.client, json.dumps(msg))

class Writer():
    def __init__(self, address, value):
        self.address = address
        self.value = value
    def __call__(self):
        gdb.execute("set {int*}0x" + self.address + " = 0x"+ self.value)
        log("Write " + self.value + " at address " + self.address)

def log(message):
	gdb.write(message+"\n"+GEF_PROMPT_ON)
	gdb.execute("echo")

def on_data_receive(client, data):
	global client_gui 
	client_gui = client
	log("log:"+data)
	json_data = json.loads(data)
	if(json_data["method"] == "update"):
		addr = json_data["data"]["address"]
		val =  json_data["data"]["value"]
		gdb.post_event(Writer(addr, val))
	elif(json_data["method"] == "snap_heap"):
		gdb.post_event(Snapper(my_server, client, "heap"))
	elif(json_data["method"] == "snap_chunks"):
		gdb.post_event(Snapper(my_server, client, "chunks"))
	elif(json_data["method"] == "snap"):
		gdb.post_event(Snapper(my_server, client, "total"))

my_server = WebSocketServer(
    "127.0.0.1",        # host.
    9884,               # port.
    on_data_receive     = on_data_receive
)

client_gui = None

# Update gui at each stop in gdb
def stop_handler (event):
	if(client_gui == None):
		return
	gdb.post_event(Snapper(my_server, client_gui, "total"))
	print("event type: stop")

gdb.events.stop.connect (stop_handler)

def start_server():
	my_server.serve_forever()

t = threading.Thread(target = start_server)
t.daemon = True
t.start()

''' 
TODO:
1. Lancio della GUI
2. Notificare al GUI Server lo stop
'''
