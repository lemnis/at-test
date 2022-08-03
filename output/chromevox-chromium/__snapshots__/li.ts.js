exports['Li @html/li: SHOULD NOT convey its position within an unordered list @notPosInSet 1'] = {
  "spoken": "List with 3 items, Cats, List item",
  "output": {
    "phrase": "List with 3 items, Cats, List item",
    "phrases": [
      "List with 3 items",
      "Cats",
      "List item"
    ]
  }
}

exports['Li @html/li: MUST convey its role in ordered list @role 1'] = {
  "spoken": "Ordered List with 3 items, 1. Cats, List item",
  "output": {
    "phrase": "Ordered List with 3 items, 1. Cats, List item",
    "phrases": [
      "Ordered List with 3 items",
      "1. Cats",
      "List item"
    ]
  }
}

exports['Li @html/li: MUST convey its role in unordered list @role 1'] = {
  "spoken": "List with 3 items, Cats, List item",
  "output": {
    "phrase": "List with 3 items, Cats, List item",
    "phrases": [
      "List with 3 items",
      "Cats",
      "List item"
    ]
  }
}

exports['Li @html/li: MUST convey its position within an ordered list @posInSet 1'] = {
  "spoken": "Ordered List with 3 items, 1. Cats, List item",
  "output": {
    "phrase": "Ordered List with 3 items, 1. Cats, List item",
    "phrases": [
      "Ordered List with 3 items",
      "1. Cats",
      "List item"
    ]
  }
}
