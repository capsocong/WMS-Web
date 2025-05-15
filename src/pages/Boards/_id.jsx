// Board details
import { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'


function Board() {
  const [board, setBoard] = useState(null)
  const boardId = '681d7a1b63a2ee619fd6a63e'

  useEffect(() => {
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      // tao placeholdercard cho cac column
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        }
      })
      // console.log('board:', board)
      setBoard(board)
    })
  }, [])

  //function gọi API tạo mới column và làm lại dữ liệu state Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    const playceholderCard = generatePlaceholderCard(createdColumn)
    createdColumn.cards = [playceholderCard]
    createdColumn.cardOrderIds = [playceholderCard._id]

    const updatedBoard = await fetchBoardDetailsAPI(board._id)
    updatedBoard.columns.forEach(column => {
      if (isEmpty(column.cards)) {
        const placeholder = generatePlaceholderCard(column)
        column.cards = [placeholder]
        column.cardOrderIds = [placeholder._id]
      }
    })

    setBoard(updatedBoard)

  }

  const createNewCard = async (newCardData) => {
    await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    const updatedBoard = await fetchBoardDetailsAPI(board._id)
    updatedBoard.columns.forEach(column => {
      if (isEmpty(column.cards)) {
        const placeholder = generatePlaceholderCard(column)
        column.cards = [placeholder]
        column.cardOrderIds = [placeholder._id]
      }
    })

    setBoard(updatedBoard)
  }
  // function gọi API sắp xếp lại thứ tự các column
  const moveColumns = async (dndOrderedColumns) => {
    //
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // gọi API cập nhật lại thứ tự các column
    await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board = {board} />
      <BoardContent
        board = {board}
        createNewColumn = {createNewColumn}
        createNewCard = {createNewCard}
        moveColumns = {moveColumns}
      />
    </Container>)
}

export default Board