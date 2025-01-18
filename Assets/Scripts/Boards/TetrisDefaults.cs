// using UnityEngine;

// static TetrisPiece[] GetDefaultPieces(Vector2Int spawnPosition)
// {
//     return new TetrisPiece[]
//     {
//         CreatePiece("I", spawnPosition),
//         CreatePiece("T", spawnPosition),
//         CreatePiece("O", spawnPosition),
//         CreatePiece("L", spawnPosition),
//         CreatePiece("J", spawnPosition),
//         CreatePiece("S", spawnPosition),
//         CreatePiece("Z", spawnPosition)
//     };
// }

// static TetrisPiece CreatePiece(string shapeType, Vector2Int spawnPosition)
// {
//     Vector2Int[] shape = shapeType switch
//     {
//         "I" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(1, 0), new Vector2Int(-1, 0), new Vector2Int(2, 0) },
//         "T" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(1, 0), new Vector2Int(-1, 0), new Vector2Int(0, 1) },
//         "O" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(1, 0), new Vector2Int(0, 1), new Vector2Int(1, 1) },
//         "L" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(1, 0), new Vector2Int(-1, 0), new Vector2Int(-1, 1) },
//         "J" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(1, 0), new Vector2Int(-1, 0), new Vector2Int(1, 1) },
//         "S" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(1, 0), new Vector2Int(0, 1), new Vector2Int(-1, 1) },
//         "Z" => new Vector2Int[] { new Vector2Int(0, 0), new Vector2Int(-1, 0), new Vector2Int(0, 1), new Vector2Int(1, 1) },
//         _ => throw new System.ArgumentException("Invalid shape type")
//     };

//     return new TetrisPiece(shape, spawnPosition);
// }
