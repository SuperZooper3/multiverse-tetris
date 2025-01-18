using UnityEngine;
using System.Collections.Generic;

// Add a default set of all the Tetris pieces
public static class TetrisDefaults
{
    public static TetrisPiece[] GetDefaultPieces(Vector2Int spawnPosition)
    {
        return new TetrisPiece[]
        {
            CreatePiece("I", spawnPosition),
            CreatePiece("T", spawnPosition),
            CreatePiece("O", spawnPosition),
            CreatePiece("L", spawnPosition),
            CreatePiece("J", spawnPosition),
            CreatePiece("S", spawnPosition),
            CreatePiece("Z", spawnPosition)
        };
    }

    public static TetrisPiece CreatePiece(string shapeType, Vector2Int spawnPosition)
    {
        Vector2Int[] shape = shapeType switch
        {
            "I" => new Vector2Int[] { new(0, 0), new(1, 0), new(-1, 0), new(2, 0) },
            "T" => new Vector2Int[] { new(0, 0), new(1, 0), new(-1, 0), new(0, 1) },
            "O" => new Vector2Int[] { new(0, 0), new(1, 0), new(0, 1), new(1, 1) },
            "L" => new Vector2Int[] { new(0, 0), new(1, 0), new(-1, 0), new(-1, 1) },
            "J" => new Vector2Int[] { new(0, 0), new(1, 0), new(-1, 0), new(1, 1) },
            "S" => new Vector2Int[] { new(0, 0), new(1, 0), new(0, 1), new(-1, 1) },
            "Z" => new Vector2Int[] { new(0, 0), new(-1, 0), new(0, 1), new(1, 1) },
            _ => throw new System.ArgumentException("Invalid shape type")
        };

        return new TetrisPiece(shape, spawnPosition);
    }
}

public class TetrisPiece
{
    public Vector2Int[] shape; // Relative positions of the blocks in the piece
    public Vector2Int position; // Current position of the piece on the board
    public int rotationState; // Current rotation state (0, 1, 2, 3 for 0°, 90°, 180°, 270°)

    public TetrisPiece(Vector2Int[] shape, Vector2Int spawnPosition)
    {
        this.shape = shape;
        this.position = spawnPosition;
        this.rotationState = 0;
    }

    public void Rotate(int direction)
    {
        rotationState = (rotationState + direction) % 4;

        // rotate the shape array around the origin (0, 0)
        for (int i = 0; i < shape.Length; i++)
        {
            Vector2Int block = shape[i];
            if (direction > 0)
            {
                shape[i] = new Vector2Int(-block.y, block.x); // 90 degrees clockwise
            }
            else
            {
                shape[i] = new Vector2Int(block.y, -block.x); // 90 degrees counterclockwise
            }
        }
    }

    public IEnumerable<Vector2Int> GetOccupiedCells()
    {
        foreach (Vector2Int block in shape)
        {
            yield return new Vector2Int(block.x + position.x, block.y + position.y);
        }
    }
}

