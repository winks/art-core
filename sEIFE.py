"""
sEIFE - set Extension Icons for Filetypes Easily
 (c) 2010 Florian Anderiasch, fa at art dash core dot org
 BSD-licensed, where applicable

* set icons for certain filetypes in windows
* needs administrator rights to write to the registry
* only tested on Win7 Professional, 32bit

---------------------------------------
HOWTO:
---------------------------------------
0) make a backup of your registry, you have been warned
   example: start->run->regedit => export (everything)
a) make a directory and put your icons there, named <EXTENSION>.ico
   example: c:\test\JPG.ico
   example: c:\test\gif.ico
b) change input_dir to your directory
   example: input_dir = "c:\test"
c) run this file and make a backup of your current icons
   example: C:\test> python sEIFE.py -d
   now you have an "original" dump as sEIFE.324324324.bak
d) run this file to set your new icons:
   example: C:\test> python sEIFE.py -n
   finished.
e) to restore, type:
   example: C:\test> python sEIFE.py -r sIFER.324324324.bak
   all back to normal.
-----------------------------------------------------------------------------"""

input_dir = "f:\Files\icons\gant_all"

""" do not change anything below this line unless you know what you are doing
-----------------------------------------------------------------------------"""
import _winreg
import os
import cPickle
import datetime
import sys

root = _winreg.HKEY_CLASSES_ROOT
DEBUG = False
errors = []
old_ones = []
new_ones = []
_name, _ = os.path.splitext(sys.argv[0])
backup_file = _name + ".%s.bak"


def read_input(path):
  values = []
  dirList=os.listdir(input_dir)
  for fname in dirList:
    name, _ = os.path.splitext(fname)
    if (DEBUG):
      print "_" + name
    values.append((r"", name.lower()))
    return values

def writeBackup(dict):
  today = datetime.datetime.now()
  b_file = backup_file % today.strftime("%Y%m%d-%H.%M.%S")
  
  try:
    print " I writing backup to '%s'" % b_file
    f = file("./" + b_file, "wb")
    cPickle.dump(dict, f)
    f.close()
  except IOError:
    print "  E cannot write file %s" % b_file

def readRestore(file_name):
  dict = {}
  try:
    f = file("./" + file_name, "rb")
    dict = cPickle.load(f)
    f.close()
    print " I reading backup from '%s'" % file_name
  except IOError:
    print "  E cannot load file '%s'" % file_name

  return dict

def writeToReg(set):
  for keypath, value_name, ext, value in set:
    hKey = _winreg.OpenKey (root, keypath, 0, _winreg.KEY_READ | _winreg.KEY_SET_VALUE)
    print " I Setting", value_name or "(default)", "for", repr (ext), "to", repr(value)
    _winreg.SetValue(hKey, value_name, _winreg.REG_SZ, value)

def worker(change_values):
  file_exts = read_input(input_dir)

  for keypath, value_name in file_exts:
    hKey = _winreg.OpenKey (root, keypath, 0, _winreg.KEY_READ)
    try:
      progid = _winreg.QueryValue(hKey, "." + value_name)
    except WindowsError:
      if (DEBUG):
        print "  E: " + value_name + " not registered"
    else:
      if (DEBUG):
        print "ok:%s:%s" % (keypath, value_name), "=>", progid
      hKey2 = _winreg.OpenKey(root, r""+progid, 0, _winreg.KEY_READ)
      try:
        old_path = _winreg.QueryValue(hKey2, "DefaultIcon")
        if (DEBUG):
          print "____" + old_path
        old_ones.append((r""+progid, "DefaultIcon", value_name, old_path))
        new_ones.append((r""+progid, "DefaultIcon", value_name, input_dir + "\\" + value_name + ".ico,0"))
      except WindowsError:
        if (DEBUG):
          print "  E: " + value_name + " not set"
          errors.append(value_name)
  
  writeBackup(old_ones)
  if change_values:
    writeToReg(new_ones)
  if len(errors) > 0:
    print "The following extensions could not be changed:"
    for x in errors:
      print "'%s'" % x,

""" 
------------------------------------
"""
if len(sys.argv) > 2 and sys.argv[1] == "-r":
  print " I restoring..."
  x = readRestore(sys.argv[2])
  writeToReg(x)
elif len(sys.argv) > 1 and sys.argv[1] == "-d":
  print " I dumping..."
  worker(False)
elif len(sys.argv) > 1 and sys.argv[1] == "-n":
  print " I setting..."
  worker(True)
else:
  print "Usage: %s [option] [file]" % sys.argv[0]
  print "sEIFE - set Extension Icons for Filetypes Easily"
  print ""
  print "  -d\t\tdump a backup"
  print "  -r <file>\trestore icons from backup file"
  print "  -n\t\tset icons according to input_dir as set at the top of this file"