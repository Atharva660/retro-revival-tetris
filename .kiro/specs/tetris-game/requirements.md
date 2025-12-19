# Requirements Document

## Introduction

This document specifies the requirements for a TypeScript-based Tetris game implementation. The Tetris_Game shall provide a complete, playable Tetris experience with proper type safety, game mechanics, and user interface components.

## Glossary

- **Tetris_Game**: The complete game system including game logic, rendering, and user interaction
- **Tetromino**: A geometric shape composed of four connected squares, representing the falling pieces in Tetris
- **Game_Board**: A 10x20 grid where tetrominoes are placed and cleared
- **Line_Clear**: The removal of completely filled horizontal rows from the game board
- **Soft_Drop**: Player-controlled faster downward movement of the current tetromino
- **Hard_Drop**: Instant placement of the current tetromino at the lowest possible position
- **Rotation**: Clockwise or counterclockwise turning of a tetromino around its center point
- **Lock_Delay**: Brief pause before a tetromino becomes fixed on the board
- **Game_State**: The complete current state of the game including board, pieces, score, and status

## Requirements

### Requirement 1

**User Story:** As a player, I want proper TypeScript type definitions for all game elements, so that the game has compile-time safety and clear interfaces.

#### Acceptance Criteria

1. WHEN the system defines tetromino types THEN the Tetris_Game SHALL include exactly seven tetromino types: I, O, T, S, Z, J, and L
2. WHEN position data is needed THEN the Tetris_Game SHALL use a Position interface with x and y coordinate properties
3. WHEN tetromino objects are created THEN the Tetris_Game SHALL use a Tetromino interface containing shape, color, and type properties
4. WHEN the game board is represented THEN the Tetris_Game SHALL use a Board type as a 2D array with 10 columns and 20 rows
5. WHEN game state is managed THEN the Tetris_Game SHALL use a GameState interface containing board, currentPiece, position, score, lines, level, gameOver, and isPaused properties

### Requirement 2

**User Story:** As a player, I want each tetromino piece to have its correct shape and color, so that the game follows standard Tetris conventions.

#### Acceptance Criteria

1. WHEN tetrominoes are defined THEN the Tetris_Game SHALL store each piece's shape as a 2D boolean or number array
2. WHEN tetrominoes are displayed THEN the Tetris_Game SHALL assign standard colors to each piece type
3. WHEN the I-piece is used THEN the Tetris_Game SHALL represent it as a 4x1 straight line with cyan color
4. WHEN the O-piece is used THEN the Tetris_Game SHALL represent it as a 2x2 square with yellow color
5. WHEN T, S, Z, J, and L pieces are used THEN the Tetris_Game SHALL represent each with their standard shapes and colors

### Requirement 3

**User Story:** As a player, I want the game board to properly track piece placement, so that filled lines can be detected and cleared.

#### Acceptance Criteria

1. WHEN the game board is initialized THEN the Tetris_Game SHALL create a 10-column by 20-row grid with all cells empty
2. WHEN a tetromino is placed THEN the Tetris_Game SHALL update the corresponding board cells with the piece's color or identifier
3. WHEN checking for line clears THEN the Tetris_Game SHALL identify completely filled horizontal rows
4. WHEN a line is cleared THEN the Tetris_Game SHALL remove the filled row and move all rows above it down by one position
5. WHEN multiple lines are cleared simultaneously THEN the Tetris_Game SHALL process all cleared lines and award appropriate points

### Requirement 4

**User Story:** As a player, I want the game to track my progress and performance, so that I can see my score, level, and lines cleared.

#### Acceptance Criteria

1. WHEN lines are cleared THEN the Tetris_Game SHALL increment the lines counter by the number of cleared lines
2. WHEN points are scored THEN the Tetris_Game SHALL add points to the total score based on lines cleared and current level
3. WHEN enough lines are cleared THEN the Tetris_Game SHALL increase the game level
4. WHEN the level increases THEN the Tetris_Game SHALL increase the falling speed of tetrominoes
5. WHEN the game state changes THEN the Tetris_Game SHALL update all relevant state properties consistently

### Requirement 5

**User Story:** As a player, I want proper game state management, so that the game can be paused, resumed, and properly handle game over conditions.

#### Acceptance Criteria

1. WHEN the game is paused THEN the Tetris_Game SHALL set isPaused to true and halt all game progression
2. WHEN the game is resumed THEN the Tetris_Game SHALL set isPaused to false and continue normal gameplay
3. WHEN a tetromino cannot be placed at the spawn position THEN the Tetris_Game SHALL set gameOver to true
4. WHEN the game is over THEN the Tetris_Game SHALL prevent further piece movement and placement
5. WHEN the game state is accessed THEN the Tetris_Game SHALL provide current values for all state properties