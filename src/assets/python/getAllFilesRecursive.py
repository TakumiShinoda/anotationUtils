import os
import glob
import json
import argparse
from io import TextIOWrapper

from typing import *

def getAllFilesRecursive(dir: str, filterFileName: List[str]) -> List[str]:
  pathList: List[str] = []

  if(len(filterFileName) == 0):
      pathList = glob.glob(f'{dir}/**', recursive=True)
  else:
    for ffn in filterFileName:
      pathList.extend(glob.glob(f'{dir}/**/{ffn}', recursive=True))

  pathList = [os.path.abspath(p).replace('\\', '/') for p in pathList if os.path.isfile(p)]

  return pathList

if __name__ == '__main__':
  parser: argparse.ArgumentParser = argparse.ArgumentParser()
  opt: argparse.Namespace
  outputFile: TextIOWrapper
  pathList: List[str]
  result: dict = {}
  resultStr: str

  parser.add_argument('--dir', type=str, default='', help='dir')
  parser.add_argument('--filterFileName', type=str, nargs='+', default=[], help='')
  parser.add_argument('--outputJsonDir', type=str, default='', help='')
  opt = parser.parse_args()

  if(not os.path.isdir(opt.dir)):
    exit(1)

  pathList = getAllFilesRecursive(opt.dir, opt.filterFileName)
  
  result['result'] = pathList
  resultStr = json.dumps(result, indent=2)

  if(opt.outputJsonDir == ''):
    print(resultStr)
    exit(0)

  if(not os.path.isdir(opt.outputJsonDir)):
    exit(1)

  outputFile = open(f'{opt.outputJsonDir}/getAllFilesRecursive.json', 'w')

  outputFile.write(resultStr)
  outputFile.close()