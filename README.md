# Heappy: an happy heap editor
This is an editor based on gdb/gef that helps you to visualize the heap status.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

It is necessary to have GEF installed:

```
wget -q -O- https://github.com/hugsy/gef/raw/master/scripts/gef.sh | sh
```

### Installing

Download _heappy.py_ and _heappy-gui_ from the release section.
From GDB:
```
gef➤ source /my/path/heappy.py
```
From another terminal launch the GUI:
```
./heappy-gui
```

Have fun!

## Some features

* A panoramic view of the heap status
* Take heap snapshots to compare each other
* highlight cell if changed compared to the previous snapshot
* Categorize bins and the respected field value (size, fd, bk, ...)
* Search values by decimal, hex or string
* Visualize heap cells by decimal, hex or string
* Edit value in heap as decimal, hex or string at runtime
* Take notes about a value in the comment section
* Enjoy dark and light mode

## Built With

* [Vue.js](https://vuejs.org/) - Web framework
* [Electron](https://www.electronjs.org/) - Builder framework
* [GEF](https://github.com/hugsy/gef) - GDB extension
* [Python3](https://www.python.org) - For GEF integration

## Current status ##

| Documentation |License | Compatibility |
|---|---|---|
| [![ReadTheDocs](https://readthedocs.org/projects/gef/badge/?version=master)](https://doc) | [![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?maxAge=2592000?style=plastic)](https://github.com) | [![Python 3](https://img.shields.io/badge/Python-3-green.svg)](https://github.com) |

