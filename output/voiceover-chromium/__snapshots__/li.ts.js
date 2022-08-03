exports['Li @html/li: MUST convey its role in unordered list @role 1'] = {
  "spoken": "•   Cats 1 of 3",
  "output": {
    "phrase": "•   Cats 1 of 3",
    "bounds": {
      "x": 53,
      "y": 171,
      "width": 46,
      "height": 18
    },
    "textUnderCursor": "•  Cats",
    "phrases": [
      "•   Cats 1 of 3"
    ]
  }
}

exports['Li @html/li: MUST convey its position within an ordered list @posInSet 1'] = {
  "spoken": "1.  Cats 1 of 3",
  "output": {
    "phrase": "1.  Cats 1 of 3",
    "bounds": {
      "x": 54,
      "y": 171,
      "width": 45,
      "height": 18
    },
    "textUnderCursor": "1. Cats",
    "phrases": [
      "1.  Cats 1 of 3"
    ]
  }
}

exports['Li @html/li: MUST convey its role in ordered list @role 1'] = {
  "spoken": "1.  Cats 1 of 3",
  "output": {
    "phrase": "1.  Cats 1 of 3",
    "bounds": {
      "x": 54,
      "y": 171,
      "width": 45,
      "height": 18
    },
    "textUnderCursor": "1. Cats",
    "phrases": [
      "1.  Cats 1 of 3"
    ]
  }
}

exports['Li @html/li: SHOULD NOT convey its position within an unordered list @notPosInSet 1'] = {
  "spoken": "list 3 items",
  "output": {
    "phrase": "list 3 items",
    "bounds": {
      "x": 30,
      "y": 171,
      "width": 1264,
      "height": 54
    },
    "textUnderCursor": "list"
  }
}

exports['Li @html/li SHOULD NOT convey its position within an unordered list @notPosInSet 1'] = {
  "spoken": "list 3 items",
  "output": {
    "phrase": "•   Cats 1 of 3",
    "bounds": {
      "x": 53,
      "y": 171,
      "width": 46,
      "height": 18
    },
    "textUnderCursor": "•  Cats",
    "phrases": [
      "list 3 items"
    ]
  }
}

exports['Li @html/li MUST convey its role in ordered list @role 1'] = {
  "spoken": "1.  Cats 1 of 3",
  "output": {
    "phrase": "1.  Cats 1 of 3",
    "bounds": {
      "x": 54,
      "y": 171,
      "width": 45,
      "height": 18
    },
    "textUnderCursor": "1. Cats",
    "phrases": [
      "1.  Cats 1 of 3"
    ]
  }
}
