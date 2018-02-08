#!/usr/bin/env python3
"""
usage: echo -n "0000ff\n00ff00" | hexer.py 009900
read hex color codes from stdin, compare to ARG.
"""
import sys


def parse(color):
  if len(color) > 6:
    color = color[-6:]

  pr = color[0:2]
  pg = color[2:4]
  pb = color[4:]

  #print("#", color, pr, pg, pb)
  return (pr, pg, pb)


def conv(s):
    return int(s, 16)


def compare(a1, b1, c1, a2, b2, c2):
    x1 = (255 - abs(a1 - a2)) / 255
    x2 = (255 - abs(b1 - b2)) / 255
    x3 = (255 - abs(c1 - c2)) / 255
    return (x1 + x2 + x3) / 3


def calc(c1, c2, fn=compare):
  ro, go, bo = parse(c1)
  rov,gov,bov = conv(ro), conv(go), conv(bo)
  r,g,b = parse(c2)
  rv,gv,bv = conv(r), conv(g), conv(b)
  return fn(rov,gov,bov,rv,gv,bv)

##########
if len(sys.argv) < 2:
  print("Usage: cat FILE | {} COLOR".format(sys.argv[0]))
  sys.exit()
color = sys.argv[1]
data = sys.stdin.readlines()

for line in data:
  line = line.strip()
  rx = calc(color, line, compare)
  print("{} ~ {} = {}".format(color, line, rx))

