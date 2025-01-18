using System.Collections.Generic;
using UnityEngine;
using static TetrisPiece;

public class TetrisBoard : MonoBehaviour
{
    public int width = 10;
    public int height = 20;
    public GameObject fixedCellPrefab;
    public GameObject activeCellPrefab;
    private bool[,] grid;
    private TetrisPiece activePiece;

    void Start()
    {
        grid = new bool[width, height];
        SetActivePiece(TetrisDefaults.GetDefaultPieces(new Vector2Int(width / 2, height - 5))[0]);

        // For testing, set the entire border to be taken
        for (int x = 0; x < width; x++)
        {
            SetCell(x, 0, true);
            SetCell(x, height - 1, true);
        }
        DrawBoard();
    }

    void DrawBoard()
    {
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                if (grid[x, y])
                {
                    Instantiate(fixedCellPrefab, new Vector3(x, y, 0), Quaternion.identity);
                }
            }
        }

        foreach (Vector2Int block in activePiece.GetOccupiedCells())
        {
            if (block.x >= 0 && block.x < width && block.y >= 0 && block.y < height) {
                Instantiate(activeCellPrefab, new Vector3(block.x, block.y, 0), Quaternion.identity);
            }
        }
    }

    public void SetCell(int x, int y, bool taken)
    {
        if (x >= 0 && x < width && y >= 0 && y < height)
        {
            grid[x, y] = taken;
        }
    }

    public bool GetCell(int x, int y)
    {
        if (x >= 0 && x < width && y >= 0 && y < height)
        {
            return grid[x, y];
        }
        return false;
    }

    public void SetActivePiece(TetrisPiece piece)
    {
        activePiece = piece;
    }
}
