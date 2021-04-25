#  	:slightly_smiling_face: Heappy: an happy heap editor
This is an editor based on gdb/gef that helps you to handle the heap during your exploitation development.  
The project should be considered a didactic tool useful to understand the evolution of the heap during the process life cycle. It has been created to simplify the study of the most common heap exploitation techniques and to help solve some binary exploitation CTFs related to this topic.

<p align="center">
<img align="center" src="https://i.imgur.com/uqBI9kr.png" width="700">
</p>


## Getting Started

These instructions will help you to install and run heappy fastly.

### Prerequisites

If you don't have it, install GEF in GDB:

```
wget -q -O- https://github.com/hugsy/gef/raw/master/scripts/gef.sh | sh
```

### Installing

Download _heappy.py_ and _heappy-gui_x64_ from the release section.
From GDB:
```
gef➤ source /my/path/heappy.py
```
It is suggested to run the heappy gui after that the heap of the target process has been initialized.
For example:
```
gef➤ break main
gef➤ run
```
From another terminal launch the GUI:
```
./heappy-gui_x64
```

Have fun!

## Some features

:white_check_mark: panoramic view of the heap status  
:white_check_mark: heap snapshots to compare each other  
:white_check_mark: highlight differences from snapshots  
:white_check_mark: categorization of bins (small, fast, ...)  
:white_check_mark: categorization of fields (size, fd, bk, ...)  
:white_check_mark: search values by decimal, hex or string  
:white_check_mark: visualization by decimal, hex or string  
:white_check_mark: editing of values as decimal, hex or string  
:white_check_mark: comment section to take note during the analysis  
:white_check_mark: light and dark mode

## Not yet implemented
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

