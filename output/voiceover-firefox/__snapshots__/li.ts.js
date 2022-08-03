exports['Li @html/li MUST convey its role in ordered list @role 1'] = {
  "spoken": "1. Cats 1 of 3",
  "output": {
    "phrase": "1. Cats 1 of 3",
    "bounds": {
      "x": 36,
      "y": 156,
      "width": 44,
      "height": 19
    },
    "textUnderCursor": "1. Cats",
    "phrases": [
      "1. Cats 1 of 3"
    ]
  }
}

exports['Li @html/li: MUST convey its role in unordered list @role 1'] = {
  "spoken": "• Cats 1 of 3",
  "output": {
    "phrase": "• Cats 1 of 3",
    "bounds": {
      "x": 37,
      "y": 156,
      "width": 43,
      "height": 20
    },
    "textUnderCursor": "• Cats",
    "phrases": [
      "• Cats 1 of 3"
    ]
  }
}

exports['Li @html/li: MUST convey its position within an ordered list @posInSet 1'] = {
  "spoken": "1. Cats 1 of 3",
  "output": {
    "phrase": "1. Cats 1 of 3",
    "bounds": {
      "x": 36,
      "y": 156,
      "width": 44,
      "height": 19
    },
    "textUnderCursor": "1. Cats",
    "phrases": [
      "1. Cats 1 of 3"
    ]
  }
}

exports['Li @html/li SHOULD NOT convey its position within an unordered list @notPosInSet 1'] = {
  "spoken": "• Cats 1 of 3",
  "output": {
    "phrase": "• Cats 1 of 3",
    "bounds": {
      "x": 37,
      "y": 156,
      "width": 43,
      "height": 20
    },
    "textUnderCursor": "• Cats",
    "phrases": [
      "list 3 items"
    ]
  }
}
