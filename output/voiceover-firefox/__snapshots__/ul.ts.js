exports['Ul @html/ul: MUST convey its role @role 1'] = {
  "spoken": "list 3 items",
  "output": {
    "phrase": "list 3 items",
    "bounds": {
      "x": 12,
      "y": 156,
      "width": 1264,
      "height": 106
    },
    "textUnderCursor": "list",
    "phrases": [
      "start button",
      "list 3 items"
    ]
  }
}

exports['Ul @html/ul: MUST convey the list boundaries - start @boundaries 1'] = {
  "spoken": "list 3 items",
  "output": {
    "phrase": "list 3 items",
    "bounds": {
      "x": 12,
      "y": 156,
      "width": 1264,
      "height": 106
    },
    "textUnderCursor": "list",
    "phrases": [
      "list 3 items"
    ]
  }
}

exports['Ul @html/ul: MUST convey the list boundaries - end @boundaries 1'] = {
  "spoken": "end of list",
  "output": {
    "phrase": "end of list",
    "bounds": {
      "x": 12,
      "y": 156,
      "width": 1264,
      "height": 106
    },
    "textUnderCursor": "list",
    "phrases": [
      "end of list"
    ]
  }
}

exports['Ul @html/ul SHOULD convey the nesting level @level 1'] = {
  "spoken": "list 2 items level 2",
  "output": {
    "phrase": "list 2 items level 2",
    "bounds": {
      "x": 52,
      "y": 177,
      "width": 1224,
      "height": 43
    },
    "textUnderCursor": "list",
    "phrases": [
      "• Cats  1 of 3",
      "list 2 items level 2"
    ]
  }
}

exports['Ul @html/ul: SHOULD convey the nesting level @level 1'] = {
  "spoken": "list 2 items level 2",
  "output": {
    "phrase": "list 2 items level 2",
    "bounds": {
      "x": 52,
      "y": 177,
      "width": 1224,
      "height": 43
    },
    "textUnderCursor": "list",
    "phrases": [
      "list 2 items level 2"
    ]
  }
}
