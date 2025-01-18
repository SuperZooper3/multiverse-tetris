using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TetrisBoard : MonoBehaviour
{
    public int width = 10;
    public int height = 20;
    public GameObject cellPrefab; // Single prefab for grid cells
    public Transform gridParent; // Parent for the cells (TetrisGrid)
    private GameObject[,] cells;
    private TetrisPiece activePiece;
    private bool[,] grid;

    void Start()
    {
        grid = new bool[width, height];
        cells = new GameObject[width, height];

        // Initialize grid cells in the UI
        InitializeGrid();

        // Set an active piece for testing
        SetActivePiece(TetrisDefaults.GetDefaultPieces(new Vector2Int(width / 2, height - 5))[0]);

        // Trigger the block loop every second
        InvokeRepeating(nameof(Step), 1f, 1f);
    }

    void InitializeGrid()
    {
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                GameObject cell = Instantiate(cellPrefab, gridParent);
                cells[x, y] = cell;
            }
        }
    }

    void Step()
    {
        // Example: Move the active piece down
        if (activePiece != null)
        {
            Debug.Log("Step");

            // Redraw the board
            DrawBoard();
        }
    }

    void DrawBoard()
    {
        // Clear grid visuals
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                Color color = grid[x, y] ? Color.gray : Color.black; // Fixed cells are gray
                cells[x, y].GetComponent<Image>().color = color;
            }
        }

        // Draw active piece
        foreach (Vector2Int block in activePiece.GetOccupiedCells())
        {
            if (block.x >= 0 && block.x < width && block.y >= 0 && block.y < height)
            {
                cells[block.x, block.y].GetComponent<Image>().color = Color.red; // Active piece is red
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

    public void SetActivePiece(TetrisPiece piece)
    {
        activePiece = piece;
    }
}
