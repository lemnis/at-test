exports['Li @html/li: MUST convey its position within an ordered list @posInSet 1'] = {
  "spoken": "1 Cats 1 of 3",
  "output": {
    "phrase": "1 Cats 1 of 3",
    "bounds": {
      "x": 187,
      "y": 205,
      "width": 49,
      "height": 18
    },
    "textUnderCursor": "1 Cats",
    "phrases": [
      "1 Cats 1 of 3"
    ]
  }
}

exports['Li @html/li MUST convey its role in ordered list @role 1'] = {
  "spoken": "1 Cats 1 of 3",
  "output": {
    "phrase": "1 Cats 1 of 3",
    "bounds": {
      "x": 187,
      "y": 205,
      "width": 49,
      "height": 18
    },
    "textUnderCursor": "1 Cats",
    "phrases": [
      "1 Cats 1 of 3"
    ]
  }
}

exports['Li @html/li: MUST convey its role in unordered list @role 1'] = {
  "spoken": "• Cats 1 of 3",
  "output": {
    "phrase": "• Cats 1 of 3",
    "bounds": {
      "x": 190,
      "y": 205,
      "width": 46,
      "height": 18
    },
    "textUnderCursor": "• Cats",
    "phrases": [
      "• Cats 1 of 3"
    ]
  }
}

exports['Li @html/li SHOULD NOT convey its position within an unordered list @notPosInSet 1'] = {
  "spoken": "• Cats 1 of 3",
  "output": {
    "phrase": "• Cats 1 of 3",
    "bounds": {
      "x": 190,
      "y": 205,
      "width": 46,
      "height": 18
    },
    "textUnderCursor": "• Cats",
    "phrases": [
      "list 3 items"
    ]
  }
}
