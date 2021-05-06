#  	:slightly_smiling_face: Heappy: a happy heap editor
Heappy is an editor based on gdb/gef that helps you to handle the heap during your exploitation development.  
The project should be considered a didactic tool useful to understand the evolution of the heap during the process life cycle. It has been created to simplify the study of the most common heap exploitation techniques and to support you to solve some binary exploitation CTFs related to this fantastic topic.

<p align="center">
<img align="center" src="https://i.imgur.com/hmP3lzg.png" width="700">
</p>

## Main features
This is what Heappy implements:  
&nbsp;&nbsp; :white_check_mark: take heap snapshots and compare them each other  
&nbsp;&nbsp; :white_check_mark: recognize immediately type and fields of heap bins  
&nbsp;&nbsp; :white_check_mark: search and edit heap values by decimal, hex or string  
&nbsp;&nbsp; :white_check_mark: find yourself with the panoramic view of the heap status  
&nbsp;&nbsp; :white_check_mark: take notes about a cell in the comment column  
&nbsp;&nbsp; :white_check_mark: enjoy the light and dark mode  

## Getting Started

These instructions will help you to install and run Heappy fastly.

### Prerequisites

If you don't have it, install GEF in GDB:

```
wget -q -O- https://github.com/hugsy/gef/raw/master/scripts/gef.sh | sh
```
<i>md5(gef.sh): eb053864d050048cb001c80c79fde7b5</i>

### Installing

Install Node.js and npm:
```
apt update
sudo apt install nodejs npm
```
Download and install Heappy:
```
git clone https://github.com/gand3lf/heappy
cd heappy/
npm install
```
Load the server inside GDB:
```
gef➤ source /my/path/heappy/server/heappy.py
```
It is suggested to run the Heappy GUI after that the target heap has been initialized.  
For example:
```
gef➤ break main
gef➤ run
```
From another terminal launch the GUI:
```
cd /my/path/heappy/
npm start
```

Have fun! :rocket:

## Not yet implemented
:black_square_button: 32-bit addresses support (coming soon)  
:black_square_button: multiple heaps support  
:black_square_button: gdb checkpoint integration

## Built With

* [Vue.js](https://vuejs.org/) - Web framework
* [Electron](https://www.electronjs.org/) - Builder framework
* [GEF](https://github.com/hugsy/gef) - GDB extension
* [Python3](https://www.python.org) - For GEF integration

## Current status ##

| License | Compatibility |
|---|---|
| [![MIT](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Gand3lf/heappy/blob/main/LICENSE) | [![Python 3](https://img.shields.io/badge/Python-3-green.svg)](https://www.python.org/) |

